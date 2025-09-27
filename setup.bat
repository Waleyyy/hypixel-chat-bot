@echo off
echo 🤖 Hypixel Chat Bot Setup
echo =========================

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed!
    echo 📥 Please install Node.js from https://nodejs.org/
    echo    Minimum version required: 16.0.0
    pause
    exit /b 1
)

echo ✅ Node.js found:
node --version

:: Check if npm is available
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not available!
    pause
    exit /b 1
)

echo ✅ npm found:
npm --version

:: Install dependencies
echo 📦 Installing dependencies...
npm install

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully!

:: Check if .env file exists
if not exist ".env" (
    echo ⚙️  Creating .env file from template...
    copy ".env.example" ".env" >nul
    echo 📝 Please edit the .env file with your configuration:
    echo    - MINECRAFT_EMAIL
    echo    - MINECRAFT_PASSWORD
    echo    - HYPIXEL_API_KEY
    echo    - BOT_USERNAME
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Edit your .env file with your credentials
echo 2. Get a Hypixel API key from https://api.hypixel.net/
echo 3. Run 'npm start' to start the bot
echo.
echo For help, see README.md

pause
