import _ = require('lodash');
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

const TOP = 0;
const RIGHT = 1;
const BOTTOM = 2;
const LEFT = 3;
const SEA_MONSTER_MATCH = '#';
const SEA_MONSTER = [
    '                  # ',
    '#    ##    ##    ###',
    ' #  #  #  #  #  #   '
];

type Tile = { id: string, image: string[], connectors: Connector[] }
type TileConfig = { tile: Tile, connector: Connector }
type Connector = { sides: string[], image: string[] };
type Point = { x: number, y: number };

@solutionInfo({
    day: 20,
    title: 'Jurassic Jigsaw'
})
export class Day20 extends SolutionBase {
    private directions: number[];
    private alignedTiles: TileConfig[];

    protected part1(): number {
        const tiles = this.parseTiles();
        tiles.forEach(t => this.fillConnectors(t));

        const tileMap = new Map(tiles.map(x => [x.id, x]));
        const size = Math.floor(Math.sqrt(tiles.length));
        this.directions = [-size, 1, size, -1];
        this.alignedTiles = this.alignTiles(size, tileMap, []);

        const corners = [0, size - 1, size * (size - 1), size * size - 1];
        const result = corners.map(x => this.alignedTiles[x]).reduce((a, x) => a * parseInt(x.tile.id), 1);

        return result;
    }

    protected part2(): number {
        if (!this.alignedTiles) { this.part1(); }
        const bigTile = this.createBigTile(this.alignedTiles);

        let monsterCoords = this.getNormalizedMonsterCoordinates();
        const monsterLength = monsterCoords.length;

        let monsterCount = 0;
        for (let connector of bigTile.connectors) {
            monsterCount += this.countMonsters(monsterCoords, connector.image);
        }

        const total = bigTile.image.reduce((a, x) => a + x.split(SEA_MONSTER_MATCH).length - 1, 0);
        const roughness = total - monsterCount * monsterLength;

        return roughness;
    }

    private getNormalizedMonsterCoordinates() {
        // Convert monster image to coordinates
        let monsterCoords = _(SEA_MONSTER).flatMap((line, y) =>
            Array.from(line)
                .map((char, x) => ({ char, point: <Point>{ x, y } }))
                .filter(c => c.char === SEA_MONSTER_MATCH)
                .map(c => c.point)
        ).value();

        // Normalize coordinates, so that first match is (0,0)
        const firstCoord = monsterCoords[0];
        monsterCoords = monsterCoords.map(c => ({ x: c.x - firstCoord.x, y: c.y - firstCoord.y }));

        return monsterCoords;
    }

    private countMonsters(monsterPoints: Point[], map: string[]) {
        let monsterCount = 0;
        for (let y = 0; y < map.length; y++) {
            const line = map[y];
            for (let x = 0; x < line.length; x++) {
                const char = line[x];
                if (char !== SEA_MONSTER_MATCH) { continue; };

                let found = true;
                for (let point of monsterPoints) {
                    let x2 = x + point.x;
                    let y2 = y + point.y;
                    let line2 = map[y2];
                    if (!line2) { found = false; break; }
                    let char2 = line2[x2];
                    if (char2 !== SEA_MONSTER_MATCH) { found = false; break; }
                }

                if (found) {
                    monsterCount++;
                }
            }
        }

        return monsterCount;
    }

    private createBigTile(alignedTiles: TileConfig[]) {
        // Remove tile borders
        for (let tileConfig of alignedTiles) {
            let image = tileConfig.connector.image;
            tileConfig.connector.image = image
                .filter((l, i) => i > 0 && i < image.length - 1)
                .map(l => l.slice(1, l.length - 1));
        }

        const size = Math.floor(Math.sqrt(alignedTiles.length));
        const tileSize = alignedTiles[0].connector.image.length;
        const bigImage: string[] = [];

        // Construct a big image from tiles
        for (let i = 0; i < size; i++) {
            const complexRow: string[] = Array(tileSize).fill('');
            for (let j = 0; j < size; j++) {
                const index = i * size + j;
                const tileConfig = alignedTiles[index];
                for (let { line, lineIndex } of tileConfig.connector.image.map((line, lineIndex) => ({ line, lineIndex }))) {
                    complexRow[lineIndex] = complexRow[lineIndex] + line;
                }
            }
            bigImage.push(...complexRow);
        }

        const bigTile: Tile = { id: 'bigTile', image: bigImage, connectors: [] };
        this.fillConnectors(bigTile);

        return bigTile;
    }

    private alignTiles(size: number, remainingTiles: Map<string, Tile>, assembly: TileConfig[]): TileConfig[] {
        if (assembly.length === size * size) {
            return assembly;
        }

        let index = assembly.length;
        const tileArray = Array.from(remainingTiles.values());
        for (let tile of tileArray) {
            if (index === 0) {
                this.updateProgress(Math.min(.99, tileArray.indexOf(tile) * 2 / tileArray.length));
            }

            remainingTiles.delete(tile.id);
            for (let connector of tile.connectors) {
                let canConnect = true;

                const directions = (index % size) === 0 ? [TOP] : [LEFT, TOP];
                for (let direction of directions) {
                    const neighbor = assembly[index + this.directions[direction]];
                    if (!neighbor) { continue; }

                    if (connector.sides[direction] !== neighbor.connector.sides[(direction + 2) % 4]) {
                        canConnect = false;
                        break;
                    }
                }
                if (!canConnect) { continue; }

                assembly.push({ connector, tile });
                const result = this.alignTiles(size, remainingTiles, assembly);
                if (result) {
                    return result;
                }
                assembly.pop();
            }
            remainingTiles.set(tile.id, tile);
        }

        return null;
    }

    private fillConnectors(tile: Tile): void {
        let connector = this.getConnector(tile.image);
        tile.connectors.push(connector);
        for (let i = 0; i < 3; i++) {
            connector = this.rotateConnectorLeft(connector);
            if (!this.containsConnector(connector, tile.connectors)) {
                tile.connectors.push(connector);
            }
        }

        for (let connector of tile.connectors) {
            const connectorH = this.mirrorConnectorHorizontal(connector);
            if (!this.containsConnector(connectorH, tile.connectors)) {
                tile.connectors.push(connectorH);
            }

            const connectorV = this.mirrorConnectorVertical(connector);
            if (!this.containsConnector(connectorV, tile.connectors)) {
                tile.connectors.push(connectorV);
            }
        }
    }

    private containsConnector(mainConnector: Connector, connectors: Connector[]): boolean {
        return connectors.some(connector => {
            for (let i = 0; i < connector.sides.length; i++) {
                if (mainConnector.sides[i] !== connector.sides[i]) {
                    return false;
                }
            }
            return true;
        });
    }

    private rotateConnectorLeft(connector: Connector): Connector {
        return this.genericTransform(connector, (source, i, j, n) => source[n - j - 1][i]);
    }

    private mirrorConnectorHorizontal(connector: Connector): Connector {
        return this.genericTransform(connector, (source, i, j, n) => source[n - i - 1][j]);
    }

    private mirrorConnectorVertical(connector: Connector): Connector {
        return this.genericTransform(connector, (source, i, j, n) => source[i][n - j - 1]);
    }

    private genericTransform(connector: Connector, transform: (source: string[], i: number, j: number, n: number) => string): Connector {
        const size = connector.image.length;
        const source = connector.image;
        const target: string[][] = Array(size).fill(0).map(x => []);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                target[i][j] = transform(source, i, j, size);
            }
        }
        const image = target.map(x => x.join(''));

        return this.getConnector(image);
    }

    private getConnector(image: string[]): Connector {
        const top = image[0];
        const left = image.map(x => x[0]).join('');
        const right = image.map(x => x[x.length - 1]).join('');
        const bottom = image[image.length - 1];

        return { image, sides: [top, right, bottom, left] };
    }

    private parseTiles(): Tile[] {
        const tileRegex = /Tile ([0-9]+):/;
        let index = 0;
        let line: string;

        const tiles: Tile[] = [];
        while (index < this.inputLines.length) {
            const [, id] = tileRegex.exec(this.inputLines[index++]);
            const image: string[] = [];
            while (line = this.inputLines[index++]) {
                image.push(line);
            }
            tiles.push({ id, image, connectors: [] });
        }

        return tiles;
    }
}
