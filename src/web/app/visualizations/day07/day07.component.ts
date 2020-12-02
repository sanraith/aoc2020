import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Bag, Day07Data } from '../../../../solutions';
import { Animation, Animator, DrawableElement as Drawable, Rect } from '../animation';
import { VisualizationBaseComponent } from '../visualization.base.component';

@Component({
    selector: 'app-day07',
    templateUrl: './day07.component.html',
    styleUrls: ['./day07.component.scss']
})
export class Day07Component extends VisualizationBaseComponent implements OnInit {
    @ViewChild('canvas', { static: true })
    canvas: ElementRef<HTMLCanvasElement>;

    constructor() {
        super();
        this.day = 7;
        this.height = 400;
    }

    ngOnInit(): void {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.animate();
    }

    protected getAnimation(): Animation {
        const animation = new Day07Animation(this.width, this.height, this.ctx, this.results);
        return animation;
    }
}

class Day07Animation extends Animation {
    private day07Data: Day07Data[];

    constructor(width, height, ctx, runtimeResults) {
        super(width, height, ctx, runtimeResults);
        this.day07Data = this.runtimeResults.map(x => x.data.visualizationData as Day07Data);
        this.init();
    }

    public init(drawStyle: 'up' | 'down' = 'down', animationStart: number = undefined, totalDuration: number = 2500) {
        animationStart = animationStart ?? 0;
        const data = this.day07Data[0];
        const levels = this.fillLevels(data.myBag, 0, drawStyle);
        const getParent: (b: Bag) => Bag[] = drawStyle === 'up' ? b => b.children.map(x => x.bag) : b => b.parents;
        const { lines, boxes, boxPairs } = this.generateTree(levels, getParent, drawStyle);

        this.elements = [];
        this.elements.push(...lines);
        this.elements.push(...boxes);

        boxes[0].isVisible = true;
        const moveToPlaceDuration = 1200;
        this.animators.push({
            start: animationStart,
            length: totalDuration,
            animate: (a, time) => {
                const lineTime = a.length / boxPairs.length;
                const currentLine = Math.min(boxPairs.length, time / lineTime);

                for (let { source, target, line } of boxPairs.filter((x, i) => i <= currentLine && !x.line.isVisible)) {
                    line.isVisible = true;
                    if (target.isVisible) { continue; }
                    target.isVisible = true;
                    const targetPos = target.rect;
                    const startPos = <Rect>{ x: source.rect.x, y: source.rect.y, width: target.rect.width, height: target.rect.height };
                    target.rect = JSON.parse(JSON.stringify(startPos));
                    this.animators.push(
                        this.createMoveToPlaceAnimator(target, startPos, targetPos, animationStart + time, moveToPlaceDuration));
                }
                return currentLine >= lines.length;
            }
        });

        if (drawStyle === 'down') { // Draw the second part with a delay
            this.animators.push({
                start: totalDuration + 2000,
                animate: (a, time) => {
                    this.init('up', a.start + time, 5000);
                    return true;
                }
            });
        }
    }

    private createMoveToPlaceAnimator(item: Drawable, startPos: Rect, targetPos: Rect, startTime: number, duration: number) {
        return <Animator>{
            start: startTime,
            length: duration,
            animate: (a, time) => {
                const progress = Math.min(1, time / duration);
                const easedProgress = this.easeOutElastic(progress);
                const xDiff = targetPos.x - startPos.x;
                const yDiff = targetPos.y - startPos.y;
                const rect = item.rect;
                rect.x = startPos.x + xDiff * easedProgress;
                rect.y = startPos.y + yDiff * easedProgress;

                return progress >= 1;
            }
        };
    }

    /**
     * Adds elastic easing out to a progress of [0..1].
     * Source: https://easings.net/#easeOutElastic
     * */
    private easeOutElastic(progress: number): number {
        const c4 = (2 * Math.PI) / 3;
        return progress === 0 ? 0 : progress === 1 ? 1
            : Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1;
    }

    private generateTree(levels: Bag[][], getParents: (bag: Bag) => Bag[], drawStyle: 'up' | 'down') {
        const partSize = 5;
        const top = 5;
        const boxes: Drawable[] = [];
        const lines: Drawable[] = [];
        const boxLevels: Map<Bag, Drawable>[] = Array(levels.length).fill(0).map(() => new Map());
        const boxPairs: { source: Drawable, target: Drawable, line?: Drawable }[] = [];

        const partMarginY = (this.height - top * 2 - levels.length * partSize) / (levels.length - 1);
        for (let { level, i } of levels.map((level, i) => ({ level, i }))) {

            const levelCount = level.length;
            const partMarginX = (this.width - (levelCount + 1) * partSize) / (levelCount + 1);

            for (let { bag, j } of level.map((bag, j) => ({ bag, j }))) {
                const vDistanceFromStart = (partSize + partMarginY) * i;
                const rectSource = {
                    x: (partSize + partMarginX) * (j + 1),
                    y: drawStyle === 'down' ? top + vDistanceFromStart : this.height - top - partSize - vDistanceFromStart,
                    width: partSize, height: partSize
                };

                const element = <Drawable>{
                    color: bag.type.split(' ')[1],
                    rect: JSON.parse(JSON.stringify(rectSource)),
                    isVisible: false,
                    draw: (e, ctx, time) => {
                        ctx.fillStyle = e.color;
                        ctx.fillRect(e.rect.x, e.rect.y, e.rect.width, e.rect.height);
                        ctx.strokeStyle = 'black';
                        ctx.strokeRect(e.rect.x, e.rect.y, e.rect.width, e.rect.height);
                        if (bag.type === this.day07Data[0].myBag.type) {
                            ctx.fillStyle = 'black';
                            ctx.font = '12px Arial';
                            const text = drawStyle === 'up' ? 'contained in (1 of each)' : 'contains (1 of each)';
                            ctx.fillText(`${bag.type} - ${text}`, e.rect.x + e.rect.width + 15, e.rect.y + 5);
                        }
                    }
                };
                boxes.push(element);
                boxLevels[i].set(bag, element);

                const parentLevel = levels[i - 1];
                if (parentLevel) {
                    const parents = parentLevel.filter(x => getParents(bag).includes(x));
                    const parentBoxes = parents.map(x => boxLevels[i - 1].get(x));
                    parentBoxes.forEach(p => boxPairs.push({ source: p, target: element }));
                }
            }
        }

        for (let pair of boxPairs) {
            const { source, target } = pair;
            const line = <Drawable>{
                color: 'black',
                isVisible: false,
                draw: (e, ctx, time) => {
                    ctx.save();
                    ctx.strokeStyle = e.color;
                    ctx.globalAlpha = 0.2;
                    ctx.beginPath();
                    ctx.moveTo(source.rect.x + partSize / 2, source.rect.y + partSize / 2);
                    ctx.lineTo(target.rect.x + partSize / 2, target.rect.y + partSize / 2);
                    ctx.stroke();
                    ctx.restore();
                }
            };
            lines.push(line);
            pair.line = line;
        }

        return { lines, boxes, boxPairs };
    }

    private fillLevels(sourceBag: Bag, levelIndex: number, direction: 'up' | 'down', levels: Bag[][] = undefined) {
        if (!levels) { levels = []; }
        if (levels.length <= levelIndex) { levels.push([]); }
        const level = levels[levelIndex];
        if (!level.includes(sourceBag)) {
            level.push(sourceBag);
        }

        const nextLevelBags = direction === 'down' ? sourceBag.children.map(x => x.bag) : sourceBag.parents;

        for (let bag of nextLevelBags) {
            this.fillLevels(bag, levelIndex + 1, direction, levels);
        }

        return levels;
    }
}
