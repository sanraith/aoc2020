import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

@solutionInfo({
    day: 2,
    title: 'Password Philosophy'
})
export class Day02 extends SolutionBase {

    protected part1(): string {
        let validCount = 0;
        for (let line of this.inputLines) {
            const [, min, max, c, password] = /([0-9]+)-([0-9]+) ([a-z]): ([a-zA-Z0-9]+)/.exec(line);
            const cCount = (password).split(c).length - 1;
            if (cCount >= parseInt(min) && cCount <= parseInt(max)) {
                validCount++;
            }
        }

        return validCount.toString();
    }

    protected part2(): string {
        let validCount = 0;
        for (let line of this.inputLines) {
            const [, first, last, c, password] = /([0-9]+)-([0-9]+) ([a-z]): ([a-zA-Z0-9]+)/.exec(line);
            const isValid = !((password[parseInt(first) - 1] === c) === (password[parseInt(last) - 1] === c));
            if (isValid) {
                validCount++;
            }
        }

        return validCount.toString();
    }
}
