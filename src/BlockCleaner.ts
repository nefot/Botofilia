// import mineflayer, { Bot, Vec3 } from 'mineflayer';
// export interface Position {
//     x: number;
//     y: number;
//     z: number;
// }
// export class BlockCleaner {
//     private bot: Bot;
//
//     constructor(bot: Bot) {
//         this.bot = bot;
//     }
//
//     public clearRect(startPos: Vec3, endPos: Vec3, placeTorches: boolean = false) {
//         // Определяем границы прямоугольника
//         const minX = Math.min(startPos.x, endPos.x);
//         const minY = Math.min(startPos.y, endPos.y);
//         const minZ = Math.min(startPos.z, endPos.z);
//         const maxX = Math.max(startPos.x, endPos.x);
//         const maxY = Math.max(startPos.y, endPos.y);
//         const maxZ = Math.max(startPos.z, endPos.z);
//
//         // Цикл для очистки блоков в прямоугольной области
//         for (let y = maxY; y >= minY; y--) {
//             for (let x = minX; x <= maxX; x++) {
//                 for (let z = minZ; z <= maxZ; z++) {
//                     const block = this.bot.blockAt(new Vec3(x, y, z));
//                     if (block && block.type !== 0) {
//                         this.bot.dig(block);
//                     }
//                 }
//             }
//         }
//
//         if (placeTorches) {
//             // Устанавливаем факелы на каждый 10-й блок нижнего слоя
//             for (let x = minX; x <= maxX; x += 10) {
//                 for (let z = minZ; z <= maxZ; z += 10) {
//                     this.bot.placeBlock(this.bot.mcData.blocksByName.torch.id, new Vec3(x, minY, z));
//                 }
//             }
//         }
//     }
// }
