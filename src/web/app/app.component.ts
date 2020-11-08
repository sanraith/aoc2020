import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Advent of Code 2020 in Typescript';
    number?: number;

    constructor() { }

    ngOnInit(): void {
    }
}

if (typeof Worker !== 'undefined') {
    // Create a new
    const worker = new Worker('./solution.worker', { type: 'module' });
    worker.onmessage = ({ data }) => {
        console.log(`page got message: ${data}`);
    };
    worker.postMessage('hello');
} else {
    // Web Workers are not supported in this environment.
    // You should add a fallback so that your program still executes correctly.
}
