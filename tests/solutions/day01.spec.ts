import { Day01 } from '../../src/solutions';

describe('Day01 solution', function () {
    describe('for input 1', function () {
        const input = `100756`;
        const solution = new Day01().init(input);

        it('solves part 1', async function () {
            expect(await solution.part1Async()).toEqual('33583');
        });

        it('solves part 2', async function () {
            expect(await solution.part2Async()).toEqual('50346');
        });
    });
});
