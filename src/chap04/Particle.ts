import p5, { Vector } from "p5";

export class Particle {
    private acceleration: Vector;
    private velocity: Vector;
    private position: Vector;
    private lifespan: number;
    private LIFESPAN_FRAMES = 60;
    private isInnerClockwise: boolean;

    constructor(p: p5, position: Vector, isClockwise: boolean) {
        this.acceleration = p
            .createVector(1, -position.x / position.y)
            .mult(position.y > 0 ? 1 : -1)
            .mult(isClockwise ? 1 : -1)
            .normalize()
            .div(30);
        this.velocity = this.acceleration
            .copy()
            .rotate(p.randomGaussian(0, p.PI / 3))
            .mult(45);
        this.position = position.copy();
        this.lifespan = this.LIFESPAN_FRAMES;
        this.isInnerClockwise = p.random(0, 1) >= 0.5;
    }

    run(p: p5) {
        this.update();
        this.display(p);
    }

    update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.lifespan -= 1;
    }

    display(p: p5) {
        let t = p.frameCount / 100;
        let alpha = p.map(this.lifespan, 0, this.LIFESPAN_FRAMES, 0, 1);
        let scale = p.map(this.lifespan, 0, this.LIFESPAN_FRAMES, 1.5, 1);
        let hue = p.degrees(this.position.angleBetween(p.createVector(0, 1)));
        hue = this.position.x < 0 ? 360 - hue : hue;
        hue = (hue + p.map(p.noise(t), 0, 1, 0, 360)) % 360;
        let sat = p.map(p.noise(1000 + t), 0, 1, 50, 100);
        let bri = p.map(p.noise(2000 + t), 0, 1, 50, 100);

        p.push();
        p.scale(scale, scale);
        p.noStroke();
        p.fill(hue, sat, bri, alpha);
        p.translate(this.position.x, this.position.y);
        p.rotate(p.frameCount / (this.isInnerClockwise ? 10 : -10));
        p.ellipse(0, 0, 12, 18);
        p.pop();
    }

    isDead() {
        return this.lifespan < 0;
    }
}
