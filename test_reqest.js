const express = require("express");
const app = express();
const urlencodedParser = express.urlencoded({extended: false});
const mineflayer = require('mineflayer');
const clc = require('cli-color');
const {pathfinder, Movements, goals: {GoalNear, GoalBlock, GoalFollow}} = require('mineflayer-pathfinder');
const password = '0303708000'
const bot = mineflayer.createBot({
    host: process.argv[2],
    // port: process.argv[3] ? process.argv[3] : NaN,
    username: process.argv[4] ? process.argv[4] : 'C',
    password: process.argv[5] ? process.argv[5] : password,
});

app.use(express.static(__dirname));

// Подключение плагина для автоматического питания
const auto_eat = require('mineflayer-auto-eat').plugin;

// Определение формата текущей даты и времени
function getCurrentDateTime() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');
    const formattedDateTime = `[${year}-${month}-${day}] [${hours}:${minutes}:${seconds}]`;
    return formattedDateTime;
}

// --------------- Ф У Н К Ц И И  -----------------//

/**
 * Функция для регистрации и входа в игру
 */
function login() {
    bot.chat(`/register ${process.argv[5]} ${process.argv[5]}  `)
    bot.chat(`/login ${process.argv[5]}`)
    console.log(`Бот ${bot.username} вошел в игру`)
    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)
    bot.pathfinder.setMovements(defaultMove)

    bot.autoEat.options.priority = 'foodPoints'
    bot.autoEat.options.startAt = 14

    bot.autoEat.options.priority = 'foodPoints';
    bot.autoEat.options.startAt = 14;
}

/**
 * Функция для следования за игроком
 * @param {Object} target - Цель, за которой нужно следовать
 */
function come(target) {
    if (!target) {
        bot.chat(`/msg ${target.displayName} я тебя не вижу`);
        return;
    }
    console.log(target);
    bot.pathfinder.setGoal(new GoalFollow(target, 1), true);
}

/**
 * Функция для остановки движения
 * @param {string} target - Цель, перед которой остановится бот
 */
function stop(target) {
    bot.pathfinder.setGoal(null, 1);
    bot.chat(`/msg ${target.displayName} остановился`);
}

/**
 * Функция для перемещения к указанным координатам
 * @param {string} message - Сообщение с координатами
 * @param {Object} target - Цель, для которой выполняется перемещение
 */
function goto(message, target) {
    const x = Number(message.split(" ")[1]);
    const y = Number(message.split(" ")[2]);
    const z = Number(message.split(" ")[3]);

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
        bot.chat(`/msg ${target} неправильно введены координаты ${x} ${y} ${z}`);
    } else {
        bot.pathfinder.setGoal(new GoalNear(x, y, z, 1));
        bot.chat(`/msg ${target} Иду в координаты ${x} ${y} ${z}`);
        console.log(clc.blue('Иду в координаты', x, y, z));
    }
}

/**
 * Функция для отправки информации о здоровье бота
 * @param {string} target - Цель, которой отправляется информация
 */
function health(target) {
    bot.chat(`/msg ${target} здоровье:${bot.health} насыщение:${bot.food} позиция ${bot.entity.position}`);
    console.log(
        clc.red(`  здоровье:${bot.health} `),
        clc.yellow(`насыщение:${bot.food} `),
        clc.blue(`позиция  x: ${bot.entity.position.x} y: ${bot.entity.position.y} z: ${bot.entity.position.z} `)
    );
}

/**
 * Функция обработки сообщений от игроков
 * @param {string} username - Имя игрока, отправившего сообщение
 * @param {string} message - Сообщение от игрока
 */
function examination(username, message) {
    const defaultMove = new Movements(bot);
    const target = bot.players[username] ? bot.players[username].entity : null;
    switch (message.split(" ")[0]) {
        case "goto":
            goto(message, target);
            break;
        case "come":
            come(target);
            break;
        case "stop":
            stop(username);
            break;
        case "health":
            health();
            break;
    }
}

// --------------- З А П Р О С Ы -----------------//

// Определение маршрутов для GET и POST запросов
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/page.html");
});
app.post("/", urlencodedParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);
    if (request.body.mes !== undefined) {
        if (request.body.name === bot.username) {
            if (request.body.mes.split('')[0] === '$') {
                examination(request.body.name, request.body.mes.split('').slice(1).join(''));
            } else {
                bot.chat(request.body.mes);
            }
        }
    }
});
bot.on('health', () => {
    if (bot.food === 20) bot.autoEat.disable()
    else bot.autoEat.enable()
})
bot.on('chat', async (username, message) => {
    console.log(`<${username}> ${message}`)

    printStrings();

})
bot.on("death",async ()=>{
    console.log(clc.red("СМЕРТЬ"))
    // stop()
})

bot.on('autoeat_started', (item, offhand) => {
    console.log(`Eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
})

bot.on('autoeat_finished', (item, offhand) => {
    console.log(`Finished eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`)
})

// Загрузка плагинов
bot.loadPlugin(auto_eat);
bot.loadPlugin(pathfinder);
bot.once("spawn", login);

// Массив строк для вывода в чате
const strings = ["/msg ManiSSar ААААААААААААААААААААААААААААААААААААААААААААААААААААААААААА","/msg ManiSSar ААААААААААААААААААААААААААААААААААААААААААААААААААААААААААА",];

/**
 * Функция для поочередного вывода строк в чат
 */
function printStrings() {
    const repetitions = 555;
    let currentRepetition = 0;

    function printStrings() {
        let index = 0;
        const intervalId = setInterval(() => {
            if (index < strings.length) {
                bot.chat(strings[index]);
                index++;
            } else {
                clearInterval(intervalId);
                currentRepetition++;
                if (currentRepetition < repetitions) {
                    const delay = Math.floor(Math.random() * (4 - 2 + 1)) + 2; // Генерируем случайное число от 2 до 4
                    setTimeout(printStrings, delay * 1000);
                }
            }
        }, 5000);
    }
}
    // printStrings();
app.listen(8000, () => console.log("Сервер запущен..."));
// bot.loadPlugin(autoeat)

// Загрузка строки в чат при выполнении условий
// printStrings();
