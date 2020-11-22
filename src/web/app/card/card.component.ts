import { Component, Input, OnInit } from '@angular/core';
import { SolutionInfo } from '../../../core/solutionInfo';
import { InputService } from '../services/input.service';
import { WorkerService } from '../services/worker.service';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
    @Input() solutionInfo: SolutionInfo;

    input = '';
    results: {
        value?: string,
        time?: number,
        onGoing?: boolean,
        percentage?: number
    }[] = [{}, {}];
    isBusy: boolean;
    isInputFieldVisible: boolean;

    get twoLetterDay(): string { return this.solutionInfo.day.toString().padStart(2, '0'); }

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
        this.results = [{ onGoing: true }, {}];
        this.workerService.solve(this.solutionInfo.day, this.input).subscribe({
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
                        result.time = state.timeMs;
                        break;
                }
                if (state.type === 'result' || state.type === 'error') {
                    result.time = state.timeMs;
                    result.onGoing = false;
                    if (this.results[state.part]) { this.results[state.part].onGoing = true; }
                }
            },
            complete: () => { this.isBusy = false; }
        });
    }

    private async loadInput() {
        this.isBusy = true;
        this.input = await this.inputService.getInput(this.solutionInfo.day);
        this.isBusy = false;
    }
}
