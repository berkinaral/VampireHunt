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
  timeRemaining?: number;
  settings: GameSettings;
  votes: Map<string, string>; // voterId -> targetId (current round)
  votesSubmitted: Set<string>; // Track who has voted (current round)
  nightVictim?: string;
  createdAt: Date;
  extraTimeUsed?: number; // Track extra time extensions used
  currentRound: number; // Track game round number
  votingHistory: VotingRound[]; // Complete voting history
}

export interface GameSettings {
  discussionTime: number; // seconds (default: 120)
  votingTime: number; // seconds (default: 60)
  nightTime: number; // seconds (default: 30)
  roleRevealTime: number; // seconds (default: 10)
  minPlayers: number;
  maxPlayers: number;
  vampireCount?: number; // Optional: custom vampire count (default: auto-calculate)
  extraTimeAllowed: boolean; // Allow host to add extra time (default: true)
  extraTimeAmount: number; // Amount of extra time in seconds (default: 30)
  maxExtraTimeUses: number; // Max number of extensions (default: 2)
  showVotesAfterGame: boolean; // Show voting history post-game (default: true)
  revealRoleOnElimination: boolean; // Show eliminated player's role (default: true)
}

export interface Vote {
  voterId: string;
  targetId: string;
  phase: GamePhase.NIGHT_PHASE | GamePhase.DAY_VOTING;
}

export interface VotingRound {
  round: number;
  phase: 'NIGHT' | 'DAY';
  votes: Array<{
    voterId: string;
    voterName: string;
    targetId: string;
    targetName: string;
  }>;
  eliminated?: {
    playerId: string;
    playerName: string;
    role?: PlayerRole;
  };
  timestamp: Date;
}

export interface GameResult {
  winner: 'VAMPIRES' | 'VILLAGERS';
  survivors: Player[];
  eliminated: Player[];
  votingHistory?: VotingRound[]; // Include voting history if enabled
  totalRounds: number;
  gameDuration: number; // in seconds
}

// Socket Event Payloads
export interface CreateRoomPayload {
  playerName: string;
  settings?: Partial<GameSettings>;
}

export interface UpdateSettingsPayload {
  roomCode: string;
  settings: Partial<GameSettings>;
}

export interface ExtendTimePayload {
  roomCode: string;
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

// UI/UX Enhancement Events
export interface PlayerActionEvent {
  playerId: string;
  playerName: string;
  action: 'joined' | 'left' | 'voted' | 'eliminated' | 'reconnected';
  timestamp: Date;
}

export interface PhaseTransitionEvent {
  fromPhase: GamePhase;
  toPhase: GamePhase;
  duration?: number; // Duration of new phase in seconds
  message?: string; // Descriptive message for UI
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
