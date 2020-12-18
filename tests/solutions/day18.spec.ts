import { Day18 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day18 solution', function () {
    describe('for test input 1', function () {
        beforeAll(setupSolution(Day18, `1 + (2 * 3) + (4 * (5 + 6))`));

        it('solves part 1', expectedResult(1, '51'));
        it('solves part 2', expectedResult(2, '51'));
    });

    describe('for test input 2', function () {
        beforeAll(setupSolution(Day18, `2 * 3 + (4 * 5)`));

        it('solves part 1', expectedResult(1, '26'));
        it('solves part 2', expectedResult(2, '46'));
    });

    describe('for test input 3', function () {
        beforeAll(setupSolution(Day18, `5 + (8 * 3 + 9 + 3 * 4 * 3)`));

        it('solves part 1', expectedResult(1, '437'));
        it('solves part 2', expectedResult(2, '1445'));
    });

    describe('for test input 4', function () {
        beforeAll(setupSolution(Day18, `5 * 9 * (7 * 3 * 3 + 9 * 3 + (8 + 6 * 4))`));

        it('solves part 1', expectedResult(1, '12240'));
        it('solves part 2', expectedResult(2, '669060'));
    });

    describe('for test input 5', function () {
        beforeAll(setupSolution(Day18, `((2 + 4 * 9) * (6 + 9 * 8 + 6) + 6) + 2 + 4 * 2`));

        it('solves part 1', expectedResult(1, '13632'));
        it('solves part 2', expectedResult(2, '23340'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day18));
        it('solves part 1', expectedResult(1, '202553439706'));
        it('solves part 2', expectedResult(2, '88534268715686'));
    });
});
