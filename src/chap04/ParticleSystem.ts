import p5, { Vector } from "p5";
import { Particle } from "./Particle";

export class ParticleSystem {
    private _origin: Vector;
    private _isClockwise: boolean;
    private particles: Particle[];

    constructor() {
        this.particles = [];
    }

    set origin(origin: Vector) {
        this._origin = origin.copy();
    }

    set isClockwise(value: boolean) {
        this._isClockwise = value;
    }

    addParticles(p: p5) {
        this.particles.push(new Particle(p, this._origin, this._isClockwise));
    }

    run(p: p5) {
        for (let particle of this.particles) {
            particle.run(p);
        }
        this.particles = this.particles.filter((particle) => !particle.isDead());
    }
}
