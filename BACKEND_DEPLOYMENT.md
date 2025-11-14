# 🚀 Backend Deployment Guide

## Current Status
- ✅ Server code ready for deployment
- ✅ All dependencies configured
- 🔄 Choosing deployment platform
- 📋 Deploying to production

---

## Option 1: Heroku (RECOMMENDED - Easiest)

### Why Heroku?
- ✅ Free tier available (with credit card)
- ✅ Automatic deployments from Git
- ✅ Built-in SSL (HTTPS)
- ✅ Easy environment variables
- ✅ Simple scaling
- ✅ Good documentation

### Prerequisites
```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Verify installation
heroku --version
```

### Step 1: Prepare Server for Heroku

Create `Procfile` in server directory:
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
cat > Procfile << 'EOF'
web: npm start
EOF
```

Update `package.json` to ensure start script uses compiled code:
```json
{
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "dev": "nodemon src/index.ts"
  }
}
```

### Step 2: Create Heroku App
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server

# Login to Heroku
heroku login

# Create app (choose unique name)
heroku create vampire-hunt-server

# Or let Heroku generate a name
heroku create
```

### Step 3: Configure Environment
```bash
# Set Node version (optional)
heroku config:set NODE_ENV=production

# View your app URL
heroku apps:info
```

### Step 4: Initialize Git (if not already)
```bash
# Check if git is initialized
git status

# If not, initialize
git init
git add .
git commit -m "Initial commit for Heroku deployment"
```

### Step 5: Deploy
```bash
# Deploy to Heroku
git push heroku main

# Or if your branch is named master
git push heroku master

# View logs
heroku logs --tail

# Open app in browser
heroku open
```

### Step 6: Test Deployment
```bash
# Get your Heroku app URL
heroku apps:info

# Test health endpoint
curl https://your-app-name.herokuapp.com/health

# Should return: {"status":"healthy",...}
```

### Step 7: Update Mobile App
```typescript
// VampireHuntApp/src/services/SocketService.ts
private serverUrl: string = 'https://your-app-name.herokuapp.com';
```

---

## Option 2: Railway (Modern Alternative)

### Why Railway?
- ✅ Generous free tier ($5 credit/month)
- ✅ Modern UI
- ✅ GitHub integration
- ✅ Automatic HTTPS
- ✅ Easy environment variables

### Steps:
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway auto-detects Node.js
7. Click "Deploy"
8. Get your URL from Settings → Domains

---

## Option 3: DigitalOcean App Platform

### Why DigitalOcean?
- ✅ $5/month (no free tier)
- ✅ Good performance
- ✅ Simple setup
- ✅ Reliable uptime

### Steps:
1. Go to https://cloud.digitalocean.com
2. Create account
3. Apps → Create App
4. Connect GitHub repository
5. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
   - Port: 3000
6. Deploy
7. Get your URL

---

## Option 4: Render

### Why Render?
- ✅ Free tier available
- ✅ Auto-deploy from Git
- ✅ Easy setup
- ✅ Good documentation

### Steps:
1. Go to https://render.com
2. Sign up
3. New → Web Service
4. Connect GitHub repo
5. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. Deploy
7. Get your URL

---

## Post-Deployment Checklist

### 1. Test All Endpoints
```bash
# Health check
curl https://your-server.com/health

# Socket.io endpoint
curl "https://your-server.com/socket.io/?EIO=4&transport=polling"
```

### 2. Update Mobile App
```typescript
// VampireHuntApp/src/services/SocketService.ts
private serverUrl: string = 'https://your-production-server.com';
```

### 3. Rebuild Mobile App
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp

# Clear cache
rm -rf node_modules
npm install

# Rebuild iOS
cd ios
pod install
cd ..
npx react-native run-ios
```

### 4. Test End-to-End
- [ ] Mobile app connects to production server
- [ ] Can create rooms
- [ ] Can join rooms
- [ ] Game flow works
- [ ] No connection errors

### 5. Monitor Performance
- Check server logs
- Monitor response times
- Watch for errors
- Test with multiple users

---

## Environment Variables (if needed)

### For Heroku:
```bash
heroku config:set PORT=3000
heroku config:set NODE_ENV=production
```

### For Railway/Render:
Add in dashboard:
- `PORT=3000`
- `NODE_ENV=production`

---

## Troubleshooting

### Issue: Build fails
**Solution**: Check `package.json` has all dependencies
```bash
npm install --save-dev typescript @types/node
```

### Issue: App crashes on start
**Solution**: Check logs
```bash
heroku logs --tail  # For Heroku
```

### Issue: Port binding error
**Solution**: Use PORT from environment
```typescript
const PORT = process.env.PORT || 3000;
```

### Issue: WebSocket connection fails
**Solution**: Ensure Socket.io CORS is configured
```typescript
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});
```

---

## Cost Comparison

| Platform | Free Tier | Paid Tier | Best For |
|----------|-----------|-----------|----------|
| Heroku | 550 hours/month | $7/month | Getting started |
| Railway | $5 credit/month | Pay as you go | Modern workflow |
| Render | 750 hours/month | $7/month | Simple deployment |
| DigitalOcean | None | $5/month | Production apps |

---

## Recommended: Start with Heroku

**Why**: 
- Easiest to set up
- Free tier sufficient for testing
- Can upgrade later if needed
- Well-documented
- Industry standard

**Next Steps**:
1. Install Heroku CLI (done above)
2. Create Procfile
3. Deploy to Heroku
4. Test deployment
5. Update mobile app
6. Submit to App Store

---

## Quick Deploy Commands (Heroku)

```bash
# One-time setup
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
echo "web: npm start" > Procfile
git init
git add .
git commit -m "Deploy to Heroku"

# Deploy
heroku login
heroku create vampire-hunt-server
git push heroku main

# Test
heroku open
heroku logs --tail

# Get URL
heroku apps:info
```

---

**Let's deploy to Heroku now!** 🚀
