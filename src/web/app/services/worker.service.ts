import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SolutionState } from '../../../core/solutionProgress';
import { SolveRequest } from './solveRequest';

@Injectable({
    providedIn: 'root'
})
export class WorkerService {
    constructor() { }

    solve(day: number, part: 1 | 2, input: string): Observable<SolutionState> {
        return new Observable(subscriber => {
            const worker = this.createWorker();
            worker.onmessage = ({ data }: { data: SolutionState }) => {
                subscriber.next(<SolutionState>data);
                if (data.type === 'result' || data.type === 'error') {
                    subscriber.complete();
                    worker.terminate();
                }
            };
            worker.postMessage(<SolveRequest>{ day, part, input });
        });
    }

    // TODO use a pool of workers
    private createWorker(): Worker {
        return new Worker('./solution.worker', { type: 'module' });
    }
}
