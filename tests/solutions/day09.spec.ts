import { Day09 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day09 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day09, `35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576`));
        beforeAll(function () {
            (this.solution as Day09).preambleCount = 5;
        });
        it('solves part 1', expectedResult(1, '127'));
        it('solves part 2', expectedResult(2, '62'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day09));
        it('solves part 1', expectedResult(1, '138879426'));
        it('solves part 2', expectedResult(2, '23761694'));
    });
});
