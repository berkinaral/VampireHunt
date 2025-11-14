# System Patterns: Vampire Hunt Mobile Game

## Architecture Overview

### System Architecture
```
┌─────────────────────────────────────────┐
│           Client (Mobile App)           │
│  ┌─────────────────────────────────┐   │
│  │         UI Components           │   │
│  │  (React Native / Flutter)       │   │
│  └─────────────┬───────────────────┘   │
│  ┌─────────────▼───────────────────┐   │
│  │      State Management           │   │
│  │    (Redux / Provider)           │   │
│  └─────────────┬───────────────────┘   │
│  ┌─────────────▼───────────────────┐   │
│  │      WebSocket Client           │   │
│  │     (Socket.io-client)          │   │
│  └─────────────┬───────────────────┘   │
└────────────────┼────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│          Server (Backend)               │
│  ┌─────────────────────────────────┐   │
│  │     WebSocket Server            │   │
│  │      (Socket.io)                │   │
│  └─────────────┬───────────────────┘   │
│  ┌─────────────▼───────────────────┐   │
│  │      Game Engine                │   │
│  │   (Game Logic & State)          │   │
│  └─────────────┬───────────────────┘   │
│  ┌─────────────▼───────────────────┐   │
│  │      Room Manager               │   │
│  │   (Sessions & Players)          │   │
│  └─────────────┬───────────────────┘   │
│  ┌─────────────▼───────────────────┐   │
│  │        Database                 │   │
│  │    (Redis / MongoDB)            │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Key Design Patterns

### 1. State Machine Pattern (Game Flow)
```
States:
- LOBBY: Waiting for players
- ROLE_REVEAL: Showing roles to players
- NIGHT_PHASE: Vampires voting
- DAY_DISCUSSION: Open discussion time
- DAY_VOTING: All players voting
- GAME_OVER: Winner announced

Transitions managed by Game Engine
```

### 2. Observer Pattern (Real-time Updates)
- WebSocket connections for real-time events
- Clients subscribe to room events
- Server broadcasts state changes
- Event-driven architecture

### 3. Command Pattern (Player Actions)
```javascript
Actions:
- JoinRoom(roomCode, playerName)
- StartGame(roomId)
- VotePlayer(targetId)
- SendMessage(message)
- LeaveRoom()
```

### 4. Factory Pattern (Role Creation)
```javascript
RoleFactory:
- createVampire()
- createVillager()
- Future: createSpecialRoles()
```

## Component Relationships

### Core Components

1. **Room Manager**
   - Creates unique room codes
   - Manages player connections
   - Handles join/leave events
   - Maintains room state

2. **Game Engine**
   - Implements game rules
   - Manages game phases
   - Handles voting logic
   - Determines win conditions
   - Controls timers

3. **Role System**
   - Assigns roles randomly
   - Manages role abilities
   - Tracks role-specific actions
   - Maintains role secrecy

4. **Voting System**
   - Collects votes
   - Validates vote eligibility
   - Tallies results
   - Handles tie-breaking
   - Announces outcomes

5. **Timer System**
   - Phase duration management
   - Countdown displays
   - Auto-progression
   - Configurable durations

## Data Flow Patterns

### Real-time Communication Flow
```
1. Client Action → WebSocket Event
2. Server Validation → Game Logic
3. State Update → Database
4. Broadcast → All Clients
5. UI Update → User Feedback
```

### Vote Processing Flow
```
1. Collect Votes → Validate Eligibility
2. Store Temporarily → Wait for Timer/All Votes
3. Tally Results → Determine Outcome
4. Update Game State → Check Win Conditions
5. Broadcast Results → Update UI
```

## Security Patterns

### Role Privacy
- Roles sent only to individual sockets
- Server-side role validation
- No client-side role storage in shared state

### Anti-Cheat Measures
- Server-authoritative game state
- Vote validation
- Action rate limiting
- Session verification

## Scalability Patterns

### Horizontal Scaling
- Stateless server design
- Redis for session management
- Load balancer for multiple instances
- Room-based sharding

### Performance Optimization
- Lazy loading of game assets
- Efficient WebSocket message batching
- Client-side prediction for UI
- Database connection pooling
