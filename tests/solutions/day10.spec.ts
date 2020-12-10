import { Day10 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day10 solution', function () {
    describe('for test input 1', function () {
        beforeAll(setupSolution(Day10, `16
10
15
5
1
11
7
19
6
12
4`));

        it('solves part 1', expectedResult(1, '35'));
        it('solves part 2', expectedResult(2, '8'));
    });

    describe('for test input 2', function () {
        beforeAll(setupSolution(Day10, `28
33
18
42
31
14
46
20
48
47
24
23
49
45
19
38
39
11
1
32
25
35
8
17
7
9
4
2
34
10
3`));

        it('solves part 1', expectedResult(1, '220'));
        it('solves part 2', expectedResult(2, '19208'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day10));
        it('solves part 1', expectedResult(1, '1980'));
        it('solves part 2', expectedResult(2, '4628074479616'));
    });
});
