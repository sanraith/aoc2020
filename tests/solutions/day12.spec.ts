import { Day12 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day12 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day12, `F10
N3
F7
R90
F11`));

        it('solves part 1', expectedResult(1, '25'));
        it('solves part 2', expectedResult(2, '286'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day12));
        it('solves part 1', expectedResult(1, '923'));
        it('solves part 2', expectedResult(2, '24769'));
    });
});
