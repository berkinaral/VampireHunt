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
  socketId: string;
  name: string;
  role?: PlayerRole;
  status: PlayerStatus;
  isHost: boolean;
  avatar?: string;
}

export interface Room {
  code: string;
  hostId: string;
  players: Map<string, Player>;
  gamePhase: GamePhase;
  currentTimer?: NodeJS.Timeout;
  timerDuration?: number;
  settings: GameSettings;
  votes: Map<string, string>; // voterId -> targetId
  nightVictim?: string;
  createdAt: Date;
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

// Socket Event Payloads
export interface CreateRoomPayload {
  playerName: string;
  maxPlayers?: number;
}

export interface JoinRoomPayload {
  roomCode: string;
  playerName: string;
}

export interface StartGamePayload {
  roomCode: string;
}

export interface CastVotePayload {
  roomCode: string;
  targetId: string;
}

export interface RoomUpdatePayload {
  room: {
    code: string;
    players: Player[];
    gamePhase: GamePhase;
    settings: GameSettings;
  };
}

export interface ErrorPayload {
  message: string;
  code?: string;
}
