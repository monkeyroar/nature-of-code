import p5 from "p5";

export class Cell {
    private x: number;
    private y: number;
    private w: number;
    private animFrames: number;
    private _state: number;
    private _previous: number;

    constructor(x: number, y: number, w: number, animFrames: number) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.animFrames = animFrames;

        this._state = Math.round(Math.random());
        this._previous = 0;
    }

    get state() {
        return this._state;
    }

    get previous() {
        return this._previous;
    }

    savePrevious() {
        this._previous = this._state;
    }

    newState(s: number) {
        this._state = s;
    }

    display(p: p5, generation: number) {
        let frame = p.frameCount % this.animFrames;
        let x, y, w, sat;

        if (this._previous == 0 && this._state == 0) return;
        if (this._state == 1) {
            if (this._previous == 1) {
                x = this.x + 1;
                y = this.y + 1;
                w = this.w - 2;
                sat = 70;
            } else {
                x = p.map(frame, 0, this.animFrames, this.x + this.w / 2, this.x + 1);
                y = p.map(frame, 0, this.animFrames, this.y + this.w / 2, this.y + 1);
                w = p.map(frame, 0, this.animFrames, 0, this.w - 2);
                sat = p.map(frame, 0, this.animFrames, 0, 70);
            }
        } else {
            x = p.map(frame, this.animFrames, 0, this.x + this.w / 2, this.x + 1);
            y = p.map(frame, this.animFrames, 0, this.y + this.w / 2, this.y + 1);
            w = p.map(frame, this.animFrames, 0, 0, this.w - 2);
            sat = p.map(frame, this.animFrames, 0, 0, 70);
        }

        let n = p.noise(x / 100, y / 100, generation / 100);
        let hue = p.map(n, 0, 1, 0, 360 * 2) % 360;
        p.fill(hue, sat, 70);
        p.rect(x, y, w, w, 3);
    }
}
