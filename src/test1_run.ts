import { createBot, Bot } from 'mineflayer';
import { Vec3 } from 'vec3';
import {placeBlockWithState} from "./rgwrg";

; // ← путь к вашему файлу

// === Настройки подключения ===
const bot = createBot({
    host: 'localhost',   // или IP сервера
    port: 25565,
    username: 'BuilderBot',
    version: '1.21.8',
     // авто-определение версии
});

bot.on('error', (err) => console.error('Bot error:', err));
bot.on('end', () => console.log('Bot disconnected'));

bot.once('spawn', async () => {
    console.log('✅ Бот заспавнился. Начинаем тест...');

    // Позиция рядом с ботом (вперёд и вниз на 1 блок)
    const botPos = bot.entity.position;
    const testPos = botPos.offset(0, -1, 2); // 2 блока вперёд по Z
    await bot.waitForChunksToLoad();

    // Убедимся, что под ногами есть блок (иначе не поставим ступень)
    const groundBelow = bot.blockAt(testPos.offset(0, -1, 0));
    console.log(bot.blockAt(testPos.offset(0, -1, 0)));
    if (!groundBelow || groundBelow.type === 0) {
        console.error('❌ Под тестовой позицией нет блока. Положите землю/камень под координатами:', testPos);
        bot.quit();
        return;
    }

    // Ищем дубовые ступени в инвентаре
    // const stairsItem = bot.inventory.findInventoryItem(bot.registry.blocksByName.oak_stairs.id, null, false);
    // if (!stairsItem) {
    //
    //     console.error('❌ В инвентаре нет дубовых ступеней (oak_stairs). Добавьте их в руку или инвентарь.');
    //     bot.quit();
    //     return;
    // }

    console.log('🔧 Найдены дубовые ступени. Тестируем установку...');

    // === Тест 1: bottom, facing=north ===
    console.log('\n🧪 Тест 1: half=bottom, facing=north');
    let result = await placeBlockWithState(bot, testPos, 'oak_stairs', {
        half: 'bottom',
        facing: 'north'
    });
    logResult(result);

    if (!result.success && result.navigateTo) {
        console.log('⚠️ Позиция вне досягаемости — перемещение не реализовано в этом тесте');
        bot.quit();
        return;
    }

    // === Тест 2: top, facing=east ===
    const testPos2 = testPos.offset(0, 0, 1); // рядом
    console.log('\n🧪 Тест 2: half=top, facing=east');
    result = await placeBlockWithState(bot, testPos2, 'oak_stairs', {
        half: 'top',
        facing: 'east'
    });
    logResult(result);

    console.log('\n✅ Тест завершён.');
    // bot.quit(); // раскомментируйте, если хотите, чтобы бот вышел после теста
});

function logResult(result: { success: boolean; message?: string }) {
    if (result.success) {
        console.log('✅ Успех:', result.message);
    } else {
        console.error('❌ Ошибка:', result.message);
    }
}