export type Rect = {
    x: number; y: number;
    width: number; height: number;
}

export type Animator = {
    start?: number;
    length?: number;
    animate(animator: Animator, time: number): boolean;
};

export type DrawableElement = {
    id?: string;
    isVisible?: boolean;
    rect?: Rect;
    color: string,
    draw(element: DrawableElement, ctx: CanvasRenderingContext2D, time: number): void;
}

export class Animation {
    constructor(public width: number, public height: number, private ctx: CanvasRenderingContext2D) {
    }

    protected animators: Animator[] = [];
    protected elements: DrawableElement[] = [];

    start(): void { this.animateLoop(); }

    protected normalize(value: number, valueMax: number, boundMax: number) {
        return (value / valueMax) * boundMax;
    }

    private animateLoop(time: number = undefined, start: number = undefined) {
        if (start === undefined) {
            requestAnimationFrame((t: number) => this.animateLoop(t, t));
            return;
        }

        const currentTime = time - start;

        this.ctx.clearRect(0, 0, this.width, this.height);
        const areAnimatorsDone = this.animators
            .filter(a => a.start === undefined || currentTime >= a.start)
            .map(a => a.animate(a, currentTime - (a.start ?? 0)));
        this.animators = this.animators.filter((_, i) => !areAnimatorsDone[i]);
        this.elements
            .filter(e => e.isVisible === undefined || e.isVisible)
            .forEach(e => e.draw(e, this.ctx, currentTime));

        if (this.animators.length > 0) {
            requestAnimationFrame((t: number) => this.animateLoop(t, start));
        }
    }
}