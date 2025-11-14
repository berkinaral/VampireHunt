# 🚂 Deploying to Railway - In Progress

## Current Status
✅ Railway CLI installed (v4.11.0)
🔄 Waiting for you to login in browser

---

## What's Happening Now

### Step 1: Railway Login (IN PROGRESS)
A browser window should have opened with Railway authentication.

**Action Required**:
1. Complete the login in your browser
2. Authorize Railway CLI
3. Return to terminal

If browser didn't open, manually go to the URL shown in terminal.

---

## After Login Completes

### Step 2: Initialize Railway Project
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
npx @railway/cli init
```

Follow prompts:
- **Create new project?** Yes
- **Project name?** vampire-hunt-server (or press Enter for default)
- **Environment?** production (or press Enter for default)

### Step 3: Deploy
```bash
npx @railway/cli up
```

This will:
1. Upload your code
2. Install dependencies
3. Build TypeScript
4. Start the server
5. Give you a URL

Wait 2-3 minutes for deployment.

### Step 4: Get Your URL
```bash
npx @railway/cli domain
```

Or generate a domain:
```bash
npx @railway/cli domain --generate
```

Your URL will be something like:
```
https://vampire-hunt-production.up.railway.app
```

### Step 5: Test Deployment
```bash
# Replace with your actual URL
curl https://vampire-hunt-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-14T...",
  "totalRooms": 0,
  "totalPlayers": 0,
  "activeGames": 0
}
```

---

## Complete Deployment Commands

Once login completes, run these in order:

```bash
# 1. Navigate to server
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server

# 2. Initialize project
npx @railway/cli init

# 3. Deploy
npx @railway/cli up

# 4. Generate domain
npx @railway/cli domain --generate

# 5. View logs
npx @railway/cli logs

# 6. Open in browser
npx @railway/cli open
```

---

## Update Mobile App After Deployment

### Step 1: Get Production URL
```bash
npx @railway/cli domain
```

Copy the URL (e.g., `https://vampire-hunt-production.up.railway.app`)

### Step 2: Update SocketService
**File**: `VampireHuntApp/src/services/SocketService.ts`

**Line 20** - Change from:
```typescript
private serverUrl: string = 'http://192.168.1.103:3000';
```

**To** (your Railway URL):
```typescript
private serverUrl: string = 'https://vampire-hunt-production.up.railway.app';
```

### Step 3: Rebuild Mobile App
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp
npx react-native run-ios
```

---

## Verify Everything Works

### Test 1: Health Endpoint
```bash
curl https://your-railway-url.com/health
```
✅ Should return healthy status

### Test 2: Socket.io Endpoint
```bash
curl "https://your-railway-url.com/socket.io/?EIO=4&transport=polling"
```
✅ Should return Socket.io handshake data

### Test 3: Web Client
Open in browser:
```
https://your-railway-url.com/test-web-client.html
```
✅ Should show "Connected to server" (green)

### Test 4: Mobile App
1. Open mobile app
2. Check Metro logs for "Connected to server"
3. Create a room
4. ✅ Room code generated

### Test 5: End-to-End
1. Create room in mobile app
2. Join from web client
3. Play complete game
4. ✅ Everything works!

---

## Railway Dashboard

After deployment, you can manage your app at:
https://railway.app/dashboard

Features:
- **Deployments**: View deployment history and logs
- **Metrics**: Monitor CPU, memory, network usage
- **Variables**: Set environment variables
- **Domains**: Manage custom domains
- **Settings**: Configure project settings

---

## Useful Railway Commands

```bash
# View logs (real-time)
npx @railway/cli logs

# Check deployment status
npx @railway/cli status

# Redeploy
npx @railway/cli up

# Open in browser
npx @railway/cli open

# List all projects
npx @railway/cli list

# Get domain
npx @railway/cli domain

# Generate new domain
npx @railway/cli domain --generate

# View environment variables
npx @railway/cli variables

# Link to different project
npx @railway/cli link
```

---

## Troubleshooting

### Issue: Login stuck
**Solution**: 
1. Check browser for Railway tab
2. Complete authentication
3. If stuck, press Ctrl+C and try again:
```bash
npx @railway/cli login
```

### Issue: Build fails
**Solution**:
```bash
# View logs
npx @railway/cli logs

# Common fixes:
# 1. Ensure package.json is correct
# 2. Test build locally
cd server
npm install
npm run build

# 3. Redeploy
npx @railway/cli up
```

### Issue: Can't access URL
**Solution**:
```bash
# Check status
npx @railway/cli status

# View logs for errors
npx @railway/cli logs

# Ensure domain is generated
npx @railway/cli domain --generate
```

### Issue: Mobile app can't connect
**Solution**:
1. Verify URL is correct (HTTPS, no trailing slash)
2. Test server: `curl https://your-url.com/health`
3. Rebuild mobile app after URL change
4. Check Metro logs for connection errors

---

## Next Steps After Deployment

1. ✅ Complete Railway login (in progress)
2. 📋 Initialize Railway project
3. 📋 Deploy with `railway up`
4. 📋 Get production URL
5. 📋 Update mobile app
6. 📋 Test end-to-end
7. 📋 UI/UX improvements
8. 📋 App Store submission

---

## Progress: 98% → 99%

**What's Done**:
- ✅ Railway CLI installed
- 🔄 Railway login in progress
- ✅ Deployment commands ready

**What's Next**:
- 🔄 Complete login
- 📋 Deploy to Railway (3 min)
- 📋 Update mobile app (2 min)
- 📋 Test (5 min)

---

## Quick Reference

**After login completes, run**:
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
npx @railway/cli init
npx @railway/cli up
npx @railway/cli domain --generate
```

**Then update mobile app**:
```typescript
// VampireHuntApp/src/services/SocketService.ts line 20
private serverUrl: string = 'https://your-railway-url.up.railway.app';
```

**Then rebuild**:
```bash
cd VampireHuntApp
npx react-native run-ios
```

---

**Complete the Railway login in your browser, then run the deployment commands above!** 🚂🚀
