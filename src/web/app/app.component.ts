import { ViewportScroller } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { timeoutAsync } from '../../core/helpers';
import { SolutionInfo, solutionManager } from '../../core/solutionManager';
import { CardComponent } from './card/card.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChildren(CardComponent)
    cards: QueryList<CardComponent>;
    activeSolutionInfo: SolutionInfo;

    title = 'Advent of Code 2020 in Typescript';
    solutionInfos = solutionManager.getSolutions();
    solutionInfosByDay = solutionManager.getSolutionsByDay();
    dayRows: { number: number, hasSolution: boolean }[][] = Array(5 * 7).fill(-1)
        .map((_, i) => i > 0 && i <= 31 ? i : -1)
        .reduce((a, x, i) => {
            a[Math.floor(i / 7)].push({
                number: x,
                hasSolution: this.solutionInfosByDay.has(x)
            });
            return a;
        }, Array(5).fill(0).map(_ => []));

    constructor(private viewPortScroller: ViewportScroller) { }

    ngOnInit(): void { }

    async solveAllAsync() {
        for (let card of this.cards) {
            this.activeSolutionInfo = card.solutionInfo;
            const currentDay = card.solutionInfo.day;
            const scrollToDay = Math.max(1, currentDay - 1);
            this.scrollToAnchor('day' + scrollToDay);
            await timeoutAsync(300);
            await card.solve();
            await timeoutAsync(700);
        }
        this.activeSolutionInfo = null;
    }

    scrollToAnchor(elementId: string): void {
        this.viewPortScroller.scrollToAnchor(elementId);
    }
}
