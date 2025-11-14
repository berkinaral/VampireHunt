# 🚀 READY TO DEPLOY - Execute These Commands

## ✅ Setup Complete!
- ✅ Heroku CLI installed (v10.15.0)
- ✅ Server code ready
- ✅ Git initialized and committed
- ✅ Procfile created
- ✅ TypeScript built

---

## 🎯 Deploy Now (5 Commands)

Open a terminal and run these commands:

### 1. Navigate to Server Directory
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
```

### 2. Login to Heroku
```bash
heroku login
```
This will open your browser. Log in with your Heroku account (or create one at heroku.com - it's free).

### 3. Create Heroku App
```bash
heroku create vampire-hunt-server
```
**Note the URL it gives you** (e.g., https://vampire-hunt-server.herokuapp.com)

If the name is taken, try:
```bash
heroku create vampire-hunt-game
# or
heroku create
# (lets Heroku generate a random name)
```

### 4. Deploy to Heroku
```bash
git push heroku master
```

If you get an error about the branch, try:
```bash
git push heroku main
```

### 5. Verify Deployment
```bash
heroku open
```

This opens your app in the browser. You should see the health check or a simple page.

---

## 🧪 Test Your Deployment

### Check Health Endpoint
```bash
# Replace with your actual Heroku URL
curl https://vampire-hunt-server.herokuapp.com/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-14T...",
  "totalRooms": 0,
  "totalPlayers": 0,
  "activeGames": 0
}
```

### Check Socket.io Endpoint
```bash
curl "https://vampire-hunt-server.herokuapp.com/socket.io/?EIO=4&transport=polling"
```

**Expected**: Should return Socket.io handshake data (starts with `0{`)

### Test Web Client
Open in browser:
```
https://vampire-hunt-server.herokuapp.com/test-web-client.html
```

**Expected**: "Connected to server" (green status)

---

## 📱 Update Mobile App

### Step 1: Edit SocketService
Open: `VampireHuntApp/src/services/SocketService.ts`

Find line 20 and change:
```typescript
// FROM:
private serverUrl: string = 'http://192.168.1.103:3000';

// TO (use your actual Heroku URL):
private serverUrl: string = 'https://vampire-hunt-server.herokuapp.com';
```

### Step 2: Rebuild Mobile App
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp

# If Metro is running, press 'r' to reload
# Or restart the app:
npx react-native run-ios
```

---

## ✅ Verify Everything Works

### Test 1: Mobile App Connects
1. Open mobile app
2. Check Metro logs for "Connected to server"
3. No connection errors

### Test 2: Create Room
1. Click "Create Room" in mobile app
2. Room code is generated
3. Lobby screen loads

### Test 3: Join from Web Client
1. Open: https://vampire-hunt-server.herokuapp.com/test-web-client.html
2. Enter the room code from mobile app
3. Enter a player name
4. Click "Join Room"
5. Both mobile app and web client show the player

### Test 4: Play Complete Game
1. Get 4 players (mobile + web clients)
2. Host starts game
3. Everyone sees their role
4. Play through all phases
5. Game completes successfully

---

## 🔧 Useful Heroku Commands

### View Logs (Real-time)
```bash
heroku logs --tail
```

### Check App Status
```bash
heroku ps
```

### Restart App
```bash
heroku restart
```

### Get App Info
```bash
heroku apps:info
```

### Open App in Browser
```bash
heroku open
```

### View Environment Variables
```bash
heroku config
```

---

## 🚨 Troubleshooting

### Issue: "App name is already taken"
**Solution**: Use a different name or let Heroku generate one:
```bash
heroku create  # Generates random name
```

### Issue: "No such app"
**Solution**: Add the Heroku remote:
```bash
heroku git:remote -a vampire-hunt-server
```

### Issue: Build fails
**Solution**: Check logs and ensure dependencies are correct:
```bash
heroku logs --tail
npm install --save typescript @types/node
git add package.json package-lock.json
git commit -m "Add dependencies"
git push heroku master
```

### Issue: App crashes after deployment
**Solution**: Check logs for errors:
```bash
heroku logs --tail
```

Common causes:
- Missing PORT environment variable (already configured ✅)
- TypeScript not compiled (already built ✅)
- Missing dependencies

### Issue: Can't connect from mobile app
**Solution**: 
1. Verify production URL is correct (HTTPS, not HTTP)
2. Check server is running: `heroku ps`
3. Test health endpoint: `curl https://your-app.herokuapp.com/health`
4. Rebuild mobile app after changing URL

---

## 📊 Deployment Checklist

- [ ] Heroku CLI installed ✅
- [ ] Logged in to Heroku
- [ ] Heroku app created
- [ ] Code deployed to Heroku
- [ ] Health endpoint returns 200 OK
- [ ] Socket.io endpoint works
- [ ] Web client connects successfully
- [ ] Mobile app URL updated
- [ ] Mobile app rebuilt
- [ ] Mobile app connects to production
- [ ] End-to-end test successful

---

## 🎉 After Successful Deployment

### Your Production URLs:
- **API**: https://vampire-hunt-server.herokuapp.com
- **Health**: https://vampire-hunt-server.herokuapp.com/health
- **Web Client**: https://vampire-hunt-server.herokuapp.com/test-web-client.html

### Update Memory Bank:
```bash
# Mark deployment as complete in:
# - memory-bank/activeContext.md
# - memory-bank/progress.md
```

### Next Steps:
1. ✅ Backend deployed
2. 📋 UI/UX improvements (2-3 hours)
3. 📋 App Store assets (2-3 hours)
4. 📋 Submit to App Store (1 hour)

---

## 🚀 Quick Start Commands

Copy and paste these in order:

```bash
# 1. Navigate to server
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server

# 2. Login to Heroku (opens browser)
heroku login

# 3. Create app
heroku create vampire-hunt-server

# 4. Deploy
git push heroku master

# 5. Open app
heroku open

# 6. Test health
curl https://vampire-hunt-server.herokuapp.com/health

# 7. View logs
heroku logs --tail
```

---

**You're ready to deploy! Run the commands above and your backend will be live in ~5 minutes!** 🦇🚀
