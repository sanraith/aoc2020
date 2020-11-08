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
        this.inputLines = this.parseInputLines(input);
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
