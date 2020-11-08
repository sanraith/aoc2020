export type SolutionState = SolutionResult | SolutionError;

export class SolutionResult {
    type: 'result' = 'result';
    result: string;

    constructor(result: string) {
        this.result = result;
    }
}

export class SolutionError {
    type: 'error' = 'error';
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}
