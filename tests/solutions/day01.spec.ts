import { Day01 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day01 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day01, `1721
979
366
299
675
1456`));

        it('solves part 1', expectedResult(1, '514579'));
        it('solves part 2', expectedResult(2, '241861950'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day01));
        it('solves part 1', expectedResult(1, '181044'));
        it('solves part 2', expectedResult(2, '82660352'));
    });
});
