# 🚂 Railway Deployment - Manual Steps

## Railway CLI Login Issue

The CLI login timed out. Let's use the Railway website instead - it's actually easier!

---

## ✅ EASIEST METHOD: Deploy via Railway Website

### Step 1: Create GitHub Repository (5 minutes)

#### Option A: Via GitHub Website
1. Go to https://github.com/new
2. Repository name: **VampireHunt**
3. Description: **Vampire Hunt - Multiplayer social deduction game**
4. Make it **Public**
5. **Don't** initialize with README
6. Click **"Create repository"**

#### Option B: Via GitHub Desktop
1. Open GitHub Desktop
2. File → Add Local Repository
3. Choose: `/Users/doktaruser/Desktop/Windsurf/VampireHunt`
4. Click "Publish repository"
5. Name: **VampireHunt**
6. Click "Publish"

### Step 2: Push Code to GitHub

```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt

# Initialize Git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Vampire Hunt game ready for deployment"

# Add GitHub remote (REPLACE 'YOUR_USERNAME' with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/VampireHunt.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Railway (2 minutes)

1. **Go to**: https://railway.app
2. Click **"Login"**
3. Select **"Login with GitHub"**
4. **Authorize Railway** to access your GitHub
5. Click **"New Project"**
6. Select **"Deploy from GitHub repo"**
7. Choose **"VampireHunt"** repository
8. Railway will scan your repo

### Step 4: Configure Deployment

Railway should auto-detect Node.js. Configure:

**Root Directory**: 
- Click "Settings" tab
- Set "Root Directory" to: `server`
- Click "Save"

**Build & Start** (should auto-detect):
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

### Step 5: Deploy

1. Click **"Deploy"** button
2. Watch the build logs
3. Wait 2-3 minutes

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

1. Go to **"Settings"** tab
2. Click **"Domains"** section
3. Click **"Generate Domain"**

Your URL will be:
```
https://vampirehunt-production.up.railway.app
```

**Copy this URL!**

### Step 7: Test Deployment

```bash
# Test health endpoint (replace with your URL)
curl https://vampirehunt-production.up.railway.app/health

# Should return:
# {"status":"healthy","timestamp":"...","totalRooms":0,"totalPlayers":0,"activeGames":0}
```

### Step 8: Test Web Client

Open in browser:
```
https://vampirehunt-production.up.railway.app/test-web-client.html
```

You should see: **"Connected to server"** (green)

---

## Update Mobile App

### Step 1: Edit SocketService

**File**: `VampireHuntApp/src/services/SocketService.ts`

**Line 20** - Change from:
```typescript
private serverUrl: string = 'http://192.168.1.103:3000';
```

**To** (your Railway URL):
```typescript
private serverUrl: string = 'https://vampirehunt-production.up.railway.app';
```

### Step 2: Rebuild App

```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp

# Reload Metro (press 'r' in Metro terminal)
# Or restart:
npx react-native run-ios
```

### Step 3: Test

1. Open mobile app
2. Check Metro logs: `Connected to server: <socket-id>`
3. Create a room
4. Should work!

---

## Alternative: Deploy Without GitHub

If you don't want to use GitHub, you can use Railway CLI with manual authentication:

### Step 1: Get Railway Token

1. Go to https://railway.app
2. Login with GitHub
3. Go to Account Settings
4. Create a new API token
5. Copy the token

### Step 2: Set Token

```bash
export RAILWAY_TOKEN=your-token-here
```

### Step 3: Deploy

```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
npx @railway/cli up
```

---

## Recommended: Use GitHub Method

**Why?**
- ✅ Easier setup
- ✅ Visual interface
- ✅ Automatic deployments on push
- ✅ Better for long-term

**Steps Summary**:
1. Create GitHub repo
2. Push code
3. Deploy from Railway website
4. Get URL
5. Update mobile app
6. Test

---

## Quick Commands

### Push to GitHub
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/VampireHunt.git
git branch -M main
git push -u origin main
```

### Then Deploy
1. Go to https://railway.app
2. Login with GitHub
3. New Project → Deploy from GitHub
4. Select VampireHunt
5. Set root directory to `server`
6. Deploy

### Update Mobile App
```typescript
// VampireHuntApp/src/services/SocketService.ts line 20
private serverUrl: string = 'https://vampirehunt-production.up.railway.app';
```

### Rebuild
```bash
cd VampireHuntApp
npx react-native run-ios
```

---

## Troubleshooting

### Issue: GitHub push fails
```bash
# Check Git status
git status

# Ensure you're in the right directory
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt

# Try again
git push -u origin main
```

### Issue: Railway can't find server
**Solution**: Set root directory to `server` in Railway settings

### Issue: Build fails on Railway
**Solution**: Check build logs in Railway dashboard, ensure package.json is correct

---

## Next Steps

1. 📋 Create GitHub repository
2. 📋 Push code to GitHub
3. 📋 Deploy via Railway website
4. 📋 Get production URL
5. 📋 Update mobile app
6. 📋 Test end-to-end

---

**Use the GitHub + Railway website method - it's the most reliable!** 🚂✅

**Start here**: https://github.com/new
