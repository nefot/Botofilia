import { createBot, Bot, BotOptions } from 'mineflayer';
import * as readline from 'readline';
import * as fs from 'fs';
import WebSocket from 'ws';

const args: string[] = process.argv.slice(2);
if (args.length < 3) {
  console.error('Использование: node main.ts <никнейм> <пароль> <адрес> [порт]');
  process.exit(1);
}

const [username, password, host, port] = args;
const botOptions: BotOptions = {
  host,
  port: port ? parseInt(port) : 25565,
  username,
  password,
  version: '1.21.4',
};

let bot: Bot;
const ws = new WebSocket('ws://localhost:8081');

ws.on('open', () => {
  console.log(`[${username}] Подключен к серверу команд.`);
});

ws.on('message', (data: WebSocket.RawData) => {
    try {
        const message = data.toString().trim();
        console.log(`[${username}] Получена команда: ${message}`);

        const [botName, ...commandParts] = message.split(' ');
        const command = commandParts.join(' ');

        if (botName === username) {
            executeCommand(command);
        }
    } catch (err) {
        console.error(`[${username}] Ошибка обработки команды:`, err);
    }
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
rl.on('line', (line: string) => {
  const [botName, ...commandParts] = line.trim().split(' ');
  console.log(commandParts)
  // if (botName === username) {
  executeCommand(commandParts.join(' '));
  // }
});

const logFileName = `chat_log_${username}.txt`;
const logStream = fs.createWriteStream(logFileName, { flags: 'a' });

function createBotInstance(): void {
  bot = createBot(botOptions);

  bot.on('login', () => {
    bot.chat(`/login ${password}`);
    console.log(`Бот (${username}) подключился к серверу ${host}:${port || 25565}`);
    logStream.write(`Бот (${username}) подключился к серверу ${host}:${port || 25565}\n`);
  });

  bot.on('messagestr', (message: string) => {
    console.log(`[MESSAGE] ${message}`);
    logStream.write(`[MESSAGE] ${message}\n`);
  });

  bot.on('error', (err: Error & { code?: string }) => {
    console.error('Ошибка:', err);
    logStream.write(`Ошибка: ${err}\n`);
    if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED') {
      console.log('Попытка переподключения через 5 секунд...');
      setTimeout(createBotInstance, 5000);
    }
  });

  bot.on('end', () => {
    console.log('Бот отключился от сервера.');
    logStream.write('Бот отключился от сервера.\n');
    logStream.end();
    process.exit(0);
  });
}

async function executeCommand(command: string): Promise<void> {
  try {
    const [cmd, ...args] = command.split(' ');
    switch (cmd) {
      case 'move':
        console.log('Бот начинает движение...');
        break;
      case 'chat':
        console.log(`Сообщение: ${args.join(' ')}`);
        bot.chat(args.join(' '));
        break;
      case 'inventory':
        console.log('Инвентарь бота:', bot.inventory.items());
        break;
      case 'online':
        console.log('Игроки онлайн:', Object.keys(bot.players).join(', '));
        break;
      case 'say':
        const message = args.join(' ');
        console.log(`[BOT] ${username}: ${message}`);
        bot.chat(message);
        break;
      case 'exit':
        console.log('Завершение работы бота...');
        bot.end();
        logStream.end();
        process.exit(0);
      default:
        console.log('Неизвестная команда.');
    }
  } catch (err) {
    console.error('Ошибка выполнения команды:', err);
  }
}

createBotInstance();
