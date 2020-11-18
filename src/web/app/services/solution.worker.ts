/// <reference lib="webworker" />

import { solutionManager } from '../../../core/solutionManager';
import { SolveRequest } from './solveRequest';

addEventListener('message', ({ data }: { data: SolveRequest }) => {
    const solutionInfos = solutionManager.getSolutionsByDay();
    const solution = solutionInfos.get(data.day).create();
    solution.init(data.input);

    const observable = data.part === 1 ? solution.part1WithProgressAsync() : solution.part2WithProgressAsync();
    observable.subscribe({
        next(x) {
            postMessage(x);
        }
    });
});
