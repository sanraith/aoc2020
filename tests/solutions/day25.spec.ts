import { Day25 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day25 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day25, `5764801\n17807724`));

        it('solves part 1', expectedResult(1, '14897079'));
        it('solves part 2', expectedResult(2, '*'));
    });

    xdescribe('for puzzle input', function () {
        beforeAll(setupSolution(Day25));
        it('solves part 1', expectedResult(1, '2679568'));
        it('solves part 2', expectedResult(2, '*'));
    });
});
