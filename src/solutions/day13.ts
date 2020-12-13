import { regexGetAllResults } from '../core/helpers';
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

export type Day13Data = { visitedTimestamps: number[] }

@solutionInfo({
    day: 13,
    title: 'Shuttle Search'
})
export class Day13 extends SolutionBase {

    protected part1(): number {
        const { earliestDepart, busIds } = this.parseInput();
        const busData: { waitTime: number, busId: number }[] = [];

        for (let busId of busIds) {
            let multiplier = Math.floor(earliestDepart / busId);
            const remainder = earliestDepart % busId;
            if (remainder > 0) { multiplier++; }

            const timestamp = busId * multiplier;
            busData.push({ waitTime: timestamp - earliestDepart, busId });
        }
        busData.sort((a, b) => a.waitTime - b.waitTime);

        return busData[0].busId * busData[0].waitTime;
    }

    protected part2(): number {
        const { extendedBusIds } = this.parseInput();
        const buses: { id: number, offset: number }[] = extendedBusIds
            .map((id, offset) => ({ id, offset }))
            .filter(x => x.id >= 0)
            .sort((a, b) => b.id - a.id);

        let visitedTimestamps: number[] = [];
        let previousMatch: number = null;
        let skipCount = buses[0].id;
        let timestamp = skipCount - buses[0].offset;
        let busIndex = 1;

        while (true) {
            visitedTimestamps.push(timestamp);
            if ((timestamp + buses[busIndex].offset) % buses[busIndex].id === 0) {
                if (busIndex === buses.length - 1) {
                    break;
                }
                if (previousMatch === null) {
                    previousMatch = timestamp;
                } else {
                    skipCount = timestamp - previousMatch;
                    timestamp = previousMatch;
                    previousMatch = null;
                    busIndex++;
                    continue;
                }
            }
            timestamp += skipCount;
        }

        this.visualizationData = <Day13Data>{ visitedTimestamps };
        return timestamp;
    }

    private parseInput() {
        const earliestDepart = parseInt(this.inputLines[0]);
        const busIds = regexGetAllResults(/[0-9]+/g, this.inputLines[1])
            .map(x => parseInt(x[0]));
        const extendedBusIds = regexGetAllResults(/[x0-9]+/g, this.inputLines[1])
            .map(x => x[0] === 'x' ? -1 : parseInt(x[0]));

        return { earliestDepart, busIds, extendedBusIds };
    }
}
