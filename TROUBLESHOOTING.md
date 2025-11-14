# 🔧 Vampire Hunt - Troubleshooting Guide

## Common Issues and Solutions

### Metro Bundler Errors

#### Error: "ENOENT: no such file or directory"
**Cause**: Missing or corrupted node_modules

**Solution**:
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp

# Clean install
rm -rf node_modules
npm install

# Restart Metro with clean cache
npx react-native start --reset-cache
```

#### Error: "Module not found" or "Cannot resolve module"
**Solution**:
```bash
# Clear all caches
npx react-native start --reset-cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Reinstall dependencies
npm install
```

---

### iOS Build Errors

#### Error: "Pod install failed"
**Solution**:
```bash
cd ios
rm -rf Pods Podfile.lock
pod deintegrate
pod install
```

#### Error: "Boost checksum mismatch"
**Solution**: The postinstall script should fix this automatically, but if not:
```bash
# Run the fix script manually
bash scripts/fix-boost.sh

# Then reinstall pods
cd ios
pod install
```

#### Error: "No space left on device"
**Solution**:
```bash
# Clean Xcode caches
rm -rf ~/Library/Developer/Xcode/DerivedData/*
rm -rf ~/Library/Caches/CocoaPods/*

# Clean project build
cd ios
xcodebuild clean
```

#### Error: "Command PhaseScriptExecution failed"
**Solution**:
```bash
# Clean and rebuild
cd ios
rm -rf build
cd ..
npx react-native run-ios
```

---

### App Runtime Errors

#### Error: "Unable to connect to Metro"
**Cause**: Metro bundler not running or wrong port

**Solution**:
```bash
# Make sure Metro is running
npx react-native start

# In another terminal, run the app
npx react-native run-ios
```

#### Error: "Could not connect to development server"
**Solution**:
1. Check Metro is running (you should see the Metro ASCII art)
2. Shake device/simulator and select "Reload"
3. Or press `r` in Metro terminal to reload

#### Error: "Network request failed" or "Socket connection failed"
**Cause**: Can't connect to backend server

**Solution**:
```bash
# Check server is running
curl http://192.168.1.103:3000/health

# If not running, start it
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
npm run dev

# Check firewall allows port 3000
# Check both devices on same WiFi
```

---

### Device-Specific Issues

#### Physical Device: "Could not find device"
**Solution**:
```bash
# List all devices
xcrun xctrace list devices

# Use exact device name
npx react-native run-ios --device="[Exact Device Name]"
```

#### Physical Device: "Device locked" or "Preparation errors"
**Solution**:
1. Unlock your iPhone
2. Trust this computer (popup on iPhone)
3. Enable Developer Mode:
   - Settings → Privacy & Security → Developer Mode → ON
   - Restart iPhone

#### Physical Device: "Code signing error"
**Solution**:
1. Open Xcode: `open ios/VampireHuntApp.xcworkspace`
2. Select VampireHuntApp target
3. Signing & Capabilities tab
4. Select your Apple ID team
5. Build again

---

### Simulator Issues

#### Simulator: "App crashes immediately"
**Solution**:
```bash
# Reset simulator
xcrun simctl erase all

# Or reset specific simulator
xcrun simctl erase "iPhone 16e"

# Rebuild and run
npx react-native run-ios
```

#### Simulator: "Slow performance"
**Solution**:
1. Close other apps
2. Increase simulator memory in Xcode
3. Use a newer simulator model
4. Restart your Mac

---

### Complete Reset (Nuclear Option)

If nothing else works, do a complete clean:

```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp

# 1. Clean npm
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# 2. Clean iOS
cd ios
rm -rf Pods Podfile.lock build
pod deintegrate
pod install
cd ..

# 3. Clean Metro
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
rm -rf $TMPDIR/react-*

# 4. Clean Xcode
rm -rf ~/Library/Developer/Xcode/DerivedData/*

# 5. Restart Metro
npx react-native start --reset-cache

# 6. In new terminal, rebuild
npx react-native run-ios
```

---

### Checking System Status

#### Check if Metro is running:
```bash
lsof -i :8081
# Should show node process
```

#### Check if server is running:
```bash
curl http://192.168.1.103:3000/health
# Should return: {"status":"healthy",...}
```

#### Check available simulators:
```bash
xcrun simctl list devices | grep Booted
```

#### Check disk space:
```bash
df -h /
# Should have at least 10GB free
```

#### Check React Native doctor:
```bash
npx react-native doctor
# Will diagnose common issues
```

---

### Build Taking Too Long

If build is stuck or very slow:

1. **Check Xcode progress**:
   ```bash
   open ios/VampireHuntApp.xcworkspace
   # Watch build progress in Xcode
   ```

2. **Kill and restart**:
   ```bash
   pkill -9 node
   pkill -9 Xcode
   npx react-native run-ios
   ```

3. **Use Xcode directly**:
   - Open `ios/VampireHuntApp.xcworkspace`
   - Select iPhone 16e simulator
   - Press ⌘R to build and run

---

### Getting Help

#### Check logs:
```bash
# Metro logs
# Already visible in terminal where you ran `npx react-native start`

# iOS logs
xcrun simctl spawn booted log stream --level debug

# Xcode logs
# Open Xcode → Window → Devices and Simulators → View Device Logs
```

#### Useful commands:
```bash
# React Native info
npx react-native info

# Check environment
npx react-native doctor

# Verbose build
npx react-native run-ios --verbose
```

---

## Quick Reference

### Start Everything:
```bash
# Terminal 1: Server
cd server && npm run dev

# Terminal 2: Metro
cd VampireHuntApp && npx react-native start

# Terminal 3: iOS
cd VampireHuntApp && npx react-native run-ios
```

### Stop Everything:
```bash
# Kill all Node processes
pkill -9 node

# Kill Metro specifically
pkill -f "react-native start"

# Kill Xcode
pkill -9 Xcode
```

### Clean Everything:
```bash
cd VampireHuntApp
rm -rf node_modules ios/Pods ios/Podfile.lock
npm install
cd ios && pod install && cd ..
npx react-native start --reset-cache
```

---

## Still Having Issues?

1. Check the documentation files:
   - `QUICK_START.md`
   - `BUILD_SUCCESS.md`
   - `DEPLOYMENT_GUIDE.md`

2. Run React Native doctor:
   ```bash
   npx react-native doctor
   ```

3. Check React Native docs:
   - https://reactnative.dev/docs/troubleshooting

4. Check if it's a known issue:
   - https://github.com/facebook/react-native/issues

---

**Most issues can be solved by cleaning caches and reinstalling dependencies!**
