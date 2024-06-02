<div align="center">
  <h1>Mineflayer Movement</h1>
  <img src="https://img.shields.io/npm/v/mineflayer-movement?style=flat-square">
  <img src="https://img.shields.io/github/license/firejoust/mineflayer-movement?style=flat-square">
  <img src="https://img.shields.io/github/issues/firejoust/mineflayer-movement?style=flat-square">
  <img src="https://img.shields.io/github/issues-pr/firejoust/mineflayer-movement?style=flat-square">
</div>

### Features
- Плавное и реалистичное движение игрока к месту назначения
- Избегание препятствий, включая блоки, ямы, стены, игроков и т. д.
- Адаптация в реальном времени к активно изменяющимся условиям местности

### Описание
"mineflayer-movement" - это плагин mineflayer, который позволяет осуществлять навигацию по местности в реальном времени без использования сложного алгоритма поиска пути. Вместо следования заранее определенному пути он ведет себя аналогично настоящему игроку, используя лучи внутри определенного поля зрения для перемещения вокруг окружающей среды. Это дает боту преимущество в отзывчивости, ловкости и производительности.

Эвристика используется для модификации поведения, настраивая ответ бота на изменяющиеся условия и препятствия. Это делает его идеальным для ситуаций, где поиск пути не так эффективен, например, в PVP или при следовании за игроком. Однако, учитывая, что он не надежен на большие расстояния, его не следует использовать там, где важна точность (т. е. достижение определенной координаты)

### Эвристика
Вот общее объяснение того, как работает эвристика:
- Каждая эвристика вычислит "стоимость" между 0 и 1 на каждое вращение yaw в пределах поля зрения.
- Эвристики настраиваются с помощью "веса", действующего как множитель на конечную стоимость.
- Поворот с наименьшей стоимостью будет углом yaw, возвращаемым `getYaw`.

Примечание: аргумент `blend` в `getYaw` может использоваться для получения среднего значения **'𝑛'** смежных стоимостей поворота *(в обоих направлениях)* для всех поворотов, увеличивая надежность в поиске подходящего угла и уменьшая вероятность застревания *(неправильный выбор поворота)*

В настоящее время существует **четыре** эвристики, которые могут быть использованы:
1. Расстояние (проверяет наличие вертикального блочного препятствия в определенном направлении)
2. Опасность (проверяет наличие опасных блоков и опасной глубины в определенном направлении)
3. Близость (проверяет, насколько близко направление к целевым координатам)
4. Соответствие (проверяет, насколько близко направление к тому, куда смотрит бот в данный момент)

### Установка
- Используя npm, установите пакет в каталог вашего проекта:
```sh
npm install mineflayer-movement
```

### Example
```js
const mineflayer = require("mineflayer")
const movement = require("mineflayer-movement")

const bot = mineflayer.createBot({
    username: "bot"
})

bot.loadPlugin(movement.plugin)

bot.once("login", function init() {
    // load heuristics with default configuration
    const { Default } = bot.movement.goals
    bot.movement.setGoal(Default)
    // set control states
    bot.setControlState("forward", true)
    bot.setControlState("sprint", true)
    bot.setControlState("jump", true)
})

bot.once("spawn", function start() {
    bot.on("physicsTick", function tick() {
        const entity = bot.nearestEntity(entity => entity.type === "player")
        if (entity) {
            // set the proximity target to the nearest entity
            bot.movement.heuristic.get('proximity')
                .target(entity.position)
            // move towards the nearest entity
            const yaw = bot.movement.getYaw(240, 15, 1)
            bot.movement.steer(yaw)
        }
    })
})
```


## API
#### Типы
```typescript
type HeuristicType = 'distance' | 'danger' | 'proximity' | 'conformity';
type Vec3 = { x: number, y: number, z: number }; // https://github.com/PrismarineJS/node-vec3
```

#### Методы

```typescript
/**
 * Инициализирует новую цель на основе указанных эвристик.
 * @param heuristics Объект, сопоставляющий метки с эвристиками
 */
const goal = new bot.movement.Goal(heuristics);

/**
 * Сбрасывает и регистрирует все эвристики, используя указанную цель.
 * @param goal Цель, содержащая новые эвристики для регистрации
 */
bot.movement.setGoal(goal);

/**
 * Возвращает оптимальный угол поворота в любом данном такте.
 * @param fov Угол обзора игрока, в градусах (по умолчанию: 240)
 * @param rotations Сколько направлений проверить в пределах FOV (по умолчанию: 15)
 * @param blend Усредняет или "смешивает" смежные стоимости в радиусе N поворотов (по умолчанию: 1)
 */
const yaw = bot.movement.getYaw(fov?: number, rotations?: number, blend?: number): number;

/**
 * Абстракция bot.look; направляется к указанному углу поворота и возвращает обещание.
 * @param yaw Угол, к которому будет обращен игрок
 * @param force Осуществлять ли принудительное направление к заданному углу (по умолчанию: true)
 */
bot.movement.steer(yaw: number, force?: boolean): Promise<void>;
```

#### Методы - Эвристики

```typescript
/**
 * Возвращает новый экземпляр эвристики.
 * @param type Тип эвристики, которая назначается
 */
bot.movement.heuristic.new(type: HeuristicType);

/**
 * Регистрирует новый экземпляр эвристики и возвращает его.
 * @param type Тип эвристики, которая назначается
 * @param label Уникальный идентификатор эвристики; по умолчанию соответствует ее типу
 */
bot.movement.heuristic.register(type: HeuristicType, label?: string): Heuristic;

/**
 * Возвращает ранее зарегистрированную эвристику.
 * @param label Метка эвристики
 */
bot.movement.heuristic.get(label: string): Heuristic;
```

#### Конфигурация - Установщики
- Поведение эвристики, такие как радиус, вес и т. д., могут быть изменены, получив доступ к его установщикам.
- Важно хорошо понимать, как работает эвристика, прежде чем изменять значения по умолчанию.
```js
bot.movement.heuristic.register('distance')
  .weight(number)    // множитель для конечной стоимости
  .radius(number)    // насколько далеко будет идти каждый луч
  .height(number)    // максимальная высота, на которую лучи могут подниматься на блоках
  .count(number)     // сколько лучей в определенном направлении
  .avoid(object)     // объект сопоставления имен избегаемых блоков с булевыми значениями
  .increment(number) // расстояние между проверками блоков
  
bot.movement.heuristic.register('danger')
  .weight(number)     // множитель для конечной стоимости
  .radius(number)     // длина начального луча
  .height(number)     // максимальная высота, на которую лучи могут подниматься на блоках
  .descent(number)    // максимальная глубина, на которую лучи могут опускаться
  .depth(number)      // насколько глубоко лучи могут опускаться от блока
  .count(number)      // сколько лучей в определенном направлении
  .avoid(object)      // объект сопоставления имен избегаемых блоков с булевыми значениями
  .increment(number)  // расстояние между проверками блоков

bot.movement.heuristic.register('proximity')
  .weight(number) // множитель для конечной стоимости
  .target(Vec3)   // координаты ближайшей цели/пункта назначения
  .avoid(boolean) // избегать ли цель (меняет стоимость)

bot.movement.heuristic.register('conformity')
  .weight(number) // множитель для конечной стоимости
  .avoid(boolean) // избегать движения в том же направлении (меняет стоимость)
```
#### Конфигурация - Объекты
- В качестве альтернативы, эвристики могут быть настроены с использованием объекта ключ/значение для более краткого синтаксиса:
```js
// Пример!

bot.movement.heuristic.register('distance')
  .configure({
    weight?: number,
    radius?: number,
    height?: number,
    count?: number,
    increment?: number
  })
```
#### Конфигурация - Цели
- Цели обеспечивают эффективный способ объединения нескольких эвристик для достижения желаемого шаблона движения.
- Это упрощает перенастройку нескольких эвристик одновременно, особенно для изменяющихся условий местности.
```typescript
// Пример!

const MovementGoal = new bot.movement.Goal({
    'distance': bot.movement.heuristic.new('distance')
        .configure({
            weight?: number,
            radius?: number,
            height?: number,
            count?: number,
            increment?: number
        })
})

bot.movement.setGoal(MovementGoal)
```
