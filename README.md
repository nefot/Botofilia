# Botofilia

Botofilia — это проект для создания и управления ботами Minecraft с использованием библиотеки Mineflayer. Этот проект включает в себя функционал для подключения, переподключения и управления ботами через различные сервисы и контроллеры.

## Структура проекта

```plaintext
├── App.ts
├── index.ts
├── rrr.ts
├── core
│   ├── dtos
│   │   └── MinecraftBotDTO.ts
│   ├── entities
│   │   └── MinecraftBot.ts
│   ├── handlers
│   │   └── ChatHandler.ts
│   ├── interfaces
│   │   └── ChatHandler.ts
│   │   └── ChatService.ts
│   │   └── Logger.ts
│   │   └── MinecraftBotRepository.ts
│   │   └── ReconnectService.ts
│   ├── movements
│   │   └── MovementHandler.ts
│   ├── services
│   │   └── ChatService.ts
│   │   └── LoggerService.ts
│   │   └── ReconnectServiceImpl.ts
├── infrastructure
│   └── repositories
│       └── MinecraftBotRepositoryImpl.ts
└── ui
    └── controllers
        └── MinecraftBotController.ts
```

## Установка

1. Клонируйте репозиторий:

    ```bash
    git clone https://github.com/yourusername/botofilia.git
    cd botofilia
    ```

2. Установите зависимости:

    ```bash
    npm install
    ```

## Использование

### Запуск проекта

Для запуска проекта используйте следующую команду:

```bash
npm start <username> <password> <host> <chat_logger> <port>
```

Пример:

```bash
npm start bot_username bot_password localhost true 25565
```

### Основные классы и их функции

#### `App.ts`

Главный класс приложения, отвечающий за инициализацию и запуск ботов.

#### `MinecraftBotDTO.ts`

Data Transfer Object (DTO) для передачи данных о ботах Minecraft.

#### `MinecraftBot.ts`

Класс, представляющий собой бота для Minecraft.

#### `ChatHandler.ts`

Обработчик сообщений чата.

#### `ChatService.ts`

Сервис для обработки сообщений чата.

#### `Logger.ts`

Интерфейс для логирования сообщений и событий.

#### `ReconnectService.ts`

Интерфейс для управления подключением и переподключением ботов.

#### `MovementHandler.ts`

Обработчик движений бота.

#### `ReconnectServiceImpl.ts`

Реализация интерфейса `ReconnectService`, включающая методы для подключения и переподключения ботов.

#### `MinecraftBotRepositoryImpl.ts`

Реализация репозитория для управления ботами.

#### `MinecraftBotController.ts`

Контроллер для управления ботами и их взаимодействия с другими сервисами.

### Примеры использования

#### Создание и подключение бота

```typescript
import { App } from './App';

async function main(): Promise<void> {
    try {
        const app = new App();
        await app.start();
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

main().then(() => {
    console.log('The main function completed successfully.');
}).catch((error) => {
    console.error('An error occurred:', error);
});
```

#### Логирование событий и сообщений

```typescript
import { LoggerService } from './core/services/LoggerService';

const logger = new LoggerService();
logger.logChatMessage('user', 'Hello, world!');
logger.logEvent('Bot connected');
```

## Вклад в проект

Если вы хотите внести вклад в проект, пожалуйста, создайте форк репозитория, внесите свои изменения и создайте pull request. Мы рассмотрим ваши предложения и интегрируем их в основной проект.

## Лицензия

Этот проект лицензирован под лицензией MIT. Подробности см. в файле `LICENSE`.

## Контакты

Если у вас есть вопросы или предложения, пожалуйста, свяжитесь с нами по адресу artyom27000@mail.ru