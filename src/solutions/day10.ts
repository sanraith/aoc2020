import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

@solutionInfo({
    day: 10,
    title: 'Adapter Array'
})
export class Day10 extends SolutionBase {

    protected part1(): number {
        const adapters = this.getAdapters();

        const differences = Array(4).fill(0);
        for (let i = 1; i < adapters.length; i++) {
            const a = adapters[i - 1];
            const b = adapters[i];
            differences[b - a]++;
        }

        return differences[1] * differences[3];
    }

    protected part2(): number {
        const adapters = this.getAdapters();
        const cache = Array(adapters.length).fill(null);
        const arrangementCount = this.countArrangements(0, adapters, cache);

        return arrangementCount;
    }

    private countArrangements(startIndex: number, adapters: number[], cache: number[]) {
        const adapter = adapters[startIndex];

        let count = 0;
        let index = startIndex + 1;
        while (index < adapters.length && adapters[index] <= adapter + 3) {
            count += cache[index] ?? this.countArrangements(index, adapters, cache);
            index++;
        }

        count = Math.max(1, count); // Count single adapter as 1 arrangement instead of 0
        cache[startIndex] = count;

        return count;
    }

    private getAdapters(): number[] {
        const adapters = this.inputLines.map(x => parseInt(x)).sort((a, b) => a - b);
        adapters.splice(0, 0, 0);
        adapters.push(adapters[adapters.length - 1] + 3);

        return adapters;
    }
}
