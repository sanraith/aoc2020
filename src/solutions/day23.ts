import _ = require('lodash');
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

type Cup = {
    value: number,
    prev?: Cup,
    next?: Cup
}

@solutionInfo({
    day: 23,
    title: 'Crab Cups'
})
export class Day23 extends SolutionBase {

    protected part1(): string {
        const cups = this.parseCups();
        const cupMap = this.play(cups, 100);
        const labels = this.getLinkedListValues(cupMap.get(1)).filter((x, i) => i > 0).join('');

        return labels;
    }

    protected part2(): number {
        const million = 1000000;
        const cups = this.parseCups();
        const maxCup = _(cups).max();
        for (let i = maxCup + 1; i <= million; i++) {
            cups.push(i);
        }

        const cupMap = this.play(cups, 10 * million);
        const cup1 = cupMap.get(1);

        return cup1.next.value * cup1.next.next.value;
    }

    private play(cups: number[], moveCount: number): Map<number, Cup> {
        const cupCount = cups.length;
        const { firstCup, cupMap } = this.convertToLinkedList(cups);

        let current = firstCup;
        for (let moveIndex = 0; moveIndex < moveCount; moveIndex++) {
            if (moveIndex % 100 === 0) { this.updateProgress(moveIndex / moveCount); }

            const pickUpStart = current.next;
            const pickUpEnd = pickUpStart.next.next;
            this.connect(current, pickUpEnd.next);

            let destinationValue = (current.value - 2 + cupCount) % cupCount + 1;
            while (pickUpStart.value === destinationValue ||
                pickUpStart.next.value === destinationValue ||
                pickUpEnd.value === destinationValue) {
                destinationValue = (destinationValue - 2 + cupCount) % cupCount + 1;
            }

            const destination = cupMap.get(destinationValue);
            this.connect(pickUpEnd, destination.next);
            this.connect(destination, pickUpStart);

            current = current.next;
        }

        return cupMap;
    }

    private connect(a: Cup, b: Cup) {
        if (a.next) { a.next.prev = null; }
        if (b.prev) { b.prev.next = null; }
        a.next = b;
        b.prev = a;
    }

    private getLinkedListValues(startItem: Cup): number[] {
        let item = startItem;
        const values: number[] = [];
        do {
            values.push(item.value);
            item = item.next;
        } while (item !== startItem);

        return values;
    }

    private convertToLinkedList(cups: number[]): { firstCup: Cup, cupMap: Map<number, Cup> } {
        let prevItem: Cup = { value: cups[0] };
        const firstCup = prevItem;
        const cupMap = new Map<number, Cup>([[prevItem.value, prevItem]]);

        for (let i = 1; i < cups.length; i++) {
            const item: Cup = {
                value: cups[i],
                prev: prevItem
            };
            cupMap.set(item.value, item);
            prevItem.next = item;
            prevItem = item;
        }
        firstCup.prev = prevItem;
        prevItem.next = firstCup;

        return { firstCup, cupMap };
    }

    private parseCups(): number[] {
        return this.inputLines[0].split('').map(x => parseInt(x));
    }
}
