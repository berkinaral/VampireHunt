# 🌐 Web Test Client - Connection Instructions

## ✅ Server Status
Your server is running at: **http://192.168.1.103:3000**

---

## 🎮 How to Access the Web Client

### Option 1: Via Server URL (Recommended)
Open your browser and go to:
```
http://192.168.1.103:3000/test-web-client.html
```

This works from:
- ✅ Your computer
- ✅ Your phone (on same WiFi)
- ✅ Any device on the same network

### Option 2: Open File Directly
1. Navigate to: `/Users/doktaruser/Desktop/Windsurf/VampireHunt/server/test-web-client.html`
2. Right-click → Open With → Browser
3. The client will auto-connect to `http://192.168.1.103:3000`

---

## 📱 Testing from Your Phone

### Steps:
1. **Make sure your phone is on the same WiFi** as your computer
2. **Open Safari or Chrome** on your phone
3. **Type the URL**: `http://192.168.1.103:3000/test-web-client.html`
4. **Enter your name** and click "Connect to Server"
5. **Create or join a room**

### Troubleshooting Phone Connection:
- Check WiFi: Both devices must be on same network
- Check firewall: Mac firewall should allow port 3000
- Try pinging: From phone browser, try `http://192.168.1.103:3000/health`
- Should see: `{"status":"healthy",...}`

---

## 🔧 Connection Issues?

### Error: "Cannot connect to server"

**Check 1: Is the server running?**
```bash
curl http://192.168.1.103:3000/health
```
Should return: `{"status":"healthy",...}`

If not running:
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
npm run dev
```

**Check 2: Firewall blocking?**
```bash
# Check if port 3000 is listening
lsof -i :3000
```

If firewall is blocking:
- System Preferences → Security & Privacy → Firewall
- Click "Firewall Options"
- Add Node.js and allow incoming connections

**Check 3: Correct IP address?**
```bash
# Get your current IP
ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
```

If IP changed, update:
1. `VampireHuntApp/src/services/SocketService.ts` (line 20)
2. `server/test-web-client.html` (line 274)

---

## 🎯 Quick Test

### Test Server Health:
```bash
curl http://192.168.1.103:3000/health
```

### Test from Browser:
1. Open: http://192.168.1.103:3000/test-web-client.html
2. Should see: "Vampire Hunt - Web Test Client" page
3. Enter name and click "Connect to Server"
4. Should see: "Connected to server" (green status)

---

## 🎮 Testing Multiplayer

### Setup:
1. **Mobile App** (simulator or device)
2. **Web Client** (browser)

### Steps:
1. **In mobile app**: Create a room → Get room code (e.g., "ABC123")
2. **In web browser**: 
   - Open http://192.168.1.103:3000/test-web-client.html
   - Connect to server
   - Click "Join Room"
   - Enter room code "ABC123"
   - Click Join
3. **See each other** in the lobby
4. **Host starts game** (from mobile app)
5. **Play together!**

### Multiple Web Clients:
- Open multiple browser tabs
- Each tab = different player
- All can join the same room

---

## 📊 Server Logs

Watch server activity in real-time:
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
npm run dev
```

You'll see:
- `New connection: [socket-id]`
- `Room [CODE] created by [name]`
- `Player [name] joined room [CODE]`
- `Game started in room [CODE]`
- etc.

---

## 🌐 Network Configuration

### Current Setup:
- **Server IP**: 192.168.1.103
- **Server Port**: 3000
- **Protocol**: HTTP (WebSocket)
- **CORS**: Enabled for all origins

### URLs:
- **Health Check**: http://192.168.1.103:3000/health
- **Web Client**: http://192.168.1.103:3000/test-web-client.html
- **Mobile App**: Connects to http://192.168.1.103:3000

---

## 🔄 If IP Address Changes

Your IP might change if you:
- Reconnect to WiFi
- Restart router
- Switch networks

To update:

1. **Get new IP**:
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1
   ```

2. **Update Mobile App**:
   ```bash
   # Edit VampireHuntApp/src/services/SocketService.ts
   # Line 20: private serverUrl: string = 'http://NEW_IP:3000';
   ```

3. **Update Web Client**:
   ```bash
   # Edit server/test-web-client.html
   # Line 274: ? 'http://NEW_IP:3000'
   ```

4. **Rebuild mobile app**:
   ```bash
   cd VampireHuntApp
   npx react-native run-ios
   ```

---

## ✅ Verification Checklist

Before testing:
- [ ] Server is running (`npm run dev` in server folder)
- [ ] Server health check works (`curl http://192.168.1.103:3000/health`)
- [ ] Web client opens in browser
- [ ] "Connect to Server" button works
- [ ] Status shows "Connected to server" (green)
- [ ] Can create/join rooms
- [ ] Mobile app can connect

---

## 🆘 Still Can't Connect?

### Complete Reset:

```bash
# 1. Stop server
pkill -f "npm run dev"

# 2. Restart server
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
npm run dev

# 3. Wait for "server running on port 3000"

# 4. Test health
curl http://192.168.1.103:3000/health

# 5. Open web client
open http://192.168.1.103:3000/test-web-client.html
```

### Check Browser Console:
1. Open web client
2. Press F12 (or Cmd+Option+I on Mac)
3. Go to Console tab
4. Look for errors
5. Should see: "Connected to server"

---

## 📞 Quick Reference

**Server**: `http://192.168.1.103:3000`  
**Web Client**: `http://192.168.1.103:3000/test-web-client.html`  
**Health Check**: `curl http://192.168.1.103:3000/health`  
**Start Server**: `cd server && npm run dev`  

**Your web client is now configured to auto-connect! 🎮**
