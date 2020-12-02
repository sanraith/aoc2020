import { Day02 } from '../../src/solutions';

describe('Day02 solution', function () {
    describe('for input 1', function () {
        const input = `1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc`;
        const solution = new Day02().init(input);

        it('solves part 1', async function () {
            expect(await solution.solveAsync(1)).toEqual('2');
        });

        it('solves part 2', async function () {
            expect(await solution.solveAsync(2)).toEqual('1');
        });
    });
});
