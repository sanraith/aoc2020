import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

@solutionInfo({
    day: 22,
    title: 'Crab Combat'
})
export class Day22 extends SolutionBase {

    protected part1(): number {
        const decks = this.parseDecks();
        while (decks.every(x => x.length > 0)) {
            const a = decks[0].shift();
            const b = decks[1].shift();
            if (a > b) {
                decks[0].push(a, b);
            } else {
                decks[1].push(b, a);
            }
        }

        const score = decks.filter(x => x.length > 0)[0]
            .reverse()
            .reduce((a, x, i) => a + x * (i + 1), 0);

        return score;
    }

    protected part2(): string {
        return 'Day22Part2';
    }

    private parseDecks(): number[][] {
        const decks: number[][] = [];
        let lineIndex = 0;
        let line: string;

        for (let i = 0; i < 2; i++) {
            lineIndex++;
            const deck: number[] = [];
            while ((line = this.inputLines[lineIndex++]) && line.length > 0) {
                deck.push(parseInt(line));
            }
            decks.push(deck);
        }

        return decks;
    }
}
