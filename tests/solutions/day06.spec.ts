import { Day06 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day06 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day06, `abc

a
b
c

ab
ac

a
a
a
a

b`));

        it('solves part 1', expectedResult(1, '11'));
        it('solves part 2', expectedResult(2, '6'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day06));
        it('solves part 1', expectedResult(1, '6170'));
        it('solves part 2', expectedResult(2, '2947'));
    });
});
