import FileInputManager from '../../src/console/fileInputManager';
import SolutionBase from '../../src/core/solutionBase';
import { Constructor } from '../../src/core/solutionInfo';
import { solutionManager } from '../../src/core/solutionManager';

const fileInputManager = new FileInputManager();

function setupSolution(type: Constructor<SolutionBase>, input: string = undefined) {
    return async function () {
        const solutionInfo = solutionManager.getSolutions().find(x => x.ctor === type);
        const solutionInstance = solutionInfo.create();
        input = input ?? await fileInputManager.loadInputAsync(solutionInfo.day);
        solutionInstance.init(input);
        this.solution = solutionInstance;
    };
}

function expectedResult(part: 1 | 2, result: string) {
    return async function () {
        expect(await this.solution.solveAsync(part)).toEqual(result);
    };
}

export {
    setupSolution,
    expectedResult
};