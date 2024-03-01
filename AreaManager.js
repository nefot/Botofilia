class AreaCleaner {
    constructor(bot, illuminate = false, startFromTop = true, illuminateHexagons = true) {
        this.bot = bot;
        this.illuminate = illuminate;
        this.startFromTop = startFromTop;
        this.illuminateHexagons = illuminateHexagons;
    }

    // Метод для очистки прямоугольной области от блоков
    async clearArea(startX, startY, startZ, endX, endY, endZ) {
        const mcData = require('minecraft-data')(this.bot.version);
        const blocksToClear = [];

        // Создаем массив координат всех блоков в указанной области
        if (this.startFromTop) {
            for (let y = endY; y >= startY; y--) {
                for (let x = startX; x <= endX; x++) {
                    for (let z = startZ; z <= endZ; z++) {
                        blocksToClear.push({ x, y, z });
                    }
                }
            }
        } else {
            for (let y = startY; y <= endY; y++) {
                for (let x = startX; x <= endX; x++) {
                    for (let z = startZ; z <= endZ; z++) {
                        blocksToClear.push({ x, y, z });
                    }
                }
            }
        }

        // Очищаем каждый блок в указанной области
        for (const { x, y, z } of blocksToClear) {
            await this.clearBlock(x, y, z);
        }

        // Если параметр illuminate равен true, освещаем область после отчистки
        if (this.illuminate) {
            if (this.illuminateHexagons) {
                await this.illuminateBottomHexagons(startX, startY, startZ, endX, endY, endZ);
            } else {
                await this.illuminateBottom(startX, startY, startZ, endX, endY, endZ);
            }
        }
    }

    // Метод для очистки одного блока
    async clearBlock(x, y, z) {
        const block = this.bot.blockAt(new this.bot.vec3(x, y, z));
        if (block && block.type !== 0) { // Проверяем, что блок существует и не является пустым воздухом
            await this.bot.dig(block);
        }
    }

    // Метод для освещения нижней грани указанной области факелами
    async illuminateBottom(startX, startY, startZ, endX, endY, endZ) {
        for (let x = startX; x <= endX; x += 10) {
            for (let z = startZ; z <= endZ; z += 10) {
                await this.placeTorch(x, startY, z);
            }
        }
    }

    // Метод для размещения факела в указанных координатах
    async placeTorch(x, y, z) {
        const torchBlock = this.bot.mcData.blocksByName['torch'];
        const torch = torchBlock.id;
        const torchPos = new this.bot.vec3(x, y - 1, z); // Размещаем факел под нижним блоком
        if (this.bot.canSeeBlock(torchPos)) {
            await this.bot.placeBlock(torchPos, new this.bot.Item(torch, 0, 1));
        }
    }

    // Метод для освещения нижней грани указанной области шестиугольниками с факелами в центрах
    async illuminateBottomHexagons(startX, startY, startZ, endX, endY, endZ) {
        const step = 6; // Радиус шестиугольников
        for (let x = startX; x <= endX; x += 3 * step) {
            for (let z = startZ; z <= endZ; z += 6 * step) {
                await this.placeTorch(x, startY, z);
                await this.placeTorch(x - 2 * step, startY, z + 3 * step);
                await this.placeTorch(x + 2 * step, startY, z + 3 * step);
                await this.placeTorch(x, startY, z + 6 * step);
                await this.placeTorch(x - 2 * step, startY, z + 9 * step);
                await this.placeTorch(x + 2 * step, startY, z + 9 * step);
            }
        }
    }
}
