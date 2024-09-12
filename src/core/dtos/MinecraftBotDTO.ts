/**
 * Data Transfer Object (DTO) для MinecraftBot.
 */
export class MinecraftBotDTO {
    /**
     *
     * @param {string} username
     * @param {string} password
     * @param {screen} host
     * @param {boolean} chat_logger
     * @param {number} port
     * @param {any} options
     * @param {any} client
     */
    constructor(
        public username: string,
        public password: string,
        public host: string,
        public chat_logger: boolean,
        public port?: number, // изменено на number
        public options?: any,
        public client?: any // добавлен client
    ) {
    }
}
