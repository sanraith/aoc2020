import _ = require('lodash');
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

@solutionInfo({
    day: 9,
    title: 'Encoding Error'
})
export class Day09 extends SolutionBase {

    preambleCount = 25;

    protected part1(): number {
        const numbers = this.inputLines.map(x => parseInt(x));
        let index = this.preambleCount;
        while (this.isValid(index, numbers)) {
            index++;
        }

        return numbers[index];
    }

    protected part2(): number {
        const numbers = this.inputLines.map(x => parseInt(x));
        const weakNumber = this.part1();

        for (let start = 0; start < numbers.length; start++) {
            for (let endEx = start; endEx <= numbers.length; endEx++) {
                const { sumNumbers, sum } = this.findNumbersToSum(weakNumber, start, endEx, numbers);
                if (sum > weakNumber) { break; }
                if (sumNumbers) {
                    return _(sumNumbers).min() + _(sumNumbers).max();
                }
            }
        }

        return undefined;
    }

    private findNumbersToSum(target: number, start: number, endEx: number, numbers: number[])
        : { sum: number, sumNumbers?: number[] } {

        let sum = 0;
        for (let i = start; i < endEx; i++) {
            sum += numbers[i];
            if (sum > target) {
                return { sum };
            }
        }

        if (sum === target) {
            return { sum, sumNumbers: numbers.slice(start, endEx) };
        }

        return { sum };
    }

    private isValid(index: number, numbers: number[]): boolean {
        const testedNumber = numbers[index];
        const start = index - this.preambleCount;

        for (let i = start; i < index; i++) {
            const a = numbers[i];
            for (let j = i + 1; j < index; j++) {
                const b = numbers[j];
                if (a + b === testedNumber) {
                    return true;
                }
            }
        }

        return false;
    }

}
