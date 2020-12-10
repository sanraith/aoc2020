import { VisualizationBaseComponent } from './visualization.base.component';

const rawVisualizationList: VisualizationInfo[] = [];

export type Constructor<T> = {
    new(...args: any[]): T;
    readonly prototype: T;
}

export type VisualizationInfo = VisualizationInfoParams & {
    ctor: Constructor<VisualizationBaseComponent>;
}

export type VisualizationInfoParams = {
    day: number
}

export function VisualizationInfo<TCtor extends Constructor<VisualizationBaseComponent>>(info: VisualizationInfoParams) {
    return (ctor: TCtor) => { rawVisualizationList.push({ ctor: ctor, ...info }); };
}

export { rawVisualizationList };
