import {App} from './App';

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

