import { Bot, BotOptions, createBot } from 'mineflayer'
import WebSocket from 'ws'
import { Logger } from './logger'
import { executeCommand } from './executeCommand'

// Неймспейс с настройками
namespace Settings {
    export const args: string[] = process.argv.slice(2)
    export const [username, password, host, port] = args
    export const botOptions: BotOptions = {
        host,
        port: port ? parseInt(port) : 25565,
        username,
        password,
        version: '1.21.8'
    }
    export const wsUrl: string = 'ws://localhost:8080'   // сервер команд
    export const tgBridgeUrl: string = 'ws://localhost:9000' // сервер для Телеги
}

const logger = new Logger(Settings.username)
let bot: Bot
let ws: WebSocket
let tgBridge: WebSocket // <-- сюда шлём чаты в Телегу

function createBotInstance(): void {
    bot = createBot(Settings.botOptions)

    bot.on('login', () => {
        bot.chat(`/register ${Settings.password} ${Settings.password}`)
        bot.chat(`/login ${Settings.password}`)
        logger.logEvent(`Бот подключился к серверу ${Settings.host}:${Settings.botOptions.port}`)
    })

    bot.on('error', (err) => {
        logger.error(`Ошибка: ${err}`)
    })

    bot.on('end', (reason) => {
        logger.logEvent(`Бот отключился: ${reason}. Переподключение через 5 секунд...`)
        setTimeout(createBotInstance, 5000)
    })

    bot.on('kicked', (reason) => {
        logger.error(`Бот кикнут: ${reason}`)
    })

    // Получение сообщений чата
    bot.on('messagestr', (message: string) => {
        const match = message.match(/<([^>]+)> (.+)/)
        if (match) {
            const [, player, msg] = match
            logger.logMessage(player, msg)

            // Отправляем в Телегу через WebSocket
            sendToTgBridge({
                player,
                message: msg
            })
        } else {
            logger.logEvent(message)
            sendToTgBridge({
                player: '-1',
                message
            })
        }
    })

    bot.on('playerJoined', (player) => {
        const text = `Игрок ${player.username} подключился к игре`
        logger.logEvent(text)
        sendToTgBridge({ player: '-1', message: text })
    })

    bot.on('playerLeft', (player) => {
        const text = `Игрок ${player.username} покинул игру`
        logger.logEvent(text)
        sendToTgBridge({ player: '-1', message: text })
    })
}

// Функция для отправки событий в Телеграм-сервер
function sendToTgBridge(event: { player: string; message: string }) {
    try {
        if (tgBridge && tgBridge.readyState === WebSocket.OPEN) {
            tgBridge.send(JSON.stringify(event))
        }
    } catch (err) {
        logger.error(`Ошибка отправки в tgBridge: ${err}`)
    }
}

// ===== WebSocket сервер команд (ws://localhost:8080) =====
let reconnectAttempts = 0
const maxReconnectAttempts = 5

function initializeWebSocket(): void {
    const wsUrl = reconnectAttempts === 0 ? Settings.wsUrl : 'ws://192.168.134.221:8080'
    ws = new WebSocket(wsUrl)

    ws.on('open', () => {
        logger.logEvent(`Подключен к серверу команд: ${wsUrl}`)
        reconnectAttempts = 0
        ws.send(`${Settings.username} register`)
    })

    ws.on('message', (data: WebSocket.RawData) => {
        try {
            const message = data.toString().trim()
            if (message.startsWith('Ошибка:')) {
                logger.error(message)
                return
            }
            if (message.startsWith('Бот') && message.includes('успешно зарегистрирован')) {
                logger.logEvent(message)
                return
            }
            executeCommand(message, logger, bot)
        } catch (err) {
            logger.error(`Ошибка обработки команды: ${err}`)
        }
    })

    ws.on('close', () => {
        logger.logEvent(`Соединение с сервером команд закрыто.`)
        if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++
            setTimeout(() => {
                logger.logEvent(`Попытка переподключения #${reconnectAttempts}...`)
                initializeWebSocket()
            }, 5000)
        } else {
            logger.error(`Превышено максимальное количество попыток переподключения.`)
        }
    })

    ws.on('error', (err) => {
        logger.error(`Ошибка WebSocket: ${err}`)
    })
}

// ===== Подключение к мосту для Телеги (ws://localhost:9000) =====
function initializeTgBridge(): void {
    tgBridge = new WebSocket(Settings.tgBridgeUrl)

    tgBridge.on('open', () => {
        logger.logEvent(`Подключен к tgBridge: ${Settings.tgBridgeUrl}`)
    })

    tgBridge.on('error', (err) => {
        logger.error(`Ошибка tgBridge: ${err}`)
    })
    tgBridge.on('message', (data: WebSocket.RawData) => {
        try {
            const event = JSON.parse(data.toString())

            if (event.type === 'chat_from_tg') {
                // Сообщение из Telegram → отправляем в игровой чат
                bot.chat(`${event.text}`)
                logger.logEvent(`TG -> MC: <${event.author}> ${event.text}`)
            }
        } catch (err) {
            logger.error(`Ошибка обработки сообщения из tgBridge: ${err}`)
        }
    })


    tgBridge.on('close', () => {
        logger.logEvent(`tgBridge соединение закрыто. Переподключение через 5 сек...`)
        setTimeout(initializeTgBridge, 5000)
    })
}

// Основная функция для запуска бота
function main(): void {
    if (Settings.args.length < 3) {
        console.error('Использование: node main.ts <никнейм> <пароль> <адрес> [порт]')
        process.exit(1)
    }

    createBotInstance()
    initializeWebSocket()
    initializeTgBridge()
}

// Запуск программы
main()
