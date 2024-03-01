import * as mineflayer from 'mineflayer';

export class EventController {
    private readonly bot: mineflayer.Bot;

    constructor(bot: mineflayer.Bot) {
        this.bot = bot;
        this.setupEvents();
    }

    private setupEvents() {
        // this.bot.on('chat', (username, message) => {
        //     console.log(`<${username}> ${message}`);
        // });

        this.bot.on('spawn', () => {
            console.log('Bot spawned!');
        });

        this.bot.on('playerJoined', (player) => {
            console.log(`${player.username} присоединился к игре`);
        });
    }
}
