import { Component, OnInit } from '@angular/core';

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

    constructor() { }

    ngOnInit(): void {
    }
}

if (typeof Worker !== 'undefined') {
    // Create a new web worker
    const worker = new Worker('./solution.worker', { type: 'module' });
    worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
    };
    worker.postMessage('hello');
} else {
    // Web Workers are not supported in this environment.
    // You should add a fallback so that your program still executes correctly.
}
