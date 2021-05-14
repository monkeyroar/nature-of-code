import p5, { Graphics } from "p5";
import { Boid } from "./Boid";

export class Flock {
    private boids: Boid[];
    private g: Graphics;

    constructor(p: p5) {
        // An array for all the boids
        this.boids = []; // Initialize the array
        this.g = p.createGraphics(p.width, p.height);
        this.g.colorMode(p.HSB);
    }

    run() {
        this.g.clear();
        for (let boid of this.boids) {
            boid.runBoid(this.boids, this.g); // Passing the entire list of boids to each boid individually
        }
        return this.g;
    }

    addBoid(b: Boid) {
        this.boids.push(b);
    }
}
