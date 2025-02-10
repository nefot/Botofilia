import { createBot, Bot, BotOptions } from 'mineflayer';
import WebSocket from 'ws';
import { Logger } from './logger';

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

const logger = new Logger(username); // Создаем логгер с именем бота

let bot: Bot;
const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  logger.logEvent(`Подключен к серверу команд.`);
  // Регистрируем бота на сервере
  ws.send(`${username} register`);
});

ws.on('message', (data: WebSocket.RawData) => {
  try {
    const message = data.toString().trim();

    // Игнорируем сообщения, содержащие "Ошибка:"
    if (message.startsWith('Ошибка:')) {
      logger.error(`Игнорируем сообщение сервера: ${message}`);
      return;
    }

    executeCommand(message);
  } catch (err) {
    logger.error(`Ошибка обработки команды: ${err}`);
  }
});

ws.on('close', () => {
  logger.logEvent(`Соединение с сервером команд закрыто.`);
});

ws.on('error', (err) => {
  logger.error(`Ошибка WebSocket: ${err}`);
});

function createBotInstance(): void {
  bot = createBot(botOptions);

  bot.on('login', () => {
    bot.chat(`/login ${password}`);
    // logger.logEvent(`Бот подключился к серверу ${host}:${port || 25565}`);
  });

  bot.on('error', (err) => {
    // logger.error(`Ошибка: ${err}`);
  });

  bot.on('end', (reason) => {
    // logger.logEvent(`Бот отключился: ${reason}. Переподключение через 5 секунд...`);
    setTimeout(createBotInstance, 5000);
  });

  bot.on('kicked', (reason) => {
    // logger.error(`Бот кикнут: ${reason}`);
  });

  bot.on('messagestr', (message: string) => {
    // Парсим сообщение для извлечения ника игрока
    const match = message.match(/<([^>]+)> (.+)/);
    if (match) {
      const [, player, msg] = match;
      logger.logMessage(player, msg); // Логируем только как сообщение от игрока
    } else {
      logger.logEvent(message); // Если сообщение не от игрока, логируем как событие
    }
  });

  bot.on('playerJoined', (player) => {
    console.log(`\x1b[33mигрок ${player.username} подключился к игре\x1b[0m`);
    logger.logEvent(`игрок ${player.username} подключился к игре`);
  });


  bot.on('playerLeft', (player) => {
    logger.logEvent(`игрок ${player.username} покинул игру`);
  });
}

async function executeCommand(command: string): Promise<void> {
  try {
    const [cmd, ...args] = command.split(' ');

    switch (cmd) {
      case 'chat':
        bot.chat(args.join(' '));
        break;

      case 'inventory':
        logger.logEvent('Инвентарь бота: ' + JSON.stringify(bot.inventory.items()));
        break;

      case 'online':
        logger.logEvent('Игроки онлайн: ' + Object.keys(bot.players).join(', '));
        break;

      case 'health': {
        const healthHearts = Math.round(bot.health / 2);
        const foodIcons = Math.round(bot.food / 2);
        const exp = bot.experience.level + bot.experience.progress;

        const healthBar = '♥'.repeat(healthHearts) + '♡'.repeat(10 - healthHearts);
        const foodBar = '🍗'.repeat(foodIcons) + '⊠'.repeat(10 - foodIcons);
        const statusGraphical = `Health: ${healthBar}\nFood: ${foodBar}\nExp: ${exp.toFixed(1)}`;
        const statusText = `Health: ${bot.health}/20, Food: ${bot.food}/20, Exp: ${exp.toFixed(1)}`;

        const output = args.includes('log')
          ? args.includes('simple') ? statusText : statusGraphical
          : args.includes('simple') ? statusText : statusGraphical;

        if (args.includes('log')) {
          logger.logEvent(output);
        } else {
          console.log(output);
        }
        break;
      }

      case 'say':
        const message = args.join(' ');
        logger.logMessage(username, message);
        bot.chat(message);
        break;

      case 'exit':
        logger.logEvent('Завершение работы бота...');
        bot.end();
        process.exit(0);

      default:
        logger.logEvent('Неизвестная команда.');
    }
  } catch (err) {
    logger.error(`Ошибка выполнения команды: ${err}`);
  }
}


createBotInstance();