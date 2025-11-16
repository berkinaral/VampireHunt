// Full game flow test for Vampire Hunt
const io = require('socket.io-client');

const serverUrl = 'http://localhost:3000';
const players = [];
let roomCode = null;
let gameStarted = false;

console.log('🎮 Testing Full Vampire Hunt Game Flow...\n');

// Create 4 players
function createPlayer(name, isHost = false) {
  const socket = io(serverUrl);
  const player = { socket, name, id: null, role: null, isHost };
  
  socket.on('connect', () => {
    console.log(`✅ ${name} connected`);
    
    if (isHost) {
      // Create room
      socket.emit('create_room', {
        playerName: name,
        maxPlayers: 6
      });
    }
  });

  socket.on('room_created', (data) => {
    console.log(`📍 Room created: ${data.roomCode}`);
    roomCode = data.roomCode;
    player.id = data.playerId;
    
    // Start adding other players
    setTimeout(() => {
      createPlayer('Alice');
      setTimeout(() => {
        createPlayer('Bob');
        setTimeout(() => {
          createPlayer('Charlie');
        }, 1000);
      }, 1000);
    }, 1000);
  });

  socket.on('room_joined', (data) => {
    console.log(`✅ ${name} joined room ${roomCode}`);
    player.id = data.playerId;
  });

  socket.on('room_update', (data) => {
    const playerCount = data.room.players.length;
    console.log(`👥 Room update: ${playerCount} players`);
    
    // Start game when we have 4 players and haven't started yet
    if (playerCount === 4 && isHost && !gameStarted) {
      gameStarted = true;
      setTimeout(() => {
        console.log('\n🚀 Starting game...');
        socket.emit('start_game', { roomCode });
      }, 2000);
    }
  });

  socket.on('game_started', () => {
    console.log(`🎯 Game started for ${name}`);
  });

  socket.on('role_assigned', (data) => {
    player.role = data.role;
    console.log(`🎭 ${name} is a ${data.role}`);
  });

  socket.on('phase_change', (data) => {
    console.log(`📢 Phase changed to: ${data.phase}`);
    
    // Auto-vote in night phase if vampire
    if (data.phase === 'NIGHT_PHASE' && player.role === 'VAMPIRE') {
      setTimeout(() => {
        // Find a non-vampire to vote for
        const targetIndex = players.findIndex(p => p.id !== player.id && p.role !== 'VAMPIRE');
        if (targetIndex >= 0) {
          console.log(`🗳️ ${name} (Vampire) voting for player ${targetIndex}`);
          socket.emit('cast_vote', {
            roomCode,
            targetId: players[targetIndex].id
          });
        }
      }, 2000);
    }
    
    // Auto-vote in day voting phase
    if (data.phase === 'DAY_VOTING') {
      setTimeout(() => {
        // Vote for someone random (not self)
        const targetIndex = players.findIndex(p => p.id !== player.id);
        if (targetIndex >= 0) {
          console.log(`🗳️ ${name} voting for player ${targetIndex}`);
          socket.emit('cast_vote', {
            roomCode,
            targetId: players[targetIndex].id
          });
        }
      }, 2000);
    }
  });

  socket.on('timer_update', (data) => {
    if (data.timeLeft % 10 === 0 || data.timeLeft <= 5) {
      console.log(`⏱️ Timer: ${data.timeLeft}s`);
    }
  });

  socket.on('player_eliminated', (data) => {
    console.log(`💀 ${data.playerName} was eliminated! (${data.phase} phase)`);
    if (data.role) {
      console.log(`   They were a ${data.role}`);
    }
  });

  socket.on('game_over', (data) => {
    console.log('\n🏆 GAME OVER!');
    console.log(`   Winner: ${data.winner}`);
    console.log('   Final roles:');
    data.players.forEach(p => {
      console.log(`   - ${p.name}: ${p.role} (${p.status})`);
    });
    
    // Cleanup
    setTimeout(() => {
      players.forEach(p => p.socket.disconnect());
      process.exit(0);
    }, 2000);
  });

  socket.on('error', (data) => {
    console.error(`❌ Error for ${name}: ${data.message}`);
  });

  // Join room if not host
  if (!isHost && roomCode) {
    setTimeout(() => {
      socket.emit('join_room', {
        roomCode,
        playerName: name
      });
    }, 500);
  }

  players.push(player);
  return player;
}

// Start with the host
const host = createPlayer('Host', true);

// Handle connection errors
setTimeout(() => {
  if (!roomCode) {
    console.error('❌ Failed to create room');
    process.exit(1);
  }
}, 5000);

// Timeout after 2 minutes
setTimeout(() => {
  console.log('⏱️ Test timeout - game took too long');
  players.forEach(p => p.socket.disconnect());
  process.exit(0);
}, 120000);
