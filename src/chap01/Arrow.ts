import p5, { Vector } from "p5";

export class Arrow {
    private initialLocation: Vector;
    private location: Vector;
    private velocity: Vector;
    private acceleration: Vector;
    private thickness: number;
    private _isStopped: boolean = false;

    constructor(
        p: p5,
        timeInFlight: number,
        spread: number,
        thickness: number,
        location = p.createVector(-spread / 2, -spread / 2)
    ) {
        this.initialLocation = location.copy();
        this.location = location;
        this.thickness = thickness;
        let r = p.width + spread / 2 + p.random(0, spread / 2);
        let h = p.height / 2 + p.random(-spread / 2, spread / 2);
        this.velocity = p.createVector(r / timeInFlight, (4 * h) / timeInFlight);
        this.acceleration = p.createVector(0, (-8 * h) / (timeInFlight * timeInFlight));
    }

    get isStopped() {
        return this._isStopped;
    }

    update() {
        if (!this._isStopped) {
            this.velocity.add(this.acceleration);
            this.location.add(this.velocity);
        }
    }

    display(p: p5) {
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
