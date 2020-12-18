import _ = require('lodash');
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

const ACTIVE = '#';
const INACTIVE = '.';

type Point = { x: number, y: number, z: number, w: number };
type ConveyMap = Set<string>;

@solutionInfo({
    day: 17,
    title: 'Conway Cubes'
})
export class Day17 extends SolutionBase {

    protected part1(): number {
        let map = this.parseInput();
        map = this.executeCycles(map, { cycleCount: 6, dimensions: 3 });

        return map.size;
    }

    protected part2(): number {
        let map = this.parseInput();
        map = this.executeCycles(map, { cycleCount: 6, dimensions: 4 });

        return map.size;
    }

    private executeCycles(map: ConveyMap, options: { cycleCount: number, dimensions: 3 | 4 }): ConveyMap {
        let mapRef: ConveyMap;
        // this.visualize(map, 0);

        for (let cycle = 0; cycle < options.cycleCount; cycle++) {
            this.updateProgress(cycle / options.cycleCount);
            mapRef = map;
            map = new Set<string>(mapRef.keys());
            this.executeCycle(map, mapRef, options.dimensions);
            // this.visualize(map, cycle + 1);
        }

        return map;
    }

    private executeCycle(map: ConveyMap, mapRef: ConveyMap, dimensions: 3 | 4) {
        const points = Array.from(mapRef.keys()).map(x => this.fromKey(x));
        const min = {
            x: _(points).minBy(p => p.x).x - 1,
            y: _(points).minBy(p => p.y).y - 1,
            z: _(points).minBy(p => p.z).z - 1,
            w: dimensions < 4 ? 0 : _(points).minBy(p => p.w).w - 1
        };
        const max = {
            x: _(points).maxBy(p => p.x).x + 1,
            y: _(points).maxBy(p => p.y).y + 1,
            z: _(points).maxBy(p => p.z).z + 1,
            w: dimensions < 4 ? 0 : _(points).maxBy(p => p.w).w + 1
        };

        this.iterateCoords(min, max, (x, y, z, w) => {
            const key = this.toKey(x, y, z, w);
            const isActive = mapRef.has(key);
            const neighborCount = this.countNeighbors({ x, y, z, w }, mapRef, dimensions);
            if (isActive) {
                if (neighborCount < 2 || neighborCount > 3) {
                    map.delete(key);
                }
            } else {
                if (neighborCount === 3) {
                    map.add(key);
                }
            }
        });
    }

    private countNeighbors(p: Point, map: ConveyMap, dimensions: 3 | 4, maxCount = 4) {
        const min = {
            x: p.x - 1,
            y: p.y - 1,
            z: p.z - 1,
            w: dimensions < 4 ? 0 : p.w - 1
        };
        const max = {
            x: p.x + 1,
            y: p.y + 1,
            z: p.z + 1,
            w: dimensions < 4 ? 0 : p.w + 1
        };

        let count = 0;
        this.iterateCoords(min, max, (x, y, z, w) => {
            if (x === p.x && y === p.y && z === p.z && w === p.w) {
                return false;
            }

            const key = this.toKey(x, y, z, w);
            if (map.has(key)) {
                count++;
                if (count >= maxCount) {
                    return true; // Stop iterating coords
                }
            }
        });

        return count;
    }

    private iterateCoords(min: Point, max: Point, callback: (x: number, y: number, z: number, w: number) => boolean | void) {
        for (let w = min.w; w <= max.w; w++) {
            for (let z = min.z; z <= max.z; z++) {
                for (let y = min.y; y <= max.y; y++) {
                    for (let x = min.x; x <= max.x; x++) {
                        const shouldBreak = callback(x, y, z, w);
                        if (shouldBreak) {
                            return;
                        }
                    }
                }
            }
        }
    }

    private toKey(x: number, y: number, z: number, w: number): string {
        return x + ',' + y + ',' + z + ',' + w;
    }

    private fromKey(key: string): Point {
        const point = key.split(',').map(x => parseInt(x));
        return { x: point[0], y: point[1], z: point[2], w: point[3] };
    }

    private visualize(map: ConveyMap, cycle: number = undefined): void {
        console.log();
        if (cycle !== undefined) {
            if (cycle === 0) {
                console.log(`Before any cycles:`);
            } else if (cycle === 1) {
                console.log(`After 1 cycle:`);
            } else {
                console.log(`After ${cycle} cycles:`);
            }
        }

        const points = Array.from(map.keys()).map(x => this.fromKey(x));
        const min = {
            x: _(points).minBy(p => p.x).x,
            y: _(points).minBy(p => p.y).y,
            z: _(points).minBy(p => p.z).z,
            w: _(points).minBy(p => p.w).w,
        };
        const max = {
            x: _(points).maxBy(p => p.x).x,
            y: _(points).maxBy(p => p.y).y,
            z: _(points).maxBy(p => p.z).z,
            w: _(points).maxBy(p => p.w).w,
        };

        for (let w = min.w; w <= max.w; w++) {
            for (let z = min.z; z <= max.z; z++) {
                console.log(`z=${z}, w=${w}`);
                for (let y = min.y; y <= max.y; y++) {
                    const line = [];
                    for (let x = min.x; x <= max.x; x++) {
                        const key = this.toKey(x, y, z, w);
                        line.push(map.has(key) ? ACTIVE : INACTIVE);
                    }
                    console.log(line.join(''));
                }
                console.log();
            }
        }
    }

    private parseInput(): ConveyMap {
        const z = 0;
        const w = 0;
        const map = new Set<string>();
        for (let { line, y } of this.inputLines.map((line, y) => ({ line, y }))) {
            for (let { char, x } of line.split('').map((char, x) => ({ char, x }))) {
                const isActive = char === ACTIVE;
                if (isActive) {
                    map.add(this.toKey(x, y, z, w));
                }
            }
        }

        return map;
    }
}
