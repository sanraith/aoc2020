import Debug from 'debug';
import { solutionManager } from '../core/solutionManager';
import FileInputManager from './fileInputManager';

const debug = Debug('aoc2020:console');

debug('Console runner working!');

async function app() {
    try {
        const inputManager = new FileInputManager();

        for (const solutionInfo of solutionManager.getSolutions()) {
            const solution = solutionInfo.create();
            const input = await inputManager.loadInputAsync(solutionInfo.day);
            solution.init(input);

            const result = await solution.part1Async();
            debug(`Result: ${result}`);
        }
    } catch (e) {
        debug(`Error: ${e}`);
    }
}

app();
