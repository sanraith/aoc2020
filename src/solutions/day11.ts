import * as _ from 'lodash';
import SolutionBase from '../core/solutionBase';
import { solutionInfo } from '../core/solutionInfo';

const FLOOR = '.';
const EMPTY = 'L';
const OCCUPIED = '#';

const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
];

type Rules = {
    noticeSeatsFromAfar: boolean;
    minAdjacentOccupiedToBecomeEmpty: number;
};

@solutionInfo({
    day: 11,
    title: 'Seating System'
})
export class Day11 extends SolutionBase {

    protected part1(): number {
        const seats = this.parseSeats();
        const result = this.progressSeats(seats, {
            noticeSeatsFromAfar: false,
            minAdjacentOccupiedToBecomeEmpty: 4
        });

        return _(result).flatMap().filter(x => x === OCCUPIED).size();
    }

    protected part2(): number {
        const seats = this.parseSeats();
        const result = this.progressSeats(seats, {
            noticeSeatsFromAfar: true,
            minAdjacentOccupiedToBecomeEmpty: 5
        });

        return _(result).flatMap().filter(x => x === OCCUPIED).size();
    }

    private progressSeats(seats: string[][], rules: Rules): string[][] {
        const rowCount = seats.length;
        const columnCount = seats[0].length;
        const maxOccupiedNoticeDistance = rules.noticeSeatsFromAfar ? undefined : 1;
        const maxChangeCount = _(seats).flatMap().filter(x => x !== FLOOR).size();

        let prev = seats.map(r => r.map(s => s));
        let changeCount = maxChangeCount;

        while (changeCount > 0) {
            changeCount = 0;
            [seats, prev] = [prev, seats];

            for (let row = 0; row < rowCount; row++) {
                for (let column = 0; column < columnCount; column++) {
                    let seat = prev[row][column];
                    if (seat === FLOOR) { continue; }

                    const occupiedCount = this.getOccupiedAdjacentCount(prev, row, column, maxOccupiedNoticeDistance);
                    if (seat === EMPTY && occupiedCount === 0) {
                        seat = OCCUPIED;
                        changeCount++;
                    } else if (seat === OCCUPIED && occupiedCount >= rules.minAdjacentOccupiedToBecomeEmpty) {
                        seat = EMPTY;
                        changeCount++;
                    }
                    seats[row][column] = seat;
                }
            }
            this.updateProgress((maxChangeCount - changeCount) / maxChangeCount);
        };

        return seats;
    }

    private getOccupiedAdjacentCount(seats: string[][], row: number, col: number, maxDistance = Number.MAX_VALUE) {
        let count = 0;
        for (let [dRow, dCol] of directions) {
            let distance = 0;
            let adjacentSeat: string;
            do {
                distance++;
                const adjacentRow = seats[row + distance * dRow];
                adjacentSeat = adjacentRow ? adjacentRow[col + distance * dCol] : undefined;
                if (adjacentSeat === OCCUPIED) {
                    count++;
                }
            } while (distance < maxDistance && adjacentSeat === FLOOR);
        }

        return count;
    }

    private parseSeats(): string[][] {
        return this.inputLines.map(x => x.split(''));
    }
}
