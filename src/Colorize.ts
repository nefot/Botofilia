// export const colorize = new (class {
//     color = (code: number, ended = false, ...messages: any[]) =>
//         `\x1b[${code}m${messages.join(" ")}${ended ? "\x1b[0m" : ""}`;
//     black = this.color.bind(null, 30, false);
//     red = this.color.bind(null, 31, false);
//     green = this.color.bind(null, 32, false);
//     yellow = this.color.bind(this, 33, false);
//     blue = this.color.bind(this, 34, false);
//     magenta = this.color.bind(this, 35, false);
//     cyan = this.color.bind(this, 36, false);
//     white = this.color.bind(this, 37, false);
//     bgBlack = this.color.bind(this, 40, true);
//     bgRed = this.color.bind(this, 41, true);
//     bgGreen = this.color.bind(this, 42, true);
//     bgYellow = this.color.bind(this, 43, true);
//     bgBlue = this.color.bind(this, 44, true);
//     bgMagenta = this.color.bind(this, 45, true);
//     bgCyan = this.color.bind(this, 46, true);
//     bgWhite = this.color.bind(this, 47, true);
// })();
//
// const text = "yellow[привет] как дела green[?]";
//
// // Разбиваем строку на слова с учётом квадратных скобок
// const words = text.split(/(\[|\])/);
// console.log(words)
//
// // Проходим по каждому слову и окрашиваем его в соответствующий цвет
// const coloredText = words.map(word => {
//     if (word.startsWith("[") && word.endsWith("]")) {
//         // Если слово в квадратных скобках, оставляем его без изменений
//         return word;
//     } else {
//         // Иначе окрашиваем слово в соответствующий цвет
//         switch (word) {
//             case "yellow":
//                 return colorize.yellow(word);
//             case "green":
//                 return colorize.green(word);
//             default:
//                 return word;
//         }
//     }
// }).join("");
//
// console.log(coloredText);



