import { Day11 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day11 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day11, `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`));

        it('solves part 1', expectedResult(1, '37'));
        it('solves part 2', expectedResult(2, '26'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day11));
        it('solves part 1', expectedResult(1, '2261'));
        it('solves part 2', expectedResult(2, '2039'));
    });
});
