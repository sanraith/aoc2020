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
    results: string[] = Array(2).fill('');
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
        for (let i = 0; i < 2; i++) {
            let state = await this.workerService.solve(this.solutionInfo.day, i + 1, this.input).toPromise();
            switch (state.type) {
                case 'result':
                    this.results[i] = state.result; break;
                case 'error':
                    this.results[i] = 'error'; break;
            }
        }
        this.isBusy = false;
    }

    private async loadInput() {
        this.isBusy = true;
        this.input = await this.inputService.getInput(this.solutionInfo.day);
        this.isBusy = false;
    }
}
