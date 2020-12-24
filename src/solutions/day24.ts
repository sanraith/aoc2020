import { regexGetAllResults } from '../core/helpers';
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

type Point = { x: number, y: number, z: number };

const directionMap = new Map<string, Point>([
    ['e', { x: 1, y: -1, z: 0 }],
    ['w', { x: -1, y: 1, z: 0 }],
    ['se', { x: 0, y: -1, z: 1 }],
    ['nw', { x: 0, y: 1, z: -1 }],
    ['ne', { x: 1, y: 0, z: -1 }],
    ['sw', { x: -1, y: 0, z: 1 }]
]);

@solutionInfo({
    day: 24,
    title: 'Lobby Layout'
})
export class Day24 extends SolutionBase {

    protected part1(): number {
        const tilePaths = this.parseTilePaths();
        const blackTiles = this.getBlackTiles(tilePaths);

        return blackTiles.size;
    }

    protected part2(): number {
        const dayCount = 100;
        const tilePaths = this.parseTilePaths();
        let blackTiles = this.getBlackTiles(tilePaths);

        for (let i = 0; i < dayCount; i++) {
            this.updateProgress(i / dayCount);
            blackTiles = this.flipDay(blackTiles);
        }

        return blackTiles.size;
    }

    private flipDay(blackTiles: Set<string>): Set<string> {
        const nextBlackTiles = new Set(blackTiles);
        const whiteTiles = this.getWhiteTiles(blackTiles);

        for (let blackKey of blackTiles) {
            const blackPoint = this.toPoint(blackKey);
            const blackNeighborCount = this.getBlackNeighborCount(blackPoint, blackTiles);
            if (blackNeighborCount === 0 || blackNeighborCount > 2) {
                nextBlackTiles.delete(blackKey);
            }
        }

        for (let whiteKey of whiteTiles) {
            const whitePoint = this.toPoint(whiteKey);
            const blackNeighborCount = this.getBlackNeighborCount(whitePoint, blackTiles);
            if (blackNeighborCount === 2) {
                nextBlackTiles.add(whiteKey);
            }
        }

        return nextBlackTiles;
    }

    /** Only counts up to 3 black neighbors. */
    private getBlackNeighborCount(point: Point, blackTiles: Set<string>): number {
        let blackNeighborCount = 0;
        for (let neighborVector of directionMap.values()) {
            const neighborKey = this.toKey(this.add(point, neighborVector));
            if (blackTiles.has(neighborKey)) {
                blackNeighborCount++;
                if (blackNeighborCount > 2) { break; }
            }
        }

        return blackNeighborCount;
    }

    private getWhiteTiles(blackTiles: Set<string>): Set<string> {
        const whiteTiles = new Set<string>();
        for (let blackKey of blackTiles) {
            const blackPoint = this.toPoint(blackKey);
            for (let neighborVector of directionMap.values()) {
                const neighborKey = this.toKey(this.add(blackPoint, neighborVector));
                if (!blackTiles.has(neighborKey)) {
                    whiteTiles.add(neighborKey);
                }
            }
        }

        return whiteTiles;
    }

    private getBlackTiles(tilePaths: string[][]): Set<string> {
        const blackTiles = new Set<string>();
        for (let tilePath of tilePaths) {
            let point = { x: 0, y: 0, z: 0 };
            for (let direction of tilePath) {
                let vector = directionMap.get(direction);
                point = this.add(point, vector);
            }

            const key = this.toKey(point);
            if (blackTiles.has(key)) {
                blackTiles.delete(key);
            } else {
                blackTiles.add(key);
            }
        }

        return blackTiles;
    }

    private toPoint(key: string): Point {
        const p = key.split(',').map(x => parseInt(x));
        return { x: p[0], y: p[1], z: p[2] };
    }

    private toKey(p: Point): string {
        return p.x + ',' + p.y + ',' + p.z;
    }

    private add(a: Point, b: Point): Point {
        return { x: a.x + b.y, y: a.y + b.y, z: a.z + b.z };
    }

    private parseTilePaths(): string[][] {
        const directionRegex = /(e|se|sw|w|nw|ne)/g;
        const tiles: string[][] = [];
        for (let line of this.inputLines) {
            const directions = regexGetAllResults(directionRegex, line).map(x => x[1]);
            tiles.push(directions);
        }

        return tiles;
    }
}
