import { RawSolutionInfo, SolutionInfoParams, rawSolutionList } from './solutionInfo';
import SolutionBase from './solutionBase';
import '../solutions'; // Discover solution files

type SolutionInfo = SolutionInfoParams & {
    day: number,
    create: () => SolutionBase
}

class SolutionManager {
    /** Get the solutions in a (day, solutionInfo) map. */
    getSolutionsByDay(): Map<number, SolutionInfo> {
        const solutionMap = new Map<number, SolutionInfo>();
        rawSolutionList.map(x => this.addSolution(solutionMap, x));
        return solutionMap;
    }

    /** Get the solutions in ascending order by day. */
    getSolutions(): SolutionInfo[] {
        return Array.from(this.getSolutionsByDay().values()).sort((a, b) => a.day - b.day);
    }

    private addSolution(solutionMap: Map<number, SolutionInfo>, info: RawSolutionInfo): void {
        // Extract day from class name if not specified
        if (info.day === undefined) {
            const dayNumberMatch = /(?<=Day)([0-9]+)/g.exec(info.ctor.name);
            if (dayNumberMatch) {
                info.day = parseInt(dayNumberMatch[0]);
            } else {
                console.log(`Could not determine day for solution: ${info.ctor} ${info}`);
                return;
            }
        }

        // Do not store solutions without a specified day
        if (solutionMap.has(info.day)) {
            console.log(`Could not register another solution for day ${info.day}. ${info.ctor}`);
            return;
        }

        solutionMap.set(info.day, { ...info, day: info.day, create: () => new info.ctor() });
    }
}

const solutionManager = new SolutionManager();

export { SolutionInfo, solutionManager };

