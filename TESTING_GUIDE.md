# 🧪 Vampire Hunt - Testing Guide

## Quick Test (5 minutes)

### Setup:
1. **Server running**: Check terminal shows "🦇 Vampire Hunt server running on port 3000"
2. **Mobile app running**: Simulator shows the app
3. **Web clients ready**: 3-4 browser tabs

### Test Flow:
```
Mobile App → Create Room → Get Code (e.g., "ABC123")
Browser Tab 1 → Join Room "ABC123" → Enter name "Player1"
Browser Tab 2 → Join Room "ABC123" → Enter name "Player2"
Browser Tab 3 → Join Room "ABC123" → Enter name "Player3"
Mobile App → Start Game (need 4+ players)
→ Everyone sees their role
→ Night phase: Vampires vote
→ Day phase: Everyone votes
→ Game ends with winner
```

---

## Detailed Testing Checklist

### 1. Connection Testing

#### Server Health:
```bash
curl http://192.168.1.103:3000/health
# Should return: {"status":"healthy",...}
```

#### Web Client Connection:
- [ ] Open http://192.168.1.103:3000/test-local.html
- [ ] Status shows "Connected" (green)
- [ ] Socket ID is displayed
- [ ] No errors in console (F12)

#### Mobile App Connection:
- [ ] App launches without crashes
- [ ] Home screen displays correctly
- [ ] No connection errors in Metro logs

---

### 2. Room Management Testing

#### Create Room:
- [ ] Click "Create Room" in mobile app
- [ ] Room code is generated (6 characters)
- [ ] Room code is displayed clearly
- [ ] Can copy room code
- [ ] Lobby screen shows host as player
- [ ] Player count shows "1/10"

#### Join Room:
- [ ] Enter valid room code in web client
- [ ] Successfully joins room
- [ ] Player appears in lobby for all users
- [ ] Player count updates
- [ ] Host sees new player immediately

#### Invalid Room:
- [ ] Enter invalid code "XXXXXX"
- [ ] Shows error message
- [ ] Doesn't crash app

#### Room Full:
- [ ] Try joining with 10 players already
- [ ] Shows "Room is full" error
- [ ] Handles gracefully

---

### 3. Lobby Testing

#### Player Display:
- [ ] All players shown in list
- [ ] Player names displayed correctly
- [ ] Host has indicator/badge
- [ ] Player count accurate

#### Host Controls:
- [ ] "Start Game" button visible for host
- [ ] "Start Game" disabled with < 4 players
- [ ] "Start Game" enabled with 4+ players
- [ ] Non-host players don't see start button

#### Player Leave:
- [ ] Close browser tab (player leaves)
- [ ] Player removed from lobby
- [ ] Player count updates
- [ ] Other players notified

#### Host Leave:
- [ ] Host closes app/tab
- [ ] New host assigned automatically
- [ ] Game continues normally
- [ ] Or room closes if no players left

---

### 4. Game Start Testing

#### With 4 Players:
- [ ] Host clicks "Start Game"
- [ ] All players transition to role reveal
- [ ] Roles assigned (1 vampire, 3 villagers)
- [ ] Each player sees their own role
- [ ] Vampires see other vampires
- [ ] Villagers don't see vampires

#### With 6 Players:
- [ ] 2 vampires, 4 villagers
- [ ] Ratio is correct (1/3)

#### With 10 Players:
- [ ] 3 vampires, 7 villagers
- [ ] All players get roles

---

### 5. Role Reveal Testing

#### Vampire View:
- [ ] Shows "You are a VAMPIRE"
- [ ] Shows list of other vampires
- [ ] Red/dark theme
- [ ] Clear instructions

#### Villager View:
- [ ] Shows "You are a VILLAGER"
- [ ] Doesn't show other players' roles
- [ ] Blue/light theme
- [ ] Clear instructions

#### Transition:
- [ ] After 10 seconds, auto-advances
- [ ] Or manual "Continue" button works
- [ ] All players advance together

---

### 6. Night Phase Testing

#### Vampire Actions:
- [ ] Only vampires can vote
- [ ] List of villagers shown
- [ ] Can select one villager
- [ ] Vote is submitted
- [ ] Can change vote before time ends

#### Villager View:
- [ ] Shows "Night time..."
- [ ] Shows waiting message
- [ ] Shows timer
- [ ] Cannot vote

#### Timer:
- [ ] Counts down from 30 seconds
- [ ] Shows remaining time
- [ ] Auto-advances when time ends

#### Vote Results:
- [ ] Majority vote determines elimination
- [ ] Tie results in random selection
- [ ] Eliminated player notified
- [ ] All players see who was eliminated

---

### 7. Day Discussion Testing

#### Discussion Phase:
- [ ] 2-minute timer
- [ ] All players see same timer
- [ ] No voting yet
- [ ] Shows all alive players
- [ ] Shows eliminated players (grayed out)

#### Timer:
- [ ] Counts down correctly
- [ ] Shows minutes:seconds
- [ ] Auto-advances to voting

---

### 8. Day Voting Testing

#### Voting Interface:
- [ ] All alive players can vote
- [ ] List shows all alive players
- [ ] Can select one player
- [ ] Can vote for anyone (including self)
- [ ] Vote is submitted

#### Vote Tracking:
- [ ] Shows "Waiting for X players to vote"
- [ ] Updates as votes come in
- [ ] Shows who has voted (not who they voted for)

#### Vote Results:
- [ ] Majority vote wins
- [ ] Tie handled correctly
- [ ] Eliminated player revealed
- [ ] Player's role revealed after elimination

---

### 9. Game End Testing

#### Vampires Win:
- [ ] When vampires ≥ villagers
- [ ] Shows "Vampires Win!"
- [ ] Shows all vampires
- [ ] Shows final player list with roles

#### Villagers Win:
- [ ] When all vampires eliminated
- [ ] Shows "Villagers Win!"
- [ ] Shows eliminated vampires
- [ ] Shows final player list with roles

#### Results Screen:
- [ ] Clear winner announcement
- [ ] All players' roles revealed
- [ ] Shows who was eliminated when
- [ ] "Play Again" button works
- [ ] "Leave Room" button works

---

### 10. Edge Cases Testing

#### Network Issues:
- [ ] Player disconnects mid-game
- [ ] Player reconnects
- [ ] Game continues without disconnected player
- [ ] Or game ends if too few players

#### Rapid Actions:
- [ ] Multiple players join simultaneously
- [ ] Multiple votes at same time
- [ ] Spam clicking buttons
- [ ] No crashes or errors

#### Invalid States:
- [ ] Try voting twice
- [ ] Try voting after time ends
- [ ] Try starting game with 3 players
- [ ] All handled gracefully

#### Browser Refresh:
- [ ] Refresh during lobby
- [ ] Refresh during game
- [ ] Reconnection handling
- [ ] State recovery

---

## Performance Testing

### Load Testing:
- [ ] 10 players in one game
- [ ] Multiple games simultaneously
- [ ] Server handles load
- [ ] No lag or delays

### Mobile Performance:
- [ ] Smooth animations
- [ ] No frame drops
- [ ] Battery usage reasonable
- [ ] No memory leaks

### Network Performance:
- [ ] Works on WiFi
- [ ] Works on cellular (if server public)
- [ ] Handles slow connections
- [ ] Reconnects automatically

---

## Automated Test Script

Run the automated test:
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
node test-game-flow.js
```

Should show:
```
✅ Room created
✅ Players joined
✅ Game started
✅ Roles assigned
✅ Night phase completed
✅ Day phase completed
✅ Game ended correctly
```

---

## Bug Reporting Template

If you find issues, document:

```
**Bug**: [Short description]

**Steps to Reproduce**:
1. 
2. 
3. 

**Expected**: [What should happen]

**Actual**: [What actually happened]

**Environment**:
- Device: [iPhone 15 / Simulator / Browser]
- OS: [iOS 17 / macOS 14]
- Browser: [Safari 17 / Chrome 120]

**Logs**: [Console errors, server logs]

**Screenshots**: [If applicable]
```

---

## Test Results Tracker

### Session 1: [Date]
- [ ] Connection: ✅ / ❌
- [ ] Room Management: ✅ / ❌
- [ ] Lobby: ✅ / ❌
- [ ] Game Start: ✅ / ❌
- [ ] Night Phase: ✅ / ❌
- [ ] Day Phase: ✅ / ❌
- [ ] Game End: ✅ / ❌
- [ ] Edge Cases: ✅ / ❌

**Notes**: 

**Issues Found**:
1. 
2. 

---

## Ready for Production?

Before submitting to App Store, verify:

- [ ] All core features work
- [ ] No critical bugs
- [ ] Performance is acceptable
- [ ] Tested with 4-10 players
- [ ] Tested on physical device
- [ ] No crashes in 10+ games
- [ ] Network issues handled gracefully
- [ ] UI is polished and clear

---

**Start with the Quick Test, then work through the detailed checklist!** 🧪✅
