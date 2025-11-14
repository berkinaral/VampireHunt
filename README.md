# 🦇 Vampire Hunt - Mobile Social Deduction Game

A real-time multiplayer social deduction game where friends can join the same room using a shared code. Players are randomly assigned roles (Vampire or Villager) and must work together (or against each other) to win!

## 🎮 Game Features

- **Room-based Multiplayer**: Create or join rooms with unique codes
- **Automated Moderator**: No need for a human moderator - the app handles everything
- **Role Assignment**: Random assignment of Vampires and Villagers
- **Day/Night Cycles**: Strategic gameplay with different phases
- **Voting System**: Democratic elimination during the day, vampire attacks at night
- **Real-time Updates**: Live game state synchronization across all players
- **Beautiful UI**: Dark vampire-themed interface optimized for mobile

## 🏗️ Project Structure

```
VampireHunt/
├── VampireHuntApp/        # React Native mobile app
│   ├── src/
│   │   ├── screens/       # UI screens
│   │   ├── navigation/    # Navigation setup
│   │   ├── types/         # TypeScript definitions
│   │   └── services/      # API and Socket services
│   ├── ios/               # iOS specific files
│   └── android/           # Android specific files
├── server/                # Node.js backend
│   └── src/
│       ├── controllers/   # Request handlers
│       ├── services/      # Business logic
│       └── types/         # Shared types
└── memory-bank/           # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- React Native development environment set up
- iOS: Xcode (for Mac)
- Android: Android Studio
- Redis (for backend session management)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd VampireHunt
```

2. **Install mobile app dependencies**
```bash
cd VampireHuntApp
npm install
# iOS only:
cd ios && pod install && cd ..
```

3. **Install server dependencies**
```bash
cd ../server
npm install
```

### Running the Application

#### Start the Backend Server
```bash
cd server
npm run dev
```

#### Run the Mobile App

**iOS:**
```bash
cd VampireHuntApp
npm run ios
```

**Android:**
```bash
cd VampireHuntApp
npm run android
```

## 🎯 How to Play

1. **Create or Join a Room**
   - One player creates a room and shares the code
   - Other players join using the room code

2. **Role Assignment**
   - Once the game starts, players are secretly assigned roles
   - Vampires know each other, Villagers don't

3. **Night Phase**
   - Vampires vote to eliminate a Villager
   - Villagers wait (and hope they survive)

4. **Day Phase**
   - Discussion time: Players discuss who might be a Vampire
   - Voting time: All players vote to eliminate a suspected Vampire

5. **Win Conditions**
   - Vampires win if they equal or outnumber Villagers
   - Villagers win if they eliminate all Vampires

## 🛠️ Technology Stack

- **Frontend**: React Native + TypeScript
- **Backend**: Node.js + Express + Socket.io
- **Database**: Redis (session management)
- **Real-time**: WebSocket (Socket.io)
- **State Management**: Redux Toolkit (planned)

## 📱 Supported Platforms

- iOS 12.0+
- Android 5.0+ (API 21+)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 🎨 Design Credits

- Dark vampire theme with red/black/white color scheme
- Optimized for mobile gameplay
- Fun and social experience focus

## 🔮 Future Enhancements

- Additional roles (Detective, Doctor, etc.)
- Custom game modes
- Player profiles and statistics
- Voice chat integration
- Tournament mode
- AI players for practice

---

**Enjoy hunting vampires (or being one)! 🦇**
