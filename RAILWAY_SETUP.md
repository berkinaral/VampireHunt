# 🚂 Railway Deployment - Complete Setup

## Current Status
Your server code is ready but needs to be pushed to GitHub for Railway deployment.

---

## Option 1: Deploy via Railway CLI (Fastest - No GitHub Needed!)

Railway CLI can deploy directly without GitHub. This is the fastest way!

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway
```bash
railway login
```
This opens your browser to authenticate.

### Step 3: Initialize and Deploy
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server

# Initialize Railway project
railway init

# Deploy
railway up

# Get your URL
railway domain
```

That's it! Your app will be deployed in 2-3 minutes.

---

## Option 2: Deploy via GitHub (Recommended for Auto-Deploy)

If you want automatic deployments when you push code:

### Step 1: Create GitHub Repository

#### Via GitHub Website:
1. Go to https://github.com/new
2. Repository name: `VampireHunt`
3. Make it Public or Private
4. Don't initialize with README (we have code already)
5. Click "Create repository"

#### Via GitHub CLI (if installed):
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt
gh repo create VampireHunt --public --source=. --remote=origin
```

### Step 2: Initialize Git in Main Directory
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt

# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Vampire Hunt game"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/VampireHunt.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Railway from GitHub
1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway
4. Click "New Project"
5. Select "Deploy from GitHub repo"
6. Choose "VampireHunt" repository
7. Railway will ask which directory - select **"server"**
8. Click "Deploy"

### Step 4: Configure Root Directory
If Railway doesn't auto-detect:
1. Go to project Settings
2. Set "Root Directory" to `server`
3. Redeploy

### Step 5: Get Your URL
1. Go to Settings → Domains
2. Click "Generate Domain"
3. Your URL: `https://vampire-hunt-production.up.railway.app`

---

## Option 3: Quick Deploy with Railway CLI (RECOMMENDED)

This is the fastest method - no GitHub setup needed!

### Complete Commands:
```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Navigate to server
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server

# 3. Login (opens browser)
railway login

# 4. Initialize project
railway init

# Follow prompts:
# - Create new project? Yes
# - Project name? vampire-hunt-server
# - Environment? production

# 5. Deploy
railway up

# 6. Get URL
railway domain

# 7. Open in browser
railway open
```

---

## After Deployment

### Get Your Production URL
```bash
railway domain
```

Example output:
```
vampire-hunt-production.up.railway.app
```

### Test Deployment
```bash
# Test health endpoint (replace with your URL)
curl https://vampire-hunt-production.up.railway.app/health

# Should return:
# {"status":"healthy","timestamp":"...","totalRooms":0,"totalPlayers":0,"activeGames":0}
```

### Update Mobile App
**File**: `VampireHuntApp/src/services/SocketService.ts`

**Line 20**:
```typescript
private serverUrl: string = 'https://vampire-hunt-production.up.railway.app';
```

### Rebuild Mobile App
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp
npx react-native run-ios
```

---

## Troubleshooting

### Issue: Railway CLI not found
```bash
# Install globally
npm install -g @railway/cli

# Verify
railway --version
```

### Issue: Login fails
```bash
# Try logout and login again
railway logout
railway login
```

### Issue: Build fails
```bash
# Check logs
railway logs

# Ensure build works locally
cd server
npm install
npm run build
```

### Issue: Can't access URL
```bash
# Check deployment status
railway status

# View logs
railway logs

# Redeploy
railway up
```

---

## Railway CLI Commands Reference

```bash
railway login              # Login to Railway
railway init               # Initialize new project
railway up                 # Deploy current directory
railway logs               # View logs
railway status             # Check deployment status
railway domain             # Get/set domain
railway open               # Open in browser
railway list               # List all projects
railway environment        # Manage environments
railway variables          # Manage environment variables
```

---

## Which Option Should You Choose?

### Use Railway CLI (Option 1/3) if:
- ✅ You want the fastest deployment (5 minutes)
- ✅ You don't need GitHub integration yet
- ✅ You want to test quickly

### Use GitHub (Option 2) if:
- ✅ You want automatic deployments on push
- ✅ You want version control
- ✅ You're planning long-term development

**Recommendation**: Start with Railway CLI (fastest), add GitHub later if needed.

---

## Next Steps

1. ✅ Choose deployment method (Railway CLI recommended)
2. ✅ Deploy backend
3. ✅ Get production URL
4. ✅ Update mobile app
5. ✅ Test end-to-end
6. 📋 UI/UX improvements
7. 📋 App Store submission

---

**Ready to deploy? Run the Railway CLI commands above!** 🚂🚀
