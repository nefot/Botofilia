// run_scripts.js

const {spawn} = require('child_process');

const fs = require('fs');


function readNamesFromFile(filename) {
    try {
        const data = fs.readFileSync(filename, 'utf8');
        const names = data.trim().split('\n');
        return names;
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
        return [];
    }
}

const filename = 'tt.txt'; // Укажите путь к вашему файлу с именами
const names = readNamesFromFile(filename);
console.log(names, names.length);


let scripts = ['npm run test'];
for (let i = 0; i < names.length; i++) {
    scripts.push (`node dist/main.js ${names[i].replace(/\r/g, '')} 0303708000 127.0.0.1 8000`); // Добавляем текущее имя к уже сохранённым
}
// Список всех скриптов для запуска

console.log(scripts)
// // Функция для запуска скриптов

function runScripts() {
    let delay = 0;
    scripts.forEach(script => {
        setTimeout(() => {
            const childProcess = spawn(script, {shell: true, stdio: 'inherit'});

            childProcess.on('close', (code) => {
                console.log(`Скрипт завершил выполнение с кодом ${code}: ${script}`);
            });

            childProcess.on('error', (err) => {
                console.error(`Произошла ошибка при запуске скрипта: ${err}`);
            });
        }, delay);
        delay += 5000; // Увеличиваем задержку на 20 секунд перед следующим запуском
    });
}

// Запускаем скрипты
runScripts();
