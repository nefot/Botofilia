// -----------------------------------------------------------------------

import {Logger} from './logger';
import {Bot} from 'mineflayer';
import {goals, Movements, pathfinder} from 'mineflayer-pathfinder';

const {GoalNear, GoalBlock, GoalFollow} = goals;

// -----------------------------------------------------------------------

type CommandHandler = (args: string[], logger: Logger, bot: Bot) => Promise<void>;

//:todo ИСПРАВИТЬ move
//:todo СДЕЛАТЬ ТЕСТЫ

const commandHandlers: Record<string, CommandHandler> = {
    async chat(args, logger, bot): Promise<void> {

        const message = args.join(' ');
        if (!message) {
            return;
        }
        bot.chat(message);

    },
    async inventory(_, logger, bot): Promise<void> {
        console.log('Инвентарь бота: ' + JSON.stringify(bot.inventory.items()));
    },
    async online(_, logger, bot): Promise<void> {
        console.log('Игроки онлайн: ' + Object.keys(bot.players).join(', '));
    },

    
    async move(args: string[], logger: Logger, bot: Bot): Promise<void> {
        if (!bot.hasPlugin(pathfinder)) {
            bot.loadPlugin(pathfinder);
        }
        if (args.length < 3) {
            logger.logEvent("Недостаточно аргументов. Укажите координаты x, y, z.");
            return;
        }

        // Здесь все ок -------------------
        const x: number = parseInt(args[0]);
        const y: number = parseInt(args[1]);
        const z: number = parseInt(args[2]);
        // --------------------------------

        // Здесь все ок ----------------------------------------------------------
        if (isNaN(x) || isNaN(y) || isNaN(z)) {
            logger.logEvent("Некорректные координаты. Должны быть числа.");
            return;
        }
        // -----------------------------------------------------------------------


        const track: boolean = args.length > 3 && args[3] === "track";
        const customMoves: Movements = new Movements(bot);
        bot.pathfinder.setMovements(customMoves);
        await new Promise(resolve => setTimeout(resolve, 100)); // небольшая задержка
        bot.pathfinder.setGoal(new GoalNear(x, y, z, 0))

        // События pathfinder ---------------------------------------------------
        bot.once("goal_reached" as any, () => {
            logger.logEvent(`Бот достиг цели: (${x}, ${y}, ${z}).`);
        });

        bot.once("path_reset" as any, () => {
            logger.logEvent("Путь сброшен, движение отменено.");
        });

        bot.on('path_update', (r) => {
            console.log(`Статус пути: ${r.status}, Оставшееся расстояние: ${r.path.length}`);
        });
        // ---------------------------------------------------------------------

    },
    async health(args, logger, bot): Promise<void> {
        const healthHearts: number = Math.round(bot.health / 2);
        const foodIcons: number = Math.round(bot.food / 2);
        const exp = bot.experience.level + bot.experience.progress;
        const healthBar: string = '♥'.repeat(healthHearts) + '♡'.repeat(10 - healthHearts);
        const foodBar: string = '🍗'.repeat(foodIcons) + '⊠'.repeat(10 - foodIcons);
        const statusGraphical: string = `Health: ${healthBar}\nFood: ${foodBar}\nExp: ${exp.toFixed(1)}`;
        const statusText: string = `Health: ${bot.health}/20, Food: ${bot.food}/20, Exp: ${exp.toFixed(1)}`;
        const output: string = args.includes('simple') ? statusText : statusGraphical;
        console.log(`Текущая позиция: (${bot.entity.position.x.toFixed(2)}, ${bot.entity.position.y.toFixed(2)}, ${bot.entity.position.z.toFixed(2)})`);

        if (args.includes('log')) {
            logger.logEvent(output);
        } else {
            console.log(output);
        }
    },
    async say(args, logger, bot): Promise<void> {
        const message = args.join(' ');

        if (!message) {
            console.log('Сообщение для команды say пустое.');
            return;
        }

        bot.chat(message);

    },
    async exit(_, logger, bot) {
        console.log('Завершение работы бота...');
        bot.end();
        process.exit(0);
    },
};

export async function executeCommand(command: string, logger: Logger, bot: Bot): Promise<void> {
    try {
        const [cmd, ...args] = command.split(' ');
        const handler = commandHandlers[cmd];

        if (!handler) {
            console.log('Неизвестная команда.');
            return;
        }

        await handler(args, logger, bot);
        console.log(`Команда '${cmd}' успешно выполнена.`);
    } catch (err) {
        logger.error(`Ошибка выполнения команды: ${err}`);
    }
}

// Пример использования

