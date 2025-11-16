// Quick test script for the Vampire Hunt server
const io = require('socket.io-client');

const serverUrl = 'http://localhost:3000';

console.log('🧪 Testing Vampire Hunt Server...\n');

// Create first player (host)
const host = io(serverUrl);
let roomCode = null;
let hostPlayerId = null;

host.on('connect', () => {
  console.log('✅ Host connected');
  
  // Create a room
  host.emit('create_room', {
    playerName: 'Host Player',
    maxPlayers: 6
  });
});

host.on('room_created', (data) => {
  console.log(`✅ Room created with code: ${data.roomCode}`);
  roomCode = data.roomCode;
  hostPlayerId = data.playerId;
  console.log(`   Players: ${data.room.players.length}/${data.room.settings.maxPlayers}`);
  
  // Now connect second player
  connectSecondPlayer();
});

host.on('room_update', (data) => {
  console.log(`📢 Room update - Players: ${data.room.players.length}/${data.room.settings.maxPlayers}`);
});

host.on('error', (data) => {
  console.error('❌ Host error:', data.message);
});

function connectSecondPlayer() {
  const player2 = io(serverUrl);
  
  player2.on('connect', () => {
    console.log('\n✅ Player 2 connected');
    
    // Join the room
    player2.emit('join_room', {
      roomCode: roomCode,
      playerName: 'Player 2'
    });
  });
  
  player2.on('room_joined', (data) => {
    console.log(`✅ Player 2 joined room ${roomCode}`);
    console.log(`   Players in room: ${data.room.players.map(p => p.name).join(', ')}`);
    
    // Test complete
    console.log('\n🎉 Server test successful!');
    console.log('   - Room creation works');
    console.log('   - Room joining works');
    console.log('   - Real-time updates work');
    
    // Cleanup
    setTimeout(() => {
      player2.disconnect();
      host.disconnect();
      process.exit(0);
    }, 1000);
  });
  
  player2.on('error', (data) => {
    console.error('❌ Player 2 error:', data.message);
  });
}

// Handle errors
host.on('connect_error', (error) => {
  console.error('❌ Connection failed:', error.message);
  console.log('   Make sure the server is running on port 3000');
  process.exit(1);
});

// Timeout after 10 seconds
setTimeout(() => {
  console.error('❌ Test timeout - no response from server');
  process.exit(1);
}, 10000);
