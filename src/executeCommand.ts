import {Bot} from 'mineflayer';
import {Logger} from './logger';
import {createBot} from 'mineflayer'
import {pathfinder, Movements, goals} from 'mineflayer-pathfinder'

const {GoalBlock} = goals

type CommandHandler = (args: string[], logger: Logger, bot: Bot) => Promise<void>;

//:todo ИСПРАВИТЬ move
//:todo СДЕЛАТЬ ТЕСТЫ

const commandHandlers: Record<string, CommandHandler> = {
    async chat(args, logger, bot) {
        const message = args.join(' ');
        if (!message) {
            logger.logEvent('Сообщение для команды chat пустое.');
            return;
        }
        bot.chat(message);
        logger.logEvent(`Бот отправил сообщение: ${message}`);
    },

    async inventory(_, logger, bot) {
        logger.logEvent('Инвентарь бота: ' + JSON.stringify(bot.inventory.items()));
    },

    async online(_, logger, bot) {
        logger.logEvent('Игроки онлайн: ' + Object.keys(bot.players).join(', '));
    },
    async move(args, logger, bot) {
        if (args.length < 3) {
            logger.logEvent('Недостаточно аргументов для команды move. Использование: move <x> <y> <z> [track]');
            return;
        }

        const x = parseFloat(args[0]);
        const y = parseFloat(args[1]);
        const z = parseFloat(args[2]);
        const trackPosition = args.includes('track');

        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            logger.logEvent('Неверные координаты для команды move. Убедитесь, что введены числа.');
            return;
        }

        logger.logEvent(`Бот начинает движение к координатам x:${x} y:${y} z:${z}`);


        bot.loadPlugin(pathfinder)
        const defaultMovements = new Movements(bot)
        bot.pathfinder.setMovements(defaultMovements)
        const goal = new GoalBlock(x, y, z)
        bot.pathfinder.goto(goal).then(() => {
            bot.chat('Прибыл в точку!')
        }).catch(err => {
            bot.chat(`Ошибка: ${err.message}`)
        })

        if (trackPosition) {
            const interval = setInterval(() => {
                const position = bot.entity.position;
                console.log(`\x1b[34mТекущее местоположение: x:${position.x.toFixed(2)} y:${position.y.toFixed(2)} z:${position.z.toFixed(2)}\x1b[0m`);
            }, 5000);

            bot.once('goal_reached', () => {
                clearInterval(interval);
                logger.logEvent('Бот достиг цели.');
            });

            bot.once('path_reset', () => {
                clearInterval(interval);
                logger.logEvent('Путь сброшен. Бот остановлен.');
            });
        }
    },

    async health(args, logger, bot) {
        const healthHearts = Math.round(bot.health / 2);
        const foodIcons = Math.round(bot.food / 2);
        const exp = bot.experience.level + bot.experience.progress;
        const healthBar = '♥'.repeat(healthHearts) + '♡'.repeat(10 - healthHearts);
        const foodBar = '🍗'.repeat(foodIcons) + '⊠'.repeat(10 - foodIcons);
        const statusGraphical = `Health: ${healthBar}\nFood: ${foodBar}\nExp: ${exp.toFixed(1)}`;
        const statusText = `Health: ${bot.health}/20, Food: ${bot.food}/20, Exp: ${exp.toFixed(1)}`;
        const output = args.includes('simple') ? statusText : statusGraphical;

        if (args.includes('log')) {
            logger.logEvent(output);
        } else {
            console.log(output);
        }
    },

    async say(args, logger, bot) {
        const message = args.join(' ');

        if (!message) {
            logger.logEvent('Сообщение для команды say пустое.');
            return;
        }

        bot.chat(message);
        logger.logEvent(`Бот сказал: ${message}`);
    },

    async exit(_, logger, bot) {
        logger.logEvent('Завершение работы бота...');
        bot.end();
        process.exit(0);
    },
};

export async function executeCommand(command: string, logger: Logger, bot: Bot): Promise<void> {
    try {
        const [cmd, ...args] = command.split(' ');
        const handler = commandHandlers[cmd];

        if (!handler) {
            logger.logEvent('Неизвестная команда.');
            return;
        }

        await handler(args, logger, bot);
        logger.logEvent(`Команда '${cmd}' успешно выполнена.`);
    } catch (err) {
        logger.error(`Ошибка выполнения команды: ${err}`);
    }
}
