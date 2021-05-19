import p5, { Vector } from "p5";

export class KochLine {
    protected start: Vector;
    private end: Vector;

    constructor(a: Vector, b: Vector) {
        this.start = a.copy();
        this.end = b.copy();
    }

    kochA() {
        return this.start.copy();
    }

    kochB() {
        let v = p5.Vector.sub(this.end, this.start);
        v.div(3);
        v.add(this.start);
        return v;
    }

    kochC() {
        let a = this.start.copy();
        let v = p5.Vector.sub(this.end, this.start);
        v.div(3);
        a.add(v);
        v.rotate(-Math.PI / 3);
        a.add(v);
        return a;
    }

    // Easy, just 2/3 of the way
    kochD() {
        let v = p5.Vector.sub(this.end, this.start);
        v.mult(2 / 3.0);
        v.add(this.start);
        return v;
    }

    kochE() {
        return this.end.copy();
    }
}
