import { Day01 } from '../../src/solutions';

describe('Day01 solution', function () {
    describe('for input 1', function () {
        const input = `1721
979
366
299
675
1456`;
        const solution = new Day01().init(input);

        it('solves part 1', async function () {
            expect(await solution.solveAsync(1)).toEqual('514579');
        });

        it('solves part 2', async function () {
            expect(await solution.solveAsync(2)).toEqual('241861950');
        });
    });
});
