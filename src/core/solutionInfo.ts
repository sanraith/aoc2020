import SolutionBase from './solutionBase';

type Constructor<T> = {
    new(...args: any[]): T;
    readonly prototype: T;
}

const rawSolutionList: SolutionInfo[] = [];

export type SolutionInfo = SolutionInfoParams & {
    create: () => SolutionBase;
}

export type SolutionInfoParams = {
    day: number,
    title: string
}

export function solutionInfo<TCtor extends Constructor<SolutionBase>>(info: SolutionInfoParams) {
    return (ctor: TCtor) => { rawSolutionList.push({ create: () => new ctor(), ...info }); };
}

export { rawSolutionList };
