import mineflayer from 'mineflayer';

/**
 * Класс MinecraftBot представляет собой бота для игры Minecraft, созданного с использованием библиотеки Mineflayer.
 */
export class MinecraftBot {
    /**
     * Создает экземпляр MinecraftBot.
     *
     * @param {string} username - Имя пользователя для входа в Minecraft.
     * @param {string} password - Пароль для входа в Minecraft.
     * @param {mineflayer.Bot} bot - Экземпляр бота Mineflayer.
     * @param {string} host - Хост сервера Minecraft.
     * @param {boolean} chat_logger - Логировать ли чат.
     * @param {string | number} [port] - Порт сервера Minecraft (необязательно).
     * @param {any} [options] - Дополнительные опции для создания бота (необязательно).
     * @param {any} client - Фигня какая то
     */
    constructor(
        readonly username: string,
        readonly password: string,
        readonly bot: mineflayer.Bot,
        readonly host: string,
        readonly chat_logger: boolean,
        readonly port?: number,
        readonly options?: any,
        readonly client?: any // добавлен client
    ) {

        this.bot = mineflayer.createBot({
            client: this.client,
            username: this.username,
            password: this.password,
            host: this.host,
            port: this.port,
            ...this.options,
        })


    }
}