import * as net from 'net';
import * as readline from 'readline';

const PORT: number = 3000;
const HOST: string = 'localhost';

const rl: readline.Interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const client: net.Socket = new net.Socket();

client.on('error', (err) => {
    console.error('Ошибка соединения:', err.message);
    startConsole(); // Перезапускаем консоль для продолжения ввода команд
});

function connectToServer(): void {
    client.connect(PORT, HOST, () => {
        console.log('Подключен к серверу');
    });

    client.on('data', (data: Buffer) => {
        console.log('Получено:', data.toString());
    });

    client.on('close', () => {
        console.log('Соединение закрыто');
    });
}

function sendCommandToBot(command: string): void {
    client.write(command);
}

// Бесконечный цикл для чтения команд из консоли
function startConsole(): void {
    rl.question('Введите команду для отправки ботам: ', (command: string) => {
        if (command.toLowerCase() === 'exits') {
            client.end();
            rl.close();
            return;
        }

        sendCommandToBot(command);
        startConsole(); // Рекурсивно вызываем функцию для продолжения чтения команд
    });
}

// Запускаем консоль и пытаемся подключиться к серверу
startConsole();
connectToServer();
