import { regexGetAllResults } from '../core/helpers';
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

type Instruction = { action: string, value: number };
type Pos = { x: number, y: number }

const directionMap = new Map<string, number>(['N', 'E', 'S', 'W'].map((x, i) => [x, i]));
const directions: Pos[] = [[0, 1], [1, 0], [0, -1], [-1, 0]].map(p => ({ x: p[0], y: p[1] }));

@solutionInfo({
    day: 12,
    title: 'Rain Risk'
})
export class Day12 extends SolutionBase {

    protected part1(): number {
        const instructions = this.parseInstructions();

        let pos = { x: 0, y: 0 };
        let facingIndex = directionMap.get('E');
        for (let { action, value } of instructions) {
            const targetDirection = directionMap.get(action);
            if (targetDirection !== undefined) {
                pos = this.add(pos, directions[targetDirection], value);
            } else {
                switch (action) {
                    case 'L': facingIndex = (4 + facingIndex - value / 90) % 4; break;
                    case 'R': facingIndex = (facingIndex + value / 90) % 4; break;
                    case 'F': pos = this.add(pos, directions[facingIndex], value); break;
                    default: throw new Error('Unknown action!');
                }
            }
        }

        return Math.abs(pos.x) + Math.abs(pos.y);
    }

    protected part2(): number {
        const instructions = this.parseInstructions();

        let pos = { x: 0, y: 0 };
        let wp = { x: 10, y: 1 };
        for (let { action, value } of instructions) {
            const targetDirection = directionMap.get(action);
            if (targetDirection !== undefined) {
                wp = this.add(wp, directions[targetDirection], value);
            } else {
                switch (action) {
                    case 'L': wp = this.rotate(wp, value); break;
                    case 'R': wp = this.rotate(wp, -value); break;
                    case 'F': pos = this.add(pos, wp, value); break;
                    default: throw new Error('Unknown action!');
                }
            }
        }

        return Math.abs(pos.x) + Math.abs(pos.y);
    }

    private rotate(pos: Pos, degrees: number): Pos {
        const length = Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2));
        const currentDegAngle = this.radiansToDegrees(Math.atan2(pos.y, pos.x));
        const newDegAngle = currentDegAngle + degrees;
        const newRadAngle = this.degreesToRadians(newDegAngle);
        const newPos = {
            x: Math.round(Math.cos(newRadAngle) * length),
            y: Math.round(Math.sin(newRadAngle) * length)
        };

        return newPos;
    }

    private degreesToRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    private radiansToDegrees(radians: number): number {
        return radians * (180 / Math.PI);
    }

    private add(a: Pos, b: Pos, multiplier: number): Pos {
        return { x: a.x + b.x * multiplier, y: a.y + b.y * multiplier };
    }

    private parseInstructions(): Instruction[] {
        const instructionRegex = /([A-Z])([0-9]+)/g;
        const instructions: Instruction[] = [];
        for (let [, action, value] of regexGetAllResults(instructionRegex, this.input)) {
            instructions.push({ action, value: parseInt(value) });
        }

        return instructions;
    }
}
