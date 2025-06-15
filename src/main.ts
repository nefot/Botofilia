import { Bot, BotOptions, createBot } from 'mineflayer';
import WebSocket from 'ws';
import { Logger } from './logger';
import { executeCommand } from './executeCommand';

/**
 * Namespace for configuration and settings
 */
namespace Settings {
  export const args: string[] = process.argv.slice(2);
  export const [username, password, host, portRaw] = args;
  export const port: number = portRaw ? parseInt(portRaw, 10) : 25565;
  export const botOptions: BotOptions = {
    host,
    port,
    username,
    password,
    version: '1.21.4',
  };
  export const wsUrls: string[] = [
    'ws://localhost:8080',
    'ws://192.168.134.221:8080',
  ];
}

const logger = new Logger(Settings.username);
let bot: Bot | null = null;
let ws: WebSocket | null = null;

let botReconnectTimeout: NodeJS.Timeout;
let wsReconnectTimeout: NodeJS.Timeout;
let loginTimeout: NodeJS.Timeout;

/**
 * Safely destroy existing bot instance and clear timeouts
 */
function destroyBot(): void {
  if (bot) {
    bot.removeAllListeners();
    try { bot.quit(); } catch {};
    bot = null;
  }
  clearTimeout(botReconnectTimeout);
  clearTimeout(loginTimeout);
}

/**
 * Create and initialize the Mineflayer bot
 */
function createBotInstance(): void {
  destroyBot();
  bot = createBot(Settings.botOptions);

  bot.once('login', () => {
    // Attempt registration then login
    bot!.chat(`/register ${Settings.password} ${Settings.password}`);
    // Schedule login after server processes registration
    clearTimeout(loginTimeout);
    loginTimeout = setTimeout(() => {
      if (bot) {
        bot.chat(`/login ${Settings.password}`);
      }
    }, 1000);
    logger.logEvent(`Bot connected to ${Settings.botOptions.host}:${Settings.botOptions.port}`);
  });

  bot.on('end', (reason) => {
    logger.error(`Bot disconnected (${reason}). Reconnecting in 5s...`);
    destroyBot();
    botReconnectTimeout = setTimeout(createBotInstance, 7000);
  });

  bot.on('error', (err) => {
    logger.error(`Bot error: ${err}. Reconnecting in 5s...`);
    bot?.end();
  });

  bot.on('kicked', (reason) => {
    logger.error(`Bot was kicked (${reason}). Reconnecting in 5s...`);
    bot?.end();
  });

  bot.on('message', (message) => {
    const text = message.toString();
    const match = text.match(/^<([^>]+)>\s*(.+)$/);
    if (match) {
      const [, player, msg] = match;
      logger.logMessage(player, msg);
    } else {
      logger.logEvent(text);
    }
  });

  bot.on('playerJoined', (player) => {
    logger.logEvent(`Player joined: ${player.username}`);
  });

  bot.on('playerLeft', (player) => {
    logger.logEvent(`Player left: ${player.username}`);
  });
}

/**
 * Initialize or reconnect the WebSocket connection
 */
let wsAttempt = 0;
function initializeWebSocket(): void {
  if (ws) {
    ws.removeAllListeners();
    ws.terminate();
    ws = null;
  }

  const url = Settings.wsUrls[wsAttempt % Settings.wsUrls.length];
  ws = new WebSocket(url);

  ws.on('open', () => {
    logger.logEvent(`WebSocket connected to ${url}`);
    wsAttempt = 0;
    ws!.send(`${Settings.username} register`);
  });

  ws.on('message', (data) => {
    const msg = data.toString().trim();
    if (msg.startsWith('Ошибка:')) {
      logger.error(`Ignored server message: ${msg}`);
      return;
    }
    try {
      executeCommand(msg, logger, bot!);
    } catch (err) {
      logger.error(`Command handling error: ${err}`);
    }
  });

  ws.on('close', () => {
    logger.error(`WebSocket closed. Reconnecting in 5s...`);
    clearTimeout(wsReconnectTimeout);
    wsReconnectTimeout = setTimeout(() => {
      wsAttempt++;
      initializeWebSocket();
    }, 7000);
  });

  ws.on('error', (err) => {
    logger.error(`WebSocket error: ${err}`);
    ws?.terminate();
  });
}

/**
 * Application entry point
 */
function main(): void {
  if (Settings.args.length < 3) {
    console.error('Usage: node main.ts <username> <password> <host> [port]');
    process.exit(1);
  }

  createBotInstance();
  initializeWebSocket();
}

main();
