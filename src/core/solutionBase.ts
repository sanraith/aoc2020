import { Observable } from 'rxjs';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { SolutionError, SolutionProgress, SolutionResult, SolutionState } from './solutionProgress';
import { Stopwatch } from 'ts-stopwatch';

/**
 * Base class for solutions.
 * Part 1 and Part 2 can only be called in sequential order.
 */
export default abstract class SolutionBase {
    minTimeBetweenUpdatesMs = 20;

    protected input: string;
    protected inputLines: string[];
    protected visualizationData: any;

    private currentSolution: {
        subscriber: Subscriber<SolutionState>,
        activePart: number,
        progressStopwatch: Stopwatch,
        stopwatch: Stopwatch
    };

    init(input: string): SolutionBase {
        this.input = input;
        this.inputLines = this.parseInputLines(input);
        return this;
    }

    solveAsync(part: number): Promise<string | undefined> {
        return this.getResultAsync(this.solveWithProgressAsync(part));
    }

    solveWithProgressAsync(part: number): Observable<SolutionState> {
        return new Observable<SolutionState>(subscriber => {
            this.visualizationData = null;
            const stopwatch = new Stopwatch();
            try {
                if (part !== 1 && part !== 2) {
                    subscriber.error(new SolutionError(part, 'Invalid part requested!'));
                    return;
                }
                if (!this.inputLines) {
                    subscriber.error(new SolutionError(part, 'No input provided!'));
                    return;
                }
                if (this.currentSolution) {
                    subscriber.error(new SolutionError(part, 'Another solution is already in progress!'));
                    return;
                }
                const partFunction = part === 1 ? this.part1 : this.part2;
                this.currentSolution = {
                    activePart: part,
                    subscriber: subscriber,
                    stopwatch: new Stopwatch(),
                    progressStopwatch: new Stopwatch()
                };
                this.currentSolution.progressStopwatch.start();

                this.currentSolution.stopwatch.start();
                let result = partFunction.apply(this);
                result = result === undefined ? undefined : result + '';
                const timeMs = this.currentSolution.stopwatch.stop();
                const resultPack = new SolutionResult(part, result, timeMs);
                resultPack.visualizationData = this.visualizationData;
                subscriber.next(resultPack);
            } catch (exception) {
                const timeMs = stopwatch.stop();
                subscriber.next(new SolutionError(part, exception, timeMs));
            } finally {
                subscriber.complete();
                this.visualizationData = null;
                this.currentSolution = null;
            }
        });
    }

    protected abstract part1(): string | number;

    protected abstract part2(): string | number;

    protected updateProgress(progress: number) {
        const current = this.currentSolution;
        if (current.progressStopwatch.getTime() > this.minTimeBetweenUpdatesMs) {
            current.subscriber.next(new SolutionProgress(current.activePart, progress, current.stopwatch.getTime()));
            current.progressStopwatch.start(true);
        }
    }

    private async getResultAsync(partObservable: Observable<SolutionState>): Promise<string | undefined> {
        const state = await partObservable.toPromise();
        switch (state.type) {
            case 'result': return state.result;
            default: return undefined;
        }
    }

    private parseInputLines(input: string): string[] {
        const newLineRegex = /\r\n?|\n/g;
        const inputLines = input.split(newLineRegex);

        let emptyCount: number;
        const whiteSpaceLineRegex = /^\s*$/gm;
        for (emptyCount = 0; emptyCount < inputLines.length; emptyCount++) {
            const line = inputLines[inputLines.length - emptyCount - 1];
            if (!whiteSpaceLineRegex.test(line)) {
                break;
            }
        }
        inputLines.splice(inputLines.length - emptyCount, emptyCount);

        return inputLines;
    }
}
