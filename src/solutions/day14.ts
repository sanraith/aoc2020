import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

type Group = {
    mask?: string,
    mask0?: bigint,
    mask1?: bigint,
    memOps: { address: bigint, value: bigint }[]
};

const WORD_SIZE = 36;

@solutionInfo({
    day: 14,
    title: 'Docking Data'
})
export class Day14 extends SolutionBase {

    protected part1(): string {
        const groups = this.parseInput();
        const flip = BigInt('0b' + (Array(WORD_SIZE).fill('1').join('')));
        const memory = new Map<bigint, bigint>();

        for (let { memOps, mask0, mask1 } of groups) {
            for (let { address, value } of memOps) {
                value = value | mask1;
                value = ((value ^ flip) | mask0) ^ flip;
                memory.set(address, value);
            }
        }

        const sum = Array.from(memory.values()).reduce((a, x) => a + x, BigInt(0));
        return sum.toString();
    }

    protected part2(): string {
        const groups = this.parseInput();
        const memory = new Map<bigint, bigint>();

        for (let { group, i } of groups.map((group, i) => ({ group, i }))) {
            this.updateProgress(i / groups.length);

            const { mask, mask1, memOps } = group;
            for (let { address, value } of memOps) {
                const baseAddress = address | mask1;
                this.writeToMemory(memory, baseAddress, mask, value);
            }
        }

        const sum = Array.from(memory.values()).reduce((a, x) => a + x, BigInt(0));
        return sum.toString();
    }

    private writeToMemory(memory: Map<bigint, bigint>, baseAddress: bigint, mask: string, value: bigint) {
        const xIndexes = this.allIndexOf(mask, 'X');
        const xCount = xIndexes.length;
        const combinationCount = Math.pow(2, xCount);
        const address = baseAddress.toString(2).padStart(WORD_SIZE, '0').split('');

        for (let combination = 0; combination < combinationCount; combination++) {
            const candidateStr = combination.toString(2).padStart(xCount, '0');
            for (let i = xCount - 1; i >= 0; i--) {
                address[xIndexes[i]] = candidateStr[i];
            }

            const newAddress = BigInt('0b' + address.join(''));
            memory.set(newAddress, value);
        }
    }

    private allIndexOf(text: string, searchedStr: string): number[] {
        const matches: number[] = [];
        let index = 0;
        while ((index = text.indexOf(searchedStr, index)) >= 0) {
            matches.push(index);
            index = index + 1;
        }
        return matches;
    }

    private parseInput(): Group[] {
        const maskRegex = /mask = ([X01]+)/;
        const memRegex = /mem\[([0-9]+)\] = ([0-9]+)/;
        const groups: Group[] = [];

        let group: Group;
        for (let line of this.inputLines) {
            if (line.startsWith('mask')) {
                const [, mask] = maskRegex.exec(line);
                group = { memOps: [] };
                group.mask = mask;
                group.mask1 = BigInt('0b' + mask.replace(/X/g, '0'));
                group.mask0 = BigInt('0b' + mask.replace(/1/g, 'X').replace(/0/g, '1').replace(/X/g, '0'));
                groups.push(group);
            } else {
                const [address, value] = memRegex.exec(line).filter((x, i) => i > 0).map(x => BigInt(x));
                group.memOps.push({ address, value });
            }
        }

        return groups;
    }
}
