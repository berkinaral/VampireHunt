# Product Context: Vampire Hunt Mobile Game

## Why This Project Exists

### Problem Statement
Social deduction games like Mafia and Werewolf are popular party games, but they require:
- A human moderator who can't play
- Manual tracking of game state
- Players to remember complex rules
- Physical presence in same location

### Solution
Vampire Hunt digitizes and automates the social deduction experience:
- Automated moderator allows everyone to play
- App handles all game logic and timers
- Clear UI guides players through each phase
- Online rooms enable remote or local play
- Simplified rules for accessibility

## How It Should Work

### User Journey
1. **Room Creation**
   - Host opens app and creates new room
   - Receives unique room code
   - Sets game parameters (player count, timer lengths)
   - Shares code with friends

2. **Joining**
   - Players enter room code
   - Choose display name
   - Wait in lobby for game start
   - See other players joining

3. **Game Start**
   - Host starts when all players ready
   - App randomly assigns roles
   - Players privately view their role
   - Game begins with Night phase

4. **Game Flow**
   - **Night Phase**: Vampires select victim
   - **Day Phase**: Discussion and voting
   - **Results**: Eliminated player revealed
   - **Win Conditions**: Check and announce
   - Repeat until game ends

### Core Game Mechanics
- **Vampires**: Win by equaling/outnumbering villagers
- **Villagers**: Win by eliminating all vampires
- **Night Actions**: Vampires vote to eliminate one villager
- **Day Actions**: All players vote to eliminate suspected vampire
- **Discussion**: Timed periods for strategy and deduction

## User Experience Goals

### Primary Goals
1. **Accessibility**: Anyone can learn in < 2 minutes
2. **Engagement**: Keep players active and involved
3. **Social**: Encourage discussion and interaction
4. **Fair Play**: Balanced roles and transparent rules
5. **Smooth Flow**: No confusion about game state

### Design Principles
- **Clarity Over Complexity**: Simple, clear UI elements
- **Mobile-First**: Optimized for phone screens
- **Visual Feedback**: Clear indicators for all actions
- **Minimal Text**: Icons and visuals where possible
- **Fun Atmosphere**: Playful vampire theme without being scary
- **Quick Actions**: One-tap voting and confirmations

### Key Features for Social Experience
- Player avatars or icons
- Chat or emoji reactions
- Victory/defeat animations
- Statistics and achievements
- Rematch functionality
- Spectator mode for eliminated players

## Differentiation
- No human moderator needed
- Simplified ruleset compared to Mafia/Werewolf
- Mobile-optimized unlike browser-based alternatives
- Focus on local friend groups vs random online
- Quick games (10-20 min) vs longer formats
- Modern, polished UI vs text-based alternatives
