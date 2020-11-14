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

            const state = await solution.part1Async().toPromise();
            switch (state.type) {
                case 'result':
                    debug(`Result: ${state.result}`);
                    break;
                case 'error':
                    debug(`Error: ${state.message}`);
                    break;
            }
        }
    } catch (e) {
        debug(`Error: ${e}`);
    }
}

app();
