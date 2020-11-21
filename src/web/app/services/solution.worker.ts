/// <reference lib="webworker" />

import { solutionManager } from '../../../core/solutionManager';
import { SolutionResult } from '../../../core/solutionProgress';
import { SolveRequest } from './solveRequest';
import { tap } from 'rxjs/operators';

const solutionInfos = solutionManager.getSolutionsByDay();

addEventListener('message', async ({ data }: { data: SolveRequest }) => {
    const solution = solutionInfos.get(data.day).create();
    solution.init(data.input);

    for (let part of [1, 2]) {
        const observable = solution.solveWithProgressAsync(part);
        await observable.pipe(
            tap(state => postMessage(state))
        ).toPromise();
    }

    // Post an invalid result to mark the end of the work.
    postMessage(new SolutionResult(-1, undefined, 0));
});
