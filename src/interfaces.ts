interface ILogger {
    log(message: string): void;
    error(message: string): void;
}

interface IChatController {
    sendMessage(message: string): void;
    sendDirectMessage(player: string, message: string): void;
}

interface IMovementController {
    gotoBlock(x: number, y: number, z: number, username: string): string;
    comeToPlayer(username: string): string;
    stopBot(username: string): string;
}

interface ILogReader {
    readCoordinatesFromLog(log: string): Coordinates | null;
    readCoordinatesFromLogFile(filePath: string): Coordinates | null;
}

export { ILogger, IChatController, IMovementController, ILogReader };
