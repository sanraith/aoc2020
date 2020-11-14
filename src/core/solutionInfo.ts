import SolutionBase from './solutionBase';

type Constructor<T> = {
    new(...args: any[]): T;
    readonly prototype: T;
}

const rawSolutionList: RawSolutionInfo[] = [];

export type SolutionInfoParams = {
    day?: number,
    title: string
}

export type RawSolutionInfo = SolutionInfoParams & {
    ctor: Constructor<SolutionBase>
}

export function solutionInfo<TCtor extends Constructor<SolutionBase>>(info: SolutionInfoParams) {
    return (ctor: TCtor) => { rawSolutionList.push({ ctor, ...info }); };
}

export { rawSolutionList };
