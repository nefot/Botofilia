import { WebSocketServer, WebSocket } from 'ws';

const server = new WebSocketServer({ port: 8080 });
const clients: Record<string, WebSocket> = {};

server.on('connection', (socket) => {
  console.log('Новое подключение.');

  socket.on('message', (data) => {
    try {
      const messageStr = data.toString().trim();
      const [botName, ...commandParts] = messageStr.split(' ');
      const command = commandParts.join(' ');

      // Проверка регистрации бота
      if (command === 'register') {
        if (!botName) {
          socket.send('Ошибка: укажите <никнейм> для регистрации');
          return;
        }

        clients[botName] = socket;
        console.log(`Бот ${botName} зарегистрирован.`);
        socket.send(`Бот ${botName} успешно зарегистрирован.`);
        return;
      }

      if (!botName || !command) {
        console.log('Ошибка: не указаны бот или команда');
        socket.send('Ошибка: укажите <никнейм> <сообщение>');
        return;
      }

      if (clients[botName]) {
        console.log(`Отправка команды боту ${botName}: ${command}`);
        clients[botName].send(command);
      } else {
        console.log(`Бот ${botName} не найден.`);
        socket.send(`Ошибка: бот ${botName} не найден.`);
      }
    } catch (err) {
      console.error('Ошибка обработки сообщения:', err);
      socket.send('Ошибка обработки сообщения');
    }
  });

  socket.on('close', () => {
    for (const [botName, clientSocket] of Object.entries(clients)) {
      if (clientSocket === socket) {
        delete clients[botName];
        console.log(`Бот ${botName} отключен.`);
      }
    }
  });
});


console.log('WebSocket сервер запущен на порту 8080.');
