import { Room, Player, PlayerRole, PlayerStatus, GamePhase, GameResult, VotingRound, PhaseTransitionEvent } from '../types/game.types';
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

    // Start role reveal timer (use setting)
    this.startPhaseTimer(room, room.settings.roleRevealTime, () => {
      this.moveToNightPhase(room);
    });
  }

  private assignRoles(room: Room): void {
    const players = Array.from(room.players.values());
    const playerCount = players.length;
    
    // Use custom vampire count if set, otherwise calculate (roughly 1/3 of players)
    const vampireCount = room.settings.vampireCount !== undefined 
      ? Math.min(room.settings.vampireCount, Math.floor(playerCount / 2)) // Max 50% vampires
      : Math.max(1, Math.floor(playerCount / 3));
    
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
    const previousPhase = room.gamePhase;
    room.gamePhase = GamePhase.NIGHT_PHASE;
    room.votes.clear();
    room.votesSubmitted.clear();
    room.currentRound++; // Increment round at start of night
    
    this.broadcastPhaseChange(room, previousPhase);

    // Start night timer
    this.startPhaseTimer(room, room.settings.nightTime, () => {
      this.processNightVotes(room);
    });
  }

  private moveToDayDiscussion(room: Room): void {
    const previousPhase = room.gamePhase;
    room.gamePhase = GamePhase.DAY_DISCUSSION;
    room.extraTimeUsed = 0; // Reset extra time counter for new day
    
    // Announce night victim if any
    if (room.nightVictim) {
      const victim = room.players.get(room.nightVictim);
      if (victim) {
        victim.status = PlayerStatus.ELIMINATED;
        this.io.to(room.code).emit('player_eliminated', {
          playerId: victim.id,
          playerName: victim.name,
          phase: 'NIGHT',
          // Don't reveal role for night victims (mystery element)
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

    this.broadcastPhaseChange(room, previousPhase);

    // Start discussion timer
    this.startPhaseTimer(room, room.settings.discussionTime, () => {
      this.moveToDayVoting(room);
    });
  }

  private moveToDayVoting(room: Room): void {
    const previousPhase = room.gamePhase;
    room.gamePhase = GamePhase.DAY_VOTING;
    room.votes.clear();
    room.votesSubmitted.clear();
    
    this.broadcastPhaseChange(room, previousPhase);

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
    room.votesSubmitted.add(voterId);

    // Calculate vote progress
    const eligibleVoters = this.getEligibleVoters(room);
    const waitingFor = eligibleVoters
      .filter(p => !room.votesSubmitted.has(p.id))
      .map(p => p.name);

    const progress = {
      voted: room.votesSubmitted.size,
      total: eligibleVoters.length,
      percentage: Math.round((room.votesSubmitted.size / eligibleVoters.length) * 100),
      waitingFor,
    };

    // Broadcast vote progress to all players
    this.io.to(room.code).emit('vote_progress', progress);

    // Also send individual confirmation to voter
    this.io.to(voter.socketId).emit('vote_cast', {
      voterId,
      targetId,
      voteCount: room.votes.size,
    });

    // Check if all eligible voters have voted
    if (room.votesSubmitted.size >= eligibleVoters.length) {
      // Clear timer and process votes immediately
      if (room.currentTimer) {
        clearInterval(room.currentTimer as any);
        room.currentTimer = undefined;
      }

      // Broadcast that voting is complete
      this.io.to(room.code).emit('voting_complete', {
        message: 'All players have voted. Processing results...',
      });

      // Small delay for UX (let players see the completion message)
      setTimeout(() => {
        if (room.gamePhase === GamePhase.NIGHT_PHASE) {
          this.processNightVotes(room);
        } else {
          this.processDayVotes(room);
        }
      }, 1000);
    }
  }

  private getEligibleVoters(room: Room): Player[] {
    const alivePlayers = Array.from(room.players.values()).filter(
      p => p.status === PlayerStatus.ALIVE
    );

    if (room.gamePhase === GamePhase.NIGHT_PHASE) {
      return alivePlayers.filter(p => p.role === PlayerRole.VAMPIRE);
    }

    return alivePlayers;
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

    // Record voting history
    const votingRound: VotingRound = {
      round: room.currentRound,
      phase: 'NIGHT',
      votes: Array.from(room.votes.entries()).map(([voterId, targetId]) => {
        const voter = room.players.get(voterId);
        const target = room.players.get(targetId);
        return {
          voterId,
          voterName: voter?.name || 'Unknown',
          targetId,
          targetName: target?.name || 'Unknown',
        };
      }),
      timestamp: new Date(),
    };

    if (victim) {
      const victimPlayer = room.players.get(victim);
      if (victimPlayer) {
        votingRound.eliminated = {
          playerId: victim,
          playerName: victimPlayer.name,
          // Don't reveal role for night victims (mystery)
        };
      }
    }

    room.votingHistory.push(votingRound);
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

    // Record voting history
    const votingRound: VotingRound = {
      round: room.currentRound,
      phase: 'DAY',
      votes: Array.from(room.votes.entries()).map(([voterId, targetId]) => {
        const voter = room.players.get(voterId);
        const target = room.players.get(targetId);
        return {
          voterId,
          voterName: voter?.name || 'Unknown',
          targetId,
          targetName: target?.name || 'Unknown',
        };
      }),
      timestamp: new Date(),
    };

    // Eliminate the player
    if (eliminated) {
      const player = room.players.get(eliminated);
      if (player) {
        player.status = PlayerStatus.ELIMINATED;
        
        votingRound.eliminated = {
          playerId: player.id,
          playerName: player.name,
          role: room.settings.revealRoleOnElimination ? player.role : undefined,
        };
        
        this.io.to(room.code).emit('player_eliminated', {
          playerId: player.id,
          playerName: player.name,
          role: room.settings.revealRoleOnElimination ? player.role : undefined,
          phase: 'DAY',
        });
      }
    }

    room.votingHistory.push(votingRound);
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

    // Calculate game duration
    const gameDuration = Math.floor((Date.now() - room.createdAt.getTime()) / 1000);

    if (aliveVampires.length === 0) {
      // Villagers win
      return {
        winner: 'VILLAGERS',
        survivors: aliveVillagers,
        eliminated: Array.from(room.players.values()).filter(
          p => p.status === PlayerStatus.ELIMINATED
        ),
        totalRounds: room.currentRound,
        gameDuration,
        votingHistory: room.settings.showVotesAfterGame ? room.votingHistory : undefined,
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
        totalRounds: room.currentRound,
        gameDuration,
        votingHistory: room.settings.showVotesAfterGame ? room.votingHistory : undefined,
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
      totalRounds: result.totalRounds,
      gameDuration: result.gameDuration,
      votingHistory: result.votingHistory, // Include if showVotesAfterGame is true
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

  private broadcastPhaseChange(room: Room, fromPhase?: GamePhase): void {
    const phaseMessages: Record<GamePhase, string> = {
      [GamePhase.LOBBY]: 'Waiting for players...',
      [GamePhase.ROLE_REVEAL]: 'Revealing roles...',
      [GamePhase.NIGHT_PHASE]: '🌙 Night falls... Vampires, choose your victim.',
      [GamePhase.DAY_DISCUSSION]: '☀️ Day breaks. Discuss who might be a vampire.',
      [GamePhase.DAY_VOTING]: '🗳️ Time to vote! Who do you suspect?',
      [GamePhase.GAME_OVER]: 'Game Over',
    };

    const phaseDurations: Partial<Record<GamePhase, number>> = {
      [GamePhase.ROLE_REVEAL]: room.settings.roleRevealTime,
      [GamePhase.NIGHT_PHASE]: room.settings.nightTime,
      [GamePhase.DAY_DISCUSSION]: room.settings.discussionTime,
      [GamePhase.DAY_VOTING]: room.settings.votingTime,
    };

    const event: PhaseTransitionEvent = {
      fromPhase: fromPhase || room.gamePhase,
      toPhase: room.gamePhase,
      duration: phaseDurations[room.gamePhase],
      message: phaseMessages[room.gamePhase],
    };

    this.io.to(room.code).emit('phase_change', event);
  }

  extendTime(room: Room, seconds: number): void {
    if (!room.currentTimer) {
      throw new Error('No active timer to extend');
    }

    if (room.gamePhase !== GamePhase.DAY_DISCUSSION) {
      throw new Error('Can only extend time during day discussion');
    }

    if (!room.settings.extraTimeAllowed) {
      throw new Error('Extra time is not allowed in this game');
    }

    if ((room.extraTimeUsed || 0) >= room.settings.maxExtraTimeUses) {
      throw new Error('Maximum extra time uses reached');
    }

    // Add time to current timer duration
    room.timerDuration = (room.timerDuration || 0) + seconds;
    room.extraTimeUsed = (room.extraTimeUsed || 0) + 1;

    // Broadcast time extension
    this.io.to(room.code).emit('time_extended', {
      addedTime: seconds,
      totalTime: room.timerDuration,
      extensionsRemaining: room.settings.maxExtraTimeUses - room.extraTimeUsed,
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
