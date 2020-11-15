/// <reference lib="webworker" />

import { SolutionResult } from 'src/core/solutionProgress';
import { solutionManager } from '../../core/solutionManager';

addEventListener('message', ({ data }) => {
    const solutionInfos = solutionManager.getSolutionsByDay();
    const day1Solution = solutionInfos.get(1).create();
    day1Solution.init('');
    day1Solution.part1WithProgressAsync().subscribe({
        next(x) {
            postMessage('Worker result: ' + (<SolutionResult>x).result);
        }
    });
});
