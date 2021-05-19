import { Vector } from "p5";
import { KochLine } from "./KochLine";

export class KochLineAnim extends KochLine {
    private aStart: Vector;
    private aEnd: Vector;
    private animLengthInFrames: number;
    private frames: number;

    constructor(aStart: Vector, aEnd: Vector, b: Vector, animLengthInFrames: number) {
        super(aStart, b);
        this.aStart = aStart.copy();
        this.aEnd = aEnd.copy();
        this.animLengthInFrames = animLengthInFrames;
        this.frames = 0;
    }

    update() {
        if (this.frames < this.animLengthInFrames) {
            this.frames++;
            let distance = Vector.sub(this.aEnd, this.aStart);
            distance.mult(Math.pow(this.frames / this.animLengthInFrames, 3));
            this.start = Vector.add(this.aStart, distance);
        }
    }
}
