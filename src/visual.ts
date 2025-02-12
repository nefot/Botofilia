import fs from 'fs';
import path from 'path';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';

const logsDir = path.join(__dirname, '2025-02');
const logFiles = fs.readdirSync(logsDir).filter(file => file.match(/^\d+$/));

logFiles.forEach(logFile => {
    const logFilePath = path.join(logsDir, logFile);
    const logData = fs.readFileSync(logFilePath, 'utf-8');

    const timeStamps: string[] = [];
    const playerCounts: number[] = [];

    const logLines = logData.split('\n');
    for (const line of logLines) {
        const timeMatch = line.match(/\[(.*?)\]/);
        const playersMatch = line.match(/Онлайн: (\d+)\/\d+/);

        if (timeMatch && playersMatch) {
            timeStamps.push(timeMatch[1]);
            playerCounts.push(parseInt(playersMatch[1], 10));
        }
    }

    const width = 800;
    const height = 400;
    const chartCallback = () => {};
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

    const configuration = {
        type: 'line',
        data: {
            labels: timeStamps,
            datasets: [{
                label: 'Количество игроков онлайн',
                data: playerCounts,
                borderColor: 'blue',
                backgroundColor: 'rgba(0, 0, 255, 0.3)',
                fill: true,
            }],
        },
        options: {
            responsive: false,
            plugins: {
                legend: {
                    display: true,
                },
            },
        },
    };

    chartJSNodeCanvas.renderToBuffer(configuration).then((image) => {
        const outputFilePath = path.join(__dirname, `player_chart_${logFile}.png`);
        fs.writeFileSync(outputFilePath, image);
        console.log(`График сохранен как ${outputFilePath}`);
    });
});
