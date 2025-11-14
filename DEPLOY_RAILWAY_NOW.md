# 🚂 Deploy to Railway NOW (5 Minutes)

## Why Railway?
- ✅ No credit card required
- ✅ $5 free credit per month
- ✅ Fastest deployment
- ✅ Automatic GitHub integration
- ✅ Built-in SSL (HTTPS)

---

## Step-by-Step Deployment

### Step 1: Push Code to GitHub (If Not Already)

```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt

# Check if Git is initialized
git status

# If not, initialize
git init
git add .
git commit -m "Ready for deployment"

# Create GitHub repo and push
# (Or use GitHub Desktop to push)
```

### Step 2: Sign Up for Railway

1. Go to: **https://railway.app**
2. Click **"Login"**
3. Select **"Login with GitHub"**
4. Authorize Railway to access your GitHub

### Step 3: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your **VampireHunt** repository
4. Railway will scan and detect Node.js

### Step 4: Configure Deployment

Railway should auto-detect everything, but verify:

**Root Directory**: 
- If Railway asks, set to: `/server`
- Or leave blank if it auto-detects

**Build Command**: (auto-detected)
```
npm install && npm run build
```

**Start Command**: (auto-detected)
```
npm start
```

**Environment Variables**: (optional)
- `NODE_ENV=production` (Railway sets this automatically)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Watch the build logs

You'll see:
```
Building...
Installing dependencies...
Running npm install...
Running npm run build...
Starting server...
✅ Deployed successfully!
```

### Step 6: Get Your URL

1. Go to your project dashboard
2. Click **"Settings"** tab
3. Click **"Domains"** section
4. Click **"Generate Domain"**

Your URL will be something like:
```
https://vampire-hunt-production.up.railway.app
```

**Copy this URL!** You'll need it for the mobile app.

### Step 7: Test Deployment

```bash
# Test health endpoint (replace with your URL)
curl https://vampire-hunt-production.up.railway.app/health

# Should return:
# {"status":"healthy","timestamp":"...","totalRooms":0,"totalPlayers":0,"activeGames":0}
```

### Step 8: Test Web Client

Open in browser:
```
https://vampire-hunt-production.up.railway.app/test-web-client.html
```

You should see: **"Connected to server"** (green status)

---

## Update Mobile App

### Step 1: Edit SocketService

**File**: `VampireHuntApp/src/services/SocketService.ts`

**Line 20** - Change from:
```typescript
private serverUrl: string = 'http://192.168.1.103:3000';
```

**To** (use your Railway URL):
```typescript
private serverUrl: string = 'https://vampire-hunt-production.up.railway.app';
```

### Step 2: Rebuild App

```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp

# Reload Metro (press 'r' in Metro terminal)
# Or restart:
npx react-native run-ios
```

### Step 3: Test Connection

1. Open mobile app
2. Check Metro logs for: `Connected to server: <socket-id>`
3. Try creating a room
4. Should work!

---

## Test End-to-End

### Test 1: Create Room (Mobile)
1. Open mobile app
2. Click "Create Room"
3. Room code is generated
4. Lobby screen loads

### Test 2: Join from Web (Browser)
1. Open: `https://vampire-hunt-production.up.railway.app/test-web-client.html`
2. Enter the room code from mobile
3. Enter a player name
4. Click "Join Room"
5. Both mobile and web see each other

### Test 3: Play Game
1. Get 4 players (mobile + web clients)
2. Start game
3. Play through all phases
4. Game completes successfully

---

## Railway Dashboard Features

### View Logs
1. Go to your project
2. Click "Deployments" tab
3. Click on latest deployment
4. View real-time logs

### Monitor Usage
1. Go to project dashboard
2. See CPU, Memory, Network usage
3. Track your $5 credit

### Redeploy
1. Push changes to GitHub
2. Railway auto-deploys
3. Or click "Redeploy" in dashboard

---

## Troubleshooting

### Issue: Build fails

**Check**:
1. View build logs in Railway
2. Ensure `package.json` has all dependencies
3. Ensure `npm run build` works locally

**Fix**:
```bash
# Test locally
cd server
npm install
npm run build

# If it works, commit and push
git add .
git commit -m "Fix build"
git push
```

### Issue: App crashes after deployment

**Check**:
1. View logs in Railway dashboard
2. Look for error messages

**Common fixes**:
- Ensure PORT is from environment (already done ✅)
- Check all dependencies are in package.json
- Verify start script uses compiled code

### Issue: Can't connect from mobile app

**Check**:
1. URL is correct (HTTPS, no trailing slash)
2. Server is running (check Railway dashboard)
3. Mobile app was rebuilt after URL change

**Test**:
```bash
# Test server
curl https://your-railway-url.com/health

# Should return healthy status
```

---

## Alternative: If Railway Doesn't Work

### Option 1: Render
1. Go to https://render.com
2. Sign up with GitHub
3. New → Web Service
4. Connect GitHub repo
5. Configure and deploy

### Option 2: Vercel
```bash
npm install -g vercel
cd server
vercel
```

---

## Quick Commands Summary

```bash
# 1. Go to Railway
https://railway.app

# 2. Login with GitHub

# 3. New Project → Deploy from GitHub → VampireHunt

# 4. Wait for deployment

# 5. Get URL from Settings → Domains

# 6. Test
curl https://your-railway-url.com/health

# 7. Update mobile app
# Edit: VampireHuntApp/src/services/SocketService.ts
# Line 20: Change to Railway URL

# 8. Rebuild
cd VampireHuntApp
npx react-native run-ios

# 9. Test end-to-end
```

---

## Success Checklist

- [ ] Railway account created
- [ ] GitHub repo connected
- [ ] Project deployed successfully
- [ ] Domain generated
- [ ] Health endpoint returns 200 OK
- [ ] Web client connects
- [ ] Mobile app URL updated
- [ ] Mobile app rebuilt
- [ ] Mobile app connects to production
- [ ] Can create rooms
- [ ] Can join from web client
- [ ] Complete game works

---

## Next Steps After Deployment

1. ✅ Backend deployed to Railway
2. ✅ Mobile app connected to production
3. ✅ End-to-end testing complete
4. 📋 Test on physical iPhone
5. 📋 UI/UX improvements
6. 📋 App Store preparation
7. 📋 Submit to App Store

---

**Railway deployment takes 5 minutes. Let's do it now!** 🚂🚀

**Go to**: https://railway.app
