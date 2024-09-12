export interface IScriptRunner {
    readNamesFromFile(): string[];
    createScripts(names: string[]): void;
}
