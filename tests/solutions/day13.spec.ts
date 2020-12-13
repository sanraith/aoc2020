import { Day13 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day13 solution', function () {
    describe('for test input 1', function () {
        beforeAll(setupSolution(Day13, `939\n7,13,x,x,59,x,31,19`));

        it('solves part 1', expectedResult(1, '295'));
        it('solves part 2', expectedResult(2, '1068781'));
    });

    describe('for test input 2', function () {
        beforeAll(setupSolution(Day13, `0\n17,x,13,19`));
        it('solves part 2', expectedResult(2, '3417'));
    });

    describe('for test input 3', function () {
        beforeAll(setupSolution(Day13, `0\n67,7,59,61`));
        it('solves part 2', expectedResult(2, '754018'));
    });

    describe('for test input 4', function () {
        beforeAll(setupSolution(Day13, `0\n67,x,7,59,61`));
        it('solves part 2', expectedResult(2, '779210'));
    });

    describe('for test input 5', function () {
        beforeAll(setupSolution(Day13, `0\n67,7,x,59,61`));
        it('solves part 2', expectedResult(2, '1261476'));
    });

    describe('for test input 6', function () {
        beforeAll(setupSolution(Day13, `0\n1789,37,47,1889`));
        it('solves part 2', expectedResult(2, '1202161486'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day13));
        it('solves part 1', expectedResult(1, '2995'));
        it('solves part 2', expectedResult(2, '1012171816131114'));
    });
});
