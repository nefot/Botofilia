import { WebSocketServer, WebSocket } from 'ws';

const server = new WebSocketServer({ port: 8080 });
const clients: Record<string, WebSocket> = {};

server.on('connection', (socket) => {
  console.log('Новое подключение.');

  socket.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      const { botName, command } = message;

      if (command === 'register') {
        clients[botName] = socket;
        console.log(`Бот ${botName} зарегистрирован.`);
        socket.send(JSON.stringify({ status: 'success', message: 'Регистрация успешна' }));
      } else if (command && clients[botName]) {
        clients[botName].send(JSON.stringify({ command }));
      } else {
        console.log(`Неизвестная команда или бот ${botName} не найден.`);
        socket.send(JSON.stringify({ status: 'error', message: 'Команда или бот не найдены' }));
      }
    } catch (err) {
      console.error('Ошибка обработки сообщения:', err);
      socket.send(JSON.stringify({ status: 'error', message: 'Ошибка обработки сообщения' }));
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