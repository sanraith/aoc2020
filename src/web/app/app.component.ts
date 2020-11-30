import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { solutionManager } from '../../core/solutionManager';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
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

    scrollToAnchor(elementId: string) {
        this.viewPortScroller.scrollToAnchor(elementId);
    }
}
