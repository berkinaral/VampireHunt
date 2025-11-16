import { Room, Player, PlayerRole, PlayerStatus, GamePhase, GameResult } from '../types/game.types';
import { Server } from 'socket.io';

export class GameEngine {
  constructor(private io: Server) {}

  startGame(room: Room): void {
    if (room.players.size < room.settings.minPlayers) {
      throw new Error(`Need at least ${room.settings.minPlayers} players to start`);
    }

    // Assign roles
    this.assignRoles(room);

    // Move to role reveal phase
    room.gamePhase = GamePhase.ROLE_REVEAL;
    
    // Send individual role assignments
    for (const player of room.players.values()) {
      this.io.to(player.socketId).emit('role_assigned', {
        role: player.role,
      });
    }

    // Start role reveal timer (10 seconds)
    this.startPhaseTimer(room, 10, () => {
      this.moveToNightPhase(room);
    });
  }

  private assignRoles(room: Room): void {
    const players = Array.from(room.players.values());
    const playerCount = players.length;
    
    // Calculate number of vampires (roughly 1/3 of players)
    const vampireCount = Math.max(1, Math.floor(playerCount / 3));
    
    // Shuffle players array
    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }

    // Assign roles
    for (let i = 0; i < players.length; i++) {
      players[i].role = i < vampireCount ? PlayerRole.VAMPIRE : PlayerRole.VILLAGER;
    }
  }

  private moveToNightPhase(room: Room): void {
    room.gamePhase = GamePhase.NIGHT_PHASE;
    room.votes.clear();
    
    this.broadcastPhaseChange(room);

    // Start night timer
    this.startPhaseTimer(room, room.settings.nightTime, () => {
      this.processNightVotes(room);
    });
  }

  private moveToDayDiscussion(room: Room): void {
    room.gamePhase = GamePhase.DAY_DISCUSSION;
    
    // Announce night victim if any
    if (room.nightVictim) {
      const victim = room.players.get(room.nightVictim);
      if (victim) {
        victim.status = PlayerStatus.ELIMINATED;
        this.io.to(room.code).emit('player_eliminated', {
          playerId: victim.id,
          playerName: victim.name,
          phase: 'NIGHT',
        });
      }
      room.nightVictim = undefined;
    }

    // Check win condition
    const result = this.checkWinCondition(room);
    if (result) {
      this.endGame(room, result);
      return;
    }

    this.broadcastPhaseChange(room);

    // Start discussion timer
    this.startPhaseTimer(room, room.settings.discussionTime, () => {
      this.moveToDayVoting(room);
    });
  }

  private moveToDayVoting(room: Room): void {
    room.gamePhase = GamePhase.DAY_VOTING;
    room.votes.clear();
    
    this.broadcastPhaseChange(room);

    // Start voting timer
    this.startPhaseTimer(room, room.settings.votingTime, () => {
      this.processDayVotes(room);
    });
  }

  castVote(room: Room, voterId: string, targetId: string): void {
    const voter = room.players.get(voterId);
    const target = room.players.get(targetId);

    if (!voter || !target) {
      throw new Error('Invalid voter or target');
    }

    if (voter.status !== PlayerStatus.ALIVE) {
      throw new Error('Dead players cannot vote');
    }

    if (target.status !== PlayerStatus.ALIVE) {
      throw new Error('Cannot vote for eliminated players');
    }

    // Check if it's the right phase for this player to vote
    if (room.gamePhase === GamePhase.NIGHT_PHASE) {
      if (voter.role !== PlayerRole.VAMPIRE) {
        throw new Error('Only vampires can vote at night');
      }
    } else if (room.gamePhase !== GamePhase.DAY_VOTING) {
      throw new Error('Voting is not allowed in this phase');
    }

    room.votes.set(voterId, targetId);

    // Notify all players that a vote was cast (without revealing who voted for whom)
    this.io.to(room.code).emit('vote_cast', {
      voterId,
      voteCount: room.votes.size,
    });

    // Check if all eligible voters have voted
    if (this.allEligibleVotersVoted(room)) {
      // Clear timer and process votes immediately
      if (room.currentTimer) {
        clearInterval(room.currentTimer as any);
        room.currentTimer = undefined;
      }

      if (room.gamePhase === GamePhase.NIGHT_PHASE) {
        this.processNightVotes(room);
      } else {
        this.processDayVotes(room);
      }
    }
  }

  private allEligibleVotersVoted(room: Room): boolean {
    const alivePlayers = Array.from(room.players.values()).filter(
      p => p.status === PlayerStatus.ALIVE
    );

    if (room.gamePhase === GamePhase.NIGHT_PHASE) {
      const aliveVampires = alivePlayers.filter(p => p.role === PlayerRole.VAMPIRE);
      return room.votes.size >= aliveVampires.length;
    } else {
      return room.votes.size >= alivePlayers.length;
    }
  }

  private processNightVotes(room: Room): void {
    const voteCount = new Map<string, number>();
    
    // Count votes
    for (const targetId of room.votes.values()) {
      voteCount.set(targetId, (voteCount.get(targetId) || 0) + 1);
    }

    // Find the player with most votes
    let maxVotes = 0;
    let victim: string | undefined;
    
    for (const [playerId, votes] of voteCount) {
      if (votes > maxVotes) {
        maxVotes = votes;
        victim = playerId;
      }
    }

    room.nightVictim = victim;
    room.votes.clear();

    this.moveToDayDiscussion(room);
  }

  private processDayVotes(room: Room): void {
    const voteCount = new Map<string, number>();
    
    // Count votes
    for (const targetId of room.votes.values()) {
      voteCount.set(targetId, (voteCount.get(targetId) || 0) + 1);
    }

    // Find the player with most votes
    let maxVotes = 0;
    let eliminated: string | undefined;
    
    for (const [playerId, votes] of voteCount) {
      if (votes > maxVotes) {
        maxVotes = votes;
        eliminated = playerId;
      }
    }

    // Eliminate the player
    if (eliminated) {
      const player = room.players.get(eliminated);
      if (player) {
        player.status = PlayerStatus.ELIMINATED;
        this.io.to(room.code).emit('player_eliminated', {
          playerId: player.id,
          playerName: player.name,
          role: player.role, // Reveal role when eliminated during day
          phase: 'DAY',
        });
      }
    }

    room.votes.clear();

    // Check win condition
    const result = this.checkWinCondition(room);
    if (result) {
      this.endGame(room, result);
    } else {
      // Continue to next night
      this.moveToNightPhase(room);
    }
  }

  private checkWinCondition(room: Room): GameResult | null {
    const alivePlayers = Array.from(room.players.values()).filter(
      p => p.status === PlayerStatus.ALIVE
    );

    const aliveVampires = alivePlayers.filter(p => p.role === PlayerRole.VAMPIRE);
    const aliveVillagers = alivePlayers.filter(p => p.role === PlayerRole.VILLAGER);

    if (aliveVampires.length === 0) {
      // Villagers win
      return {
        winner: 'VILLAGERS',
        survivors: aliveVillagers,
        eliminated: Array.from(room.players.values()).filter(
          p => p.status === PlayerStatus.ELIMINATED
        ),
      };
    }

    if (aliveVampires.length >= aliveVillagers.length) {
      // Vampires win
      return {
        winner: 'VAMPIRES',
        survivors: aliveVampires,
        eliminated: Array.from(room.players.values()).filter(
          p => p.status === PlayerStatus.ELIMINATED
        ),
      };
    }

    return null;
  }

  private endGame(room: Room, result: GameResult): void {
    room.gamePhase = GamePhase.GAME_OVER;
    
    // Clear any active timer
    if (room.currentTimer) {
      clearInterval(room.currentTimer as any);
      room.currentTimer = undefined;
    }

    // Reveal all roles
    const allPlayers = Array.from(room.players.values()).map(p => ({
      id: p.id,
      name: p.name,
      role: p.role,
      status: p.status,
    }));

    this.io.to(room.code).emit('game_over', {
      winner: result.winner,
      players: allPlayers,
    });
  }

  private startPhaseTimer(room: Room, seconds: number, callback: () => void): void {
    // Clear existing timer if any
    if (room.currentTimer) {
      clearInterval(room.currentTimer as any);
    }

    room.timerDuration = seconds;

    // Send initial timer value
    this.io.to(room.code).emit('timer_update', { timeLeft: seconds });

    // Update timer every second
    let timeLeft = seconds;
    const interval = setInterval(() => {
      timeLeft--;
      this.io.to(room.code).emit('timer_update', { timeLeft });
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        // Execute the callback when timer reaches 0
        callback();
      }
    }, 1000);

    // Store the interval reference so we can clear it later
    room.currentTimer = interval as any;
  }

  private broadcastPhaseChange(room: Room): void {
    this.io.to(room.code).emit('phase_change', {
      phase: room.gamePhase,
    });
  }

  getRoomState(room: Room): any {
    return {
      code: room.code,
      players: Array.from(room.players.values()).map(p => ({
        id: p.id,
        name: p.name,
        status: p.status,
        isHost: p.isHost,
      })),
      gamePhase: room.gamePhase,
      settings: room.settings,
    };
  }
}
