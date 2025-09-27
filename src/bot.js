require('dotenv').config();
const mineflayer = require('mineflayer');
const { Client } = require('hypixel-api-reborn');
const { Authflow } = require('prismarine-auth');

// Initialize Hypixel API
const hypixel = new Client(process.env.HYPIXEL_API_KEY);

// Command configuration
const COMMAND_PREFIX = process.env.COMMAND_PREFIX || '!';
const DEBUG = process.env.DEBUG === 'true';

class HypixelBot {
    constructor() {
        this.bot = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = parseInt(process.env.MAX_RECONNECT_ATTEMPTS) || 10;
        this.reconnectDelay = parseInt(process.env.RECONNECT_DELAY) || 5000;
        this.isReconnecting = false;
        this.usePrivateMessages = process.env.USE_PRIVATE_MESSAGES !== 'false'; // Default to true
    }

    async createBot() {
        this.log('Creating bot connection...');
        
        try {
            // Try Microsoft authentication with improved flow
            const authflow = new Authflow(process.env.BOT_USERNAME || 'HypixelBot', './auth_cache');
            const authResult = await authflow.getMinecraftJavaToken({
                username: process.env.MINECRAFT_EMAIL,
                password: process.env.MINECRAFT_PASSWORD,
                authTitle: 'HypixelBot',
                deviceType: 'Win32'
            });

            const botConfig = {
                host: 'mc.hypixel.net',
                username: authResult.profile.name,
                accessToken: authResult.access_token,
                clientToken: authResult.client_token,
                profileId: authResult.profile.id,
                auth: 'microsoft',
                version: '1.8.9'
            };

            this.bot = mineflayer.createBot(botConfig);
        } catch (error) {
            this.log(`Microsoft authentication failed: ${error.message}`, 'error');
            this.log('Trying alternative authentication...', 'info');
            
            // Fallback to direct configuration (this might not work with modern accounts)
            const botConfig = {
                host: 'mc.hypixel.net',
                username: process.env.BOT_USERNAME || 'HypixelBot',
                version: '1.8.9'
            };

            this.bot = mineflayer.createBot(botConfig);
        }

        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.bot.on('login', () => {
            this.log(`Bot logged in as ${this.bot.username}`);
            this.reconnectAttempts = 0;
            this.isReconnecting = false;
        });

        this.bot.on('spawn', () => {
            this.log('Bot spawned in the world');
            
            // Wait a moment then try to join the guild
            setTimeout(() => {
                this.log('Attempting to join guild...');
                this.bot.chat('/g online');  // Check guild status
            }, 2000);
            
            // Test guild chat after spawning
            setTimeout(() => {
                this.log('Testing guild chat...');
                this.bot.chat('/gc Bot online and ready!');
            }, 5000);
        });

        this.bot.on('message', (message) => {
            this.handleMessage(message);
        });

        this.bot.on('end', () => {
            this.log('Bot disconnected');
            if (!this.isReconnecting) {
                this.handleReconnect();
            }
        });

        this.bot.on('error', (err) => {
            this.log(`Bot error: ${err.message}`, 'error');
            if (!this.isReconnecting) {
                this.handleReconnect();
            }
        });
    }

    handleMessage(message) {
        const messageText = message.toString();
        
        // Debug logging for all messages if enabled
        if (DEBUG) {
            this.debugLog(`Message received: ${messageText}`);
        }

        // Log all messages to help debug (temporarily)
        this.log(`All messages: ${messageText}`, 'debug');

        // Log any system messages that might indicate messaging issues
        if (messageText.includes('You cannot message this player') || 
            messageText.includes('That player is not online') ||
            messageText.includes('You are sending messages too quickly') ||
            messageText.includes('Message could not be delivered') ||
            messageText.includes('You are not allowed to message') ||
            messageText.includes('Player is ignoring you') ||
            messageText.includes('has disabled') ||
            messageText.includes('has their private messages disabled') ||
            messageText.includes('You are not in a guild') ||
            messageText.includes('Guild chat is disabled')) {
            this.log(`System message about messaging: ${messageText}`, 'warn');
        }

        // Also log any messages that might be from the bot itself or responses
        if (messageText.includes('From ') || messageText.includes('To ') || 
            messageText.includes('Guild >') || messageText.includes('[Guild]')) {
            this.log(`Message system: ${messageText}`, 'info');
        }

        // Check for guild chat messages with commands
        const guildChatRegex = /Guild > (.+): (.+)/;
        const guildMatch = messageText.match(guildChatRegex);

        if (guildMatch) {
            const playerName = guildMatch[1];
            const content = guildMatch[2];
            
            this.log(`Guild message from ${playerName}: ${content}`);
            this.handleStatsCommand(playerName, content);
        }
    }

    async handleStatsCommand(requesterName, message) {
        // Check for toggle command first
        if (message.trim() === '!toggle' || message.trim() === '!togglepm') {
            this.usePrivateMessages = !this.usePrivateMessages;
            const mode = this.usePrivateMessages ? 'private messages' : 'guild chat';
            this.sendToGuildChat(`${requesterName}: Bot response mode changed to ${mode}`);
            this.log(`Response mode changed to ${mode} by ${requesterName}`);
            return;
        }

        // Parse both old and new command formats
        // New format: !bw player, !bw player mode, !sw player, !duels player
        const newCommandMatch = message.match(/^!(\w+)\s+(\w+)(?:\s+(\w+))?$/);
        // Old format: !stats game player, !stats game player mode  
        const oldCommandMatch = message.match(/^!stats\s+(\w+)\s+(\w+)(?:\s+(\w+))?$/);
        
        let game, player, mode;
        
        if (newCommandMatch) {
            // New format: !bw player [mode] or !bw mode player
            [, game, player, mode] = newCommandMatch;
            
            // Check if the second parameter is a known mode (swap if needed)
            const knownModes = ['solo', 'doubles', 'threes', 'fours', 'team', 'teams', 'ranked'];
            if (knownModes.includes(player.toLowerCase()) && mode && !knownModes.includes(mode.toLowerCase())) {
                // Swap: user typed "!bw solo waleyy" instead of "!bw waleyy solo"
                [player, mode] = [mode, player];
            }
        } else if (oldCommandMatch) {
            // Old format: !stats game player [mode]
            [, game, player, mode] = oldCommandMatch;
        } else {
            return; // Not a valid command format
        }

        this.log(`Processing ${game} command for ${player}${mode ? ` (${mode})` : ''} requested by ${requesterName}`);

        try {
            const playerData = await hypixel.getPlayer(player);
            
            if (!playerData) {
                this.sendResponse(requesterName, `Player "${player}" not found`);
                return;
            }

            let statsMessage;

            switch (game.toLowerCase()) {
                case 'bw':
                case 'bedwars':
                    statsMessage = this.formatBedWarsStats(playerData, mode);
                    break;
                case 'sw':
                case 'skywars':
                    statsMessage = this.formatSkyWarsStats(playerData, mode);
                    break;
                case 'duels':
                    statsMessage = this.formatDuelsStats(playerData, mode);
                    break;
                default:
                    this.sendResponse(requesterName, `Unknown game: ${game}. Available: bw, sw, duels`);
                    return;
            }

            // Send response using preferred method
            this.sendResponse(requesterName, statsMessage);

        } catch (error) {
            this.log(`Error fetching stats: ${error.message}`, 'error');
            this.sendResponse(requesterName, `Error fetching stats for ${player}`);
        }
    }

    formatBedWarsStats(player, mode = null) {
        const stats = player.stats?.bedwars;
        
        if (!stats) {
            return `No BedWars stats found for ${player.nickname}`;
        }

        // Use the level directly from the API (it's already calculated)
        const level = stats.level || 0;
        const winstreak = stats.winstreak || 0;
        
        // If no mode specified, show overall stats in a shorter format
        if (!mode) {
            const wins = stats.wins || 0;
            const losses = stats.losses || 0;
            const finalKills = stats.finalKills || 0;
            const finalDeaths = stats.finalDeaths || 0;

            const wlr = losses > 0 ? (wins / losses).toFixed(2) : wins.toFixed(2);
            const fkdr = finalDeaths > 0 ? (finalKills / finalDeaths).toFixed(2) : finalKills.toFixed(2);

            // Much shorter format to avoid spam detection
            return `${player.nickname} BW: ${level}⭐ WLR:${wlr} FKDR:${fkdr} WS:${winstreak}`;
        }

        // Handle specific modes using the mode objects from the API
        let modeStats = null;
        let modeName = '';

        switch (mode.toLowerCase()) {
            case 'solo':
                modeStats = stats.solo || {};
                modeName = 'Solo';
                break;
            case 'doubles':
                modeStats = stats.doubles || {};
                modeName = 'Doubles';
                break;
            case 'threes':
                modeStats = stats.threes || {};
                modeName = 'Threes';
                break;
            case 'fours':
                modeStats = stats.fours || {};
                modeName = 'Fours';
                break;
            default:
                return `Unknown BedWars mode: ${mode}. Available: solo, doubles, threes, fours`;
        }

        const wins = modeStats.wins || 0;
        const losses = modeStats.losses || 0;
        const finalKills = modeStats.finalKills || 0;
        const finalDeaths = modeStats.finalDeaths || 0;

        const wlr = losses > 0 ? (wins / losses).toFixed(2) : wins.toFixed(2);
        const fkdr = finalDeaths > 0 ? (finalKills / finalDeaths).toFixed(2) : finalKills.toFixed(2);

        return `${player.nickname} BW ${modeName}: ${level}⭐ WLR:${wlr} FKDR:${fkdr}`;
    }

    formatSkyWarsStats(player, mode = null) {
        const stats = player.stats?.skywars;
        
        if (!stats) {
            return `No SkyWars stats found for ${player.nickname}`;
        }

        // Use API level directly
        const level = stats.level || 0;
        
        // If no mode specified, show overall stats
        if (!mode) {
            const wins = stats.wins || 0;
            const losses = stats.losses || 0;
            const wlr = losses > 0 ? (wins / losses).toFixed(2) : wins.toFixed(2);

            return `${player.nickname} SW: ${level}⋆ WLR:${wlr}`;
        }

        // Handle specific modes (shortened)
        let modeStats = null;
        let modeName = '';

        switch (mode.toLowerCase()) {
            case 'solo':
                modeStats = stats.solo || {};
                modeName = 'Solo';
                break;
            case 'team':
            case 'teams':
                modeStats = stats.team || {};
                modeName = 'Teams';
                break;
            case 'ranked':
                modeStats = stats.ranked || {};
                modeName = 'Ranked';
                break;
            default:
                return `Unknown SkyWars mode: ${mode}`;
        }

        const wins = modeStats.wins || 0;
        const losses = modeStats.losses || 0;
        const wlr = losses > 0 ? (wins / losses).toFixed(2) : wins.toFixed(2);

        return `${player.nickname} SW ${modeName}: ${level}⋆ WLR:${wlr}`;
    }

    formatDuelsStats(player, mode = null) {
        const stats = player.stats?.duels;
        
        if (!stats) {
            return `No Duels stats found for ${player.nickname}`;
        }

        // If no mode specified, show overall stats
        if (!mode) {
            const wins = stats.wins || 0;
            const losses = stats.losses || 0;
            const wlr = losses > 0 ? (wins / losses).toFixed(2) : wins.toFixed(2);

            return `${player.nickname} Duels: WLR:${wlr}`;
        }

        // Handle specific duels modes
        const modeKey = mode.toLowerCase().replace(/[^a-z]/g, '');
        const modeStats = stats[modeKey] || stats[`${modeKey}Duel`] || stats[`${modeKey}_duel`];
        
        if (!modeStats) {
            return `Unknown Duels mode: ${mode}`;
        }

        const wins = modeStats.wins || 0;
        const losses = modeStats.losses || 0;
        const wlr = losses > 0 ? (wins / losses).toFixed(2) : wins.toFixed(2);

        return `${player.nickname} Duels ${mode}: WLR:${wlr}`;
    }

    sendResponse(playerName, message) {
        if (this.usePrivateMessages) {
            this.sendPrivateMessage(playerName, message);
        } else {
            this.sendToGuildChat(`${playerName}: ${message}`);
        }
    }

    sendPrivateMessage(playerName, message) {
        // Add longer delay to appear more natural
        setTimeout(() => {
            try {
                // Clean the player name (remove rank formatting)
                const cleanPlayerName = playerName.replace(/^\[.+?\]\s*/, '');
                
                // Split message if too long and add natural variation
                const shortMessage = message.length > 80 ? message.substring(0, 77) + '...' : message;
                
                this.log(`Sending message to ${cleanPlayerName}: ${shortMessage}`);
                this.bot.chat(`/msg ${cleanPlayerName} ${shortMessage}`);
                this.log(`Message sent to ${cleanPlayerName}`);
                
                // Shorter fallback time since messages are now shorter
                setTimeout(() => {
                    this.log(`Checking message delivery...`, 'debug');
                    // Don't automatically fallback - just log
                }, 2000);
                
            } catch (error) {
                this.log(`Error sending private message: ${error.message}`, 'error');
                // Try guild chat on error
                this.sendToGuildChat(`@${playerName}: ${message}`);
            }
        }, 1000);  // Longer delay to seem more natural
    }

    sendToGuildChat(message) {
        // Add delay to avoid rate limiting
        setTimeout(() => {
            try {
                const shortMessage = message.length > 80 ? message.substring(0, 77) + '...' : message;
                this.log(`Sending to guild: ${shortMessage}`);
                this.bot.chat(`/gc ${shortMessage}`);
                this.log(`Guild message sent`);
            } catch (error) {
                this.log(`Error sending to guild chat: ${error.message}`, 'error');
            }
        }, 800);
    }

    handleReconnect() {
        if (this.isReconnecting) {
            return;
        }

        this.isReconnecting = true;
        this.reconnectAttempts++;

        if (this.reconnectAttempts > this.maxReconnectAttempts) {
            this.log('Max reconnection attempts reached. Stopping.', 'error');
            process.exit(1);
        }

        this.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        setTimeout(() => {
            this.createBot().catch((err) => {
                this.log(`Reconnection failed: ${err.message}`, 'error');
                this.isReconnecting = false;
                this.handleReconnect();
            });
        }, this.reconnectDelay);
    }

    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }

    debugLog(message) {
        if (DEBUG) {
            this.log(`[DEBUG] ${message}`);
        }
    }
}

// Main function to start the bot
async function main() {
    const bot = new HypixelBot();
    
    try {
        await bot.createBot();
    } catch (error) {
        console.error('Failed to start bot:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down bot...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\nBot terminated');
    process.exit(0);
});

main().catch(console.error);