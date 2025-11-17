# 🗺️ Vampire Hunt - Improvement Roadmap

**Last Updated**: November 17, 2025  
**Status**: Production Live - Enhancement Phase

---

## 🔴 CRITICAL - Fix Immediately

### 1. Voting System Bug Fix
**Priority**: URGENT  
**Estimated Time**: 2-4 hours  
**Status**: 🔴 Blocking

**Issue**: Voting system not working properly

**Tasks**:
- [ ] Debug vote submission mechanism
  - Check client-side vote casting
  - Verify server receives votes
  - Test vote event handling
- [ ] Test vote counting logic
  - Verify vote aggregation
  - Check tie-breaking logic
  - Test elimination calculation
- [ ] Verify vote result calculation
  - Ensure correct player elimination
  - Test edge cases (ties, disconnects)
- [ ] Ensure proper phase transitions after voting
  - Day voting → Night phase
  - Night voting → Day discussion
  - Test timer resets

**Testing Checklist**:
- [ ] 4 players vote during day phase
- [ ] Vampires vote during night phase
- [ ] Votes counted correctly
- [ ] Correct player eliminated
- [ ] Phase transitions properly
- [ ] No errors in console

---

## 🟠 HIGH PRIORITY - Week 1 Sprint

### 2. Adjustable Game Timers
**Priority**: High  
**Estimated Time**: 4-6 hours  
**Impact**: Improves game flexibility

**Features**:
- [ ] Add game settings screen/modal
- [ ] Implement timer configuration
  - Day discussion time (default: 120s, range: 30-300s)
  - Night phase time (default: 30s, range: 15-60s)
  - Voting time (default: 60s, range: 30-120s)
  - Role reveal time (default: 10s, range: 5-20s)
- [ ] Add "Extra Time" button for day discussions
  - Host can add +30s during discussion
  - Max 2 extensions per day phase
- [ ] Save timer settings per game
- [ ] Update backend to use configurable timers

**UI Components**:
- Settings panel in lobby
- Slider controls for each timer
- Preview of selected times
- "Extra Time" button during day phase

---

### 3. Smart Voting Completion
**Priority**: High  
**Estimated Time**: 3-4 hours  
**Impact**: Improves game flow

**Features**:
- [ ] Auto-end voting when all players vote
  - Check if all eligible voters submitted
  - Skip remaining timer
  - Immediate phase transition
- [ ] Show vote progress indicator
  - "X/Y players voted" display
  - Update in real-time
  - Visual progress bar
- [ ] Add "Waiting for votes" indicator
  - Show who hasn't voted yet (names only)
  - Highlight pending voters
  - Add gentle reminder after 30s

**Backend Changes**:
- Track vote submissions per phase
- Calculate vote completion percentage
- Trigger early phase transition

---

### 4. Game Settings & Transparency
**Priority**: High  
**Estimated Time**: 5-6 hours  
**Impact**: Better game experience

**Features**:
- [ ] Configurable vampire count
  - Host selects vampire count (1 to N/3)
  - Show vampire ratio in lobby
  - Validate minimum players needed
- [ ] Post-game vote reveal
  - Show who voted for whom
  - Display voting history
  - Optional: hide during game, show after
- [ ] Display eliminated player's role
  - Show role immediately after elimination
  - Add dramatic reveal animation
  - Update all players' screens
- [ ] Game settings presets
  - Quick game (short timers)
  - Standard game (default timers)
  - Extended game (long timers)
  - Custom (user-defined)

**UI Components**:
- Settings panel in lobby
- Vampire count selector
- Preset buttons
- Post-game statistics screen

---

### 5. UI/UX Improvements - All Screens
**Priority**: High  
**Estimated Time**: 8-10 hours  
**Impact**: Professional polish

#### Home Screen
- [ ] Improve button visual feedback
  - Pressed state animation
  - Hover effects (if applicable)
  - Ripple effect
- [ ] Add smooth transitions
  - Fade in/out animations
  - Slide transitions
- [ ] Better layout and spacing
  - Consistent padding
  - Improved typography
  - Better color contrast

#### Create/Join Room Screens
- [ ] Enhanced input validation
  - Real-time validation feedback
  - Clear error indicators
  - Success confirmation
- [ ] Better error messages
  - Specific, actionable messages
  - Friendly tone
  - Suggest solutions
- [ ] Loading states for network actions
  - Spinner during room creation
  - "Joining..." indicator
  - Disable buttons during loading

#### Game Lobby Screen
- [ ] Enhanced player list display
  - Player cards with better design
  - Host badge/indicator
  - Player count display
- [ ] Show player status indicators
  - Connected/disconnected status
  - Ready/not ready (optional)
  - Color-coded status
- [ ] Better host controls layout
  - Prominent "Start Game" button
  - Settings access
  - Kick player option (optional)
- [ ] Add settings panel
  - Accessible from lobby
  - Configure all game options
  - Preview settings

#### Game Play Screen
- [ ] Improved voting interface
  - Larger, clearer buttons
  - Better player card layout
  - Visual feedback on selection
  - Confirm vote dialog
- [ ] Better timer visibility
  - Larger timer display
  - Countdown animation
  - Color change when < 10s
  - Pulse effect when urgent
- [ ] Enhanced phase transition animations
  - Smooth fade between phases
  - Phase name announcement
  - Visual effects
- [ ] Show vote progress indicator
  - "X/Y voted" display
  - Progress bar
  - Update in real-time
- [ ] Display who has voted
  - Show names of voters (not votes)
  - Check mark indicator
  - "Waiting for..." list

#### Role Reveal Screen
- [ ] More dramatic reveal animation
  - Fade in/out effects
  - Card flip animation
  - Particle effects (optional)
- [ ] Clearer role description
  - Larger role name
  - Brief ability description
  - Role-specific colors
- [ ] Better visual design
  - Vampire: Red theme
  - Villager: Blue theme
  - Special roles: Unique colors

#### Game Result Screen
- [ ] Show detailed game statistics
  - Total rounds played
  - Players eliminated each round
  - Voting patterns
- [ ] Display voting history
  - Who voted for whom each round
  - Voting timeline
  - Interactive view
- [ ] Show all player roles
  - Reveal all roles post-game
  - Role distribution chart
  - MVP/interesting stats
- [ ] Better winner announcement
  - Animated winner display
  - Confetti effect
  - Victory sound

---

### 6. Audio & Haptics
**Priority**: High  
**Estimated Time**: 4-5 hours  
**Impact**: Enhanced immersion

#### Basic Sound Effects
- [ ] Button press sounds
  - Subtle click sound
  - Different sounds for different actions
- [ ] Phase transition sounds
  - Day → Night: Ominous sound
  - Night → Day: Dawn sound
  - Voting start: Alert sound
- [ ] Vote cast sound
  - Confirmation sound
  - Success feedback
- [ ] Elimination sound
  - Dramatic elimination sound
  - Different for day/night
- [ ] Victory/defeat sounds
  - Victory fanfare
  - Defeat sound
  - Role-specific sounds (optional)

**Implementation**:
- Use React Native Sound library
- Preload all sounds
- Add volume control in settings
- Mute option

#### Vibration Feedback
- [ ] Button presses
  - Light vibration (10ms)
  - Haptic feedback
- [ ] Important events
  - Phase change (medium vibration)
  - Elimination (strong vibration)
  - Game start/end (pattern)
- [ ] Vote submission
  - Confirmation vibration
  - Success feedback
- [ ] Timer warnings
  - Vibrate at 10s remaining
  - Pulse pattern

**Implementation**:
- Use React Native Haptic Feedback
- Different patterns for different events
- Settings to disable vibrations

---

## 🟡 MEDIUM PRIORITY - Week 2-3

### 7. Additional Roles System
**Priority**: Medium  
**Estimated Time**: 12-15 hours  
**Impact**: Adds game depth

#### Doctor Role
**Ability**: Can save one player per night

- [ ] Backend implementation
  - Add DOCTOR to PlayerRole enum
  - Implement save action logic
  - Handle save during night phase
  - Update elimination logic (check if saved)
- [ ] Frontend implementation
  - Doctor-specific UI during night
  - Player selection for saving
  - Confirmation dialog
  - Green theme for doctor
- [ ] Update win conditions
  - Doctor counts as villager
  - Saved player not eliminated
- [ ] Balance considerations
  - Doctor can't save same player twice in a row
  - Doctor can't save themselves (optional)

#### Police/Detective Role
**Ability**: Can investigate one player per night

- [ ] Backend implementation
  - Add POLICE to PlayerRole enum
  - Implement investigation logic
  - Return player's role privately
  - Track investigation history
- [ ] Frontend implementation
  - Police-specific UI during night
  - Player selection for investigation
  - Private result display
  - Blue theme for police
- [ ] Investigation results
  - Show "Vampire" or "Not Vampire"
  - Private to police only
  - History of investigations
- [ ] Balance considerations
  - Can't investigate same player twice
  - Results shown immediately

#### Medium Role
**Ability**: Can communicate with eliminated players

- [ ] Backend implementation
  - Add MEDIUM to PlayerRole enum
  - Implement spirit communication
  - Allow medium to see eliminated players' chat
  - Limited communication (yes/no questions)
- [ ] Frontend implementation
  - Medium-specific UI
  - Spirit communication interface
  - Purple theme for medium
- [ ] Communication mechanics
  - Medium can ask yes/no questions
  - Spirits can respond once per round
  - Shown only to medium
- [ ] Balance considerations
  - Limited uses (2-3 per game)
  - Spirits can lie (optional)

#### Role Configuration System
- [ ] Host role selection UI
  - Enable/disable each role
  - Set count for each role type
  - Visual role distribution preview
- [ ] Role validation
  - Minimum players for role combinations
  - Balance checks (not too many special roles)
  - Warning messages
- [ ] Role presets
  - Classic (Vampire + Villager only)
  - Standard (+ Doctor + Police)
  - Advanced (all roles)
  - Custom (user-defined)
- [ ] Save/load role configurations
  - Save favorite setups
  - Quick select presets
  - Share configurations (optional)

---

### 8. Enhanced UI/UX Polish
**Priority**: Medium  
**Estimated Time**: 6-8 hours  
**Impact**: Professional feel

- [ ] Tutorial/onboarding flow
  - First-time user guide
  - Interactive tutorial
  - Skip option
  - Role explanations
- [ ] Confirmation dialogs
  - Leave game confirmation
  - Vote confirmation
  - Kick player confirmation
  - Critical action warnings
- [ ] Better empty states
  - "No players yet" in lobby
  - "Waiting for players" messages
  - Helpful tips during waiting
  - Animated placeholders
- [ ] Improved error recovery
  - Auto-reconnect on disconnect
  - Resume game state
  - Clear reconnection feedback
  - Graceful degradation
- [ ] Player avatars/icons
  - Default avatar set
  - Color-coded avatars
  - Initials-based avatars
  - Custom avatars (future)
- [ ] Custom elimination animations
  - Fade out effect
  - Particle effects
  - Role-specific animations
  - Dramatic timing

---

## 🟢 LOW PRIORITY - Future Enhancements

### 9. Advanced Features
**Priority**: Low  
**Estimated Time**: 20+ hours  
**Impact**: Nice to have

- [ ] Chat/messaging system
  - Day phase chat
  - Night phase (vampire-only)
  - Text-based communication
  - Emoji support
- [ ] Game statistics tracking
  - Win/loss record
  - Role statistics
  - Favorite roles
  - Play history
- [ ] Player profiles
  - Username system
  - Profile pictures
  - Statistics display
  - Friend system (optional)
- [ ] Custom game modes
  - Speed mode (short timers)
  - Chaos mode (random events)
  - Team mode (2 vampire teams)
  - Custom rules
- [ ] Spectator mode
  - Eliminated players can watch
  - Can't communicate with alive players
  - See all roles (optional)
  - Ghost chat
- [ ] Voice chat integration
  - Real-time voice during day phase
  - Push-to-talk
  - Mute controls
  - Voice quality settings
- [ ] Advanced sound & music
  - Background music
  - Ambient sounds
  - Dynamic music (changes with phase)
  - Sound themes
- [ ] Theme customization
  - Dark/light mode
  - Color schemes
  - Custom themes
  - Accessibility options
- [ ] Replay system
  - Record game sessions
  - Replay viewer
  - Share replays
  - Highlight moments
- [ ] Tournament mode
  - Multi-game tournaments
  - Bracket system
  - Leaderboards
  - Prizes/rewards

---

## 📊 Implementation Timeline

### Week 1 (Nov 17-24)
- 🔴 Fix voting system bug (Day 1-2)
- 🟠 Adjustable game timers (Day 2-3)
- 🟠 Smart voting completion (Day 3-4)
- 🟠 Game settings & transparency (Day 4-5)
- 🟠 Start UI improvements (Day 5-7)

### Week 2 (Nov 25 - Dec 1)
- 🟠 Complete UI improvements all screens
- 🟠 Add audio & haptics
- 🟡 Start additional roles (Doctor)
- 🟡 Police role implementation

### Week 3 (Dec 2-8)
- 🟡 Complete additional roles (Medium)
- 🟡 Role configuration system
- 🟡 Enhanced UI/UX polish
- 🟡 Tutorial/onboarding

### Week 4+ (Dec 9+)
- 📋 App Store preparation
- 📋 TestFlight beta testing
- 🟢 Low priority features (as time permits)

---

## 🎯 Success Metrics

### Critical Bug Fix
- ✅ Voting works 100% of the time
- ✅ No errors in console
- ✅ Proper phase transitions
- ✅ Correct elimination logic

### High Priority Features
- ✅ All timers configurable
- ✅ Voting ends when all vote
- ✅ Game settings fully functional
- ✅ All screens polished
- ✅ Sound and vibration working

### Medium Priority Features
- ✅ 3 additional roles working
- ✅ Role configuration system complete
- ✅ Tutorial implemented
- ✅ All polish items done

---

## 📝 Notes

### Testing Strategy
- Test each feature thoroughly before moving to next
- Get user feedback after each major feature
- Prioritize bug fixes over new features
- Maintain production stability

### Code Quality
- Write clean, maintainable code
- Add comments for complex logic
- Update type definitions
- Keep components modular

### Documentation
- Update memory bank after each feature
- Document new game mechanics
- Update README with new features
- Create user guides

---

**Ready to start with the critical voting bug fix!** 🔴

See `memory-bank/progress.md` for detailed task breakdown.
