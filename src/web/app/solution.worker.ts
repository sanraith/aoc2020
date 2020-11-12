/// <reference lib="webworker" />

import { SolutionResult } from 'src/core/solutionProgress';
import { Day01 } from 'src/solutions/day01';

addEventListener('message', ({ data }) => {
    const day = new Day01();
    day.init('');
    day.part1Async().subscribe({
        next(x) {
            postMessage('Worker result: ' + (<SolutionResult>x).result);
        }
    });
});
