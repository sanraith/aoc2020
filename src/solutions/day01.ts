import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';
import * as _ from 'lodash';

@solutionInfo({
    day: 1,
    title: 'The Tyranny of the Rocket Equation'
})
export class Day01 extends SolutionBase {

    protected part1(): string {
        return _(this.inputLines)
            .map(x => Math.floor(parseInt(x) / 3) - 2)
            .reduce((a, x) => a + x)
            .toString();
    }

    protected part2(): string {
        // Simulate arbitrary work
        const max = 21;
        for (let j = 0; j < max; j++) {
            this.updateProgress(j / max);
            for (let i = 0; i < 1e8; i++) { ; }
        }

        return _(this.inputLines)
            .map(parseInt)
            .reduce((sum, fuel) => {
                while (fuel > 0) {
                    fuel = Math.floor(fuel / 3) - 2;
                    if (fuel > 0) { sum += fuel; }
                }
                return sum;
            }, 0).toString();
    }
}
