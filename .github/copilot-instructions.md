# Hypixel Chat Bot Project Instructions

This project is a Node.js-based Minecraft bot that:
- Connects to Hypixel using a Minecraft account
- Monitors guild chat for stats commands (e.g., "!stats bw waleyy")
- Fetches player statistics from Hypixel API
- Sends private messages with the requested stats to guild members

## Key Components
- **mineflayer**: Minecraft bot framework for connecting and chat monitoring
- **hypixel-api-nodejs**: Library for fetching Hypixel player statistics
- **Node.js**: Runtime environment with async/await patterns
- **Configuration system**: Secure storage of credentials and API keys

## Development Guidelines
- Use modern JavaScript (ES6+) with async/await
- Implement proper error handling for network requests
- Follow security best practices for credential management
- Use logging for debugging and monitoring bot activity
- Modular code structure for easy maintenance

## Bot Features
- Auto-reconnection on disconnect
- Command parsing and validation
- Rate limiting for API requests
- Support for multiple game modes (BedWars, SkyWars, etc.)
- Private message responses to avoid spam
