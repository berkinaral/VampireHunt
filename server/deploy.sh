#!/bin/bash

# Vampire Hunt - Heroku Deployment Script
# This script automates the deployment process to Heroku

set -e  # Exit on error

echo "🦇 Vampire Hunt - Heroku Deployment"
echo "===================================="
echo ""

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found!"
    echo "Installing Heroku CLI..."
    brew tap heroku/brew && brew install heroku
fi

echo "✅ Heroku CLI installed"
echo ""

# Check if logged in to Heroku
echo "Checking Heroku authentication..."
if ! heroku auth:whoami &> /dev/null; then
    echo "Please log in to Heroku:"
    heroku login
fi

echo "✅ Logged in to Heroku"
echo ""

# Check if Git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized!"
    echo "Run: git init && git add . && git commit -m 'Initial commit'"
    exit 1
fi

echo "✅ Git repository ready"
echo ""

# Build TypeScript
echo "Building TypeScript..."
npm run build

if [ ! -d dist ]; then
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

echo "✅ TypeScript built successfully"
echo ""

# Check if Heroku app exists
APP_NAME="vampire-hunt-server"
if heroku apps:info --app $APP_NAME &> /dev/null; then
    echo "✅ Heroku app '$APP_NAME' exists"
    echo ""
    echo "Deploying to existing app..."
else
    echo "Creating new Heroku app: $APP_NAME"
    heroku create $APP_NAME
    echo "✅ Heroku app created"
fi

echo ""
echo "Deploying to Heroku..."
git push heroku master || git push heroku main

echo ""
echo "✅ Deployment complete!"
echo ""

# Get app URL
APP_URL=$(heroku apps:info --app $APP_NAME | grep "Web URL" | awk '{print $3}')
echo "🌐 Your app is live at: $APP_URL"
echo ""

# Test health endpoint
echo "Testing health endpoint..."
sleep 5  # Wait for app to start
curl -s "${APP_URL}health" | python3 -m json.tool || echo "Health check pending..."

echo ""
echo "===================================="
echo "✅ Deployment Successful!"
echo "===================================="
echo ""
echo "Next steps:"
echo "1. Update mobile app URL to: $APP_URL"
echo "2. Rebuild mobile app"
echo "3. Test end-to-end"
echo ""
echo "View logs: heroku logs --tail --app $APP_NAME"
echo "Open app: heroku open --app $APP_NAME"
