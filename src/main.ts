import { createBot, Bot, BotOptions } from 'mineflayer';
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
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  console.log(`[${username}] Подключен к серверу команд.`);
  // Регистрируем бота на сервере
  ws.send(JSON.stringify({ botName: username, command: 'register' }));
});

ws.on('message', (data: WebSocket.RawData) => {
  try {
    const message = JSON.parse(data.toString());
    console.log(`[${username}] Получена команда: ${message.command}`);

    if (message.command) {
      executeCommand(message.command);
    }
  } catch (err) {
    console.error(`[${username}] Ошибка обработки команды:`, err);
  }
});

ws.on('close', () => {
  console.log(`[${username}] Соединение с сервером команд закрыто.`);
});

ws.on('error', (err) => {
  console.error(`[${username}] Ошибка WebSocket:`, err);
});

function createBotInstance(): void {
  bot = createBot(botOptions);

  bot.on('login', () => {
    bot.chat(`/login ${password}`);
    console.log(`Бот (${username}) подключился к серверу ${host}:${port || 25565}`);
  });

  bot.on('error', (err) => {
    console.log('Ошибка:', err);
  });

  bot.on('end', (reason) => {
    console.log(`Бот отключился: ${reason}. Переподключение через 5 секунд...`);
    setTimeout(createBotInstance, 5000);
  });

  bot.on('kicked', (reason) => {
    console.log(`Бот кикнут: ${reason}`);
  });

  bot.on('messagestr', (message: string) => {
    console.log(`[MESSAGE] ${message}`);
  });
}

async function executeCommand(command: string): Promise<void> {
  try {
    const [cmd, ...args] = command.split(' ');
    switch (cmd) {
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
        process.exit(0);
      default:
        console.log('Неизвестная команда.');
    }
  } catch (err) {
    console.error('Ошибка выполнения команды:', err);
  }
}

createBotInstance();