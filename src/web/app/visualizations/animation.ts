import { RuntimeResult } from '../card/card.component';

export type Pos = {
    x: number;
    y: number;
}

export type Size = {
    width: number;
    height: number;
}

export type Animator = {
    start?: number;
    length?: number;
    animate(animator: Animator, time: number): boolean;
};

export type Drawable = {
    id?: string;
    isVisible?: boolean;
    pos?: Pos;
    size?: Size;
    color?: string;
    draw(element: Drawable, ctx: CanvasRenderingContext2D, time: number): void;
}

export class Animation {
    constructor(public width: number, public height: number,
        private ctx: CanvasRenderingContext2D, protected runtimeResults: RuntimeResult[]) { }

    protected animators: Animator[] = [];
    protected elements: Drawable[] = [];

    start(): void { this.animateLoop(); }

    protected normalize(value: number, valueMax: number, boundMax: number) {
        return (value / valueMax) * boundMax;
    }

    protected sinTransform(x: number) {
        return Math.sin(x * Math.PI);
    }

    private animateLoop(time: number = undefined, start: number = undefined) {
        if (start === undefined) {
            requestAnimationFrame((t: number) => this.animateLoop(t, t));
            return;
        }

        const currentTime = time - start;

        this.ctx.clearRect(0, 0, this.width, this.height);
        const areAnimatorsDone = this.animators.map(a => {
            if (a.start === undefined || currentTime >= a.start) {
                return a.animate(a, currentTime - (a.start ?? 0));
            }
            return false;
        });
        this.animators = this.animators.filter((_, i) => !areAnimatorsDone[i]);
        this.elements
            .filter(e => e.isVisible === undefined || e.isVisible)
            .forEach(e => e.draw(e, this.ctx, currentTime));

        if (this.animators.length > 0) {
            requestAnimationFrame((t: number) => this.animateLoop(t, start));
        }
    }
}
