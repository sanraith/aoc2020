import * as fs from 'fs';
import * as path from 'path';

export default class FileInputManager {
    private inputPath: string;

    constructor(inputPath?: string) {
        this.inputPath = inputPath ?? './src/web/assets/input/';
    }

    loadInputAsync(day: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const twoDigitDay = day.toString().padStart(2, '0');
            const filePath = path.join(this.inputPath, `day${twoDigitDay}.txt`);
            fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}
