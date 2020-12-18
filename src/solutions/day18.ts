import { regexGetAllResults } from '../core/helpers';
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

@solutionInfo({
    day: 18,
    title: 'Operation Order'
})
export class Day18 extends SolutionBase {

    protected part1(): number {
        let sum = 0;
        for (let line of this.inputLines) {
            sum += parseInt(this.solveComplex(line, { additionPrecedence: false }));
        }

        return sum;
    }

    protected part2(): number {
        let sum = 0;
        for (let line of this.inputLines) {
            sum += parseInt(this.solveComplex(line, { additionPrecedence: true }));
        }

        return sum;
    }

    private solveComplex(expression: string, options: { additionPrecedence: boolean }): string {
        const precedenceRegex = /\([^\(\)]+\)/g;
        let matches: RegExpExecArray[];

        while ((matches = regexGetAllResults(precedenceRegex, expression)).length > 0) {
            for (let [part] of matches) {
                const solvedPart = this.solveComplex(part.slice(1, part.length - 1), options);
                expression = expression.replace(part, solvedPart);
            }
        }

        if (options.additionPrecedence) {
            const additionRegex = /\d+ \+ \d+/g;
            while ((matches = regexGetAllResults(additionRegex, expression)).length > 0) {
                for (let [part] of matches) {
                    const solvedPart = this.solveSimple(part);
                    expression = expression.replace(part, solvedPart);
                }
            }
        }

        return this.solveSimple(expression);
    }

    private solveSimple(expression: string): string {
        const parts = expression.split(' ');
        let result = parseInt(parts[0]);
        for (let i = 1; i < parts.length; i += 2) {
            const operation = parts[i];
            const value = parts[i + 1];
            switch (operation) {
                case '+': result += parseInt(value); break;
                case '*': result *= parseInt(value); break;
                default: throw new Error(`Unknown operation: ${operation}`);
            }
        }

        return result.toString();
    }
}
