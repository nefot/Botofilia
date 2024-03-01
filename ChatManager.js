const fs = require('fs');

class ChatManager {
    constructor(bot, botName) {
        this.bot = bot;
        this.botName = botName;
        this.chatLogFilePath = 'chat.log'; // Путь к файлу лога чата
    }

    // Метод для отправки сообщения в чат
    sendChatMessage(message) {
        this.bot.chat(message);
        this.saveChatLog(`[CHAT] ${message}`);
    }

    // Метод для отправки личного сообщения игроку
    sendPrivateMessage(username, message) {
        this.bot.whisper(username, message);
        this.saveChatLog(`[WHISPER] To ${username}: ${message}`);
    }

    // Метод для обработки чата (пример)
    handleChat(username, message) {
        console.log(`[${username}]: ${message}`);
        this.saveChatLog(`[${username}]: ${message}`);
        this.chatGPTIfMentioned(username, message); // Вызов функции для обращения к ChatGPT
        this.handleCommands(username, message); // Вызов функции для обработки команд
    }

    // Функция для обработки определенных команд
    handleCommands(username, message) {
        // Разбиваем сообщение на слова
        const words = message.split(' ');

        // Проверяем первое слово на наличие команды
        const command = words[0].toLowerCase();

        // Выполняем определенные действия в зависимости от команды
        switch (command) {
            case '/hello':
                this.sendChatMessage(`Hello, ${username}!`);
                break;
            case '/info':
                this.sendChatMessage('This is a bot providing assistance.');
                break;
            // Добавьте здесь другие команды и их обработку
            default:
                // Если команда не распознана, ничего не делаем
                break;
        }
    }

    // Функция для обращения к ChatGPT при упоминании имени бота
    async chatGPTIfMentioned(username, message) {
        if (message.toLowerCase().includes(this.botName.toLowerCase())) {
            // Здесь можно вызвать функцию, которая отправляет сообщение в ChatGPT и обрабатывает его ответ
            // Например:
            // const response = await chatGPT.send(message); // Предполагается, что у вас есть объект chatGPT для общения с ChatGPT
            // this.sendChatMessage(response);
            console.log(`[${username}] mentioned ${this.botName}, processing with ChatGPT...`);
        }
    }

    // Метод для сохранения сообщений чата в лог
    saveChatLog(message) {
        fs.appendFile(this.chatLogFilePath, `${message}\n`, (err) => {
            if (err) {
                console.error('Error saving chat log:', err);
            }
        });
    }
}

module.exports = ChatManager;
