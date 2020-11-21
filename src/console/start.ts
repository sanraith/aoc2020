import { solutionManager } from '../core/solutionManager';
import { SolutionError, SolutionResult } from '../core/solutionProgress';
import FileInputManager from './fileInputManager';

async function app() {
    try {
        const inputManager = new FileInputManager();

        for (const solutionInfo of solutionManager.getSolutions()) {
            const solution = solutionInfo.create();
            let input = await inputManager.loadInputAsync(solutionInfo.day);
            solution.init(input);

            console.log(`Day ${solutionInfo.day} - ${solutionInfo.title}`);
            for (let part of [1, 2]) {
                const state = <SolutionResult | SolutionError>(await solution.solveWithProgressAsync(part).toPromise());
                let result = '';
                switch (state.type) {
                    case 'result': result = state.result; break;
                    case 'error': result = 'Error - ' + state.message; break;
                }
                if (/\r\n?|\n/g.test(result)) {
                    result = '\n' + result; // Start multiline results on the next line
                }
                console.log(`Part ${part} (${state.timeMs} ms): ${result}`);
            }
            console.log();
        }
    } catch (e) {
        console.log(`Error: ${e}`);
    }
}

app();
