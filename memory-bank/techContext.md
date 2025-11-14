# Tech Context: Vampire Hunt Mobile Game

## Technology Stack

### Frontend (Mobile App)

#### Primary Framework Options

**Option 1: React Native** (Recommended)
- Cross-platform (iOS & Android)
- Large ecosystem and community
- Hot reload for development
- Native performance
- Libraries: React Navigation, React Native Paper

**Option 2: Flutter**
- Excellent performance
- Beautiful UI components
- Single codebase
- Dart language
- Material Design built-in

#### Frontend Libraries & Tools
```json
{
  "state-management": "Redux Toolkit or Zustand",
  "websocket": "socket.io-client",
  "ui-components": "React Native Elements or NativeBase",
  "navigation": "React Navigation v6",
  "animations": "Lottie React Native",
  "icons": "React Native Vector Icons",
  "forms": "React Hook Form",
  "storage": "AsyncStorage"
}
```

### Backend (Server)

#### Core Technologies
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **WebSocket**: Socket.io
- **Language**: TypeScript

#### Backend Dependencies
```json
{
  "express": "^4.18.0",
  "socket.io": "^4.5.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.0",
  "uuid": "^9.0.0",
  "joi": "^17.9.0",
  "helmet": "^7.0.0",
  "compression": "^1.7.4"
}
```

### Database

#### Primary Database Options

**Option 1: Redis** (Recommended for MVP)
- In-memory data store
- Perfect for temporary game sessions
- Fast read/write operations
- Pub/sub for real-time events
- Auto-expiration for rooms

**Option 2: MongoDB**
- Document-based storage
- Good for player profiles
- Game history storage
- More complex queries
- Persistent data

### Development Setup

#### Development Tools
```bash
# Package Managers
- npm or yarn
- CocoaPods (iOS)
- Gradle (Android)

# Development Environment
- VS Code with extensions
- React Native Debugger
- Flipper (debugging)
- Postman (API testing)
- ngrok (tunnel for testing)
```

#### Environment Configuration
```env
# .env.development
SERVER_URL=http://localhost:3000
SOCKET_URL=ws://localhost:3000
REDIS_URL=redis://localhost:6379
NODE_ENV=development
PORT=3000

# .env.production
SERVER_URL=https://api.vampirehunt.com
SOCKET_URL=wss://api.vampirehunt.com
REDIS_URL=redis://production-redis:6379
NODE_ENV=production
```

## Technical Constraints

### Performance Requirements
- **Latency**: < 100ms for local actions
- **Real-time sync**: < 500ms between clients
- **App size**: < 50MB initial download
- **Memory usage**: < 200MB runtime
- **Battery**: Minimal drain during gameplay

### Platform Constraints
- **iOS**: Minimum iOS 12.0
- **Android**: Minimum API 21 (Android 5.0)
- **Screen sizes**: 4" to 7" phones
- **Network**: 3G minimum, WiFi preferred
- **Offline**: Graceful degradation

### Security Constraints
- HTTPS/WSS for all connections
- Input validation on server
- Rate limiting for actions
- Secure random for role assignment
- No sensitive data in client storage

## Dependencies

### NPM Package Structure
```
/vampire-hunt-app
├── package.json (React Native app)
├── /ios
│   └── Podfile
├── /android
│   └── build.gradle
└── /server
    └── package.json (Node.js server)
```

### Critical Dependencies
1. **socket.io**: Real-time bidirectional communication
2. **react-native**: Mobile app framework
3. **express**: Web server framework
4. **redis**: Session and game state storage
5. **typescript**: Type safety and better DX

## Tool Usage Patterns

### Git Workflow
```bash
main → develop → feature/[name]
                → bugfix/[name]
                → hotfix/[name]
```

### Build & Deploy
```bash
# Development
npm run dev         # Start dev server
npm run ios        # Run iOS simulator
npm run android    # Run Android emulator

# Production
npm run build      # Build production app
npm run deploy     # Deploy to stores
```

### Testing Strategy
- **Unit Tests**: Jest
- **Integration Tests**: Supertest
- **E2E Tests**: Detox
- **Load Testing**: Artillery.io

### CI/CD Pipeline
1. GitHub Actions or GitLab CI
2. Automated testing on PR
3. Build validation
4. Deployment to TestFlight/Play Console
5. Production release workflow

## Infrastructure

### Hosting Options
- **Backend**: Heroku, Railway, or AWS EC2
- **Database**: Redis Cloud or AWS ElastiCache
- **WebSocket**: Dedicated server or managed service
- **CDN**: CloudFlare for static assets

### Monitoring
- **APM**: New Relic or DataDog
- **Error Tracking**: Sentry
- **Analytics**: Firebase Analytics
- **Logging**: Winston + CloudWatch
