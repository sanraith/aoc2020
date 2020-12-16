import { solutionManager } from '../core/solutionManager';
import { SolutionError, SolutionResult } from '../core/solutionProgress';
import FileInputManager from './fileInputManager';
import { ArgumentParser } from 'argparse';

let lastConsoleLineLength = 0;

function consoleRewrite(message: string, newLine: boolean = false) {
    process.stdout.write('\r'.padEnd(lastConsoleLineLength, ' '));
    lastConsoleLineLength = message.length + 1;
    process.stdout.write('\r' + message + (newLine ? '\n' : ''));
}

function consoleRewriteLine(message: string) {
    consoleRewrite(message, true);
}

async function app(days: number[]) {
    try {
        const inputManager = new FileInputManager();

        for (let day of days) {
            const solutionInfo = solutionManager.getSolutionsByDay().get(day);
            const solution = solutionInfo.create();
            let input = await inputManager.loadInputAsync(solutionInfo.day);
            solution.init(input);
            solution.minTimeBetweenUpdatesMs = 150;

            console.log(`Day ${solutionInfo.day} - ${solutionInfo.title}`);
            for (let part of [1, 2]) {
                await new Promise<void>((resolve, _) => {
                    let result: string;
                    let resultState: SolutionResult | SolutionError;
                    consoleRewrite(`Part ${part}...`);
                    solution.solveWithProgressAsync(part).subscribe({
                        next: state => {
                            switch (state.type) {
                                case 'result': resultState = state; result = state.result; break;
                                case 'error': resultState = state; result = 'Error - ' + state.message; break;
                                case 'progress':
                                    consoleRewrite(`Part ${part} (${state.timeMs}+ ms): ${(state.progress * 100).toFixed(2)} %`);
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

async function parseArgs() {
    const parser = new ArgumentParser({
        description: 'Advent of Code 2020 solutions in Typescript',
        add_help: true,
    });

    parser.add_argument('-d', '--days', { help: 'Solve a single day or multiple days.', type: 'int', nargs: '+' });
    parser.add_argument('-a', '--all', { help: 'Solve all days.', action: 'store_true' });
    parser.add_argument('-l', '--last', { help: 'Solve the last available day.', action: 'store_true' });

    const args = parser.parse_args();
    let days: number[] = [];

    if (args.days) {
        days = args.days;
        console.log(`Running solutions for day(s): ${days.join(', ')}`);
    } else if (args.last) {
        days = [Array.from(solutionManager.getSolutionsByDay().keys()).sort((a, b) => b - a)[0]];
        console.log(`Running last available day: ${days[0]}`);
    } else {
        console.log('Running all available solutions.');
        days = Array.from(solutionManager.getSolutionsByDay().keys()).sort((a, b) => a - b);
    }

    if (!days || days.length === 0 || days.some(x => x === undefined)) {
        console.log('No solutions are available.');
        return;
    }

    await app(days);
}

parseArgs();
