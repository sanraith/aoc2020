import { Day03 } from '../../src/solutions';
import { expectedResult, setupSolution } from './testHelper';

describe('Day03 solution', function () {
    describe('for test input', function () {
        beforeAll(setupSolution(Day03, `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`));

        it('solves part 1', expectedResult(1, '7'));
        it('solves part 2', expectedResult(2, '336'));
    });

    describe('for puzzle input', function () {
        beforeAll(setupSolution(Day03));
        it('solves part 1', expectedResult(1, '205'));
        it('solves part 2', expectedResult(2, '3952146825'));
    });
});
