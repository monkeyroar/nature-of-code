import p5, { Vector, Graphics } from "p5";
import { KochLine } from "./KochLine";
import { KochLineAnim } from "./KochLineAnim";

export class KochFractal {
    private topLeft: Vector;
    private topRight: Vector;
    private bottomLeft: Vector;
    private bottomRight: Vector;
    private lines: KochLine[];
    private count: number;
    private animLengthInFrames: number;

    constructor(p: p5, offset: number, animLengthInFrames: number) {
        this.topLeft = p.createVector(offset, offset);
        this.topRight = p.createVector(p.width - offset, offset);
        this.bottomLeft = p.createVector(offset, p.height - offset);
        this.bottomRight = p.createVector(p.width - offset, p.height - offset);
        this.animLengthInFrames = animLengthInFrames;
        this.restart();
    }

    update() {
        for (let line of this.lines) {
            if (line instanceof KochLineAnim) {
                line.update();
            }
        }
    }

    nextLevel() {
        this.lines = this.iterate(this.lines);
        this.count++;
    }

    restart() {
        this.count = 0;
        this.lines = [];
        this.lines.push(new KochLine(this.topLeft, this.topRight));
        this.lines.push(new KochLine(this.topRight, this.bottomRight));
        this.lines.push(new KochLine(this.bottomRight, this.bottomLeft));
        this.lines.push(new KochLine(this.bottomLeft, this.topLeft));
    }

    getCount() {
        return this.count;
    }

    render(g: Graphics, hue: number, sat: number, bri: number, alpha: number = 1) {
        g.clear();
        if (alpha == 0) return;
        g.fill(hue, sat, bri, alpha * 0.8);
        g.stroke(hue, sat + 20, bri + 20, alpha * 0.8);
        g.beginShape();
        for (let i = 0; i < this.lines.length; i++) {
            let vertex = this.lines[i].kochA();
            g.vertex(vertex.x, vertex.y);
        }
        g.endShape(g.CLOSE);
    }

    iterate(before: KochLine[]) {
        let now = [];
        for (let i = 0; i < before.length; i++) {
            let l = before[i];

            let a = l.kochA();
            let b = l.kochB();
            let c = l.kochC();
            let d = l.kochD();
            let e = l.kochE();
            let cStart = Vector.sub(e, a).mult(0.5).add(a);

            now.push(new KochLine(a, b));
            now.push(new KochLine(b, c));
            now.push(new KochLineAnim(cStart, c, d, this.animLengthInFrames));
            now.push(new KochLine(d, e));
        }
        return now;
    }
}
