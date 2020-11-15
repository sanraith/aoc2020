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
            let input = await inputManager.loadInputAsync(solutionInfo.day);
            solution.init(input);

            const result1 = await solution.part1Async();
            debug(`Result1: ${result1}`);
            const result2 = await solution.part2Async();
            debug(`Result2: ${result2}`);
        }
    } catch (e) {
        debug(`Error: ${e}`);
    }
}

app();
