import SolutionBase from '../../src/core/solutionBase';
import { Day01 } from '../../src/solutions';

describe('Day01 solution', function () {
    let solution: SolutionBase;

    describe('for input 1', function () {
        const input = ``;
        solution = new Day01().init(input);

        it('solves part 1', async function () {
            const expected = 'Day01Part1';
            expect(await solution.part1Async()).toEqual(expected);
        });

        it('solves part 2', async function () {
            const expected = 'Day01Part2';
            expect(await solution.part2Async()).toEqual(expected);
        });
    });
});
