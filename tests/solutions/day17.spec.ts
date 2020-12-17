import { Day17 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day17 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day17, `.#.
..#
###`));

        it('solves part 1', expectedResult(1, '112'));
        it('solves part 2', expectedResult(2, '848'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day17));
        it('solves part 1', expectedResult(1, '338'));
        it('solves part 2', expectedResult(2, '2440'));
    });
});
