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

    input = '100756'; // TODO populate from input files
    results: string[] = Array(2).fill('');
    isBusy: boolean;

    constructor(
        private workerService: WorkerService,
        private inputService: InputService) { }

    ngOnInit(): void {
        this.loadInput();
    }

    async solve() {
        this.isBusy = true;
        for (let i = 0; i < 2; i++) {
            let state = await this.workerService.solve(this.solutionInfo.day, i + 1, this.input).toPromise();
            switch (state.type) {
                case 'result':
                    this.results[i] = state.result; this.isBusy = false; break;
                case 'error':
                    this.results[i] = 'error'; this.isBusy = false; break;
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
