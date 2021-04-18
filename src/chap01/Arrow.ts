import p5, { Vector } from "p5";

export class Arrow {
    private initialLocation: Vector;
    private location: Vector;
    private velocity: Vector;
    private acceleration: Vector;
    private thickness: number;
    private frameStart: number;
    private framesDelay: number;
    private _isStopped: boolean = false;

    constructor(
        p: p5,
        timeInFlight: number,
        thickness: number,
        framesDelay: number = 0,
        location = p.createVector(0, 0)
    ) {
        this.initialLocation = location.copy();
        this.location = location;
        this.thickness = thickness;

        let a = (4 * p.height) / (timeInFlight * timeInFlight);
        let r = p.width - location.x * 2;
        let h = p.height / 3 - location.x / 2;
        let vx = (Math.sqrt(a) * r) / (2 * Math.sqrt(2) * Math.sqrt(h));
        let vy = Math.sqrt(2 * a * h);

        this.velocity = p.createVector(vx, vy);
        this.acceleration = p.createVector(0, -a);
        this.frameStart = p.frameCount;
        this.framesDelay = framesDelay;
    }

    get isStopped() {
        return this._isStopped;
    }

    update(p: p5) {
        if (!this._isStopped && p.frameCount - this.frameStart > this.framesDelay) {
            this.velocity.add(this.acceleration);
            this.location.add(this.velocity);
        }
    }

    display(p: p5) {
        if (p.frameCount - this.frameStart <= this.framesDelay) return;
        let vec = this.location;
        let strokeWeight = this.thickness * 2 + 1;
        p.push();
        p.stroke(0);
        p.strokeWeight(strokeWeight);
        p.fill(0);
        p.translate(vec.x, vec.y);
        p.rotate(this.velocity.heading());
        p.line(0, 0, -30, 0);
        let arrowSize = 7;
        p.triangle(0, 0, -10, arrowSize / 2, -10, -arrowSize / 2);
        p.pop();
    }

    checkEdges() {
        if (this.location.y < Math.min(this.initialLocation.y, 0) && this.location.x > this.initialLocation.y) {
            this._isStopped = true;
        }
    }
}
