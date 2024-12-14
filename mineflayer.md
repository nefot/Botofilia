<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Содержание**  *сгенерировано с помощью [DocToc](https://github.com/thlorenz/doctoc)*

- [API](#api)
    - [Перечисления](#перечисления)
        - [minecraft-data](#minecraft-data)
        - [mcdata.blocks](#mcdata-blocks)
        - [mcdata.items](#mcdata-items)
        - [mcdata.materials](#mcdata-materials)
        - [mcdata.recipes](#mcdata-recipes)
        - [mcdata.instruments](#mcdata-instruments)
        - [mcdata.biomes](#mcdata-biomes)
        - [mcdata.entities](#mcdata-entities)
    - [Классы](#классы)
        - [vec3](#vec3)
        - [mineflayer.Location](#mineflayerlocation)
        - [Сущность](#Entity)
            - [Данные об игроке](#Данные-о-скине-игрока)
        - [Блок](#Block)
        - [Биом](#Biome)
        - [Предмет](#Item)
        - [windows.Window (базовый класс)](#windowswindow-базовый-класс)
            - [window.deposit(itemType, metadata, count, nbt)](#windowdeposititemtype-metadata-count-nbt)
            - [window.withdraw(itemType, metadata, count, nbt)](#windowwithdrawitemtype-metadata-count-nbt)
            - [window.close()](#windowclose)
        - [Рецепт](#Recipe)
        - [mineflayer.Container](#mineflayercontainer)
        - [mineflayer.Furnace](#mineflayerfurnace)
            - [furnace "update"](#furnace-update)
            - [furnace.takeInput()](#furnacetakeinput)
            - [furnace.takeFuel()](#furnacetakefuel)
            - [furnace.takeOutput()](#furnacetakeoutput)
            - [furnace.putInput(itemType, metadata, count)](#furnaceputinputitemtype-metadata-count)
            - [furnace.putFuel(itemType, metadata, count)](#furnaceputfuelitemtype-metadata-count)
            - [furnace.inputItem()](#furnaceinputitem)
            - [furnace.fuelItem()](#furnacefuelitem)
            - [furnace.outputItem()](#furnaceoutputitem)
            - [furnace.fuel](#furnacefuel)
            - [furnace.progress](#furnaceprogress)
        - [mineflayer.EnchantmentTable](#mineflayerenchantmenttable)
            - [enchantmentTable "ready"](#enchantmenttable-ready)
            - [enchantmentTable.targetItem()](#enchantmenttabletargetitem)
            - [enchantmentTable.xpseed](#enchantmenttablexpseed)
            - [enchantmentTable.enchantments](#enchantmenttableenchantments)
            - [enchantmentTable.enchant(choice)](#enchantmenttableenchantchoice)
            - [enchantmentTable.takeTargetItem()](#enchantmenttabletaketargetitem)
            - [enchantmentTable.putTargetItem(item)](#enchantmenttableputtargetitemitem)
            - [enchantmentTable.putLapis(item)](#enchantmenttableputlapisitem)
        - [mineflayer.anvil](#mineflayeranvil)
            - [anvil.combine(itemOne, itemTwo[, name])](#anvilcombineitemone-itemtwo-name)
            - [anvil.combine(item[, name])](#anvilcombineitem-name)
            - [villager "ready"](#villager-ready)
            - [villager.trades](#villagertrades)
            - [villager.trade(tradeIndex, [times])](#villagertradetradeindex-times)
        - [mineflayer.ScoreBoard](#mineflayerscoreboard)
            - [ScoreBoard.name](#scoreboardname)
            - [ScoreBoard.title](#scoreboardtitle)
            - [ScoreBoard.itemsMap](#scoreboarditemsmap)
            - [ScoreBoard.items](#scoreboarditems)
        - [mineflayer.Team](#mineflayerteam)
            - [Team.name](#teamname)
            - [Team.friendlyFire](#teamfriendlyfire)
            - [Team.nameTagVisibility](#teamnametagvisibility)
            - [Team.collisionRule](#teamcollisionrule)
            - [Team.color](#teamcolor)
            - [Team.prefix](#teamprefix)
            - [Team.suffix](#teamsuffix)
            - [Team.members](#teammembers)
        - [mineflayer.BossBar](#mineflayerbossbar)
            - [BossBar.title](#bossbartitle)
            - [BossBar.health](#bossbarhealth)
            - [BossBar.dividers](#bossbardividers)
            - [BossBar.entityUUID](#bossbarentityuuid)
            - [BossBar.shouldDarkenSky](#bossbarshoulddarkensky)
            - [BossBar.isDragonBar](#bossbarisdragonbar)
            - [BossBar.createFog](#bossbarcreatefog)
            - [BossBar.color](#bossbarcolor)
        - [mineflayer.Particle](#mineflayerparticle)
            - [Particle.id](#particleid)
            - [Particle.name](#particlename)
            - [Particle.position](#particleposition)
            - [Particle.offset](#particleoffset)
            - [Particle.longDistanceRender](#particlelongdistancerender)
            - [Particle.count](#particlecount)
            - [Particle.movementSpeed](#particlemovementspeed)
    - [Бот](#бот)
        - [mineflayer.createBot(options)](#mineflayercreatebotoptions)
        - [Свойства](#свойства)
            - [bot.registry](#botregistry)
            - [bot.world](#botworld)
                - [world "blockUpdate" (oldBlock, newBlock)](#world-blockupdate-oldblock-newblock)
                - [world "blockUpdate:(x, y, z)" (oldBlock, newBlock)](#world-blockupdatex-y-z-oldblock-newblock)
            - [bot.entity](#botentity)
            - [bot.entities](#botentities)
            - [bot.username](#botusername)
            - [bot.spawnPoint](#botspawnpoint)
            - [bot.heldItem](#bothelditem)
            - [bot.usingHeldItem](#botusinghelditem)
            - [bot.game.levelType](#botgameleveltype)
            -
## Перечисления

Эти перечисления хранятся в независимом от языка проекте [minecraft-data](https://github.com/PrismarineJS/minecraft-data) и используются через [node-minecraft-data](https://github.com/PrismarineJS/node-minecraft-data).

### minecraft-data
Данные доступны в модуле [node-minecraft-data](https://github.com/PrismarineJS/node-minecraft-data)

`require('minecraft-data')(bot.version)` предоставляет к ним доступ.

### mcdata.blocks
Блоки, индексированные по идентификатору.

### mcdata.items
Предметы, индексированные по идентификатору.

### mcdata.materials

Ключ - это материал. Значение - это объект, где ключ - это идентификатор инструмента, а значение - это множитель эффективности.

### mcdata.recipes
Рецепты, индексированные по идентификатору.

### mcdata.instruments
Инструменты, индексированные по идентификатору.

### mcdata.biomes
Биомы, индексированные по идентификатору.

### mcdata.entities
Сущности, индексированные по идентификатору.

## Классы

### vec3

Смотрите [andrewrk/node-vec3](https://github.com/andrewrk/node-vec3)

Все точки в mineflayer предоставляются как экземпляры этого класса.

* x - юг
* y - вверх
* z - запад

Функции и методы, которым требуется аргумент точки, принимают экземпляры `Vec3`, а также массив с 3 значениями и объект с свойствами `x`, `y` и `z`.

### mineflayer.Location

### Entity

Сущности представляют игроков, мобов и объекты. Они генерируются во многих событиях, и вы можете получить доступ к своей сущности с помощью `bot.entity`. Смотрите [prismarine-entity](https://github.com/PrismarineJS/prismarine-entity)

#### Данные о скине игрока

Данные о скине хранятся в свойстве `skinData` объекта игрока, если они присутствуют.

```js
// player.skinData
{
  url: 'http://textures.minecraft.net/texture/...',
  model: 'slim' // или 'classic'
}

```
### Block

Смотрите [prismarine-block](https://github.com/PrismarineJS/prismarine-block)

Также `block.blockEntity` - это дополнительное поле с данными о блоке в качестве `Object`. Данные в этом поле различаются в зависимости от версии.
```js
// Пример block.blockEntity от 1.19
{
  GlowingText: 0, // 0 для false, 1 для true
  Color: 'black',
  Text1: '{"text":"1"}',
  Text2: '{"text":"2"}',
  Text3: '{"text":"3"}',
  Text4: '{"text":"4"}'
}
```

Примечание: если вам нужно получить обычный текст на табличке, вы можете использовать [`block.getSignText()`](https://github.com/PrismarineJS/prismarine-block/blob/master/doc/API.md#sign) вместо нестабильных данных blockEntity.
```java
> block = bot.blockAt(new Vec3(0, 60, 0)) // предположим, что здесь находится табличка
> block.getSignText()
[ "Текст на лицевой стороне\nПривет, мир", "Текст на обратной стороне\nПривет, мир" ]
```

### Biome

Смотрите [prismarine-biome](https://github.com/PrismarineJS/prismarine-biome)

### Item

Смотрите [prismarine-item](https://github.com/PrismarineJS/prismarine-item)

### windows.Window (базовый класс)

Смотрите [prismarine-windows](https://github.com/PrismarineJS/prismarine-windows)

#### window.deposit(itemType, metadata, count, nbt)

Эта функция возвращает `Promise`, который завершается без аргументов, когда происходит депозит.

* `itemType` - числовой идентификатор предмета
* `metadata` - числовое значение. `null` означает соответствие чему угодно.
* `count` - сколько внести. `null` означает 1.
* `nbt` - соответствие данных nbt. `null` означает игнорировать nbt.

#### window.withdraw(itemType, metadata, count, nbt)

Эта функция возвращает `Promise`, который завершается без аргументов, когда происходит изъятие. Выбрасывает ошибку, если в инвентаре бота нет свободного места.

* `itemType` - числовой идентификатор предмета
* `metadata` - числовое значение. `null` означает соответствие чему угодно.
* `count` - сколько изъять. `null` означает 1.
* `nbt` - соответствие данных nbt. `null` означает игнорировать nbt.

#### window.close()

### Recipe

Смотрите [prismarine-recipe](https://github.com/PrismarineJS/prismarine-recipe)

### mineflayer.Container

Расширяет windows.Window для сундуков, диспенсеров и т. д...
Смотрите `bot.openContainer(chestBlock or minecartchestEntity)`.

### mineflayer.Furnace

Расширяет windows.Window для печей, кузнечных печей и т. д...
Смотрите `bot.openFurnace(furnaceBlock)`.

#### furnace "update"

Срабатывает, когда `furnace.fuel` и/или `furnace.progress` обновляются.

#### furnace.takeInput()

Эта функция возвращает `Promise`, который завершается с `item` в качестве аргумента по завершении.

#### furnace.takeFuel()

Эта функция возвращает `Promise`, который завершается с `item` в качестве аргумента по завершении.

#### furnace.takeOutput()

Эта функция возвращает `Promise`, который завершается с `item` в качестве аргумента по завершении.

#### furnace.putInput(itemType, metadata, count)

Эта функция возвращает `Promise`, который завершается без аргументов по завершении.

#### furnace.putFuel(itemType, metadata, count)

Эта функция возвращает `Promise`, который завершается без аргументов по завершении.

#### furnace.inputItem()

Возвращает экземпляр `Item`, который является входом.

#### furnace.fuelItem()

#### furnace.outputItem()

Возвращает экземпляр `Item`, который является результатом.

#### furnace.fuel

Сколько топлива осталось между 0 и 1.

#### furnace.progress

Сколько приготовлен вход между 0 и 1.

### mineflayer.EnchantmentTable

Расширяет windows.Window для зачарованных столов.
Смотрите `bot.openEnchantmentTable(enchantmentTableBlock)`.

#### enchantmentTable "ready"

Срабатывает, когда `enchantmentTable.enchantments` полностью заполнены, и вы можете сделать выбор, вызвав `enchantmentTable.enchant(choice)`.

#### enchantmentTable.targetItem()

Получает целевой предмет. Это и вход, и выход зачарованного стола.

#### enchantmentTable.xpseed

16-битный xpseed, отправленный сервером.

#### enchantmentTable.enchantments

Массив длины 3, которые представляют собой 3 зачарования на выбор.
`level` может быть `-1`, если сервер еще не отправил данные.

Выглядит так:

```js
[
  {
    level: 3
  },
  {
    level: 4
  },
  {
    level: 9
  }
]
```

#### enchantmentTable.enchant(choice)

Эта функция возвращает `Promise`, с `item` в качестве аргумента, когда предмет был зачарован.

* `choice` - [0-2], индекс зачарования, которое вы хотите выбрать.

#### enchantmentTable.takeTargetItem()

Эта функция возвращает `Promise`, с `item` в качестве аргумента по завершении.


#### enchantmentTable.putTargetItem(item)

Эта функция возвращает `Promise`, без аргументов по завершении.


#### enchantmentTable.putLapis(item)

Эта функция возвращает `Promise`, без аргументов по завершении.


### mineflayer.anvil

Расширяет windows.Window для наковален.
Смотрите `bot.openAnvil(anvilBlock)`.

#### anvil.combine(itemOne, itemTwo[, name])

Эта функция возвращает `Promise`, без аргументов по завершении.


#### anvil.combine(item[, name])

Эта функция возвращает `Promise`, без аргументов по завершении.


#### villager "ready"

Срабатывает, когда `villager.trades` загружены.

#### villager.trades

Массив сделок.

Выглядит так:

```js
[
  {
    firstInput: Item,
    output: Item,
    hasSecondItem: false,
    secondaryInput: null,
    disabled: false,
    tooluses: 0,
    maxTradeuses: 7
  },
  {
    firstInput: Item,
    output: Item,
    hasSecondItem: false,
    secondaryInput: null,
    disabled: false,
    tooluses: 0,
    maxTradeuses: 7
  },
  {
    firstInput: Item,
    output: Item,
    hasSecondItem: true,
    secondaryInput: Item,
    disabled: false,
    tooluses: 0,
    maxTradeuses: 7
  }
]  
```







#### villager.trade(tradeIndex, [times])
Это то же самое, что и [bot.trade(villagerInstance, tradeIndex, [times])](#bottradevillagerinstance-tradeindex-times)

### mineflayer.ScoreBoard

#### ScoreBoard.name

Имя доски счета.

#### ScoreBoard.title

Заголовок доски счета (не всегда равен имени)

#### ScoreBoard.itemsMap

Объект со всеми элементами в доске счета
```js
{
  wvffle: { name: 'wvffle', value: 3 },
  dzikoysk: { name: 'dzikoysk', value: 6 }
}
```

#### ScoreBoard.items

Массив со всеми отсортированными элементами в доске счета
```js
[
  { name: 'dzikoysk', value: 6 },
  { name: 'wvffle', value: 3 }
]
```

### mineflayer.Team

#### Team.name

Имя команды

#### Team.friendlyFire

#### Team.nameTagVisibility

Одно из `always`, `hideForOtherTeams`, `hideForOwnTeam`

#### Team.collisionRule

Одно из `always`, `pushOtherTeams`, `pushOwnTeam`

#### Team.color

Цвет (или форматирование) имени команды, например, `dark_green`, `red`, `underlined`

#### Team.prefix

Компонент чата, содержащий префикс команды

#### Team.suffix

Компонент чата, содержащий суффикс команды

#### Team.members

Массив членов команды. Имена пользователей для игроков и UUID для других сущностей.

### mineflayer.BossBar

#### BossBar.title

Заголовок панели босса, экземпляр ChatMessage

#### BossBar.health

Процент здоровья босса, от `0` до `1`

#### BossBar.dividers

Количество делений панели босса, одно из `0`, `6`, `10`, `12`, `20`

#### BossBar.entityUUID

UUID сущности панели босса

#### BossBar.shouldDarkenSky

Определяет, затемнять ли небо

#### BossBar.isDragonBar

Определяет, является ли панель босса панелью дракона

#### BossBar.createFog

Определяет, создает ли панель босса туман

#### BossBar.color

Определяет цвет панели босса, одно из `pink`, `blue`, `red`, `green`, `yellow`, `purple`, `white`

### mineflayer.Particle

#### Particle.id

ID частицы, как определено в [протоколе](https://wiki.vg/Protocol#Particle)

#### Particle.name

Имя частицы, как определено в [протоколе](https://wiki.vg/Protocol#Particle)

#### Particle.position

Экземпляр Vec3, где была создана частица

#### Particle.offset

Экземпляр Vec3 смещения частицы

#### Particle.longDistanceRender

Определяет, нужно ли принудительно отображать частицу, несмотря на настройки клиента по частицам, и увеличивает максимальное расстояние просмотра с 256 до 65536

#### Particle.count

Количество созданных частиц

#### Particle.movementSpeed

Скорость частицы в случайном направлении

