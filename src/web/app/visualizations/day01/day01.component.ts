import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Day01Data } from '../../../../solutions/day01';
import { RuntimeResult } from '../../card/card.component';
import { Animation, Animator, Drawable } from '../animation';
import { VisualizationBaseComponent } from '../visualization.base.component';

@Component({
    selector: 'app-day01',
    templateUrl: './day01.component.html'
})
export class Day01Component extends VisualizationBaseComponent implements OnInit {
    @ViewChild('canvas', { static: true })
    canvas: ElementRef<HTMLCanvasElement>;

    constructor() {
        super();
        this.day = 1;
    }

    ngOnInit(): void {
        this.ctx = this.canvas.nativeElement.getContext('2d');
    }

    protected getAnimation(): Animation {
        return new Day01Animation(this.width, this.height, this.ctx, this.results);
    }
}

class Day01Animation extends Animation {
    private day01Data: Day01Data[];

    constructor(width: number, height: number, ctx: CanvasRenderingContext2D, runtimeResults: RuntimeResult[]) {
        super(width, height, ctx, runtimeResults);
        this.day01Data = this.runtimeResults.map(x => x.data.visualizationData as Day01Data);
        this.init();
    }

    init(): void {
        const numbers = this.day01Data[0].numbers;
        const diagramLeft = 0;
        const partWidth = Math.ceil(800 / numbers.length);
        const totalLength = 8000;

        numbers.forEach((number, i) => { // Add diagram elements
            const height = this.normalize(number, 2020, this.height - 10);
            this.elements.push({
                pos: { x: diagramLeft + i * partWidth, y: this.height - height, },
                size: { width: partWidth, height: height },
                isVisible: false,
                color: 'red',
                draw: (e, ctx, time) => {
                    ctx.fillStyle = e.color;
                    let displacement = this.sinTransform((time + i / numbers.length * 1000) / 1000) * 5 - 5;
                    displacement = displacement * (1 - time / totalLength);
                    ctx.fillRect(e.pos.x,
                        e.pos.y + displacement,
                        e.size.width,
                        e.size.height);
                }
            });
        });

        this.animators.push({ // reveal diagram incrementally
            animate: (a, time) => {
                const allVisible = 1000;
                const max = this.elements.length * (time / allVisible);
                for (let element of this.elements.filter((x, i) => i < max)) {
                    element.isVisible = true;
                }

                return max >= this.elements.length;
            }
        });

        this.animators.push({ // find part 1
            start: 1500, length: 2000,
            animate: (a, time) => this.animateChecks(a, time, 0, 2)
        });
        this.animators.push({ // find part 2
            start: 4500, length: 2000,
            animate: (a, time) => this.animateChecks(a, time, 1, 3)
        });
        this.animators.push({ // stop after 10 sec
            start: 0, length: totalLength,
            animate: (a, time) => { return time >= a.length; }
        });
    }

    private animateChecks(animator: Animator, time: number, part: number, singleCheckCount: number) {
        const animationLength = animator.length;
        const checks = this.day01Data[part].checks;
        const checksCount = checks.length / singleCheckCount;
        const singleCheckDuration = animationLength / checksCount;

        const currentCheckIndex = Math.floor(Math.min(checksCount - 1, time / singleCheckDuration));
        const check = checks.slice(currentCheckIndex * singleCheckCount, currentCheckIndex * singleCheckCount + singleCheckCount);
        for (let [element, i] of this.elements.map((x, i) => [x, i])) {
            if (i < check[0]) {
                (<Drawable>element).color = 'gray';
            } else if (check.indexOf(<number>i) >= 0) {
                (<Drawable>element).color = 'blue';
            } else {
                (<Drawable>element).color = 'red';
            }
        }

        return currentCheckIndex >= checksCount - 1;
    }
}
