# 🔗 How to Integrate Deployed Backend with Mobile App

## Overview

Your mobile app currently connects to `http://192.168.1.103:3000` (local server). After deployment, you need to update it to connect to your production server (e.g., `https://vampire-hunt-production.up.railway.app`).

---

## Step-by-Step Integration

### Step 1: Get Your Production URL

After deploying to Railway/Render/Vercel, you'll get a URL like:
- Railway: `https://vampire-hunt-production.up.railway.app`
- Render: `https://vampire-hunt-server.onrender.com`
- Vercel: `https://vampire-hunt-server.vercel.app`

**Important**: Note this URL - you'll need it!

---

### Step 2: Update SocketService

**File Location**: 
```
VampireHuntApp/src/services/SocketService.ts
```

**Current Code** (Line 18-20):
```typescript
export class SocketService {
  private socket: Socket | null = null;
  private serverUrl: string = 'http://192.168.1.103:3000';
```

**Updated Code**:
```typescript
export class SocketService {
  private socket: Socket | null = null;
  private serverUrl: string = 'https://vampire-hunt-production.up.railway.app'; // Your production URL
```

**Full Example**:
```typescript
import io, { Socket } from 'socket.io-client';

export class SocketService {
  private socket: Socket | null = null;
  
  // CHANGE THIS LINE - Use your production URL
  private serverUrl: string = 'https://vampire-hunt-production.up.railway.app';
  
  constructor() {
    this.connect();
  }

  connect() {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(this.serverUrl, {
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server:', this.socket?.id);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  // ... rest of the code stays the same
}
```

---

### Step 3: Rebuild Mobile App

After updating the URL, rebuild your app:

```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp

# If Metro bundler is running, press 'r' to reload
# Or restart the app:
npx react-native run-ios
```

---

### Step 4: Verify Connection

#### Check Metro Logs
Look for these messages in your Metro terminal:
```
Connected to server: <socket-id>
```

If you see connection errors:
```
Connection error: <error message>
```

#### Check App Behavior
1. Open the app
2. Try to create a room
3. If it works, you're connected!
4. If it fails, check the logs

---

## Environment-Based Configuration (Optional)

For better flexibility, use environment variables:

### Option A: Simple Environment Check

**File**: `VampireHuntApp/src/services/SocketService.ts`

```typescript
export class SocketService {
  private socket: Socket | null = null;
  
  // Automatically use production or local based on environment
  private serverUrl: string = __DEV__ 
    ? 'http://192.168.1.103:3000'  // Development (local)
    : 'https://vampire-hunt-production.up.railway.app';  // Production
  
  // ... rest of code
}
```

This way:
- **Development**: Uses local server (`http://192.168.1.103:3000`)
- **Production**: Uses deployed server (your Railway/Render URL)

### Option B: Environment Variables (Advanced)

#### 1. Install react-native-config
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp
npm install react-native-config
cd ios && pod install && cd ..
```

#### 2. Create .env file
**File**: `VampireHuntApp/.env`
```
API_URL=https://vampire-hunt-production.up.railway.app
```

#### 3. Update SocketService
```typescript
import Config from 'react-native-config';

export class SocketService {
  private socket: Socket | null = null;
  private serverUrl: string = Config.API_URL || 'http://192.168.1.103:3000';
  
  // ... rest of code
}
```

---

## Testing the Integration

### Test 1: Connection
1. Open mobile app
2. Check Metro logs for "Connected to server"
3. No connection errors

### Test 2: Create Room
1. Click "Create Room"
2. Room code is generated
3. Lobby screen loads

### Test 3: Join from Web Client
1. Open: `https://your-production-url.com/test-web-client.html`
2. Enter room code
3. Both mobile and web see each other

### Test 4: Complete Game
1. Get 4 players
2. Start game
3. Play through all phases
4. Game completes successfully

---

## Troubleshooting

### Issue: "Connection error" in logs

**Possible Causes**:
1. Wrong URL (check for typos)
2. Server not running (check deployment)
3. CORS issues (server should allow all origins)
4. Network issues

**Solutions**:
```bash
# 1. Test server is running
curl https://your-production-url.com/health

# 2. Test Socket.io endpoint
curl "https://your-production-url.com/socket.io/?EIO=4&transport=polling"

# 3. Check server logs (Railway/Render dashboard)

# 4. Verify URL in SocketService.ts (no trailing slash)
```

### Issue: "Cannot connect to server"

**Check**:
1. URL is HTTPS (not HTTP)
2. No trailing slash in URL
3. Server is deployed and running
4. Mobile app was rebuilt after URL change

**Fix**:
```typescript
// CORRECT:
private serverUrl: string = 'https://vampire-hunt-production.up.railway.app';

// WRONG:
private serverUrl: string = 'http://vampire-hunt-production.up.railway.app';  // Missing HTTPS
private serverUrl: string = 'https://vampire-hunt-production.up.railway.app/';  // Extra slash
```

### Issue: Works on simulator but not on physical device

**Cause**: Physical device can't access localhost

**Solution**: Always use production URL for physical devices

```typescript
// Use production URL
private serverUrl: string = 'https://vampire-hunt-production.up.railway.app';
```

---

## Server Configuration (Already Done)

Your server is already configured correctly for production:

### CORS Configuration
```typescript
// server/src/index.ts
const io = new Server(httpServer, {
  cors: {
    origin: '*',  // Allows all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});
```

### PORT Configuration
```typescript
// server/src/index.ts
const PORT = process.env.PORT || 3000;  // Uses environment PORT
```

### CSP Headers
```typescript
// server/src/index.ts
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      connectSrc: ["'self'", "ws:", "wss:", "http:", "https:"],
      // ... allows WebSocket connections
    },
  },
}));
```

---

## Quick Integration Checklist

- [ ] Deploy backend to Railway/Render/Vercel
- [ ] Get production URL
- [ ] Update `SocketService.ts` line 20 with production URL
- [ ] Rebuild mobile app (`npx react-native run-ios`)
- [ ] Test connection (check Metro logs)
- [ ] Test create room
- [ ] Test join from web client
- [ ] Test complete game flow

---

## Example: Complete Integration

### 1. Deploy to Railway
```
URL: https://vampire-hunt-production.up.railway.app
```

### 2. Update SocketService.ts
```typescript
private serverUrl: string = 'https://vampire-hunt-production.up.railway.app';
```

### 3. Rebuild App
```bash
cd VampireHuntApp
npx react-native run-ios
```

### 4. Test
```bash
# Mobile app creates room
# Web client joins: https://vampire-hunt-production.up.railway.app/test-web-client.html
# Play game!
```

---

## Production vs Development

### Development (Local Testing)
```typescript
private serverUrl: string = 'http://192.168.1.103:3000';
```
- Use for local development
- Requires server running on your machine
- Only works on same network

### Production (Deployed)
```typescript
private serverUrl: string = 'https://vampire-hunt-production.up.railway.app';
```
- Use for production/testing
- Works from anywhere
- Works on physical devices
- Required for App Store submission

---

## Next Steps After Integration

1. ✅ Backend deployed
2. ✅ Mobile app updated
3. ✅ Connection tested
4. 📋 Test on physical iPhone
5. 📋 UI/UX improvements
6. 📋 App Store preparation
7. 📋 Submit to App Store

---

**Integration is simple: Just update the URL and rebuild!** 🔗✅
