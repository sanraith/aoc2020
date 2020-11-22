import { Component, Input, OnInit } from '@angular/core';
import { Stopwatch } from 'ts-stopwatch';
import { SolutionInfo } from '../../../core/solutionInfo';
import { SolutionError, SolutionResult } from '../../../core/solutionProgress';
import { InputService } from '../services/input.service';
import { WorkerService } from '../services/worker.service';

type Result = {
    value?: string,
    time?: number,
    onGoing?: boolean,
    percentage?: number,
    stopwatch?: Stopwatch,
    updateTimeout?: NodeJS.Timeout
};

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
    @Input() solutionInfo: SolutionInfo;

    input = '';
    results: Result[] = [{}, {}];
    isBusy: boolean;
    isInputFieldVisible: boolean;

    get twoLetterDay(): string { return this.solutionInfo.day.toString().padStart(2, '0'); }
    get hasOngoingSolution(): boolean { return this.results.some(x => x.onGoing); }

    private cancelSolutionWorker: (() => void);

    constructor(
        private workerService: WorkerService,
        private inputService: InputService) { }

    ngOnInit(): void {
        this.loadInput();
    }

    toggleInput() {
        this.isInputFieldVisible = !this.isInputFieldVisible;
    }

    async solve() {
        this.isBusy = true;
        this.results = [{}, {}];

        const { observable, cancel } = this.workerService.solve(this.solutionInfo.day, this.input);
        this.cancelSolutionWorker = cancel;
        this.endPartAndStartNextPart();

        observable.subscribe({
            next: state => {
                const result = this.results[state.part - 1];
                result.onGoing = true;
                switch (state.type) {
                    case 'result':
                        result.value = state.result;
                        break;
                    case 'error':
                        result.value = 'error';
                        break;
                    case 'progress':
                        result.percentage = state.percentage * 100;
                        break;
                }
                if (state.type === 'result' || state.type === 'error') {
                    this.endPartAndStartNextPart(state);
                }
            },
            complete: () => {
                this.isBusy = false;
                this.cancelSolutionWorker = null;
            }
        });
    }

    cancel() {
        if (!this.cancelSolutionWorker) {
            return;
        }
        this.cancelSolutionWorker();
        this.results.filter(x => x.value === undefined).forEach(x => x.value = 'Canceled.');
        this.endPart(this.results.find(x => x.onGoing));
    }

    private endPartAndStartNextPart(state: SolutionResult | SolutionError = undefined) {
        const currentPart = state ? state.part : 0;

        // End current part
        if (currentPart > 0) {
            const currentResult = this.results[currentPart - 1];
            this.endPart(currentResult);
            currentResult.time = state.timeMs;
        }

        // Start next part
        if (currentPart < 2) {
            const result = this.results[currentPart];
            result.onGoing = true;
            result.stopwatch = new Stopwatch();
            result.stopwatch.start();
            this.updateResultTime(result);
        }
    }

    private endPart(result: Result) {
        result.onGoing = false;
        result.stopwatch?.stop();
        clearTimeout(result.updateTimeout);
    }

    private updateResultTime(result: Result) {
        if (result.onGoing) {
            result.time = result.stopwatch.getTime();
            result.updateTimeout = setTimeout(() => this.updateResultTime(result), 50);
        }
    }

    private async loadInput() {
        this.isBusy = true;
        this.input = await this.inputService.getInput(this.solutionInfo.day);
        this.isBusy = false;
    }
}
