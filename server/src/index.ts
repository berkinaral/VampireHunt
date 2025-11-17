import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

import { RoomManager } from './services/RoomManager';
import { GameEngine } from './services/GameEngine';
import { 
  CreateRoomPayload, 
  JoinRoomPayload, 
  StartGamePayload, 
  CastVotePayload,
  UpdateSettingsPayload,
  ExtendTimePayload
} from './types/game.types';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true,
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.socket.io", "https:", "http:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:", "http:"],
      connectSrc: ["'self'", "ws://192.168.1.103:3000", "wss://192.168.1.103:3000", "http://192.168.1.103:3000", "ws:", "wss:", "http:", "https:"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: false,
  hsts: false,
}));
app.use(cors());
app.use(compression());
app.use(express.json());

// Serve static files (web client)
app.use(express.static(path.join(__dirname, '..')));

// Services
const roomManager = new RoomManager();
const gameEngine = new GameEngine(io);

// Health check endpoint
app.get('/health', (req, res) => {
  const stats = roomManager.getRoomStats();
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    ...stats,
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  // Create Room
  socket.on('create_room', (payload: CreateRoomPayload) => {
    try {
      const playerId = uuidv4();
      const room = roomManager.createRoom(
        playerId,
        socket.id,
        payload.playerName,
        payload.settings
      );

      // Join the socket room
      socket.join(room.code);

      // Send success response
      socket.emit('room_created', {
        roomCode: room.code,
        playerId,
        room: gameEngine.getRoomState(room),
      });

      console.log(`Room ${room.code} created by ${payload.playerName}`);
    } catch (error: any) {
      socket.emit('error', {
        message: error.message || 'Failed to create room',
      });
    }
  });

  // Join Room
  socket.on('join_room', (payload: JoinRoomPayload) => {
    try {
      const playerId = uuidv4();
      const room = roomManager.joinRoom(
        payload.roomCode.toUpperCase(),
        playerId,
        socket.id,
        payload.playerName
      );

      if (!room) {
        throw new Error('Failed to join room');
      }

      // Join the socket room
      socket.join(room.code);

      // Send success response to joiner
      socket.emit('room_joined', {
        playerId,
        room: gameEngine.getRoomState(room),
      });

      // Notify all players in room
      io.to(room.code).emit('room_update', {
        room: gameEngine.getRoomState(room),
      });

      console.log(`${payload.playerName} joined room ${room.code}`);
    } catch (error: any) {
      socket.emit('error', {
        message: error.message || 'Failed to join room',
      });
    }
  });

  // Start Game
  socket.on('start_game', (payload: StartGamePayload) => {
    try {
      const room = roomManager.getRoom(payload.roomCode);
      
      if (!room) {
        throw new Error('Room not found');
      }

      // Verify the requester is the host
      let isHost = false;
      for (const player of room.players.values()) {
        if (player.socketId === socket.id && player.isHost) {
          isHost = true;
          break;
        }
      }

      if (!isHost) {
        throw new Error('Only the host can start the game');
      }

      gameEngine.startGame(room);

      // Notify all players
      io.to(room.code).emit('game_started', {
        room: gameEngine.getRoomState(room),
      });

      console.log(`Game started in room ${room.code}`);
    } catch (error: any) {
      socket.emit('error', {
        message: error.message || 'Failed to start game',
      });
    }
  });

  // Cast Vote
  socket.on('cast_vote', (payload: CastVotePayload) => {
    try {
      const room = roomManager.getRoom(payload.roomCode);
      
      if (!room) {
        throw new Error('Room not found');
      }

      // Find the voter by socket ID
      let voterId: string | undefined;
      for (const [id, player] of room.players) {
        if (player.socketId === socket.id) {
          voterId = id;
          break;
        }
      }

      if (!voterId) {
        throw new Error('Player not found');
      }

      gameEngine.castVote(room, voterId, payload.targetId);

      console.log(`Vote cast in room ${room.code}`);
    } catch (error: any) {
      socket.emit('error', {
        message: error.message || 'Failed to cast vote',
      });
    }
  });

  // Update Settings
  socket.on('update_settings', (payload: UpdateSettingsPayload) => {
    try {
      const room = roomManager.getRoom(payload.roomCode);
      
      if (!room) {
        throw new Error('Room not found');
      }

      // Check if requester is host
      let isHost = false;
      for (const player of room.players.values()) {
        if (player.socketId === socket.id && player.isHost) {
          isHost = true;
          break;
        }
      }

      if (!isHost) {
        throw new Error('Only the host can update settings');
      }

      const updatedRoom = roomManager.updateSettings(payload.roomCode, payload.settings);

      if (updatedRoom) {
        // Broadcast updated settings to all players
        io.to(updatedRoom.code).emit('settings_updated', {
          settings: updatedRoom.settings,
        });

        console.log(`Settings updated in room ${updatedRoom.code}`);
      }
    } catch (error: any) {
      socket.emit('error', {
        message: error.message || 'Failed to update settings',
      });
    }
  });

  // Extend Time
  socket.on('extend_time', (payload: ExtendTimePayload) => {
    try {
      const room = roomManager.getRoom(payload.roomCode);
      
      if (!room) {
        throw new Error('Room not found');
      }

      // Check if requester is host
      let isHost = false;
      for (const player of room.players.values()) {
        if (player.socketId === socket.id && player.isHost) {
          isHost = true;
          break;
        }
      }

      if (!isHost) {
        throw new Error('Only the host can extend time');
      }

      gameEngine.extendTime(room, room.settings.extraTimeAmount);

      console.log(`Time extended in room ${room.code} by ${room.settings.extraTimeAmount}s`);
    } catch (error: any) {
      socket.emit('error', {
        message: error.message || 'Failed to extend time',
      });
    }
  });

  // Leave Room / Disconnect
  socket.on('leave_room', () => {
    handleDisconnect();
  });

  socket.on('disconnect', () => {
    handleDisconnect();
  });

  function handleDisconnect() {
    const { room, playerId } = roomManager.leaveRoom(socket.id);
    
    if (room && playerId) {
      // Notify remaining players
      io.to(room.code).emit('room_update', {
        room: gameEngine.getRoomState(room),
      });

      // Leave the socket room
      socket.leave(room.code);

      console.log(`Player ${playerId} left room ${room.code}`);
    }

    console.log(`Disconnected: ${socket.id}`);
  }
});

// Periodic cleanup of old rooms
setInterval(() => {
  roomManager.cleanupOldRooms();
}, 60 * 60 * 1000); // Every hour

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🦇 Vampire Hunt server running on port ${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
});
