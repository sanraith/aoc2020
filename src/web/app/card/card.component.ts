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
        time?: number
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
        this.results = [{}, {}];
        this.workerService.solve(this.solutionInfo.day, this.input).subscribe({
            next: state => {
                const result = this.results[state.part - 1];
                switch (state.type) {
                    case 'result':
                        result.value = state.result;
                        result.time = state.timeMs;
                        break;
                    case 'error':
                        result.value = 'error';
                        result.time = state.timeMs;
                        break;
                    case 'progress':
                        // TODO handle progress information
                        break;
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
