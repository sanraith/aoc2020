import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { Day13Data } from '../../../../solutions/day13';
import { Animation, Drawable, Pos } from '../animation';
import { VisualizationBaseComponent } from '../visualization.base.component';

@Component({
    selector: 'app-day13',
    templateUrl: './day13.component.html'
})
export class Day13Component extends VisualizationBaseComponent implements OnInit {
    @ViewChild('canvas', { static: true })
    canvas: ElementRef<HTMLCanvasElement>;

    constructor() {
        super();
        this.day = 13;
    }

    ngOnInit(): void {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.animate();
    }

    protected getAnimation(): Animation {
        const animation = new Day13Animation(this.width, this.height, this.ctx, this.results);
        return animation;
    }
}

class Day13Animation extends Animation {
    private day07Data: Day13Data[];

    constructor(width, height, ctx, runtimeResults) {
        super(width, height, ctx, runtimeResults);
        this.day07Data = this.runtimeResults.map(x => x.data.visualizationData as Day13Data);
        this.init();
    }

    private init() {
        const { visitedTimestamps: visited } = this.day07Data[1];
        const maxValue = _(visited).max();
        const myLog = (x: number) => Math.log10(x);
        const multiplier = this.height / myLog(maxValue);
        const norm = (x: number) => myLog(x) * multiplier;
        const marginH = 1;
        const columnWidth = (this.width - marginH * 2) / visited.length;

        this.elements.push(this.generateLine({ x: 1, y: this.height - 1 }, { x: 1, y: 0 }));
        this.elements.push(this.generateLine({ x: 1, y: this.height - 1 }, { x: this.width, y: this.height - 1 }));

        const lineParts: Drawable[] = [];
        for (let i = 1; i < visited.length; i++) {
            const left = marginH + (i - 1) * columnWidth;
            const start = visited[i - 1];
            const end = visited[i];
            const line = {
                color: 'red',
                isVisible: false,
                draw: (e, ctx, time) => {
                    ctx.save();
                    ctx.strokeStyle = e.color;
                    ctx.beginPath();
                    ctx.moveTo(left, this.height - norm(start));
                    ctx.lineTo(left + columnWidth, this.height - norm(end));
                    ctx.stroke();
                    ctx.restore();
                }
            };
            this.elements.push(line);
            lineParts.push(line);
        }

        this.animators.push({
            length: 4000,
            animate: (a, time) => {
                const progress = this.easeOutQuad(time / a.length) * a.length;
                // const progress = time;
                const linePartTime = a.length / lineParts.length;
                for (let line of lineParts.filter((x, i) => i < progress / linePartTime)) {
                    line.isVisible = true;
                }

                return time > a.length;
            }
        });

        this.elements.push(this.generateText(maxValue.toString(), { x: 5, y: 12 }));
        this.elements.push(this.generateText('0',
            { x: 5, y: this.height + 2 }, { fromBottom: true }));
        this.elements.push(this.generateText(visited[0].toString(),
            { x: 5, y: this.height + 4 - norm(visited[0]) }));
        this.elements.push(this.generateText(visited.length.toString(),
            { x: this.width, y: this.height + 2 }, { fromBottom: true, fromRight: true }));
    }

    private generateLine(start: Pos, end: Pos) {
        return <Drawable>{
            color: 'black',
            draw: (e, ctx, time) => {
                ctx.save();
                ctx.strokeStyle = e.color;
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
                ctx.restore();
            }
        };
    }

    private generateText(text: string, pos: Pos,
        options: { fromBottom?: boolean, fromRight?: boolean } = { fromBottom: false, fromRight: false }) {
        return <Drawable>{
            color: 'black',
            draw: (e, ctx, time) => {
                ctx.fillStyle = e.color;
                ctx.font = '12px Arial';
                const metrics = ctx.measureText(text);
                let x = pos.x;
                let y = pos.y;
                if (options.fromBottom) {
                    y -= metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                }
                if (options.fromRight) {
                    x -= metrics.width;
                }
                ctx.fillText(text, x, y);
            }
        };
    }

    private easeOutQuad(x: number): number {
        return 1 - (1 - x) * (1 - x);
    }
}
