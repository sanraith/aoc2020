import { toInteger } from 'lodash';
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

@solutionInfo({
    day: 1,
    title: 'Report Repair'
})
export class Day01 extends SolutionBase {

    protected part1(): number {
        const numbers = this.inputLines.map(x => toInteger(x));
        for (let i = 0; i < numbers.length; i++) {
            const a = numbers[i];
            for (let j = i + 1; j < numbers.length; j++) {
                const b = numbers[j];
                if (a + b === 2020) {
                    return a * b;
                }
            }
        };

        return undefined;
    }

    protected part2(): number {
        const numbers = this.inputLines.map(x => toInteger(x));
        for (let i = 0; i < numbers.length; i++) {
            const a = numbers[i];
            for (let j = i + 1; j < numbers.length; j++) {
                const b = numbers[j];
                for (let k = j + 1; k < numbers.length; k++) {
                    const c = numbers[k];
                    if (a + b + c === 2020) {
                        return a * b * c;
                    }
                }
            }
        };

        return undefined;
    }
}
