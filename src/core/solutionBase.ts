import { Observable } from 'rxjs';
import { Subscriber } from 'rxjs/internal/Subscriber';
import { SolutionError, SolutionResult, SolutionState } from './solutionProgress';

/**
 * Base class for solutions.
 * Part 1 and Part 2 can only be called in sequential order.
 */
export default abstract class SolutionBase {
    protected inputLines: string[];
    protected state = { percentage: 0 };

    private subscriber?: Subscriber<SolutionState> = null;

    init(input: string): SolutionBase {
        this.inputLines = this.parseInputLines(input);
        return this;
    }

    part1Async(): Promise<string | undefined> {
        return this.getResultAsync(this.part1WithProgressAsync());
    }

    part2Async(): Promise<string | undefined> {
        return this.getResultAsync(this.part2WithProgressAsync());
    }

    part1WithProgressAsync(): Observable<SolutionState> {
        return this.startPartAsync(this.part1);
    }

    part2WithProgressAsync(): Observable<SolutionState> {
        return this.startPartAsync(this.part2);
    }

    protected abstract part1(): string;

    protected abstract part2(): string;

    private async getResultAsync(partObservable: Observable<SolutionState>): Promise<string | undefined> {
        const state = await partObservable.toPromise();
        switch (state.type) {
            case 'result': return state.result;
            default: return undefined;
        }
    }

    private startPartAsync(partFunction: (() => string)): Observable<SolutionState> {
        return new Observable<SolutionState>(subscriber => {
            try {
                if (!this.inputLines) {
                    subscriber.error(new SolutionError('No input provided!'));
                    return;
                }

                if (this.subscriber) {
                    subscriber.error(new SolutionError('Another solution is already in progress!'));
                    return;
                }

                this.subscriber = subscriber;
                const result = partFunction.apply(this);
                subscriber.next(new SolutionResult(result));
            } catch (exception) {
                subscriber.error(new SolutionError(exception));
            } finally {
                subscriber.complete();
                this.subscriber = null;
            }
        });
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
