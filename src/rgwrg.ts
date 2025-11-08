import {Bot} from 'mineflayer';
import {Block} from 'prismarine-block';
import {Vec3} from 'vec3';

// --- Типы ---

export type FacingDirection = 'north' | 'south' | 'east' | 'west';
export type Half = 'top' | 'bottom';

export interface BlockPlacementState {
    facing?: FacingDirection;
    half?: Half;
    // shape?: 'straight' | 'inner_left' | 'inner_right' | 'outer_left' | 'outer_right'; // можно добавить позже
}

export interface PlacementResult {
    success: boolean;
    message?: string;
    navigateTo?: Vec3;
}

// --- Вспомогательные константы ---

const OPPOSITE_FACING: Record<FacingDirection, Vec3> = {
    north: new Vec3(0, 0, 1),   // смотрим с юга → ступень смотрит на север
    south: new Vec3(0, 0, -1),
    east: new Vec3(-1, 0, 0),
    west: new Vec3(1, 0, 0)
};

// --- Вспомогательные функции ---

function isWithinReach(botPos: Vec3, targetPos: Vec3, maxDistance: number = 4): boolean {
    const dx = botPos.x - targetPos.x;
    const dy = botPos.y - targetPos.y;
    const dz = botPos.z - targetPos.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return distance <= maxDistance;
}

// --- Основная функция ---

/**
 * Устанавливает блок с учётом желаемого состояния (facing, half) в режиме выживания.
 * Поддерживает *_stairs. Работает без читов — только через легальные действия.
 *
 * @param bot - экземпляр бота mineflayer
 * @param targetPos - позиция, куда нужно поставить блок (целевая позиция)
 * @param blockName - имя блока (например, 'oak_stairs', 'stone')
 * @param desiredState - желаемое состояние блока (актуально для ступеней и подобных)
 * @returns Promise с результатом операции
 */
export async function placeBlockWithState(
    bot: Bot,
    targetPos: Vec3,
    blockName: string,
    desiredState: BlockPlacementState = {}
): Promise<PlacementResult> {
    // === Валидация входных данных ===
    if (!bot) {
        return {success: false, message: 'Bot instance is required'};
    }

    if (!targetPos || !(targetPos instanceof Vec3)) {
        return {success: false, message: 'targetPos must be an instance of Vec3'};
    }

    if (!blockName || typeof blockName !== 'string') {
        return {success: false, message: 'blockName must be a non-empty string'};
    }

    const isStairs = blockName.endsWith('_stairs');
    const {facing, half} = desiredState;

    // === Проверка досягаемости ===
    if (!isWithinReach(bot.entity.position, targetPos)) {
        return {
            success: false,
            message: 'Target position is out of reach',
            navigateTo: targetPos
        };
    }

    // === Поиск подходящего опорного блока и грани ===
    const adjacentChecks = [
        {offset: new Vec3(0, -1, 0), face: 1 as const, supportType: 'bottom' as const},
        {offset: new Vec3(0, 1, 0), face: 0 as const, supportType: 'top' as const},
        {offset: new Vec3(0, 0, -1), face: 5 as const, supportType: null as null},
        {offset: new Vec3(0, 0, 1), face: 4 as const, supportType: null as null},
        {offset: new Vec3(-1, 0, 0), face: 3 as const, supportType: null as null},
        {offset: new Vec3(1, 0, 0), face: 2 as const, supportType: null as null}
    ];

    let referenceBlock: Block | null = null;
    let face: number | null = null;
    let supportPos: Vec3 | null = null;

    for (const {offset, face: f, supportType} of adjacentChecks) {
        const pos = targetPos.plus(offset);
        const block = bot.blockAt(pos);

        if (block && block.type !== 0) {
            if (isStairs) {
                if (half === 'top' && supportType === 'top') {
                    referenceBlock = block;
                    face = f;
                    supportPos = pos;
                    break;
                }
                if (half === 'bottom' && supportType === 'bottom') {
                    referenceBlock = block;
                    face = f;
                    supportPos = pos;
                    break;
                }
                if (half == null) {
                    // Если half не задан — принимаем первую подходящую опору
                    referenceBlock = block;
                    face = f;
                    supportPos = pos;
                    break;
                }
            } else {
                referenceBlock = block;
                face = f;
                supportPos = pos;
                break;
            }
        }
    }

    if (!referenceBlock || face === null) {
        return {success: false, message: 'No adjacent solid block to place against'};
    }

    // === Определение точки взгляда ===
    let lookTarget: Vec3;

    if (isStairs && facing) {
        const oppositeVec = OPPOSITE_FACING[facing];
        if (!oppositeVec) {
            return {success: false, message: `Invalid facing direction: ${facing}`};
        }
        // Центр целевого блока + смещение внутрь (чтобы смотреть "в" блок с нужной стороны)
        lookTarget = targetPos.clone().offset(0.5, 0.5, 0.5).plus(oppositeVec.scaled(0.5));
    } else {
        // Обычный блок — смотрим в центр
        lookTarget = targetPos.clone().offset(0.5, 0.5, 0.5);
    }

    // === Коррекция по вертикали для half ===
    if (isStairs) {
        if (half === 'top') {
            lookTarget.y += 0.6; // клик в верхнюю половину опоры
        } else if (half === 'bottom') {
            lookTarget.y -= 0.1; // клик в нижнюю половину
        }
    }

    // === Поворот бота ===
    try {
        await bot.lookAt(lookTarget, true); // force = true
    } catch (err) {
        return {
            success: false,
            message: `Failed to rotate bot: ${(err as Error).message}`
        };
    }

    // === Установка блока ===
    // === Установка блока (новая сигнатура) ===
    try {
        await bot.placeBlock(referenceBlock!, new Vec3(0, 0, 0));
        return {
            success: true,
            message: 'Block placed successfully with desired state'
        };
    } catch (err) {
        return {
            success: false,
            message: `Block placement failed: ${(err as Error).message}`
        };
    }
}


