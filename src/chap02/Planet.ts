import p5, { Vector } from "p5";
import { Texture } from "./Texture";

export class Planet {
    private mass: number;
    private radius: number;
    private location: Vector;
    private velocity: Vector;
    private acceleration: Vector;
    private rotateAxis: Vector;
    private texture: Texture;
    private G = 1;

    constructor(p: p5, x: number, y: number) {
        this.mass = p.random(16, 32);
        this.radius = p.map(this.mass, 16, 32, 32, 64);
        this.location = p.createVector(x, y);
        this.velocity = p.createVector(0, 0);
        this.acceleration = p.createVector(0, 0);
        this.rotateAxis = Vector.random3D();
        this.texture = new Texture(512, 512, Math.round(p.random(3, 7)), Math.pow(5, p.random(-1, 1)), p);
    }

    applyForce(force: Vector) {
        let f = Vector.div(force, this.mass);
        this.acceleration.add(f);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);
        this.acceleration.mult(0);
    }

    display(p: p5) {
        p.push();
        p.noStroke();
        p.translate(this.location.x, this.location.y);
        p.rotate(p.millis() / 2000, this.rotateAxis);
        p.texture(this.texture.draw(p));
        p.sphere(this.radius);
        p.pop();
    }

    bounceBounds(p: p5, direction: Vector) {
        let distance =
            ((direction.x * this.location.x + p.width) % p.width) +
            ((direction.y * this.location.y + p.height) % p.height);
        direction.setMag((this.mass * this.mass) / (distance * distance));
        return direction;
    }

    attract(other: Planet) {
        let force = Vector.sub(this.location, other.location);
        let distance = Math.max(force.mag() - this.radius - other.radius, 32);
        let strength = (this.G * this.mass * other.mass) / (distance * distance);
        force.setMag(strength);
        return force;
    }
}
