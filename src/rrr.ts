import * as fs from 'fs';
import * as path from 'path';

function printFilesContents(directory: string): void {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${directory}: ${err.message}`);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directory, file.name);

            if (file.isDirectory()) {
                printFilesContents(filePath);
            } else {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        console.error(`Error reading file ${filePath}: ${err.message}`);
                        return;
                    }

                    console.log(` ${file.name}`);

                    console.log("\n" + "=".repeat(50) + "\n");

                    console.log(data);
                    console.log("\n" + "=".repeat(50) + "\n");
                });
            }
        });
    });
}

// Укажите путь к директории, которую хотите обойти
const directory: string = "C:\\Users\\artyo\\mineflayer_bot\\src";
printFilesContents(directory);
