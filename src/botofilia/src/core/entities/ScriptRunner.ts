import {readFileSync} from "fs";

export class ScriptRunner {
    constructor(
        public filename: string,
        public host: string,
        public password: string,
        public port: number,
        public scripts: string[] = []
    ) {}

    readNamesFromFile(): string[] {
        const data = readFileSync(this.filename, 'utf8');
        return data.trim().split('\n');
    }

    createScripts(names: string[]): void {
        this.scripts = names.map(name => `node dist/main.js ${name.trim()} ${this.password} ${this.host} ${this.port}`);
    }
}
