import { SolutionInfo } from '../../../core/solutionInfo';
import { RuntimeResult } from '../card/card.component';
import { Animation } from './animation';

export abstract class VisualizationBaseComponent {
    solutionInfo: SolutionInfo;
    width = 800;
    height = 200;
    day = -1;

    set results(value: RuntimeResult[]) {
        this._results = value;
    };
    get results(): RuntimeResult[] { return this._results; };
    private _results: RuntimeResult[];

    protected abstract getAnimation(): Animation;

    constructor() { }

    async animate() {
        const animation = this.getAnimation();
        animation.start();
    }
}
