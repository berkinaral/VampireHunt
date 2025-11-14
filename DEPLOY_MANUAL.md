# 🚀 Manual Deployment Steps

## Current Status
- ✅ Heroku CLI installing (in progress)
- ✅ Server code ready
- ✅ Git initialized
- ✅ Procfile created
- ✅ Build successful

---

## Option 1: Automated Deployment (Recommended)

Once Heroku CLI installation completes:

```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
./deploy.sh
```

This script will:
1. Check Heroku CLI installation
2. Log you in to Heroku
3. Build TypeScript code
4. Create/deploy to Heroku app
5. Test health endpoint
6. Show you the production URL

---

## Option 2: Manual Step-by-Step

### Step 1: Verify Heroku CLI Installation
```bash
heroku --version
# Should show: heroku/10.x.x
```

### Step 2: Login to Heroku
```bash
heroku login
# Opens browser for authentication
```

### Step 3: Create Heroku App
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server

# Create app with custom name
heroku create vampire-hunt-server

# OR let Heroku generate a name
heroku create

# Note the URL it gives you
```

### Step 4: Deploy to Heroku
```bash
# Push code to Heroku
git push heroku master

# If your branch is 'main':
git push heroku main
```

### Step 5: Verify Deployment
```bash
# Check if app is running
heroku ps

# View logs
heroku logs --tail

# Open app in browser
heroku open
```

### Step 6: Test Endpoints
```bash
# Get your app URL
heroku apps:info

# Test health endpoint (replace with your URL)
curl https://vampire-hunt-server.herokuapp.com/health

# Should return:
# {"status":"healthy","timestamp":"...","totalRooms":0,"totalPlayers":0,"activeGames":0}
```

---

## Option 3: Alternative Platforms

If Heroku installation is taking too long, consider these alternatives:

### Railway (Fastest Alternative)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose VampireHunt repository
6. Railway auto-detects Node.js
7. Click "Deploy"
8. Get URL from Settings → Domains

### Render
1. Go to https://render.com
2. Sign up
3. New → Web Service
4. Connect GitHub repo
5. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. Deploy
7. Get URL

---

## After Deployment

### 1. Get Production URL
Your app will be at one of these:
- Heroku: `https://vampire-hunt-server.herokuapp.com`
- Railway: `https://vampire-hunt-production.up.railway.app`
- Render: `https://vampire-hunt.onrender.com`

### 2. Test Production Server
```bash
# Health check
curl https://your-app-url.com/health

# Socket.io endpoint
curl "https://your-app-url.com/socket.io/?EIO=4&transport=polling"

# Web client
open https://your-app-url.com/test-web-client.html
```

### 3. Update Mobile App
Edit: `VampireHuntApp/src/services/SocketService.ts`

```typescript
// Line 20 - Change from:
private serverUrl: string = 'http://192.168.1.103:3000';

// To (use your production URL):
private serverUrl: string = 'https://vampire-hunt-server.herokuapp.com';
```

### 4. Rebuild Mobile App
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp

# Reload Metro (press 'r' in Metro terminal)
# Or restart:
npx react-native run-ios
```

### 5. Test End-to-End
1. Open mobile app
2. Create a room
3. Open web client: `https://your-app-url.com/test-web-client.html`
4. Join the room
5. Play the game!

---

## Troubleshooting

### Heroku CLI Installation Stuck
```bash
# Cancel current installation (Ctrl+C)
# Try direct download:
curl https://cli-assets.heroku.com/install.sh | sh
```

### Build Fails
```bash
# Ensure TypeScript compiles
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
npm run build

# Check dist/ folder exists
ls -la dist/
```

### App Crashes on Heroku
```bash
# View logs
heroku logs --tail

# Common fixes:
# 1. Ensure PORT is from environment
# 2. Check all dependencies in package.json
# 3. Verify start script runs compiled code
```

### Can't Push to Heroku
```bash
# Check Git status
git status

# Ensure changes are committed
git add .
git commit -m "Ready for deployment"

# Check Heroku remote
git remote -v

# Add Heroku remote if missing
heroku git:remote -a vampire-hunt-server
```

---

## Quick Commands Reference

```bash
# Heroku CLI
heroku login                    # Login
heroku create APP_NAME          # Create app
heroku apps:info                # Get app info
heroku logs --tail              # View logs
heroku ps                       # Check dyno status
heroku restart                  # Restart app
heroku open                     # Open in browser

# Git
git status                      # Check status
git add .                       # Stage changes
git commit -m "message"         # Commit
git push heroku master          # Deploy

# Testing
curl URL/health                 # Health check
heroku logs --tail              # Monitor logs
```

---

## Next Steps After Successful Deployment

1. ✅ Backend deployed
2. 📋 Update mobile app URL
3. 📋 Test end-to-end
4. 📋 UI/UX improvements
5. 📋 App Store preparation
6. 📋 Submit to App Store

---

## Current Installation Status

Heroku CLI is installing via Homebrew. This may take 5-10 minutes.

**While waiting, you can**:
- Review the deployment steps above
- Prepare your Heroku account (sign up at heroku.com)
- Review the mobile app code that needs updating
- Read through the troubleshooting section

**Once installation completes**:
- Run `heroku --version` to verify
- Run `./deploy.sh` for automated deployment
- Or follow manual steps above

---

**The automated script `deploy.sh` is ready to use once Heroku CLI installation completes!** 🚀
