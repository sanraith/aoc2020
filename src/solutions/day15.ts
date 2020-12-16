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
        const chunkCount = Math.ceil(gameLength / 500000);
        const chunkSize = Math.ceil(gameLength / chunkCount);
        const numbersWhen = new Map<number, number>(numbers.map((x, i) => [x, i])); // what - when

        let spoken = numbers[numbers.length - 1];
        let lastIndex: number = undefined;
        for (let chunk = 0; chunk < chunkCount; chunk++) {
            this.updateProgress(chunk / chunkCount);
            const start = Math.max(numbers.length, chunk * chunkSize);
            const max = Math.min(gameLength, (chunk + 1) * chunkSize);

            for (let index = start; index < max; index++) {
                if (lastIndex === undefined) {
                    spoken = 0;
                } else {
                    spoken = index - lastIndex - 1;
                }
                lastIndex = numbersWhen.get(spoken);
                numbersWhen.set(spoken, index);
            }
        }

        return spoken;
    }

    private parseNumbers(): number[] {
        return this.inputLines[0].split(',').map(x => parseInt(x));
    }
}
