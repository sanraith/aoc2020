import SolutionBase from './solutionBase';

const rawSolutionList: SolutionInfo[] = [];

export type Constructor<T> = {
    new(...args: any[]): T;
    readonly prototype: T;
}

export type SolutionInfo = SolutionInfoParams & {
    create: () => SolutionBase;
    ctor: Constructor<SolutionBase>;
}

export type SolutionInfoParams = {
    day: number,
    title: string
}

export function solutionInfo<TCtor extends Constructor<SolutionBase>>(info: SolutionInfoParams) {
    return (ctor: TCtor) => { rawSolutionList.push({ create: () => new ctor(), ctor: ctor, ...info }); };
}

export { rawSolutionList };
