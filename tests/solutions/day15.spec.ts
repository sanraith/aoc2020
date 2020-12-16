import { Day15 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day15 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day15, `1,3,2`));

        it('solves part 1', expectedResult(1, '1'));
        it('solves part 2', expectedResult(2, '2578'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day15));
        it('solves part 1', expectedResult(1, '620'));
        it('solves part 2', expectedResult(2, '110871'));
    });
});
