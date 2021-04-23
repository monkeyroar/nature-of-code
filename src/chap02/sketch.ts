import p5, { Vector } from "p5";
import { Planet } from "./Planet";
import { Star } from "./Star";

export const sketch = (p: p5) => {
    const FRAME_RATE = 60;
    const NUMBER_OF_PLANETS = 5;
    const NUMBER_OF_STARS = 100;
    let planets: Planet[] = [];
    let stars: Star[] = [];
    let bounds: Vector[] = [p.createVector(1, 0), p.createVector(0, 1), p.createVector(-1, 0), p.createVector(0, -1)];

    p.setup = () => {
        let dim = p.windowHeight - (p.windowHeight % 10);
        p.frameRate(FRAME_RATE);
        p.createCanvas(dim, dim, p.WEBGL);

        for (let i = 0; i < NUMBER_OF_PLANETS; i++) {
            let x = (i - 1) % 2;
            let y = Math.floor((i - 1) / 2);
            let focalPoint = i == 0 ? p.createVector(dim / 2, dim / 2) : p.createVector(x * dim, y * dim);
            let r = Math.min(dim / 2, Math.abs(p.randomGaussian(0, dim / 4))) + 32 * +(i != 0);
            let theta = p.radians(i == 0 ? p.random(360) : p.random(90 * x + 10, 90 + 90 * x - 10) * (-(y * 2) + 1));
            focalPoint.add(r * Math.cos(theta), r * Math.sin(theta));
            planets[i] = new Planet(p, focalPoint.x, focalPoint.y);
        }

        for (let i = 0; i < NUMBER_OF_STARS; i++) {
            stars[i] = new Star(p);
        }
    };

    p.draw = () => {
        p.translate(-p.width / 2, -p.height / 2);
        p.background(0);
        p.ambientLight(32);
        p.directionalLight(128, 128, 128, 1, 0, -1);
        p.directionalLight(128, 128, 128, 0, 1, -1);

        for (let i = 0; i < stars.length; i++) {
            stars[i].draw(p);
        }

        for (let i = 0; i < planets.length; i++) {
            for (let j = 0; j < planets.length; j++) {
                if (i !== j) {
                    let force = planets[j].attract(planets[i]);
                    force.mult(-1);
                    planets[i].applyForce(force);
                }
            }
            for (let j = 0; j < bounds.length; j++) {
                planets[i].applyForce(planets[i].bounceBounds(p, bounds[j].copy()));
            }
            planets[i].update();
            planets[i].display(p);
        }
    };
};
