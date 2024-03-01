const ChatManager = require('./ChatManager');
const MovementManager = require('./MovementManager');
const InventoryManager = require('./InventoryManager');
const AreaManager = require('./AreaManager');

class BotController {
    constructor(bot, botName) {
        this.bot = bot;
        this.botName = botName;

        // Инициализация экземпляров классов
        this.chatManager = new ChatManager(bot, botName);
        this.movementManager = new MovementManager(bot);
        this.inventoryManager = new InventoryManager(bot);
        this.areaManager = new AreaManager(bot);
    }

    // Метод для обработки чата
    handleChat(username, message) {
        this.chatManager.handleChat(username, message);
    }

    // Другие методы для управления ботом, например:
    // - методы для передвижения (передвигать, стоять на месте и т. д.)
    // - методы для управления инвентарем (получать предметы, выкидывать предметы и т. д.)
    // - методы для управления областью (очищать область от блоков, размещать факелы и т. д.)
}

module.exports = BotController;
