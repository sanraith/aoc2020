import { Day14 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day14 solution', function () {
    describe('for test input 1', function () {
        beforeAll(setupSolution(Day14, `mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
mem[8] = 11
mem[7] = 101
mem[8] = 0`));

        it('solves part 1', expectedResult(1, '165'));
    });

    describe('for test input 2', function () {
        beforeAll(setupSolution(Day14, `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1`));

        it('solves part 2', expectedResult(2, '208'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day14));
        it('solves part 1', expectedResult(1, '8471403462063'));
        it('solves part 2', expectedResult(2, '2667858637669'));
    });
});
