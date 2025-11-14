# 🚀 Deploy Backend NOW - Step by Step

## ✅ Prerequisites Complete
- ✅ Server code ready
- ✅ Git initialized
- ✅ Procfile created
- ✅ Build successful
- ✅ Ready to deploy!

---

## 🎯 Quick Deploy to Heroku (15 minutes)

### Step 1: Install Heroku CLI (if not installed)
```bash
brew tap heroku/brew && brew install heroku
```

### Step 2: Login to Heroku
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
heroku login
```
This will open a browser window. Log in with your Heroku account (or create one - it's free).

### Step 3: Create Heroku App
```bash
# Create app with a custom name
heroku create vampire-hunt-server

# OR let Heroku generate a random name
heroku create

# Note the URL it gives you (e.g., https://vampire-hunt-server.herokuapp.com)
```

### Step 4: Deploy
```bash
# Deploy to Heroku
git push heroku master

# Watch the deployment logs
# You'll see:
# - Building dependencies
# - Running npm install
# - Starting the server
```

### Step 5: Verify Deployment
```bash
# Check if app is running
heroku ps

# View logs
heroku logs --tail

# Test health endpoint
curl https://your-app-name.herokuapp.com/health

# Should return: {"status":"healthy",...}
```

### Step 6: Get Your Production URL
```bash
# Get app info
heroku apps:info

# Or open in browser
heroku open
```

---

## 📱 Update Mobile App with Production URL

### Step 1: Update SocketService
```typescript
// File: VampireHuntApp/src/services/SocketService.ts
// Line 20

// Change from:
private serverUrl: string = 'http://192.168.1.103:3000';

// To:
private serverUrl: string = 'https://your-app-name.herokuapp.com';
```

### Step 2: Rebuild Mobile App
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp

# Reload Metro bundler (press 'r' in the Metro terminal)
# Or restart:
npx react-native run-ios
```

### Step 3: Test End-to-End
1. Open mobile app
2. Create a room
3. Open web client: https://your-app-name.herokuapp.com/test-web-client.html
4. Join the room
5. Play the game!

---

## 🔧 Troubleshooting

### Issue: "heroku: command not found"
```bash
# Install Heroku CLI
brew tap heroku/brew && brew install heroku

# Verify
heroku --version
```

### Issue: Build fails on Heroku
```bash
# Check logs
heroku logs --tail

# Common fix: ensure all dependencies are in package.json
npm install --save typescript @types/node
git add package.json package-lock.json
git commit -m "Add missing dependencies"
git push heroku master
```

### Issue: App crashes after deployment
```bash
# Check logs
heroku logs --tail

# Common causes:
# 1. Missing PORT environment variable (already fixed)
# 2. TypeScript not compiled (run npm run build)
# 3. Missing dependencies
```

### Issue: Can't connect from mobile app
```bash
# 1. Check server is running
curl https://your-app-name.herokuapp.com/health

# 2. Check Socket.io endpoint
curl "https://your-app-name.herokuapp.com/socket.io/?EIO=4&transport=polling"

# 3. Verify URL in mobile app is correct (HTTPS, not HTTP)
# 4. Rebuild mobile app after changing URL
```

---

## 📊 Post-Deployment Checklist

- [ ] Heroku app created
- [ ] Code deployed successfully
- [ ] Health endpoint returns 200 OK
- [ ] Socket.io endpoint works
- [ ] Mobile app updated with production URL
- [ ] Mobile app rebuilt
- [ ] End-to-end test successful
- [ ] Web client works with production server
- [ ] Multiple players can join and play

---

## 🎮 Testing Your Deployed App

### Test 1: Health Check
```bash
curl https://your-app-name.herokuapp.com/health
```
**Expected**: `{"status":"healthy","timestamp":"...","totalRooms":0,"totalPlayers":0,"activeGames":0}`

### Test 2: Socket.io Connection
```bash
curl "https://your-app-name.herokuapp.com/socket.io/?EIO=4&transport=polling"
```
**Expected**: `0{"sid":"...","upgrades":["websocket"],...}`

### Test 3: Web Client
Open in browser:
```
https://your-app-name.herokuapp.com/test-web-client.html
```
**Expected**: "Connected to server" (green status)

### Test 4: Mobile App
1. Open app on simulator/device
2. Create room
3. Should connect successfully
4. Room code should be generated

### Test 5: Multiplayer
1. Create room in mobile app
2. Join from web client
3. Both should see each other
4. Play complete game

---

## 💰 Heroku Free Tier Limits

- **550 hours/month** (enough for 24/7 if you verify with credit card)
- **512 MB RAM** (sufficient for this app)
- **Sleeps after 30 min inactivity** (wakes up on first request)
- **Custom domain** supported
- **SSL/HTTPS** included free

### To prevent sleeping (optional):
Use a service like UptimeRobot to ping your app every 25 minutes.

---

## 🔄 Future Deployments

After initial deployment, to update:

```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server

# Make your changes
# Then:
git add .
git commit -m "Update: description of changes"
git push heroku master

# Heroku automatically rebuilds and deploys
```

---

## 📈 Monitoring Your App

### View Logs
```bash
heroku logs --tail
```

### Check Dyno Status
```bash
heroku ps
```

### Restart App
```bash
heroku restart
```

### View App Metrics
```bash
heroku open
# Then go to: https://dashboard.heroku.com/apps/your-app-name/metrics
```

---

## 🎯 Next Steps After Deployment

1. ✅ Deploy backend (you're doing this now!)
2. 📋 Update mobile app with production URL
3. 📋 Test on physical iPhone
4. 📋 Create app icon and screenshots
5. 📋 Submit to App Store

---

## 🆘 Need Help?

### Heroku Documentation
- Getting Started: https://devcenter.heroku.com/articles/getting-started-with-nodejs
- Deploying: https://devcenter.heroku.com/articles/deploying-nodejs
- Troubleshooting: https://devcenter.heroku.com/articles/troubleshooting-node-deploys

### Check Deployment Status
```bash
# In server directory
heroku apps:info
heroku logs --tail
```

---

## ✅ Success Criteria

You'll know deployment is successful when:
1. ✅ `heroku logs` shows "Vampire Hunt server running on port XXXX"
2. ✅ Health endpoint returns healthy status
3. ✅ Web client connects successfully
4. ✅ Mobile app connects to production server
5. ✅ Can create and join rooms
6. ✅ Can play complete game

---

## 🚀 Ready to Deploy?

Run these commands now:

```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
heroku login
heroku create vampire-hunt-server
git push heroku master
heroku open
```

**Your production server will be live in ~5 minutes!** 🎉
