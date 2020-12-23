import { Day23 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day23 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day23, `389125467`));

        it('solves part 1', expectedResult(1, '67384529'));
        it('solves part 2', expectedResult(2, '149245887792'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day23));
        it('solves part 1', expectedResult(1, '34952786'));
        it('solves part 2', expectedResult(2, '505334281774'));
    });
});
