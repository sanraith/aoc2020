import { Injectable, Type } from '@angular/core';
import { Day01Component } from '../visualizations/day01/day01.component';
import { VisualizationBaseComponent } from '../visualizations/visualization.base.component';

@Injectable({
    providedIn: 'root'
})
export class VisualizationService {
    visualizers: Map<number, Type<VisualizationBaseComponent>> = new Map();

    constructor() {
        Array.from([
            Day01Component
        ]).forEach(x => this.visualizers.set(new x().day, x));
    }
}
