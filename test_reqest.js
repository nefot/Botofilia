// --------------- П Е Р Е М Е Н Н Ы Е -----------------//
const express = require("express");
const app = express();
const urlencodedParser = express.urlencoded({extended: false});
const mineflayer = require('mineflayer')
const clc = require('cli-color');
const {pathfinder, Movements, goals: {GoalNear, GoalBlock, GoalFollow}} = require('mineflayer-pathfinder');
const password = '0303708000'
const bot = mineflayer.createBot({
    host: process.argv[2],
    // port: process.argv[3] ? process.argv[3] : NaN,
    username: process.argv[4] ? process.argv[4] : 'C',
    password: process.argv[5] ? process.argv[5] : password,
})
app.use(express.static(__dirname))

// --------------- Ф У Н К Ц И И  -----------------//
function login() {
    bot.chat(`/register ${process.argv[5]} ${process.argv[5]}  `)
    bot.chat(`/login ${process.argv[5]}`)
    console.log(`Бот ${bot.username} вошел в игру`)
    const mcData = require('minecraft-data')(bot.version)
    const defaultMove = new Movements(bot, mcData)
    bot.pathfinder.setMovements(defaultMove)
}

function come(target) {
    if (!target) {
        bot.chat(`/msg ${target.displayName} я тебя не вижу`)
        return
    }
    bot.pathfinder.setGoal(new GoalFollow(target, 1), true)
}

function stop(target) {
    bot.pathfinder.setGoal(null, 1)
    bot.chat(`/msg ${target.displayName} остановился`)
}

function goto(message, target) {
    const x = Number(message.split(" ")[1])
    const y = Number(message.split(" ")[2])
    const z = Number(message.split(" ")[3])
    // const player = bot.players[username]

    if (isNaN(x) || isNaN(y) || isNaN(z)) {
        bot.chat(`/msg ${target} неправельно введены кординаты ${x} ${y} ${z}`)
    } else {

        bot.pathfinder.setGoal(new GoalNear(x, y, z, 1))
        bot.chat(`/msg ${target} Иду в кординаты ${x} ${y} ${z}`)
        console.log(clc.blue('Иду в кординаты', x, y, z))
    }
}

function health(target) {
    bot.chat(`/msg ${target} здоровье:${bot.health} насыщение:${bot.food} позиция ${bot.entity.position}`)
    console.log(
        clc.red(`  здоровье:${bot.health} `),
        clc.yellow(`насыщение:${bot.food} `),
        clc.blue(`позиция  x: ${bot.entity.position.x} y: ${bot.entity.position.y} z: ${bot.entity.position.z} `),
    )
}

function examination(username, message) {

    const defaultMove = new Movements(bot)
    const target = bot.players[username] ? bot.players[username].entity : null
    switch (message.split(" ")[0]) {
        case "goto":
            goto(message, target)
            break;
        case "come":
            come(username)
            break;
        case "stop":
            stop(username)
            break;
        case "health":
            health()
            break;
    }
}

// --------------- З А П Р О С Ы -----------------//
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/page.html");
});
app.post("/", urlencodedParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);
    if (request.body.mes !== undefined) {
        if (request.body.name === bot.username) {
            if (request.body.mes.split('')[0] === '/') {
                examination(request.body.name, request.body.mes.split('').slice(1).join(''))
            } else {
                bot.chat(request.body.mes)
            }
        }
    }
});
bot.on('chat', async (username, message) => {
    console.log(`<${username}> ${message}`)
})
bot.on('playerJoined', async (username) => {
    console.log(clc.yellow(`${username.displayName} присоеденился к игре`))
})
bot.on('playerLeft', async (username) => {
    console.log(clc.green(`${username.displayName} вышел из игры`))
})
bot.on('whisper', function (username, message, translate, jsonMsg, matches) {
    examination(username, message)

})

app.listen(2828, () => console.log("Сервер запущен..."));
bot.loadPlugin(pathfinder)
bot.once("spawn", login)