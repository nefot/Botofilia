import { WebSocketServer, WebSocket } from 'ws';

const server = new WebSocketServer({ port: 8080 });
const clients: Record<string, WebSocket> = {};

server.on('connection', (socket) => {
  socket.on('message', (data) => {
    try {
      const { botName, command } = JSON.parse(data.toString());

      if (command === 'register') {
        clients[botName] = socket;
        console.log(`Бот ${botName} зарегистрирован.`);
      } else if (command && clients[botName]) {
        clients[botName].send(JSON.stringify({ command }));
      } else {
        console.log(`Неизвестная команда или бот ${botName} не найден.`);
      }
    } catch (err) {
      console.error('Ошибка обработки сообщения:', err);
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
