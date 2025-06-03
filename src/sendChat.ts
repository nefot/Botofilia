import WebSocket from 'ws';

type ChatEvent = {
    event: boolean;
    data: number;
    player: string;
    message: string;
};

export function sendChatEvent(url: string = 'ws://localhost:9000', event: ChatEvent): void {
    const socket = new WebSocket(url);

    socket.on('open', () =>
    {
        socket.send(JSON.stringify(event));
        console.log('Событие отправлено');
        socket.close();
    });

    socket.on('error', (err) =>
    {
        console.error('Ошибка WebSocket:', err);
    });
}
