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
        const regex = new RegExp(regexStr, 'm');
        let matchCount = messages.filter(m => regex.test(m)).length;

        return matchCount;
    }

    protected part2(): number {
        const part1MatchCount = this.part1();
        const { rules, messages } = this.parseRules();
        const mainRule = rules.get('0');

        // Add loop to rules
        const r8 = rules.get('8');
        const r11 = rules.get('11');
        const r31 = rules.get('31');
        const r42 = rules.get('42');
        r8.options = [[r42], [r42, r8]];
        r11.options = [[r42, r31], [r42, r11, r31]];

        // Brute force with 5 recursion levels (can fail for other inputs...)
        const maxRecursionLevel = 5;
        let regexps: RegExp[] = [];
        for (let l1 = 0; l1 < maxRecursionLevel; l1++) {
            for (let l2 = 0; l2 < maxRecursionLevel; l2++) {
                let regexStr = this.convertRuleToRegexStr(mainRule, new Map([[r8, l1], [r11, l2]]));
                regexStr = `^${regexStr}$`;
                const regex = new RegExp(regexStr, 'm');
                regexps.push(regex);
            }
        }

        let matchCount = 0;
        for (let [i, message] of messages.entries()) {
            for (let [j, regex] of regexps.entries()) {
                this.updateProgress(Math.min(.99, (i + part1MatchCount) / messages.length + j / regexps.length / messages.length));

                if (regex.test(message)) {
                    matchCount++;
                    break;
                }
            }
        }

        return matchCount;
    }

    private convertRuleToRegexStr(rule: Rule,
        maxRecursion: Map<Rule, number> = undefined,
        recursion: Map<Rule, number> = undefined): string {

        if (rule.onlyHasStringPart) {
            return rule.onlyHasStringPart;
        }

        if (maxRecursion === undefined) { maxRecursion = new Map<Rule, number>(); }
        if (recursion === undefined) { recursion = new Map<Rule, number>(Array.from(maxRecursion.keys()).map(x => [x, 0])); }

        const regexParts = [];
        let nextRecursion = recursion;
        if (maxRecursion.has(rule)) {
            nextRecursion = new Map(recursion.entries());
            nextRecursion.set(rule, recursion.get(rule) + 1);
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
                    optionParts.push(this.convertRuleToRegexStr(part, maxRecursion, nextRecursion));
                }
                if (invalid) {
                    break;
                }
            }
            if (!invalid) {
                regexParts.push(optionParts.join(''));
            }
        }

        return `(?:${regexParts.join('|')})`;
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
