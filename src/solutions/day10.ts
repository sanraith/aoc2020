import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

@solutionInfo({
    day: 10,
    title: 'Adapter Array'
})
export class Day10 extends SolutionBase {

    protected part1(): number {
        const adapters = this.parseAdapters();

        const differences = Array(4).fill(0);
        for (let i = 1; i < adapters.length; i++) {
            const a = adapters[i - 1];
            const b = adapters[i];
            differences[b - a]++;
        }

        return differences[1] * differences[3];
    }

    protected part2(): number {
        const adapters = this.parseAdapters();
        const arrangementCount = this.countArrangements(adapters);

        return arrangementCount;
    }

    private countArrangements(adapters: number[]) {
        const arrangementCounts = Array(adapters.length).fill(null);

        for (let start = adapters.length - 1; start >= 0; start--) {
            const adapter = adapters[start];
            let count = 0;
            let next = start + 1;
            while (next < adapters.length && adapters[next] <= adapter + 3) {
                count += arrangementCounts[next];
                next++;
            }
            arrangementCounts[start] = Math.max(1, count); // Count single adapter as 1 arrangement instead of 0
        }

        return arrangementCounts[0];
    }

    private parseAdapters(): number[] {
        const adapters = this.inputLines.map(x => parseInt(x)).sort((a, b) => a - b);
        adapters.splice(0, 0, 0);
        adapters.push(adapters[adapters.length - 1] + 3);

        return adapters;
    }
}
