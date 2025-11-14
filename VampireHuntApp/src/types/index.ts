// Game Types
export enum GamePhase {
  LOBBY = 'LOBBY',
  ROLE_REVEAL = 'ROLE_REVEAL',
  NIGHT_PHASE = 'NIGHT_PHASE',
  DAY_DISCUSSION = 'DAY_DISCUSSION',
  DAY_VOTING = 'DAY_VOTING',
  GAME_OVER = 'GAME_OVER',
}

export enum PlayerRole {
  VAMPIRE = 'VAMPIRE',
  VILLAGER = 'VILLAGER',
}

export enum PlayerStatus {
  ALIVE = 'ALIVE',
  ELIMINATED = 'ELIMINATED',
  DISCONNECTED = 'DISCONNECTED',
}

export interface Player {
  id: string;
  name: string;
  role?: PlayerRole;
  status: PlayerStatus;
  isHost: boolean;
  avatar?: string;
}

export interface Room {
  code: string;
  hostId: string;
  players: Player[];
  gamePhase: GamePhase;
  currentTimer?: number;
  settings: GameSettings;
}

export interface GameSettings {
  discussionTime: number; // seconds
  votingTime: number; // seconds
  nightTime: number; // seconds
  minPlayers: number;
  maxPlayers: number;
}

export interface Vote {
  voterId: string;
  targetId: string;
  phase: GamePhase.NIGHT_PHASE | GamePhase.DAY_VOTING;
}

export interface GameResult {
  winner: 'VAMPIRES' | 'VILLAGERS';
  survivors: Player[];
  eliminated: Player[];
}

// Socket Events
export enum SocketEvents {
  // Room Events
  CREATE_ROOM = 'create_room',
  JOIN_ROOM = 'join_room',
  LEAVE_ROOM = 'leave_room',
  ROOM_UPDATE = 'room_update',
  
  // Game Events
  START_GAME = 'start_game',
  ROLE_ASSIGNED = 'role_assigned',
  PHASE_CHANGE = 'phase_change',
  TIMER_UPDATE = 'timer_update',
  
  // Voting Events
  CAST_VOTE = 'cast_vote',
  VOTE_RESULT = 'vote_result',
  
  // Player Events
  PLAYER_ELIMINATED = 'player_eliminated',
  PLAYER_DISCONNECTED = 'player_disconnected',
  PLAYER_RECONNECTED = 'player_reconnected',
  
  // Game Over
  GAME_OVER = 'game_over',
  
  // Error Events
  ERROR = 'error',
}
