import { rawSolutionList, SolutionInfo } from './solutionInfo';
import '../solutions';

class SolutionManager {
    /** Get the solutions in a (day, solutionInfo) map. */
    getSolutionsByDay(): Map<number, SolutionInfo> {
        return new Map(rawSolutionList.map(info => [info.day, info]));
    }

    /** Get the solutions in ascending order by day. */
    getSolutions(): SolutionInfo[] {
        return Array.from(this.getSolutionsByDay().values()).sort((a, b) => a.day - b.day);
    }
}

const solutionManager = new SolutionManager();

export { SolutionInfo, solutionManager };

