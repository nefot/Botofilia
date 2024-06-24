export interface ILogger {
    logChatMessage(username: string, message: string): void;
    logEvent(event: string): void;
}
