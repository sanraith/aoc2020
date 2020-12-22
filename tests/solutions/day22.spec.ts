import { Day22 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day22 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day22, `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`));

        it('solves part 1', expectedResult(1, '306'));
        it('solves part 2', expectedResult(2, '291'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day22));
        it('solves part 1', expectedResult(1, '31754'));
        it('solves part 2', expectedResult(2, '35436'));
    });
});
