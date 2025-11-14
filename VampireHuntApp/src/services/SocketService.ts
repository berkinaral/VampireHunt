import io, {Socket} from 'socket.io-client';
import {Player, GamePhase, PlayerRole} from '../types';

interface SocketServiceEvents {
  onRoomCreated?: (data: {roomCode: string; playerId: string; room: any}) => void;
  onRoomJoined?: (data: {playerId: string; room: any}) => void;
  onRoomUpdate?: (data: {room: any}) => void;
  onGameStarted?: (data: {room: any}) => void;
  onRoleAssigned?: (data: {role: PlayerRole}) => void;
  onPhaseChange?: (data: {phase: GamePhase}) => void;
  onTimerUpdate?: (data: {timeLeft: number}) => void;
  onVoteCast?: (data: {voterId: string; voteCount: number}) => void;
  onPlayerEliminated?: (data: {playerId: string; playerName: string; role?: PlayerRole; phase: string}) => void;
  onGameOver?: (data: {winner: 'VAMPIRES' | 'VILLAGERS'; players: any[]}) => void;
  onError?: (data: {message: string}) => void;
}

class SocketService {
  private socket: Socket | null = null;
  private serverUrl: string = 'http://192.168.1.103:3000'; // Local network IP for phone testing
  private events: SocketServiceEvents = {};
  private currentRoomCode: string | null = null;
  private playerId: string | null = null;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve();
        return;
      }

      this.socket = io(this.serverUrl, {
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to server');
        this.setupEventListeners();
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        reject(error);
      });
    });
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Room events
    this.socket.on('room_created', (data) => {
      this.currentRoomCode = data.roomCode;
      this.playerId = data.playerId;
      this.events.onRoomCreated?.(data);
    });

    this.socket.on('room_joined', (data) => {
      this.playerId = data.playerId;
      this.events.onRoomJoined?.(data);
    });

    this.socket.on('room_update', (data) => {
      this.events.onRoomUpdate?.(data);
    });

    // Game events
    this.socket.on('game_started', (data) => {
      this.events.onGameStarted?.(data);
    });

    this.socket.on('role_assigned', (data) => {
      this.events.onRoleAssigned?.(data);
    });

    this.socket.on('phase_change', (data) => {
      this.events.onPhaseChange?.(data);
    });

    this.socket.on('timer_update', (data) => {
      this.events.onTimerUpdate?.(data);
    });

    this.socket.on('vote_cast', (data) => {
      this.events.onVoteCast?.(data);
    });

    this.socket.on('player_eliminated', (data) => {
      this.events.onPlayerEliminated?.(data);
    });

    this.socket.on('game_over', (data) => {
      this.events.onGameOver?.(data);
    });

    // Error handling
    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
      this.events.onError?.(data);
    });
  }

  setEventHandlers(events: SocketServiceEvents): void {
    this.events = events;
  }

  createRoom(playerName: string, maxPlayers?: number): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    this.socket.emit('create_room', {
      playerName,
      maxPlayers,
    });
  }

  joinRoom(roomCode: string, playerName: string): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }

    this.currentRoomCode = roomCode;
    this.socket.emit('join_room', {
      roomCode,
      playerName,
    });
  }

  startGame(): void {
    if (!this.socket || !this.currentRoomCode) {
      console.error('Socket not connected or no room code');
      return;
    }

    this.socket.emit('start_game', {
      roomCode: this.currentRoomCode,
    });
  }

  castVote(targetId: string): void {
    if (!this.socket || !this.currentRoomCode) {
      console.error('Socket not connected or no room code');
      return;
    }

    this.socket.emit('cast_vote', {
      roomCode: this.currentRoomCode,
      targetId,
    });
  }

  leaveRoom(): void {
    if (!this.socket) return;

    this.socket.emit('leave_room');
    this.currentRoomCode = null;
    this.playerId = null;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentRoomCode = null;
      this.playerId = null;
    }
  }

  getCurrentRoomCode(): string | null {
    return this.currentRoomCode;
  }

  getPlayerId(): string | null {
    return this.playerId;
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
