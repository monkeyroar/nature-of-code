import p5, { Vector, Graphics } from "p5";

export class Mover {
    protected acceleration: Vector;
    protected velocity: Vector;
    protected position: Vector;
    protected r: number;
    protected maxSpeed: number;
    protected maxForce: number;
    protected p: p5;
    private hue: number;

    constructor(x: number, y: number, p: p5) {
        this.acceleration = p.createVector(0, 0);
        this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
        this.position = p.createVector(x, y);
        this.r = 5;
        this.maxSpeed = 3; // Maximum speed
        this.maxForce = 0.05; // Maximum steering force
        this.p = p;
        this.hue = 0;
    }

    applyForce(force: Vector) {
        this.acceleration.add(force);
    }

    // Method to update location
    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);

        let n = this.p.noise(this.position.x / 100, this.position.y / 100, this.p.frameCount / 100);
        this.hue = this.p.map(n, 0, 1, 0, 360);
    }

    render(g: Graphics) {
        // Draw a triangle rotated in the direction of velocity
        let theta = this.velocity.heading() + Math.PI / 2;
        g.push();
        g.fill(this.hue, 100, 100);
        g.strokeWeight(1);
        g.stroke(this.hue, 100, 100);
        g.translate(this.position.x, this.position.y);
        g.rotate(theta);
        g.beginShape();
        g.vertex(0, -this.r * 2);
        g.vertex(-this.r, this.r * 2);
        g.vertex(this.r, this.r * 2);
        g.endShape(this.p.CLOSE);
        g.pop();
    }
}
