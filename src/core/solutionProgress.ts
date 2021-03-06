export type SolutionState = SolutionResult | SolutionError | SolutionProgress;

abstract class SolutionStateBase {
    type = 'none';
    constructor(public part: number) { }
}

export class SolutionProgress extends SolutionStateBase {
    type: 'progress' = 'progress';
    constructor(part: number, public progress: number, public timeMs: number = 0) {
        super(part);
    }
}

export class SolutionResult extends SolutionStateBase {
    type: 'result' = 'result';
    visualizationData?: any;

    constructor(part: number, public result: string, public timeMs: number) {
        super(part);
    }
}

export class SolutionError extends SolutionStateBase {
    type: 'error' = 'error';

    constructor(part: number, public message: string, public timeMs: number = 0) {
        super(part);
    }
}
