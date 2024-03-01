class MovementManager {
    constructor(bot, mcData) {
        this.bot = bot;
        this.mcData = mcData;
        this.movements = new mineflayer.Movements(bot, mcData);
    }

    // Метод для перемещения к указанным координатам
    goTo(x, y, z) {
        this.bot.pathfinder.setMovements(this.movements);
        this.bot.pathfinder.setGoal(new mineflayer.goals.GoalNear(x, y, z), true);
    }

    // Метод для следования за целью (игроком)
    follow(target) {
        this.bot.pathfinder.setMovements(this.movements);
        this.bot.pathfinder.setGoal(new mineflayer.goals.GoalFollow(target, 1), true);
    }

    // Метод для остановки движения
    stop() {
        this.bot.pathfinder.setGoal(null);
    }
}
