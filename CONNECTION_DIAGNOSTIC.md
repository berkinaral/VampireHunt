# 🔍 Web Client Connection Diagnostic

## Current Issue
Web client shows "Disconnected from server" even though server is running.

---

## ✅ What We Know Works

1. **Server is running**: ✅
   ```bash
   curl http://192.168.1.103:3000/health
   # Returns: {"status":"healthy",...}
   ```

2. **Web page loads**: ✅
   ```bash
   curl -I http://192.168.1.103:3000/test-web-client.html
   # Returns: HTTP/1.1 200 OK
   ```

3. **CSP headers fixed**: ✅
   - Allows Socket.io CDN
   - Allows WebSocket connections
   - Allows inline scripts

---

## 🔧 Diagnostic Steps

### Step 1: Check Browser Console

1. **Open the web client**: http://192.168.1.103:3000/test-simple.html
2. **Open Developer Tools**:
   - Chrome/Edge: Press `F12` or `Cmd+Option+I` (Mac)
   - Safari: Enable Developer menu first, then `Cmd+Option+I`
3. **Go to Console tab**
4. **Look for errors**

**What to look for:**
- ❌ "Failed to load resource" → Socket.io CDN blocked
- ❌ "WebSocket connection failed" → Port or firewall issue
- ❌ "CORS error" → Server CORS configuration
- ✅ "Connected successfully!" → It's working!

### Step 2: Check Network Tab

1. **Open Developer Tools** (F12)
2. **Go to Network tab**
3. **Reload the page** (Cmd+R or Ctrl+R)
4. **Look for**:
   - `socket.io.min.js` - Should be 200 OK
   - `socket.io/?EIO=4&transport=polling` - Should be 200 OK
   - `socket.io/?EIO=4&transport=websocket` - Should upgrade to WebSocket

### Step 3: Test Simple Connection

Open this URL in your browser:
```
http://192.168.1.103:3000/test-simple.html
```

This is a minimal test page that will show:
- ✅ Connection status
- ✅ Socket ID when connected
- ✅ Detailed logs
- ✅ Room creation test

### Step 4: Check Firewall

**Mac Firewall:**
```bash
# Check if firewall is blocking
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

# If enabled, check Node.js is allowed
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --listapps | grep -i node
```

**Allow Node.js through firewall:**
1. System Preferences → Security & Privacy
2. Firewall tab → Firewall Options
3. Click "+" and add Node.js
4. Set to "Allow incoming connections"

### Step 5: Test from Command Line

**Test Socket.io connection:**
```bash
# Install socket.io-client globally
npm install -g socket.io-client

# Test connection
node -e "const io = require('socket.io-client'); const socket = io('http://192.168.1.103:3000'); socket.on('connect', () => { console.log('Connected!', socket.id); process.exit(0); }); socket.on('connect_error', (err) => { console.error('Error:', err.message); process.exit(1); });"
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to load Socket.io CDN"

**Symptoms:**
- Console error: "Failed to load resource: https://cdn.socket.io/..."
- Status shows "Disconnected"

**Solution:**
The server CSP has been updated to allow this. Clear browser cache:
- Chrome: Cmd+Shift+Delete → Clear cached images and files
- Safari: Cmd+Option+E (Empty Caches)

Then reload: Cmd+Shift+R (hard reload)

### Issue 2: "WebSocket connection failed"

**Symptoms:**
- Console error: "WebSocket connection to 'ws://...' failed"
- Falls back to polling but still doesn't work

**Solution:**
```bash
# Check if port 3000 is accessible
telnet 192.168.1.103 3000

# Or use nc
nc -zv 192.168.1.103 3000
```

If connection refused:
1. Check server is running: `lsof -i :3000`
2. Check firewall allows port 3000
3. Restart server: `cd server && npm run dev`

### Issue 3: "CORS Policy Error"

**Symptoms:**
- Console error: "blocked by CORS policy"

**Solution:**
Server already has CORS enabled with `origin: '*'`. If still seeing this:
1. Hard reload browser (Cmd+Shift+R)
2. Try incognito/private mode
3. Check server logs for CORS errors

### Issue 4: Browser Cache

**Symptoms:**
- Old version of page loads
- Changes don't appear

**Solution:**
```bash
# Hard reload in browser
Cmd+Shift+R (Mac)
Ctrl+Shift+R (Windows/Linux)

# Or clear cache completely
Cmd+Shift+Delete
```

### Issue 5: Wrong IP Address

**Symptoms:**
- Connection timeout
- No response from server

**Solution:**
```bash
# Verify current IP
ifconfig | grep "inet " | grep -v 127.0.0.1

# If IP changed, update:
# 1. server/test-web-client.html (line 274)
# 2. VampireHuntApp/src/services/SocketService.ts (line 20)
```

---

## 🧪 Manual Testing

### Test 1: Direct Socket.io Test

Create a file `test-socket.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <script src="https://cdn.socket.io/4.5.4/socket.io.min.js"></script>
</head>
<body>
    <h1 id="status">Testing...</h1>
    <script>
        const socket = io('http://192.168.1.103:3000');
        socket.on('connect', () => {
            document.getElementById('status').textContent = 'Connected!';
            document.getElementById('status').style.color = 'green';
        });
        socket.on('connect_error', (err) => {
            document.getElementById('status').textContent = 'Error: ' + err.message;
            document.getElementById('status').style.color = 'red';
        });
    </script>
</body>
</html>
```

Open in browser and check status.

### Test 2: cURL Test

```bash
# Test Socket.io endpoint
curl "http://192.168.1.103:3000/socket.io/?EIO=4&transport=polling"

# Should return something like:
# 0{"sid":"...","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000}
```

### Test 3: Browser Console Test

Open browser console and run:
```javascript
const socket = io('http://192.168.1.103:3000');
socket.on('connect', () => console.log('Connected!', socket.id));
socket.on('connect_error', (err) => console.error('Error:', err));
```

---

## 📊 Expected Behavior

When working correctly, you should see:

**In Browser Console:**
```
[10:50:00] Starting connection test...
[10:50:00] Connecting to: http://192.168.1.103:3000
[10:50:01] ✅ Connected successfully!
[10:50:01] Socket ID: abc123xyz
[10:50:03] Testing room creation...
[10:50:03] ✅ Room created: ABC123
```

**In Server Logs:**
```
New connection: abc123xyz
Room ABC123 created by TestPlayer
```

**On Web Page:**
- Status: "Connected" (green)
- Socket ID displayed
- No errors in console

---

## 🆘 If Nothing Works

### Nuclear Option - Complete Reset:

```bash
# 1. Stop everything
pkill -9 node

# 2. Clear all caches
rm -rf ~/Library/Caches/com.apple.Safari
rm -rf ~/Library/Caches/Google/Chrome

# 3. Restart server
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
npm run dev

# 4. Wait for "server running on port 3000"

# 5. Test with curl
curl http://192.168.1.103:3000/socket.io/?EIO=4&transport=polling

# 6. Open in INCOGNITO/PRIVATE window
# Chrome: Cmd+Shift+N
# Safari: Cmd+Shift+N

# 7. Go to: http://192.168.1.103:3000/test-simple.html
```

---

## 📱 Testing from Phone

If testing from phone:

1. **Same WiFi**: Ensure phone is on same network as computer
2. **IP Address**: Use computer's IP (192.168.1.103)
3. **URL**: http://192.168.1.103:3000/test-simple.html
4. **Browser**: Use Safari or Chrome (not in-app browsers)

---

## 🔍 What to Report

If still not working, check these and report:

1. **Browser Console Errors**: Copy exact error messages
2. **Network Tab**: Screenshot of failed requests
3. **Server Logs**: Copy last 20 lines
4. **Test Results**:
   ```bash
   curl http://192.168.1.103:3000/health
   curl http://192.168.1.103:3000/socket.io/?EIO=4&transport=polling
   ```

---

## ✅ Quick Checklist

Before asking for help, verify:

- [ ] Server is running (`lsof -i :3000` shows node process)
- [ ] Health endpoint works (`curl http://192.168.1.103:3000/health`)
- [ ] Browser cache cleared (hard reload with Cmd+Shift+R)
- [ ] Tried in incognito/private window
- [ ] Checked browser console for errors
- [ ] Firewall allows Node.js
- [ ] Correct IP address (192.168.1.103)
- [ ] Tried test-simple.html page

---

**The connection should work now with the CSP fix. Try the test-simple.html page first!**
