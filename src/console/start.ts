import { solutionManager } from '../core/solutionManager';
import { SolutionError, SolutionResult } from '../core/solutionProgress';
import FileInputManager from './fileInputManager';

let lastConsoleLineLength = 0;

function consoleRewrite(message: string, newLine: boolean = false) {
    process.stdout.write(''.padStart(lastConsoleLineLength, ' ') + '\r');
    lastConsoleLineLength = message.length;
    process.stdout.write('\r' + message + (newLine ? '\n' : ''));
}

function consoleRewriteLine(message: string) {
    consoleRewrite(message, true);
}

async function app() {
    try {
        const inputManager = new FileInputManager();

        for (const solutionInfo of solutionManager.getSolutions()) {
            const solution = solutionInfo.create();
            let input = await inputManager.loadInputAsync(solutionInfo.day);
            solution.init(input);

            console.log(`Day ${solutionInfo.day} - ${solutionInfo.title}`);
            for (let part of [1, 2]) {
                await new Promise((resolve, _) => {
                    let result: string;
                    let resultState: SolutionResult | SolutionError;
                    consoleRewrite(`Part ${part}...`);
                    solution.solveWithProgressAsync(part).subscribe({
                        next: (state) => {
                            switch (state.type) {
                                case 'result': resultState = state; result = state.result; break;
                                case 'error': resultState = state; result = 'Error - ' + state.message; break;
                                case 'progress':
                                    consoleRewrite(`Part ${part} (${state.timeMs}+ ms): ${(state.percentage * 100).toFixed(2)} %`);
                                    break;
                            }
                        },
                        complete: () => {
                            consoleRewriteLine(`Part ${part} (${resultState.timeMs} ms): ${result}`);
                            resolve();
                        }
                    });
                });
            }
            console.log();
        }
    } catch (e) {
        console.log(`Error: ${e}`);
    }
}

app();
