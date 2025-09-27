#!/bin/bash

# Hypixel Chat Bot - Quick Setup Script

echo "🤖 Hypixel Chat Bot Setup"
echo "========================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "📥 Please install Node.js from https://nodejs.org/"
    echo "   Minimum version required: 16.0.0"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not available!"
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "📝 Please edit the .env file with your configuration:"
    echo "   - MINECRAFT_EMAIL"
    echo "   - MINECRAFT_PASSWORD" 
    echo "   - HYPIXEL_API_KEY"
    echo "   - BOT_USERNAME"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit your .env file with your credentials"
echo "2. Get a Hypixel API key from https://api.hypixel.net/"
echo "3. Run 'npm start' to start the bot"
echo ""
echo "For help, see README.md or run 'npm run help'"
