import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

type Rule = {
    index: string,
    options: (Rule | string)[][];
    onlyHasStringPart?: string;
};

@solutionInfo({
    day: 19,
    title: 'Monster Messages'
})
export class Day19 extends SolutionBase {

    protected part1(): number {
        const { rules, messages } = this.parseRules();
        const mainRule = rules.get('0');
        const regexStr = `^${this.convertRuleToRegexStr(mainRule)}$`;
        console.log(regexStr);
        const regex = new RegExp(regexStr, 'm');

        let count = 0;
        for (let message of messages) {
            if (regex.test(message)) {
                count++;
            }
        }

        return count;
    }

    protected part2(): number {
        const { rules, messages } = this.parseRules();
        const mainRule = rules.get('0');

        // Add loop to rules
        const r8 = rules.get('8');
        const r11 = rules.get('11');
        const r31 = rules.get('31');
        const r42 = rules.get('42');
        r8.options = [[r42], [r42, r8]];
        r11.options = [[r42, r31], [r42, r11, r31]];

        // Brute force with 4 recursion levels (can fail for other inputs...)
        let regexps: RegExp[] = [];
        for (let r1 = 0; r1 < 4; r1++) {
            for (let r2 = 0; r2 < 4; r2++) {
                let regexStr = this.convertRuleToRegexStrPart2(mainRule, new Map([[r8, r1], [r11, r2]]), new Map([[r8, 0], [r11, 0]]));
                regexStr = `^${regexStr}$`;
                const regex = new RegExp(regexStr, 'm');
                regexps.push(regex);
            }
        }

        let count = 0;
        for (let { message, i } of messages.map((message, i) => ({ message, i }))) {
            for (let { regex, j } of regexps.map((regex, j) => ({ regex, j }))) {
                this.updateProgress(i / messages.length + j / regexps.length / messages.length);
                if (regex.test(message)) {
                    count++;
                    break;
                }
            }
        }

        return count;
    }

    private convertRuleToRegexStr(rule: Rule): string {
        const regexParts = [];

        if (rule.onlyHasStringPart) {
            return rule.onlyHasStringPart;
        }

        for (let option of rule.options) {
            const optionParts = [];
            for (let part of option) {
                if (typeof (part) === 'string') {
                    optionParts.push(part);
                } else {
                    optionParts.push(this.convertRuleToRegexStr(part));
                }
            }
            regexParts.push('' + optionParts.join('') + '');
        }

        return `(${regexParts.map(x => `(${x})`).join('|')})`;
    }


    private convertRuleToRegexStrPart2(rule: Rule, maxRecursion: Map<Rule, number> = undefined,
        recursion: Map<Rule, number> = undefined): string {

        const regexParts = [];
        let nextRecursion = recursion;
        if (Array.from(maxRecursion.keys()).includes(rule)) {
            nextRecursion = new Map(recursion.entries());
            nextRecursion.set(rule, recursion.get(rule) + 1);
        }

        if (rule.onlyHasStringPart) {
            return rule.onlyHasStringPart;
        }

        for (let option of rule.options) {
            let invalid = false;
            const optionParts = [];
            for (let part of option) {
                if (typeof (part) === 'string') {
                    optionParts.push(part);
                } else {
                    if (recursion.get(part) > maxRecursion.get(part)) {
                        invalid = true;
                        break;
                    }
                    optionParts.push(this.convertRuleToRegexStrPart2(part, maxRecursion, nextRecursion));
                }
                if (invalid) {
                    break;
                }
            }
            if (!invalid) {
                regexParts.push('' + optionParts.join('') + '');
            }
        }

        return `(${regexParts.map(x => `(${x})`).join('|')})`;
    }

    private parseRules() {
        const ruleRegex = /([0-9]+): (.+)/;
        const numberRegex = /^[0-9]+$/;
        const stringRegex = /^"([a-z]+)"$/;

        const rules = new Map<string, Rule>();

        let line: string;
        let lineIndex = 0;
        while ((line = this.inputLines[lineIndex++]).length > 0) {
            const [, ruleIndexStr, partsStr] = ruleRegex.exec(line);
            const rule = this.getOrCreateRule(ruleIndexStr, rules);
            const orParts = partsStr.split(' | ');
            for (let orPart of orParts) {
                const orList = [];
                rule.options.push(orList);
                const parts = orPart.split(' ');
                for (let part of parts) {
                    if (numberRegex.test(part)) {
                        const innerRule = this.getOrCreateRule(part, rules);
                        orList.push(innerRule);
                    } else {
                        const [, stringPart] = stringRegex.exec(part);
                        orList.push(stringPart);
                        rule.onlyHasStringPart = stringPart;
                    }
                }
            }
        }

        const messages: string[] = [];
        for (let i = lineIndex; i < this.inputLines.length; i++) {
            messages.push(this.inputLines[i]);
        }

        return { rules, messages };
    }

    private getOrCreateRule(index: string, rules: Map<string, Rule>): Rule {
        let rule = rules.get(index);
        if (!rule) {
            rule = { index, options: [] };
            rules.set(index, rule);
        }

        return rule;
    }
}
