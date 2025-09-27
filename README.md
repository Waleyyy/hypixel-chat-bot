# Hypixel Chat Bot

A lightweight Minecraft bot that monitors Hypixel guild chat and responds to player statistics requests with concise, essential stats.

## Features

- 🤖 **Auto-connects** to Hypixel using Microsoft authentication
- 👥 **Guild chat monitoring** for stats commands
- 📊 **Essential player statistics** for BedWars, SkyWars, and Duels
- 💬 **Smart message delivery** - Private messages with guild chat fallback
- 🔄 **Auto-reconnection** with configurable retry logic
- ⚙️ **Toggle between** private messages and guild chat responses
- 🛡️ **Anti-spam protection** with short, clean message format
- 📝 **Simple commands** - Easy to use for guild members

## Prerequisites

Before running this bot, you need:

1. **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
2. **Minecraft account** (Java Edition)
3. **Hypixel API key** - Get one at [api.hypixel.net](https://api.hypixel.net/)
4. **Guild membership** on Hypixel (the bot needs to be in a guild)

## Installation

1. **Clone or download this project**
   ```bash
   git clone <your-repo-url>
   cd hypixel-chat-bot
   ```

2. **Install Node.js dependencies**
   
   **Windows PowerShell users**: If you get an execution policy error, run this first:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   
   Then install dependencies:
   ```bash
   npm install
   ```

3. **Create your environment configuration**
   - Copy `.env.example` to `.env`
   - Fill in your credentials:
   ```env
   MINECRAFT_EMAIL=your_email@example.com
   MINECRAFT_PASSWORD=your_password
   HYPIXEL_API_KEY=your_api_key_here
   BOT_USERNAME=your_minecraft_username
   GUILD_NAME=your_guild_name
   ```

## Configuration

Edit your `.env` file with the following settings:

### Required Settings
```env
# Your Minecraft account credentials (Microsoft account recommended)
MINECRAFT_EMAIL=your_minecraft_email@example.com
MINECRAFT_PASSWORD=your_minecraft_password

# Your Hypixel API key (get from https://api.hypixel.net/)
HYPIXEL_API_KEY=your_hypixel_api_key_here

# Your bot's Minecraft username and guild
BOT_USERNAME=your_bot_minecraft_username
GUILD_NAME=your_guild_name
```

### Optional Settings
```env
# Message delivery method (true = private messages, false = guild chat)
USE_PRIVATE_MESSAGES=true

# Command prefix (default: !)
COMMAND_PREFIX=!

# Reconnection settings
RECONNECT_DELAY=5000
MAX_RECONNECT_ATTEMPTS=10

# Debug mode (shows all messages)
DEBUG=false
```

## Usage

1. **Start the bot**
   ```bash
   npm start
   ```

2. **Guild members can now use stats commands**
   ```
   !bw waleyy               # BedWars stats for "waleyy"
   !bw waleyy solo          # BedWars solo mode stats
   !sw username             # SkyWars stats  
   !duels playername        # Duels stats
   
   # Alternative format (backwards compatibility):
   !stats bw waleyy         # Same as !bw waleyy
   ```

3. **Toggle response method** (if needed)
   ```
   !toggle                  # Switch between private messages and guild chat
   ```

4. **The bot responds with short, clean stats** to avoid spam detection

## Supported Commands

### **New Command Format (Primary):**
| Command | Description | Example Output |
|---------|-------------|----------------|
| `!bw <player>` | BedWars overall stats | `Waleyy BW: 677⭐ WLR:0.41 FKDR:1.48 WS:0` |
| `!bw <player> <mode>` | BedWars mode stats | `Waleyy BW Solo: 677⭐ WLR:0.22 FKDR:1.23` |
| `!sw <player>` | SkyWars overall stats | `Waleyy SW: 25⋆ WLR:1.50` |  
| `!duels <player>` | Duels overall stats | `Waleyy Duels: WLR:2.00` |

### **Legacy Format (Supported):**
| Command | Description | 
|---------|-------------|
| `!stats bw <player>` | Same as `!bw <player>` |
| `!stats sw <player>` | Same as `!sw <player>` |
| `!stats duels <player>` | Same as `!duels <player>` |

### **Special Commands:**
| Command | Description |
|---------|-------------|
| `!toggle` or `!togglepm` | Switch between private messages and guild chat |

### **Supported Game Modes:**

**BedWars**: `solo`, `doubles`, `threes`, `fours`
**SkyWars**: `solo`, `team`, `ranked`  
**Duels**: Various modes (auto-detected)

## Key Statistics Displayed

### **BedWars**
- ⭐ **Star Level** (automatically calculated)
- 🏆 **W/L Ratio** and raw wins/losses  
- ⚔️ **Final K/D Ratio** and final kills/deaths
- 🔥 **Win Streak** (current)
- 🎯 **Mode-specific** stats for solo, doubles, threes, fours

### **SkyWars**  
- ⋆ **Star Level** with prestige
- 🏆 **W/L Ratio** and raw wins/losses
- 🎯 **Mode-specific** stats for solo, teams, ranked

### **Duels**
- 🏆 **W/L Ratio** and raw wins/losses  
- 🎯 **Mode-specific** stats (auto-detected)

## Message Delivery System

The bot uses a **smart delivery system**:

1. **Private Messages** (default) - Sends stats via `/msg` 
2. **Guild Chat Fallback** - If private messages fail, sends to guild chat
3. **Toggle Command** - Use `!toggle` to switch between modes
4. **Anti-Spam** - Short message format to avoid Hypixel's spam detection

### Why Short Messages?
Hypixel blocks messages that look like spam. The bot uses a condensed format:
- ✅ `Waleyy BW: 677⭐ WLR:0.41 FKDR:1.48 WS:0`
- ❌ `Waleyy's BedWars [677★] | W/L: 2720/6716 (0.41) | ...` (too long, gets blocked)

## Security Notes

⚠️ **Important Security Information**

- Never share your `.env` file or commit it to version control
- Use a dedicated Minecraft account for the bot (not your main account)
- Keep your Hypixel API key secure
- Consider using Microsoft account authentication for better security

## Troubleshooting

### Common Issues

**Bot won't send messages:**
- Check if `USE_PRIVATE_MESSAGES=true` in your `.env`
- Try `!toggle` command to switch to guild chat mode
- Hypixel may be blocking private messages from new accounts
- Enable `DEBUG=true` to see if messages are being blocked

**"Blocked message containing lobby command":**
- This is Hypixel's anti-spam system
- The bot automatically uses shorter messages to avoid this
- Try switching to guild chat mode with `!toggle`

**Commands not working:**
- Ensure the bot is in the correct guild
- Check that guild chat is enabled
- Verify command format: `!bw player` or `!stats bw player`
- Bot needs to be online and connected to respond

**API errors:**
- Verify your Hypixel API key is correct
- Check if you've exceeded the API rate limit (120 requests/minute)
- Ensure the player name exists and has played the requested gamemode

**Guild chat not detected:**
- Make sure the bot is in a guild
- Verify guild chat permissions
- Check that the bot has successfully joined the server

## Example Usage

### **Quick Stats Check:**
```
[Guild] Player1: !bw Technoblade
[VIP] YourBot: Technoblade BW: 2800⭐ WLR:15.2 FKDR:45.3 WS:23

[Guild] Player2: !sw Waleyy  
[VIP] YourBot: Waleyy SW: 89⋆ WLR:4.5

[Guild] Player3: !bw Hypixel solo
[VIP] YourBot: Hypixel BW Solo: 1200⭐ WLR:3.2 FKDR:12.1
```

### **Toggle Response Mode:**
```
[Guild] Player: !toggle
[VIP] YourBot: Bot response mode changed to guild chat

[Guild] Player: !bw waleyy
[Guild] [VIP] YourBot: Player: waleyy BW: 677⭐ WLR:0.41 FKDR:1.48 WS:0
```

## Development

### Project Structure
```
hypixel-chat-bot/
├── src/
│   └── bot.js              # Main bot script
├── .env.example            # Configuration template
├── .env                    # Your configuration (don't commit)
├── .gitignore             # Git ignore rules
├── package.json           # Node.js dependencies
└── README.md              # This file
```

### Adding New Game Modes

To add support for new game modes:

1. Add a new case in `handleStatsCommand()` method
2. Create a formatting function like `formatBedWarsStats()`
3. Keep messages short to avoid spam detection
4. Update the README documentation

### Debug Mode

Enable debug mode to see detailed logging:
```env
DEBUG=true
```

This will show all chat messages, API requests, and delivery attempts.

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. See LICENSE file for details.

## Disclaimer

This bot is for educational purposes. Make sure to:
- Follow Hypixel's rules and terms of service
- Don't spam commands or abuse the API  
- Be respectful to other players and guild members
- Use the bot responsibly and considerately
- Don't use on your main account - use a dedicated bot account

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Enable debug mode for detailed logs
3. Create an issue on GitHub with error details
4. Join the community Discord (if available)

---

**Happy botting! 🎮**
