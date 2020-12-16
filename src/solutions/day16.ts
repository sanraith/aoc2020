import _ = require('lodash');
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

type Range = { min: number, max: number };
type Field = { name: string, ranges: Range[] }

@solutionInfo({
    day: 16,
    title: 'Ticket Translation'
})
export class Day16 extends SolutionBase {

    relevantFieldFilter: (n: string) => boolean = name => name.startsWith('departure');

    protected part1(): number {
        const { rules, nearbyTickets } = this.parseInput();

        let errorRate = 0;
        for (let value of _(nearbyTickets).flatMap().value()) {
            const matchedRules = rules.filter(rule => this.checkValue(value, rule));
            if (matchedRules.length === 0) {
                errorRate += value;
            }
        }

        return errorRate;
    }

    protected part2(): number {
        const { rules, myTicket, nearbyTickets } = this.parseInput();
        const validTickets = nearbyTickets.filter(t => t.every(v => rules.some(r => this.checkValue(v, r))));
        const validFields = this.filterValidRulesByField(rules, validTickets);

        const fieldFrequency = new Map<Field, number>(rules.map(f => [f, 0]));
        _(validFields).flatMap().forEach(f => fieldFrequency.set(f, fieldFrequency.get(f) + 1));
        const sortedValidFieldsByFrequency = validFields.map(f => f.sort((a, b) => fieldFrequency.get(a) - fieldFrequency.get(b)));

        const fieldOrder = this.backtrackFieldOrder(sortedValidFieldsByFrequency);

        const myRelevantFields = fieldOrder
            .map((r, i) => ({ name: r.name, index: i }))
            .filter(x => this.relevantFieldFilter(x.name))
            .map(x => myTicket[x.index]);

        const result = myRelevantFields.reduce((a, x) => a * x, 1);
        return result;
    }

    private filterValidRulesByField(rules: Field[], tickets: number[][]): Field[][] {
        const validFields: Field[][] = Array(rules.length).fill(0).map(_ => []);
        for (let ticketIndex = 0; ticketIndex < rules.length; ticketIndex++) {
            for (let rule of rules) {
                const isValid = tickets.every(t => this.checkValue(t[ticketIndex], rule));
                if (isValid) {
                    validFields[ticketIndex].push(rule);
                }
            }
        }
        return validFields;
    }

    private backtrackFieldOrder(validRules: Field[][], order: Field[] = []): Field[] {
        const ticketIndex = order.length;
        const shouldUpdateProgress = order.length === 0;
        for (let rule of validRules[ticketIndex]) {
            if (order.includes(rule)) { continue; }
            if (shouldUpdateProgress) {
                this.updateProgress(Math.min(.99, validRules[ticketIndex].indexOf(rule) * 1.5 / validRules.length));
            }

            order.push(rule);
            if (order.length === validRules.length) {
                return order;
            }

            let applicable = true;
            for (let nextIndex = ticketIndex + 1; nextIndex < validRules.length; nextIndex++) {
                applicable = applicable && validRules[nextIndex].some(x => !order.includes(x));
                if (!applicable) { break; }
            }

            if (applicable) {
                const result = this.backtrackFieldOrder(validRules, order);
                if (result) {
                    return order;
                }
            }
            order.pop();
        }

        return null;
    }

    private checkValue(value: number, rule: Field) {
        for (let { min, max } of rule.ranges) {
            if (value >= min && value <= max) {
                return true;
            }
        }
        return false;
    }

    private parseInput() {
        const ruleRegex = /([\S ]+): (\d+)-(\d+) or (\d+)-(\d+)/;

        let lineIndex = 0;
        let line: string;
        const rules: Field[] = [];
        while ((line = this.inputLines[lineIndex++]).length !== 0) {
            const [, name, ...rangesStr] = ruleRegex.exec(line);
            const ranges = rangesStr.map(x => parseInt(x)).reduce((a, x, i) => {
                if (i % 2 === 0) { a.push({ min: x, max: 0 }); }
                else { a[a.length - 1].max = x; }
                return a;
            }, []);
            rules.push({ name, ranges });
        }

        lineIndex++;
        const myTicket = this.inputLines[lineIndex].split(',').map(x => parseInt(x));

        lineIndex += 3;
        const nearbyTickets: number[][] = [];
        while ((line = this.inputLines[lineIndex++]) !== undefined) {
            const ticket = line.split(',').map(x => parseInt(x));
            nearbyTickets.push(ticket);
        }

        return { rules, myTicket, nearbyTickets };
    }
}
