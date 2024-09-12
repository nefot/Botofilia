import {App} from './App';
import {ScriptRunnerController} from './ui/controllers/ScriptRunnerController';

let scriptRunnerController = new ScriptRunnerController();

async function main(): Promise<void> {
    try {
        scriptRunnerController.generateNames();
        scriptRunnerController.runScripts();
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

