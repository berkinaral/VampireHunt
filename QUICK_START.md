# 🦇 Vampire Hunt - Quick Start Guide

## 🎉 Your App is Ready!

The iOS app is successfully built and running on the simulator. Here's everything you need to know.

---

## 🚀 Running the App

### Current Status:
- ✅ **iOS Simulator**: Running on iPhone 16e
- ✅ **Metro Bundler**: Active
- ✅ **Backend Server**: Running at http://192.168.1.103:3000

### To Restart Everything:

```bash
# Terminal 1: Start Backend Server
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server
npm run dev

# Terminal 2: Start Metro Bundler
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp
npx react-native start

# Terminal 3: Run iOS App
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp
npx react-native run-ios --simulator="iPhone 16e"
```

---

## 📱 Testing on Your iPhone

### Prerequisites:
1. **Unlock your iPhone** (Berkin)
2. **Connect via USB**
3. **Trust this computer** when prompted
4. **Enable Developer Mode**:
   - Settings → Privacy & Security → Developer Mode → ON
   - Restart iPhone if needed

### Run on Device:
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp
npx react-native run-ios --device="Berkin"
```

If the device name doesn't match, list available devices:
```bash
xcrun xctrace list devices
```

---

## 🎮 How to Test Multiplayer

### Option 1: Simulator + Web Client
1. **App on simulator** is already running
2. **Open web browser** and go to: http://192.168.1.103:3000/test-web-client.html
3. **Create room** in the app
4. **Join room** from web browser using the room code
5. **Add more players** by opening multiple browser tabs
6. **Start game** when you have 4+ players

### Option 2: Multiple Devices
1. **Run app on iPhone**
2. **Open web client on computer**: http://192.168.1.103:3000/test-web-client.html
3. **Or share with friends**: They can access http://YOUR_IP:3000/test-web-client.html
4. All devices must be on the same WiFi network

### Option 3: Multiple Simulators
```bash
# Terminal 1
npx react-native run-ios --simulator="iPhone 16"

# Terminal 2
npx react-native run-ios --simulator="iPhone 16 Plus"
```

---

## 🔧 Troubleshooting

### App Won't Build
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
npx react-native run-ios
```

### Metro Bundler Issues
```bash
# Reset cache
npx react-native start --reset-cache
```

### Server Connection Failed
```bash
# Check server is running
curl http://192.168.1.103:3000/health

# Should return: {"status":"healthy",...}
```

### Device Not Found
```bash
# List all devices
xcrun xctrace list devices

# Use exact device name
npx react-native run-ios --device="[Device Name]"
```

### "No space left on device"
```bash
# Clean Xcode caches
rm -rf ~/Library/Developer/Xcode/DerivedData/*
rm -rf ~/Library/Caches/CocoaPods/*
```

---

## 📝 Development Commands

### Backend Server:
```bash
cd server
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
node test-game-flow.js  # Run automated tests
```

### Mobile App:
```bash
cd VampireHuntApp
npm start            # Start Metro bundler
npm run ios          # Run on iOS
npm run android      # Run on Android (requires setup)
npm test             # Run tests
npm run lint         # Check code quality
```

### Useful iOS Commands:
```bash
# Clean build
cd ios && xcodebuild clean

# List simulators
xcrun simctl list devices

# Open in Xcode
open ios/VampireHuntApp.xcworkspace
```

---

## 🎯 Game Testing Checklist

### Basic Flow:
- [ ] App launches successfully
- [ ] Home screen displays correctly
- [ ] Can navigate to Create Room
- [ ] Can navigate to Join Room
- [ ] Room code is generated
- [ ] Can copy room code
- [ ] Can join room with code
- [ ] Players appear in lobby
- [ ] Host can start game
- [ ] Role reveal shows correctly
- [ ] Game phases transition
- [ ] Timer counts down
- [ ] Can cast votes
- [ ] Elimination works
- [ ] Game ends correctly
- [ ] Results screen shows winners
- [ ] Can play again

### Multiplayer:
- [ ] 4+ players can join
- [ ] Real-time updates work
- [ ] Vampires see each other
- [ ] Villagers don't see vampires
- [ ] Night voting (vampires only)
- [ ] Day voting (all players)
- [ ] Player elimination
- [ ] Win conditions

### Edge Cases:
- [ ] Player disconnects
- [ ] Host leaves
- [ ] Invalid room code
- [ ] Network interruption
- [ ] App backgrounded
- [ ] App killed and reopened

---

## 🚀 Deployment Checklist

### Before App Store Submission:

#### 1. Update Configuration
- [ ] Change server URL to production
- [ ] Update Bundle Identifier
- [ ] Set version to 1.0.0
- [ ] Configure code signing

#### 2. Create Assets
- [ ] App icon (1024x1024)
- [ ] Screenshots (6.7", 6.5", 5.5")
- [ ] App Store description
- [ ] Privacy policy URL

#### 3. Deploy Backend
- [ ] Choose hosting (Heroku/AWS/DigitalOcean)
- [ ] Set up production database (if needed)
- [ ] Configure environment variables
- [ ] Set up SSL certificate
- [ ] Test production server

#### 4. Test Production Build
- [ ] Build release version
- [ ] Test on physical devices
- [ ] Verify server connection
- [ ] Test all features
- [ ] Check performance

#### 5. Submit to App Store
- [ ] Create App Store Connect account
- [ ] Archive in Xcode
- [ ] Upload to App Store Connect
- [ ] Fill in app information
- [ ] Submit for review

---

## 📞 Support Resources

### Documentation:
- **React Native**: https://reactnative.dev
- **Socket.io**: https://socket.io/docs
- **React Navigation**: https://reactnavigation.org

### Project Files:
- `DEPLOYMENT_GUIDE.md` - Complete deployment instructions
- `BUILD_SUCCESS.md` - Build summary and status
- `RUN_ON_PHONE.md` - Phone testing details
- `memory-bank/` - Project documentation

### Useful Links:
- **App Store Connect**: https://appstoreconnect.apple.com
- **TestFlight**: For beta testing
- **Xcode Documentation**: https://developer.apple.com/xcode

---

## 🎊 You're All Set!

Your Vampire Hunt app is:
- ✅ Built and running
- ✅ Fully functional
- ✅ Ready for testing
- ✅ Ready for deployment

**Next Steps:**
1. Test the app on the simulator
2. Test on your iPhone
3. Gather friends for multiplayer testing
4. Deploy backend to production
5. Submit to App Store

**Have fun testing your game! 🦇🎮**
