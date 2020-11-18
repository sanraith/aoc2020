import { Component, OnInit } from '@angular/core';
import { solutionManager } from '../../core/solutionManager';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Advent of Code 2020 in Typescript';
    dayRows = Array(5 * 7).fill(-1)
        .map((_, i) => i > 0 && i <= 31 ? i : -1)
        .reduce((a, x, i) => {
            (a[Math.floor(i / 7)] ?? a[a.push([]) - 1]).push(x);
            return a;
        }, []);

    solutionInfos = solutionManager.getSolutions();

    constructor() { }

    ngOnInit(): void {
    }
}
