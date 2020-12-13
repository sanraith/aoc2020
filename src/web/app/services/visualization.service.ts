import { Injectable, Type } from '@angular/core';
import { Day01Component } from '../visualizations/day01/day01.component';
import { Day07Component } from '../visualizations/day07/day07.component';
import { Day13Component } from '../visualizations/day13/day13.component';
import { VisualizationBaseComponent } from '../visualizations/visualization.base.component';

@Injectable({
    providedIn: 'root'
})
export class VisualizationService {
    visualizers: Map<number, Type<VisualizationBaseComponent>> = new Map();

    constructor() {
        Array.from([
            Day01Component,
            Day07Component,
            Day13Component
        ]).forEach(x => this.visualizers.set(new x().day, x));
    }
}
