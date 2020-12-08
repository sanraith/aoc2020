import { Day08 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day08 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day08, `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`));

        it('solves part 1', expectedResult(1, '5'));
        it('solves part 2', expectedResult(2, '8'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day08));
        it('solves part 1', expectedResult(1, '1528'));
        it('solves part 2', expectedResult(2, '640'));
    });
});
