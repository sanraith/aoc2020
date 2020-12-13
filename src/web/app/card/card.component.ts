import { Component, ComponentFactoryResolver, Input, OnInit, Type, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Stopwatch } from 'ts-stopwatch';
import { SolutionInfo } from '../../../core/solutionInfo';
import { SolutionError, SolutionResult } from '../../../core/solutionProgress';
import { InputService } from '../services/input.service';
import { VisualizationService } from '../services/visualization.service';
import { WorkerService } from '../services/worker.service';
import { VisualizationContentDirective } from '../visualizations/visContentDirective';
import { VisualizationBaseComponent } from '../visualizations/visualization.base.component';

export type RuntimeResult = {
    value?: string,
    time?: number,
    onGoing?: boolean,
    percentage?: number,
    stopwatch?: Stopwatch,
    updateTimeout?: NodeJS.Timeout,
    data?: SolutionResult
};

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
    @Input() solutionInfo: SolutionInfo;

    @ViewChild(VisualizationContentDirective, { static: true })
    contentHost: VisualizationContentDirective;

    input = '';
    results: RuntimeResult[] = [{}, {}];
    isBusy: boolean;
    isInputFieldVisible: boolean;
    autoStartDay = null;

    get twoLetterDay(): string { return this.solutionInfo.day.toString().padStart(2, '0'); }
    get hasOngoingSolution(): boolean { return this.results.some(x => x.onGoing); }

    private solutionSubscription: Subscription;

    constructor(
        private workerService: WorkerService,
        private inputService: InputService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private visualizationService: VisualizationService,
    ) { }

    ngOnInit(): void {
        this.loadInput();
    }

    toggleInput(): void {
        this.isInputFieldVisible = !this.isInputFieldVisible;
    }

    async solve(): Promise<void> {
        this.isBusy = true;
        this.results = [{}, {}];
        this.endPartAndStartNextPart();

        this.solutionSubscription = this.workerService.solveAsync(this.solutionInfo.day, this.input).subscribe({
            next: state => {
                const result = this.results[state.part - 1];
                result.onGoing = true;
                switch (state.type) {
                    case 'result':
                        result.value = state.result;
                        result.data = state;
                        break;
                    case 'error':
                        result.value = 'error';
                        break;
                    case 'progress':
                        result.percentage = state.progress * 100;
                        break;
                }
                if (state.type === 'result' || state.type === 'error') {
                    this.endPartAndStartNextPart(state);
                }
                this.results = this.results.map(x => x); // force change detection
            },
            complete: () => this.solveCompleted()
        });
    }

    cancel(): void {
        if (!this.solutionSubscription) { return; }
        this.solutionSubscription.unsubscribe();
        this.results.filter(x => x.value === undefined).forEach(x => x.value = 'Canceled.');
        this.endPart(this.results.find(x => x.onGoing));
        this.solveCompleted();
    }

    private solveCompleted(): void {
        this.isBusy = false;
        this.solutionSubscription = null;
        this.updateVisualization(v => {
            v.solutionInfo = this.solutionInfo;
            v.results = this.results;
        });
    }

    private updateVisualization(updater: (v: VisualizationBaseComponent) => void) {
        const visType = this.visualizationService.visualizers.get(this.solutionInfo.day);
        if (!visType) { return; }

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(visType);
        const viewContainerRef = this.contentHost.viewContainerRef;
        viewContainerRef.clear();

        const componentRef = viewContainerRef.createComponent(componentFactory);
        updater(componentRef.instance);
    }

    private endPartAndStartNextPart(state: SolutionResult | SolutionError = undefined): void {
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

    private endPart(result: RuntimeResult): void {
        result.onGoing = false;
        result.stopwatch?.stop();
        clearTimeout(result.updateTimeout);
    }

    private updateResultTime(result: RuntimeResult): void {
        if (result.onGoing) {
            result.time = result.stopwatch.getTime();
            result.updateTimeout = setTimeout(() => this.updateResultTime(result), 50);
        }
    }

    private async loadInput(): Promise<void> {
        this.isBusy = true;
        this.input = await this.inputService.getInput(this.solutionInfo.day);
        this.isBusy = false;
        if (this.solutionInfo.day === this.autoStartDay) {
            await this.solve();
        }
    }
}
