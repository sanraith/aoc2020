import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SolutionState } from '../../../core/solutionProgress';
import { SolveRequest } from './solveRequest';
import { EventDispatcher, IEventManagement } from 'strongly-typed-events';

type WorkerInfo = { isAvailable: boolean, worker: Worker };

@Injectable({
    providedIn: 'root'
})
export class WorkerService {
    private maxWorkerCount = 4;
    private preparedWorkerCount = 1;
    private workerList: WorkerInfo[] = [];

    private _onWorkerAvailable = new EventDispatcher<any, WorkerInfo>();
    private get onWorkerAvailable() { return this._onWorkerAvailable.asEvent(); }

    constructor() {
        this.workerList = Array(this.preparedWorkerCount).fill(0).map(_ => ({ isAvailable: false, worker: undefined }));
        setTimeout(() => {
            for (let workerInfo of this.workerList.filter((_, i) => i < this.preparedWorkerCount)) {
                workerInfo.worker = this.createWorker();
                this.makeWorkerAvailable(workerInfo);
            }
        });
    }

    solve(day: number, input: string): Observable<SolutionState> {
        return new Observable(subscriber => {
            this.getAvailableWorker().then(workerInfo => {
                const worker = workerInfo.worker;
                worker.onmessage = ({ data }: { data: SolutionState }) => {
                    if (data.part > 0) {
                        subscriber.next(data);
                    } else {
                        this.makeWorkerAvailable(workerInfo);
                        subscriber.complete();
                    }
                };
                worker.postMessage(<SolveRequest>{ day, input });
            });
        });
    }

    private makeWorkerAvailable(workerInfo: WorkerInfo) {
        workerInfo.isAvailable = true;
        this._onWorkerAvailable.dispatch(this, workerInfo);
    }

    private getAvailableWorker(): Promise<WorkerInfo> {
        return new Promise((resolve, _) => {
            // Try to find an available worker
            let workerInfo = this.workerList.find(x => x.isAvailable);
            if (workerInfo) {
                workerInfo.isAvailable = false;
                resolve(workerInfo);
                return;
            }

            // Create a new one if possible
            if (this.workerList.length < this.maxWorkerCount) {
                const workerInfo = { isAvailable: false, worker: this.createWorker() };
                this.workerList.push(workerInfo);
                resolve(workerInfo);
                return;
            }

            // Wait for an available one
            this.onWorkerAvailable.sub((_: any, workerInfo: WorkerInfo, event: IEventManagement) => {
                if (workerInfo.isAvailable) {
                    event.unsub();
                    workerInfo.isAvailable = false;
                    resolve(workerInfo);
                }
            });
        });
    }

    private createWorker(): Worker {
        return new Worker('./solution.worker', { type: 'module' });
    }
}
