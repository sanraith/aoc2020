import { regexGetAllResults } from '../core/helpers';
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

export type Bag = {
    type: string,
    parents: Bag[],
    children: { bag: Bag, count: number }[]
}

export type Day07Data = {
    bags: Map<string, Bag>,
    myBag: Bag
}

@solutionInfo({
    day: 7,
    title: 'Handy Haversacks'
})
export class Day07 extends SolutionBase {

    protected part1(): number {
        const bags = this.parseBags();
        const myBag = bags.get('shiny gold');
        const parentCount = this.countAllParents(myBag);
        this.visualizationData = <Day07Data>{ bags, myBag };

        return parentCount;
    }

    protected part2(): number {
        const bags = this.parseBags();
        const childCount = this.countAllChildren(bags.get('shiny gold'));

        return childCount;
    }

    private countAllParents(bag: Bag, parents: Set<string> = undefined): number {
        parents = parents ?? new Set<string>();
        for (let parent of bag.parents) {
            if (!parents.has(parent.type)) {
                parents.add(parent.type);
                this.countAllParents(parent, parents);
            }
        }

        return parents.size;
    }

    private countAllChildren(parent: Bag, multiplier: number = 1): number {
        let sum = 0;
        for (let { bag, count } of parent.children) {
            sum += count * multiplier;
            sum += this.countAllChildren(bag, count * multiplier);
        }

        return sum;
    }

    private parseBags(): Map<string, Bag> {
        const lineRegex = /^([a-z]+ [a-z]+) bags contain (?:no other bags|(.+))\.$/;
        const bags = new Map<string, Bag>();
        for (let line of this.inputLines) {
            const [, type, innerBagsStr] = lineRegex.exec(line);
            const bag = this.getOrCreateBag(type, bags);
            if (innerBagsStr) {
                this.parseInnerBags(innerBagsStr, bag, bags);
            }
        }

        return bags;
    }

    private parseInnerBags(innerBagsStr: string, parent: Bag, bags: Map<string, Bag>): void {
        const innerRegex = /([0-9]+) ([a-z]+ [a-z]+) bags?/g;
        for (let record of regexGetAllResults(innerRegex, innerBagsStr)) {
            const [, countStr, type] = record;
            const count = parseInt(countStr);
            const bag = this.getOrCreateBag(type, bags);
            bag.parents.push(parent);
            parent.children.push({ bag, count });
        }
    }

    private getOrCreateBag(type: string, bags: Map<string, Bag>): Bag {
        let bag = bags.get(type);
        if (!bag) {
            bag = { type, parents: [], children: [] };
            bags.set(bag.type, bag);
        }
        return bag;
    }
}
