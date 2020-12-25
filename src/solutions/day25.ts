import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

const initialSubjectNumber = 7;
const cryptoDivider = 20201227;

@solutionInfo({
    day: 25,
    title: 'Combo Breaker'
})
export class Day25 extends SolutionBase {

    protected part1(): number {
        const { cardPublicKey, doorPublicKey } = this.parseInput();
        const cardLoopSize = this.getLoopSize(initialSubjectNumber, cardPublicKey);
        const encryptionKey = this.executeLoop(doorPublicKey, cardLoopSize);

        return encryptionKey;
    }

    protected part2(): string {
        return '*';
    }

    private executeLoop(subject: number, loopCount: number) {
        let value = 1;
        for (let i = 0; i < loopCount; i++) {
            value = (value * subject) % cryptoDivider;
        }

        return value;
    }

    private getLoopSize(subject: number, target: number) {
        let loopSize = 1;
        let value = 1;
        while ((value = (value * subject) % cryptoDivider) !== target) {
            loopSize++;
        }

        return loopSize;
    }

    private parseInput() {
        const [cardPublicKey, doorPublicKey] = this.inputLines.map(x => parseInt(x));
        return { cardPublicKey, doorPublicKey };
    }
}
