# 🚂 Railway Deployment - Root Directory Fix

## Issue
Railway's interface has changed - the "Root Directory" setting might not be visible or is in a different location.

## ✅ Solution: Use Configuration Files

I've created configuration files that tell Railway where your code is located.

---

## Step 1: Push Configuration Files to GitHub

```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt

# Add the new configuration files
git add railway.json railway.toml

# Commit
git commit -m "Add Railway configuration files"

# Push to GitHub
git push origin main
```

---

## Step 2: Redeploy on Railway

### Option A: Automatic Redeploy
Railway should automatically detect the new files and redeploy.

### Option B: Manual Redeploy
1. Go to your Railway project
2. Click on the deployment
3. Click **"Redeploy"** or **"Deploy"** button

---

## Step 3: Alternative - Deploy Server Directory Directly

If the configuration files don't work, let's deploy just the server directory:

### Method 1: Create Separate GitHub Repo for Server

```bash
# Navigate to server directory
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt/server

# Initialize Git in server directory
git init

# Add all files
git add .

# Commit
git commit -m "Vampire Hunt server"

# Create new GitHub repo and push
# Go to https://github.com/new
# Name it: VampireHunt-Server
# Then:
git remote add origin https://github.com/YOUR_USERNAME/VampireHunt-Server.git
git branch -M main
git push -u origin main
```

Then deploy this new repo to Railway (no root directory needed).

### Method 2: Use Railway Service Settings

In the new Railway interface:

1. Go to your Railway project
2. Click on your service (the deployment)
3. Look for **"Settings"** or **"Service Settings"**
4. Look for one of these options:
   - **"Source"** section
   - **"Build"** section
   - **"Service Variables"**
5. Try setting:
   - **Working Directory**: `server`
   - **Root Directory**: `server`
   - **Source Directory**: `server`

### Method 3: Use Environment Variables

1. In Railway project, go to **"Variables"** tab
2. Add a new variable:
   - **Name**: `RAILWAY_WORKDIR`
   - **Value**: `server`
3. Redeploy

---

## Step 4: Check Current Railway Interface

Let me guide you through the current Railway interface:

### Where to Find Settings:

**Option 1: Service Settings**
1. Click on your deployed service (the card/box with your app)
2. Look for tabs at the top: **Settings**, **Variables**, **Deployments**, **Metrics**
3. Click **"Settings"**
4. Scroll down to find:
   - **Build Settings**
   - **Deploy Settings**
   - **Source Settings**

**Option 2: Deployment Settings**
1. Click **"Deployments"** tab
2. Click on the latest deployment
3. Look for **"..."** (three dots) menu
4. Click **"View Build Logs"** or **"Settings"**

**Option 3: Project Settings**
1. Click your project name at the top
2. Look for **"Settings"** in the sidebar
3. Check for **"Service"** or **"Build"** sections

---

## Step 5: Manual Build Configuration

If you still can't find root directory setting, configure manually:

### In Railway Dashboard:

1. **Go to your service**
2. **Click "Settings"**
3. **Find "Build" section** (might be collapsed)
4. **Set these values**:

**Build Command**:
```bash
cd server && npm install && npm run build
```

**Start Command**:
```bash
cd server && npm start
```

**Install Command** (if available):
```bash
cd server && npm install
```

---

## Step 6: Check Build Logs

1. Go to **"Deployments"** tab
2. Click on the latest deployment
3. **View the logs** to see what's happening

Look for errors like:
- `Cannot find module`
- `package.json not found`
- `ENOENT: no such file or directory`

If you see these, Railway is looking in the wrong directory.

---

## Quick Fix: Simplest Solution

### Move server files to root:

```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt

# Move server files to root
cp -r server/* .
cp server/.gitignore .gitignore-server

# Commit and push
git add .
git commit -m "Move server to root for Railway deployment"
git push origin main
```

Then Railway will deploy from the root directory automatically.

---

## Alternative: Use Render Instead

If Railway is too confusing, Render has a simpler interface:

### Deploy to Render:

1. Go to **https://render.com**
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repo
5. Configure:
   - **Name**: vampire-hunt-server
   - **Root Directory**: `server` (this field is clearly visible!)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. Click **"Create Web Service"**

Render's interface is more straightforward for setting the root directory.

---

## What to Do Right Now

### Option 1: Try Configuration Files (Recommended)
```bash
cd /Users/doktaruser/Desktop/Windsurf/VampireHunt
git add railway.json railway.toml
git commit -m "Add Railway config"
git push origin main
```
Then check Railway - it should redeploy automatically.

### Option 2: Deploy Server Directory Only
Create a separate repo for just the server directory and deploy that.

### Option 3: Use Render
Switch to Render.com - it has a clearer "Root Directory" field.

### Option 4: Move Server to Root
Move all server files to the repository root.

---

## Tell Me What You See

Please share:
1. What tabs/sections do you see in Railway?
2. Is there a "Settings" tab when you click on your service?
3. Can you see "Build Command" or "Start Command" fields?
4. What does the Railway interface look like? (describe the layout)

Then I can give you exact instructions for your specific Railway interface version.

---

## Quick Test

Try this in Railway:

1. Click on your service/deployment
2. Look for **"Settings"** (might be a gear icon ⚙️)
3. Look for **"Variables"** tab
4. Add variable: `RAILWAY_WORKDIR` = `server`
5. Redeploy

If that doesn't work, let's use one of the other methods above.

---

**Let me know what you see in Railway and I'll guide you through the exact steps!** 🚂
