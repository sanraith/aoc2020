import { Injectable, Type } from '@angular/core';
import { VisualizationBaseComponent } from '../visualizations/visualization.base.component';
import { rawVisualizationList } from '../visualizations/visualizationInfo';

@Injectable({
    providedIn: 'root'
})
export class VisualizationService {
    get visualizers(): Map<number, Type<VisualizationBaseComponent>> {
        return new Map(rawVisualizationList.map(x => [x.day, x.ctor]));
    };
}
