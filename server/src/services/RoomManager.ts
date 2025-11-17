import { Room, Player, GameSettings, GamePhase, PlayerStatus } from '../types/game.types';

export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private playerRooms: Map<string, string> = new Map(); // socketId -> roomCode

  generateRoomCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code: string;
    
    do {
      code = '';
      for (let i = 0; i < 6; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length));
      }
    } while (this.rooms.has(code));
    
    return code;
  }

  createRoom(hostId: string, hostSocketId: string, hostName: string, customSettings?: Partial<GameSettings>): Room {
    const code = this.generateRoomCode();
    
    const host: Player = {
      id: hostId,
      socketId: hostSocketId,
      name: hostName,
      status: PlayerStatus.ALIVE,
      isHost: true,
    };

    const defaultSettings: GameSettings = {
      discussionTime: 120, // 2 minutes
      votingTime: 60, // 1 minute
      nightTime: 30, // 30 seconds
      roleRevealTime: 10, // 10 seconds
      minPlayers: 4,
      maxPlayers: 10,
      extraTimeAllowed: true,
      extraTimeAmount: 30, // 30 seconds
      maxExtraTimeUses: 2,
      showVotesAfterGame: true,
      revealRoleOnElimination: true,
    };

    const settings: GameSettings = {
      ...defaultSettings,
      ...customSettings,
    };

    const room: Room = {
      code,
      hostId,
      players: new Map([[hostId, host]]),
      gamePhase: GamePhase.LOBBY,
      settings,
      votes: new Map(),
      votesSubmitted: new Set(),
      createdAt: new Date(),
      extraTimeUsed: 0,
      currentRound: 0,
      votingHistory: [],
    };

    this.rooms.set(code, room);
    this.playerRooms.set(hostSocketId, code);
    
    return room;
  }

  updateSettings(roomCode: string, newSettings: Partial<GameSettings>): Room | null {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      throw new Error('Room not found');
    }
    
    if (room.gamePhase !== GamePhase.LOBBY) {
      throw new Error('Cannot change settings after game has started');
    }

    room.settings = {
      ...room.settings,
      ...newSettings,
    };

    return room;
  }

  joinRoom(roomCode: string, playerId: string, playerSocketId: string, playerName: string): Room | null {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      throw new Error('Room not found');
    }
    
    if (room.players.size >= room.settings.maxPlayers) {
      throw new Error('Room is full');
    }
    
    if (room.gamePhase !== GamePhase.LOBBY) {
      throw new Error('Game already in progress');
    }

    const player: Player = {
      id: playerId,
      socketId: playerSocketId,
      name: playerName,
      status: PlayerStatus.ALIVE,
      isHost: false,
    };

    room.players.set(playerId, player);
    this.playerRooms.set(playerSocketId, roomCode);
    
    return room;
  }

  leaveRoom(socketId: string): { room: Room | null; playerId: string | null } {
    const roomCode = this.playerRooms.get(socketId);
    
    if (!roomCode) {
      return { room: null, playerId: null };
    }
    
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      this.playerRooms.delete(socketId);
      return { room: null, playerId: null };
    }

    // Find the player by socketId
    let playerId: string | null = null;
    for (const [id, player] of room.players) {
      if (player.socketId === socketId) {
        playerId = id;
        break;
      }
    }

    if (playerId) {
      const player = room.players.get(playerId);
      
      // If game is in progress, mark as disconnected instead of removing
      if (room.gamePhase !== GamePhase.LOBBY && room.gamePhase !== GamePhase.GAME_OVER) {
        if (player) {
          player.status = PlayerStatus.DISCONNECTED;
        }
      } else {
        room.players.delete(playerId);
        
        // If host left, assign new host
        if (player?.isHost && room.players.size > 0) {
          const newHost = room.players.values().next().value;
          if (newHost) {
            newHost.isHost = true;
            room.hostId = newHost.id;
          }
        }
      }
    }

    this.playerRooms.delete(socketId);

    // Delete room if empty
    if (room.players.size === 0) {
      this.rooms.delete(roomCode);
      return { room: null, playerId };
    }

    return { room, playerId };
  }

  getRoom(roomCode: string): Room | undefined {
    return this.rooms.get(roomCode);
  }

  getRoomBySocketId(socketId: string): Room | undefined {
    const roomCode = this.playerRooms.get(socketId);
    return roomCode ? this.rooms.get(roomCode) : undefined;
  }

  getPlayerRoom(socketId: string): string | undefined {
    return this.playerRooms.get(socketId);
  }

  reconnectPlayer(roomCode: string, playerId: string, newSocketId: string): Room | null {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return null;
    }

    const player = room.players.get(playerId);
    
    if (!player) {
      return null;
    }

    player.socketId = newSocketId;
    player.status = PlayerStatus.ALIVE;
    this.playerRooms.set(newSocketId, roomCode);

    return room;
  }

  deleteRoom(roomCode: string): void {
    const room = this.rooms.get(roomCode);
    
    if (room) {
      // Clean up player mappings
      for (const player of room.players.values()) {
        this.playerRooms.delete(player.socketId);
      }
      
      // Clear any timers
      if (room.currentTimer) {
        clearInterval(room.currentTimer as any);
      }
      
      this.rooms.delete(roomCode);
    }
  }

  // Clean up old rooms (called periodically)
  cleanupOldRooms(): void {
    const now = new Date();
    const maxAge = 6 * 60 * 60 * 1000; // 6 hours

    for (const [code, room] of this.rooms) {
      if (room.gamePhase === GamePhase.GAME_OVER || 
          (now.getTime() - room.createdAt.getTime() > maxAge)) {
        this.deleteRoom(code);
      }
    }
  }

  getRoomStats(): { totalRooms: number; totalPlayers: number; activeGames: number } {
    let totalPlayers = 0;
    let activeGames = 0;

    for (const room of this.rooms.values()) {
      totalPlayers += room.players.size;
      if (room.gamePhase !== GamePhase.LOBBY && room.gamePhase !== GamePhase.GAME_OVER) {
        activeGames++;
      }
    }

    return {
      totalRooms: this.rooms.size,
      totalPlayers,
      activeGames,
    };
  }
}
