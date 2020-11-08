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

    init(input: string) {
        const newLineRegex = /\r\n?|\n/g;
        this.inputLines = input.split(newLineRegex);
    }

    part1Async(): Observable<SolutionState> {
        return this.startPartAsync(this.part1);
    }

    part2Async(): Observable<SolutionState> {
        return this.startPartAsync(this.part2);
    }

    protected abstract part1(): string;

    protected abstract part2(): string;

    private startPartAsync(partFunction: (() => string)): Observable<SolutionState> {
        return new Observable<SolutionState>(subscriber => {
            if (!this.inputLines) {
                subscriber.error(new SolutionError('No input provided!'));
                subscriber.complete();
                return;
            }

            if (this.subscriber) {
                subscriber.error(new SolutionError('Another solution is already in progress!'));
                subscriber.complete();
                return;
            }

            try {
                this.subscriber = subscriber;
                const result = partFunction();
                subscriber.next(new SolutionResult(result));
            } catch (exception) {
                subscriber.error(new SolutionError(exception));
            } finally {
                subscriber.complete();
                this.subscriber = null;
            }
        });
    }
}
