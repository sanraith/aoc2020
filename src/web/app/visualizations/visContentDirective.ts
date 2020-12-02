import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[vis-content]',
})
export class VisualizationContentDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
