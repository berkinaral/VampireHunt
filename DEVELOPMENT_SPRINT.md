# 🚀 Development Sprint - Week 1

**Start Date**: November 17, 2025  
**Sprint Goal**: Fix critical issues + Implement high priority features  
**Status**: 🔄 In Progress

---

## 🔴 TASK 1: Debug Voting System (CRITICAL)

### Status: 🔄 IN PROGRESS
**Priority**: URGENT  
**Estimated Time**: 2-4 hours  
**Assignee**: Development Team

### Investigation Results:

#### Code Review Findings:
✅ **Backend (GameEngine.ts)**:
- `castVote()` method looks correct (lines 106-153)
- Validates voter and target
- Checks phase and role permissions
- Stores votes in `room.votes` Map
- Auto-progresses when all eligible voters vote
- Processes votes correctly in `processNightVotes()` and `processDayVotes()`

✅ **Frontend (GamePlayScreen.tsx)**:
- Vote button shows correctly during voting phases
- `handleVote()` calls `SocketService.castVote()`
- Loading state prevents double-voting
- Player selection works correctly

✅ **Socket Communication (SocketService.ts & index.ts)**:
- Client emits `'cast_vote'` with roomCode and targetId
- Server receives and processes vote
- Emits `'vote_cast'` confirmation
- Error handling in place

### Potential Issues to Test:

1. **Network/Connection Issues**
   - [ ] Test with production server
   - [ ] Check for socket disconnections during vote
   - [ ] Verify reconnection handling

2. **Edge Cases**
   - [ ] Test with minimum players (3-4)
   - [ ] Test with eliminated players
   - [ ] Test voting timeout
   - [ ] Test simultaneous votes

3. **Phase Transitions**
   - [ ] Verify timer clears properly
   - [ ] Check phase change events
   - [ ] Test vote reset between phases

### Testing Plan:

```bash
# Test 1: Basic Voting (4 players)
1. Start game with 4 players
2. Night phase: Vampire votes
3. Verify elimination
4. Day voting: All players vote
5. Verify elimination and phase transition

# Test 2: Auto-Progress
1. All eligible voters vote before timer ends
2. Verify immediate phase transition
3. Check timer was cleared

# Test 3: Timeout
1. Some players don't vote
2. Wait for timer to expire
3. Verify votes are processed
4. Check phase transitions correctly

# Test 4: Error Handling
1. Try voting for eliminated player
2. Try voting during wrong phase
3. Verify error messages display
```

### Action Items:
- [ ] Test voting in production environment
- [ ] Add console logging for debugging
- [ ] Test all edge cases
- [ ] Verify with multiple devices
- [ ] Check Railway logs for errors

### If Bug Found:
Document the specific scenario, error messages, and fix implementation here.

---

## 🟠 TASK 2: Adjustable Game Timers

### Status: 📋 PENDING
**Priority**: High  
**Estimated Time**: 4-6 hours

### Implementation Plan:

#### Backend Changes:

**File**: `server/src/types/game.types.ts`
```typescript
// Add to GameSettings interface
export interface GameSettings {
  minPlayers: number;
  maxPlayers: number;
  nightTime: number;          // Currently 30s
  discussionTime: number;     // Currently 120s
  votingTime: number;         // Currently 60s
  roleRevealTime: number;     // Currently 10s
  vampireCount?: number;      // Optional: custom vampire count
  extraTimeAllowed: boolean;  // Allow host to add extra time
  extraTimeAmount: number;    // Amount of extra time (default: 30s)
  maxExtraTime: number;       // Max extensions (default: 2)
}
```

**File**: `server/src/index.ts`
```typescript
// Update create_room to accept settings
socket.on('create_room', (payload: CreateRoomPayload) => {
  const settings = payload.settings || {
    minPlayers: 4,
    maxPlayers: 10,
    nightTime: 30,
    discussionTime: 120,
    votingTime: 60,
    roleRevealTime: 10,
    extraTimeAllowed: true,
    extraTimeAmount: 30,
    maxExtraTime: 2,
  };
  
  const room = roomManager.createRoom(playerName, socket.id, settings);
  // ...
});

// Add extend_time event
socket.on('extend_time', (payload: { roomCode: string }) => {
  const room = roomManager.getRoom(payload.roomCode);
  if (!room) return;
  
  // Check if host
  const player = Array.from(room.players.values()).find(p => p.socketId === socket.id);
  if (!player?.isHost) {
    socket.emit('error', { message: 'Only host can extend time' });
    return;
  }
  
  // Check if in discussion phase
  if (room.gamePhase !== GamePhase.DAY_DISCUSSION) {
    socket.emit('error', { message: 'Can only extend time during discussion' });
    return;
  }
  
  // Check extension limit
  if ((room.extraTimeUsed || 0) >= room.settings.maxExtraTime) {
    socket.emit('error', { message: 'Maximum extensions reached' });
    return;
  }
  
  // Add extra time
  gameEngine.extendTime(room, room.settings.extraTimeAmount);
  room.extraTimeUsed = (room.extraTimeUsed || 0) + 1;
});
```

**File**: `server/src/services/GameEngine.ts`
```typescript
extendTime(room: Room, seconds: number): void {
  if (!room.currentTimer) return;
  
  // Add time to current timer
  room.timerDuration += seconds;
  
  // Broadcast extension
  this.io.to(room.code).emit('time_extended', {
    addedTime: seconds,
    newTotal: room.timerDuration,
  });
}
```

#### Frontend Changes:

**File**: `VampireHuntApp/src/types/index.ts`
```typescript
export interface GameSettings {
  minPlayers: number;
  maxPlayers: number;
  nightTime: number;
  discussionTime: number;
  votingTime: number;
  roleRevealTime: number;
  vampireCount?: number;
  extraTimeAllowed: boolean;
  extraTimeAmount: number;
  maxExtraTime: number;
}

export interface GameSettingsPreset {
  name: string;
  settings: GameSettings;
}
```

**New File**: `VampireHuntApp/src/screens/GameSettingsScreen.tsx`
```typescript
// Create settings screen with sliders for each timer
// Presets: Quick, Standard, Extended, Custom
// Save/load functionality
```

**File**: `VampireHuntApp/src/screens/GameLobbyScreen.tsx`
```typescript
// Add "Settings" button for host
// Show current settings summary
// Allow editing before game starts
```

**File**: `VampireHuntApp/src/screens/GamePlayScreen.tsx`
```typescript
// Add "Extra Time" button during discussion (host only)
// Show extensions used/remaining
// Disable when max reached
```

### Tasks:
- [ ] Update backend types
- [ ] Implement backend timer logic
- [ ] Add extend_time event handler
- [ ] Create GameSettingsScreen component
- [ ] Add settings to lobby
- [ ] Add extra time button to gameplay
- [ ] Test all timer configurations
- [ ] Test extra time functionality

---

## 🟠 TASK 3: Smart Voting Completion

### Status: 📋 PENDING
**Priority**: High  
**Estimated Time**: 3-4 hours

### Implementation Plan:

#### Backend Changes:

**File**: `server/src/types/game.types.ts`
```typescript
export interface Room {
  // ... existing fields
  votesSubmitted: Set<string>;  // Track who has voted
  totalEligibleVoters: number;  // Cache eligible voter count
}
```

**File**: `server/src/services/GameEngine.ts`
```typescript
castVote(room: Room, voterId: string, targetId: string): void {
  // ... existing validation
  
  room.votes.set(voterId, targetId);
  room.votesSubmitted.add(voterId);
  
  // Calculate progress
  const eligibleVoters = this.getEligibleVoters(room);
  const progress = {
    voted: room.votesSubmitted.size,
    total: eligibleVoters.length,
    percentage: Math.round((room.votesSubmitted.size / eligibleVoters.length) * 100),
    waitingFor: eligibleVoters
      .filter(p => !room.votesSubmitted.has(p.id))
      .map(p => p.name),
  };
  
  // Broadcast vote progress
  this.io.to(room.code).emit('vote_progress', progress);
  
  // Check if all voted
  if (room.votesSubmitted.size >= eligibleVoters.length) {
    // Clear timer and process immediately
    if (room.currentTimer) {
      clearInterval(room.currentTimer as any);
      room.currentTimer = undefined;
    }
    
    if (room.gamePhase === GamePhase.NIGHT_PHASE) {
      this.processNightVotes(room);
    } else {
      this.processDayVotes(room);
    }
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

private moveToNightPhase(room: Room): void {
  room.gamePhase = GamePhase.NIGHT_PHASE;
  room.votes.clear();
  room.votesSubmitted = new Set();  // Reset vote tracking
  // ... rest of implementation
}

private moveToDayVoting(room: Room): void {
  room.gamePhase = GamePhase.DAY_VOTING;
  room.votes.clear();
  room.votesSubmitted = new Set();  // Reset vote tracking
  // ... rest of implementation
}
```

#### Frontend Changes:

**File**: `VampireHuntApp/src/services/SocketService.ts`
```typescript
interface SocketServiceEvents {
  // ... existing events
  onVoteProgress?: (data: {
    voted: number;
    total: number;
    percentage: number;
    waitingFor: string[];
  }) => void;
}

// In setupEventListeners():
this.socket.on('vote_progress', (data) => {
  if (this.events.onVoteProgress) {
    this.events.onVoteProgress(data);
  }
});
```

**File**: `VampireHuntApp/src/screens/GamePlayScreen.tsx`
```typescript
const [voteProgress, setVoteProgress] = useState<{
  voted: number;
  total: number;
  percentage: number;
  waitingFor: string[];
} | null>(null);

// In useEffect socket handlers:
onVoteProgress: (data) => {
  setVoteProgress(data);
},

// In render:
{voteProgress && (gamePhase === GamePhase.NIGHT_PHASE || gamePhase === GamePhase.DAY_VOTING) && (
  <View style={styles.voteProgressContainer}>
    <Text style={styles.voteProgressText}>
      Votes: {voteProgress.voted}/{voteProgress.total}
    </Text>
    <View style={styles.progressBar}>
      <View style={[styles.progressFill, { width: `${voteProgress.percentage}%` }]} />
    </View>
    {voteProgress.waitingFor.length > 0 && (
      <Text style={styles.waitingText}>
        Waiting for: {voteProgress.waitingFor.join(', ')}
      </Text>
    )}
  </View>
)}
```

### Tasks:
- [ ] Add vote tracking to backend
- [ ] Implement vote progress calculation
- [ ] Add vote_progress event
- [ ] Update frontend to show progress
- [ ] Add progress bar UI component
- [ ] Test with various player counts
- [ ] Test early completion
- [ ] Verify timer clears properly

---

## 📊 Sprint Progress Tracker

### Day 1 (Nov 17):
- [x] Code review of voting system
- [ ] Test voting in production
- [ ] Debug any issues found
- [ ] Start timer implementation

### Day 2 (Nov 18):
- [ ] Complete adjustable timers
- [ ] Test timer configurations
- [ ] Start smart voting completion

### Day 3 (Nov 19):
- [ ] Complete smart voting
- [ ] Start game settings & transparency
- [ ] Begin UI improvements

### Day 4-5 (Nov 20-21):
- [ ] Complete game settings
- [ ] UI/UX improvements
- [ ] Sound & vibration

### Day 6-7 (Nov 22-23):
- [ ] Testing & bug fixes
- [ ] Polish & refinement
- [ ] Deploy to production

---

## 🎯 Success Criteria

### Critical Bug Fix:
- ✅ Voting works 100% of the time
- ✅ No console errors
- ✅ Proper phase transitions
- ✅ All edge cases handled

### High Priority Features:
- ✅ Timers fully configurable
- ✅ Settings UI complete
- ✅ Extra time button works
- ✅ Vote progress shows correctly
- ✅ Auto-completion works
- ✅ All features tested

---

**Ready to start development!** 🚀

Next: Test voting system in production, then proceed with timer implementation.
