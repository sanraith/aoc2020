import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

@solutionInfo({
    day: 15,
    title: 'Rambunctious Recitation'
})
export class Day15 extends SolutionBase {

    protected part1(): number {
        const numbers = this.parseNumbers();
        const lastNumber = this.playGame(numbers, 2020);

        return lastNumber;
    }

    protected part2(): number {
        const numbers = this.parseNumbers();
        const lastNumber = this.playGame(numbers, 30000000);

        return lastNumber;
    }

    private playGame(numbers: number[], gameLength: number): number {
        const numbersWhen = new Map<number, number[]>(numbers.map((x, i) => [x, [i]])); // what - when

        let prevSpoken = numbers[numbers.length - 1];
        for (let index = numbers.length; index < gameLength; index++) {
            this.updateProgress(index / gameLength);

            let times = numbersWhen.get(prevSpoken);
            let spoken = 0;
            if (times.length !== 1) {
                spoken = times[1] - times[0];
            }

            times = numbersWhen.get(spoken);
            if (!times) {
                times = [];
                numbersWhen.set(spoken, times);
            }
            if (times.length > 1) {
                times.shift();
            }
            times.push(index);

            prevSpoken = spoken;
        }

        return prevSpoken;
    }

    private parseNumbers(): number[] {
        return this.inputLines[0].split(',').map(x => parseInt(x));
    }
}
