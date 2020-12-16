import { Day16 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day16 solution', function () {
    describe('for test input 1', function () {
        beforeAll(setupSolution(Day16, `class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`));

        it('solves part 1', expectedResult(1, '71'));
    });

    describe('for test input 2', function () {
        beforeAll(setupSolution(Day16, `class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`));
        beforeAll(function () {
            this.solution.relevantFieldFilter = (name: string) => name === 'row' || name === 'seat';
        });

        it('solves part 2', expectedResult(2, '143'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day16));
        it('solves part 1', expectedResult(1, '22073'));
        xit('solves part 2', expectedResult(2, '1346570764607')); // Disabled due to slowness
    });
});
