// scripts/pin-versions.js
const fs = require('fs');
const cp = require('child_process');

function runNpmLsJson() {
  try {
    return JSON.parse(cp.execSync('npm ls --depth=0 --json', { encoding: 'utf8' }));
  } catch (err) {
    // npm ls возвращает ненулевой код при некоторых несовпадениях, но stdout часто содержит JSON — попытка взять его
    if (err.stdout) {
      try { return JSON.parse(err.stdout.toString()); } catch (e) { /* fallthrough */ }
    }
    console.error('Не удалось выполнить `npm ls`. Ошибка:', err.message || err);
    process.exit(1);
  }
}

function main() {
  const pkgPath = 'package.json';
  if (!fs.existsSync(pkgPath)) {
    console.error('package.json не найден в текущей папке.');
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const ls = runNpmLsJson();

  const sections = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  let changed = false;

  sections.forEach(section => {
    if (!pkg[section]) return;
    Object.keys(pkg[section]).forEach(name => {
      const installed = ls.dependencies && ls.dependencies[name] && ls.dependencies[name].version;
      if (installed) {
        if (pkg[section][name] !== installed) {
          console.log(`${section}: ${name}  ${pkg[section][name]}  ->  ${installed}`);
          pkg[section][name] = installed;
          changed = true;
        }
      } else {
        console.warn(`${section}: пакет "${name}" не найден в npm ls — пропускаю.`);
      }
    });
  });

  if (!changed) {
    console.log('Версии в package.json уже соответствуют установленным версиям.');
    return;
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log('package.json обновлён. Проверь изменения и закоммить их.');
}

main();
