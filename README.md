# Hypixel Chat Bot

A Minecraft bot that monitors Hypixel guild chat and responds to player statistics requests via private messages.

## Features

- 🤖 **Auto-connects** to Hypixel using your Minecraft account
- 👥 **Guild chat monitoring** for stats commands
- 📊 **Player statistics** for BedWars, SkyWars, and Duels
- 💬 **Private message responses** to avoid spam
- 🔄 **Auto-reconnection** with configurable retry logic
- 🛡️ **Error handling** and logging for stability
- ⚙️ **Configurable** command prefix and settings

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
   ```

## Configuration

Edit your `.env` file with the following settings:

### Required Settings
```env
# Your Minecraft account credentials
MINECRAFT_EMAIL=your_minecraft_email@example.com
MINECRAFT_PASSWORD=your_minecraft_password

# Your Hypixel API key (get from https://api.hypixel.net/)
HYPIXEL_API_KEY=your_hypixel_api_key_here

# Your bot's Minecraft username
BOT_USERNAME=your_bot_minecraft_username
```

### Optional Settings
```env
# Command prefix (default: !)
COMMAND_PREFIX=!

# Reconnection settings
RECONNECT_DELAY=5000
MAX_RECONNECT_ATTEMPTS=10

# Debug mode
DEBUG=false

# Microsoft account authentication (if using Microsoft account)
MINECRAFT_AUTH=microsoft
```

## Usage

1. **Start the bot**
   ```bash
   npm start
   ```

2. **Guild members can now use stats commands**
   ```
   !stats bw waleyy          # BedWars stats for player "waleyy"
   !stats sw username        # SkyWars stats
   !stats duels playername   # Duels stats
   ```

3. **The bot will respond via private message** with formatted statistics

## Supported Commands

| Command | Description | Examples |
|---------|-------------|----------|
| `!stats <game> <player>` | Overall game statistics | `!stats bw Technoblade` |
| `!stats <game> <mode> <player>` | Specific mode statistics | `!stats bw solo Dream` |
| `!stats general <player>` | General Hypixel player info | `!stats general Sapnap` |

### **BedWars Statistics (Statsify-level detail):**
- **Overall**: Star level, coins, winstreak, games played, averages, resource collection
- **Solo**: Individual 8v8v8v8v8v8v8v8 stats with items purchased and resources
- **Doubles**: 4v4v4v4 team stats with detailed breakdowns  
- **Threes**: 3v3v3v3 mode with comprehensive metrics
- **Fours**: 4v4 classic mode with full statistics

### **SkyWars Statistics:**
- **Overall**: Star level, coins, souls, experience, win rate, accuracy stats
- **Solo Normal/Insane**: Individual queue statistics
- **Team Normal/Insane**: Team-based game modes
- **Detailed metrics**: Chests opened, void kills, mob kills, time played

### **Duels Statistics:**
- **Overall**: Division title, winstreaks, accuracy, damage stats, health regeneration
- **UHC**: Golden apples eaten, health regenerated
- **Classic**: Damage dealt, bow hits
- **Bow**: Shot accuracy and hit statistics  
- **OP**: Healing potions used, damage metrics
- **SkyWars**: Blocks placed, enderpearls thrown
- **Sumo**: Melee accuracy and hit/swing ratios

### **General Player Information:**
- Rank, level, achievement points, karma
- Guild information, online status
- First/last login dates, most played game
- Recent games and network experience

### **Comprehensive Data (Like Statsify):**
✅ **Star levels and prestige colors**  
✅ **Coins, experience, and resources**  
✅ **Winstreaks (current and best)**  
✅ **Averages per game and ratios**  
✅ **Accuracy statistics (bow, melee)**  
✅ **Time played and activity metrics**  
✅ **Items purchased and collected**  
✅ **Health/damage statistics**  
✅ **Mode-specific unique stats**

## Statistics Displayed

### BedWars
- Wins, Losses, W/L Ratio
- Kills, Deaths, K/D Ratio  
- Final Kills, Final Deaths, Final K/D Ratio
- Beds Broken, Beds Lost, Bed Break Ratio

### SkyWars
- Wins, Losses, W/L Ratio
- Kills, Deaths, K/D Ratio

### Duels
- Wins, Losses, W/L Ratio
- Kills, Deaths, K/D Ratio

## Security Notes

⚠️ **Important Security Information**

- Never share your `.env` file or commit it to version control
- Use a dedicated Minecraft account for the bot (not your main account)
- Keep your Hypixel API key secure
- Consider using Microsoft account authentication for better security

## Troubleshooting

### Common Issues

**Bot won't connect:**
- Check your Minecraft credentials
- Ensure your account has access to multiplayer
- Verify you're not already logged in elsewhere

**"Invalid session" errors:**
- Wait a few minutes between connection attempts
- Try using Microsoft authentication if available
- Restart the bot if the session expires

**API errors:**
- Verify your Hypixel API key is correct
- Check if you've exceeded the API rate limit (120 requests/minute)
- Ensure the player name exists and has played the requested gamemode

**Guild chat not detected:**
- Make sure the bot is in a guild
- Verify guild chat permissions
- Check that the bot has successfully joined the server

### Debug Mode

Enable debug mode to see detailed logging:
```env
DEBUG=true
```

This will show all chat messages and API requests for troubleshooting.

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

1. Add a new case in `getPlayerStats()` method
2. Create a formatting function like `formatBedWarsStats()`
3. Update the README documentation

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
- Don't spam or abuse the API
- Be respectful to other players
- Use the bot responsibly

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Enable debug mode for detailed logs
3. Create an issue on GitHub with error details
4. Join the community Discord (if available)

---

**Happy botting! 🎮**
