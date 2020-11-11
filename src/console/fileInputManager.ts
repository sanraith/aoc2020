import { Observable } from 'rxjs';
import * as fs from 'fs';
import * as path from 'path';

export default class FileInputManager {
    private inputPath: string;

    constructor(inputPath?: string) {
        this.inputPath = inputPath ?? './inputs/';
    }

    loadInputAsync(day: number): Observable<string> {
        return new Observable<string>(subscriber => {
            const twoDigitDay = day.toString().padStart(2, '0');
            const filePath = path.join(this.inputPath, `day${twoDigitDay}.txt`);
            fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
                if (err) {
                    subscriber.error(err);
                } else {
                    subscriber.next(data);
                }
                subscriber.complete();
            });
        });
    }
}
