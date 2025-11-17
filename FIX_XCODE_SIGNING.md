# 🔧 Fix Xcode Code Signing

## Error
```
error: Signing for "VampireHuntApp" requires a development team. 
Select a development team in the Signing & Capabilities editor.
```

## Solution: Configure Code Signing in Xcode

### Step 1: Open Project in Xcode
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp
open ios/VampireHuntApp.xcworkspace
```

**IMPORTANT**: Open the `.xcworkspace` file, NOT the `.xcodeproj` file!

---

### Step 2: Select Your Team

Once Xcode opens:

1. **Click on "VampireHuntApp"** in the left sidebar (the blue project icon at the top)
2. **Select the "VampireHuntApp" target** (under TARGETS, not PROJECTS)
3. **Click "Signing & Capabilities"** tab at the top
4. **Check "Automatically manage signing"** checkbox
5. **Select your Team** from the dropdown:
   - If you have an Apple Developer account, select your team
   - If not, select your personal Apple ID (it will show as "Your Name (Personal Team)")

---

### Step 3: Add Apple ID (If Needed)

If you don't see a team in the dropdown:

1. **Xcode menu** → **Settings** (or Preferences)
2. Click **"Accounts"** tab
3. Click **"+"** button at bottom left
4. Select **"Apple ID"**
5. Sign in with your Apple ID
6. Close Settings
7. Go back to **Signing & Capabilities** and select your team

---

### Step 4: Build from Xcode

Once team is selected:

1. **Select a simulator** from the device dropdown at the top (e.g., "iPhone 15 Pro")
2. **Click the Play button** (▶️) or press **Cmd+R**
3. Wait for build to complete
4. App should launch in simulator

---

## Alternative: Use Simulator Without Signing

If you just want to test in simulator (not on a real device), you can disable signing:

### Option 1: Build for Simulator Only
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHuntApp
npx react-native run-ios --simulator="iPhone 15 Pro"
```

This might work without signing configuration for simulator builds.

### Option 2: Manually Configure for Simulator

1. Open `ios/VampireHuntApp.xcworkspace` in Xcode
2. Select VampireHuntApp target
3. Signing & Capabilities tab
4. Under "Debug" configuration:
   - Uncheck "Automatically manage signing"
   - Set "Signing Certificate" to "Sign to Run Locally"
5. Build for simulator

---

## Quick Fix Commands

### Open in Xcode:
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp
open ios/VampireHuntApp.xcworkspace
```

### After configuring signing, build from terminal:
```bash
npx react-native run-ios
```

### Or specify simulator:
```bash
npx react-native run-ios --simulator="iPhone 15 Pro"
```

---

## What to Do Now

**EASIEST SOLUTION**:

1. **Open Xcode**:
   ```bash
   cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/VampireHuntApp
   open ios/VampireHuntApp.xcworkspace
   ```

2. **In Xcode**:
   - Click VampireHuntApp (blue icon, left sidebar)
   - Click VampireHuntApp target (under TARGETS)
   - Click "Signing & Capabilities" tab
   - Check "Automatically manage signing"
   - Select your Apple ID from Team dropdown

3. **Build**:
   - Click Play button (▶️) in Xcode
   - OR close Xcode and run: `npx react-native run-ios`

---

## After Signing is Configured

The app will build and you can test with production server!

**Then you can**:
- Create a room in mobile app
- Join from web client: https://vampirehunt-production.up.railway.app/test-web-client.html
- Play the game!

---

**Open Xcode now and configure signing** ⬆️
