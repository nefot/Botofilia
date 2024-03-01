const clc = require('cli-color');

module.exports = function(bot) {
    bot.on('health', () => {
        if (bot.food === 20) bot.autoEat.disable();
        else bot.autoEat.enable();
    });

    bot.on('chat', async (username, message) => {
        console.log(`${getCurrentDateTime()} <${username}> ${message}`);
    });

    bot.on("death", async () => {
        console.log(clc.red("СМЕРТЬ"));
        bot.pathfinder.setGoal(null, 1);
    });

    bot.on('autoeat_started', (item, offhand) => {
        console.log(`Eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`);
    });

    bot.on('autoeat_finished', (item, offhand) => {
        console.log(`Finished eating ${item.name} in ${offhand ? 'offhand' : 'hand'}`);
    });

    bot.on('autoeat_error', console.error);

    bot.on('playerJoined', async (username) => {
        console.log(clc.yellow(`${username.displayName} присоединился к игре`));
    });

    bot.on('playerLeft', async (username) => {
        console.log(clc.green(`${username.displayName} вышел из игры`));
    });

    bot.on('whisper', function (username, message, translate, jsonMsg, matches) {
        examination(username, message);
        console.log(clc.cyan(` ${getCurrentDateTime()} <${username}> ${message}`));
    });
};
