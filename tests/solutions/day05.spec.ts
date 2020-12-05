import { Day05 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day05 solution', function () {
    describe('for test input 1', function () {
        beforeAll(setupSolution(Day05, `BFFFBBFRRR`));
        it('solves part 1', expectedResult(1, '567'));
    });
    describe('for test input 2', function () {
        beforeAll(setupSolution(Day05, `FFFBBBFRRR`));
        it('solves part 1', expectedResult(1, '119'));
    });
    describe('for test input 3', function () {
        beforeAll(setupSolution(Day05, `BBFFBBFRLL`));
        it('solves part 1', expectedResult(1, '820'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day05));
        it('solves part 1', expectedResult(1, '878'));
        it('solves part 2', expectedResult(2, '504'));
    });
});
