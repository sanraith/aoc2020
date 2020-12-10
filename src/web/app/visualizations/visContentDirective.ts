import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[vis-content]',
})
export class VisualizationContentDirective {
    constructor(public viewContainerRef: ViewContainerRef) { }
}
