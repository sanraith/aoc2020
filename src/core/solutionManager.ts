import { RawSolutionInfo, rawSolutionList } from './solutionInfo';
import '../solutions'; // Discover solution files

type SolutionInfo = RawSolutionInfo & {
    day: number
}

class SolutionManager {
    /** (day, info) map of solutions. */
    private solutionMap: Map<number, SolutionInfo> = new Map();

    /** Get the solutions in ascending order by day. */
    getSolutions(): SolutionInfo[] {
        this.solutionMap = new Map();
        rawSolutionList.map(x => this.addSolution(x));
        return Array.from(this.solutionMap.values()).sort((a, b) => a.day - b.day);
    }

    private addSolution(info: RawSolutionInfo): void {
        if (info.day === undefined) {
            const dayNumberMatch = /(?<=Day)([0-9]+)/g.exec(info.ctor.name);
            if (dayNumberMatch) {
                info.day = parseInt(dayNumberMatch[0]);
            } else {
                console.log(`Could not determine day for solution: ${info.ctor} ${info}`);
                return;
            }
        }

        if (this.solutionMap.has(info.day)) {
            console.log(`Could not register another solution for day ${info.day}. ${info.ctor}`);
            return;
        }

        this.solutionMap.set(info.day, { ...info, day: info.day });
    }
}

const solutionManager = new SolutionManager();

export { SolutionInfo, solutionManager };

