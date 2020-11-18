import { Component, Input, OnInit } from '@angular/core';
import { SolutionInfo } from '../../../core/solutionInfo';
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

    constructor(private worker: WorkerService) { }

    ngOnInit(): void {
    }

    async solve() {
        for (let i = 0; i < 2; i++) {
            let state = await this.worker.solve(this.solutionInfo.day, <1 | 2>(i + 1), this.input).toPromise();
            switch (state.type) {
                case 'result':
                    this.results[i] = state.result; this.isBusy = false; break;
                case 'error':
                    this.results[i] = 'error'; this.isBusy = false; break;
            }
        }
    }
}
