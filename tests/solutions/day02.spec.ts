import { Day02 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day02 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day02, `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`));

        it('solves part 1', expectedResult(1, '2'));
        it('solves part 2', expectedResult(2, '1'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day02));
        it('solves part 1', expectedResult(1, '614'));
        it('solves part 2', expectedResult(2, '354'));
    });
});
