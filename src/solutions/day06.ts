import { regexGetAllResults } from '../core/helpers';
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

type Group = { answers: Map<string, number>, groupSize: number };

@solutionInfo({
    day: 6,
    title: 'Custom Customs'
})
export class Day06 extends SolutionBase {

    protected part1(): number {
        let sum = 0;
        for (let { answers } of this.getGroups()) {
            sum += Array.from(answers.keys()).length;
        }

        return sum;
    }

    protected part2(): number {
        let sum = 0;
        for (let { answers, groupSize } of this.getGroups()) {
            const value = Array.from(answers.values()).filter(x => x === groupSize).length;
            sum += value;
        }

        return sum;
    }

    private getGroups(): Group[] {
        const doubleNewLineRegex = /\r\n\r\n|\n\n/g;
        const groupStrings = this.input.split(doubleNewLineRegex);

        return groupStrings.map(s => this.parseGroup(s));
    }

    private parseGroup(groupStr: string): Group {
        const answers = new Map<string, number>();
        const records = regexGetAllResults(/[a-z]+/g, groupStr);
        for (let [form] of records) {
            for (let answer of form) {
                answers.set(answer, (answers.get(answer) ?? 0) + 1);
            }
        }

        return { answers, groupSize: records.length };
    }
}
