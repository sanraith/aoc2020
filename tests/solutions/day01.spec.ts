import { Day01 } from '../../src/solutions';

describe('Day01 solution', function () {
    describe('for input 1', function () {
        const input = `100756`;
        const solution = new Day01().init(input);

        it('solves part 1', async function () {
            expect(await solution.solveAsync(1)).toEqual('33583');
        });

        it('solves part 2', async function () {
            expect(await solution.solveAsync(2)).toEqual('50346');
        });
    });
});
