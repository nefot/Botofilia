class InventoryManager {
    constructor(bot) {
        this.bot = bot;
    }

    // Метод для получения содержимого инвентаря
    getItems() {
        return this.bot.inventory.items();
    }

    // Метод для получения количества указанного предмета в инвентаре
    getItemCount(itemName) {
        const items = this.getItems();
        let count = 0;
        for (const item of items) {
            if (item.name === itemName) {
                count += item.count;
            }
        }
        return count;
    }

    // Метод для проверки наличия указанного предмета в инвентаре
    hasItem(itemName) {
        return this.getItemCount(itemName) > 0;
    }

    // Метод для получения слота, в котором находится указанный предмет
    getItemSlot(itemName) {
        const items = this.getItems();
        for (const item of items) {
            if (item.name === itemName) {
                return item.slot;
            }
        }
        return -1; // Если предмет не найден, возвращаем -1
    }

    // Метод для выбрасывания указанного количества предметов
    dropItem(itemName, count) {
        const slot = this.getItemSlot(itemName);
        if (slot !== -1) {
            this.bot.tossStack(slot, count);
            return true;
        }
        return false; // Предмет не найден в инвентаре
    }
}
