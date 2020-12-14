import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

type Group = {
    mask?: string,
    mask0?: bigint,
    mask1?: bigint,
    memOps: { address: bigint, value: bigint }[]
};

@solutionInfo({
    day: 14,
    title: 'Docking Data'
})
export class Day14 extends SolutionBase {

    protected part1(): string {
        const groups = this.parseInput();
        const flip = BigInt('0b' + (Array(36).fill('1').join('')));
        const memory = new Map<bigint, bigint>();

        for (let { memOps, mask0, mask1 } of groups) {
            for (let { address, value } of memOps) {
                // console.log();
                // console.log('mask:   ' + mask.padStart(36, '0'));
                // console.log('value:  ' + this.toBinary(value).padStart(36, '0'));
                // console.log('+mask1: ' + this.toBinary(mask1).padStart(36, '0'));

                value = value | mask1;
                // console.log('=value: ' + this.toBinary(value).padStart(36, '0'));
                // console.log('+mask0: ' + this.toBinary(mask0).padStart(36, '0'));

                value = ((value ^ flip) | mask0) ^ flip;
                // console.log('=value: ' + this.toBinary(value).padStart(36, '0'));

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
                this.writeToMany(memory, baseAddress, mask, value);
            }
        }

        const sum = Array.from(memory.values()).reduce((a, x) => a + x, BigInt(0));
        return sum.toString();
    }

    private writeToMany(memory: Map<bigint, bigint>, baseAddress: bigint, mask: string, value: bigint) {
        const indexes = this.allIndexOf(mask, 'X');
        const addressArr = baseAddress.toString(2).padStart(36, '0').split('');
        const xCount = indexes.length;
        const max = Math.pow(2, xCount);

        // console.log();
        // console.log(baseAddress.toString(2).padStart(36, '0'));
        // console.log(mask);
        // console.log(indexes);
        // console.log(xCount);
        // console.log();

        for (let aMemory = 0; aMemory < max; aMemory++) {
            const candidateStr = aMemory.toString(2).padStart(xCount, '0');
            for (let i = xCount - 1; i >= 0; i--) {
                addressArr[indexes[i]] = candidateStr[i];
            }

            const newAddressStr = addressArr.join('');
            const newAddress = BigInt('0b' + newAddressStr);
            memory.set(newAddress, value);

            // console.log(newAddressStr.padStart(36, '0'));
        }
    }

    private allIndexOf(text: string, searchFor: string): number[] {
        const matches: number[] = [];
        let index = 0;
        while ((index = text.indexOf(searchFor, index)) >= 0) {
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
