import { toNumber } from 'lodash';
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

type State = { acc: number, ip: number };
type Instruction = { opCode: string, arg: number };
type operation = (s: State, arg: number) => void;

@solutionInfo({
    day: 8,
    title: 'Handheld Halting'
})
export class Day08 extends SolutionBase {

    private operations = new Map<string, operation>([
        ['acc', (s, arg) => s.acc += arg],
        ['jmp', (s, arg) => s.ip += arg - 1],
        ['nop', () => { }]
    ]);

    protected part1(): number {
        const source = this.parseSource();
        const state = this.runUntilInfiniteLoop(source);

        return state.acc;
    }

    protected part2(): number {
        const source = this.parseSource();
        for (let i = 0; i < source.length; i++) {
            const instruction = source[i];
            if (instruction.opCode === 'acc') { continue; }

            const modifiedSource = source.slice();
            modifiedSource[i] = {
                opCode: instruction.opCode === 'nop' ? 'jmp' : 'nop',
                arg: instruction.arg
            };

            const state = this.runUntilInfiniteLoop(modifiedSource);
            if (state.ip === modifiedSource.length) {
                return state.acc;
            }
        }

        return undefined;
    }

    private runUntilInfiniteLoop(program: Instruction[]): State {
        const state = { acc: 0, ip: 0 };
        const visited = new Set<number>();

        while (!visited.has(state.ip) && state.ip < program.length) {
            visited.add(state.ip);
            const instruction = program[state.ip];
            const operation = this.operations.get(instruction.opCode);
            operation(state, instruction.arg);
            state.ip++;
        }

        return state;
    }

    private parseSource(): Instruction[] {
        const instructionRegex = /^([a-z]+) ([+\-0-9]+)$/;
        const program: Instruction[] = [];
        for (let line of this.inputLines) {
            const [, opCode, argumentStr] = instructionRegex.exec(line);
            const arg = toNumber(argumentStr);
            program.push({ opCode, arg });
        }

        return program;
    }
}
