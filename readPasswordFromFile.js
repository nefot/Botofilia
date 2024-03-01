const fs = require('fs');

// Путь к файлу с паролем
const passwordFilePath = 'password.txt';

// Функция для чтения пароля из файла
function readPasswordFromFile(callback) {
    fs.readFile(passwordFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла с паролем:', err);
            callback(err, null);
            return;
        }

        // Присвоение считанного пароля переменной password
        const password = data.trim(); // Удаляем пробельные символы из начала и конца строки, если они есть

        // Передача пароля в качестве аргумента функции обратного вызова
        callback(null, password);
    });
}

module.exports = readPasswordFromFile;