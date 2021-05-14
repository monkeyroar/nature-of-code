import p5, { Graphics } from "p5";
import { Flock } from "./Flock";
import { Boid } from "./Boid";
import { Star } from "../chap02/Star";

export const sketch = (p: p5) => {
    const FRAME_RATE = 60;
    const NUMBER_OF_STARS = 500;
    let flock: Flock;
    let stars: Star[] = [];
    let starsGraphics: Graphics;

    p.setup = () => {
        let dim = p.windowHeight - (p.windowHeight % 10);
        p.disableFriendlyErrors = true;
        p.frameRate(FRAME_RATE);
        p.createCanvas(dim, dim);
        p.colorMode(p.HSB);

        flock = new Flock(p);
        for (let i = 0; i < 200; i++) {
            let b = new Boid(p.random(p.width), p.random(p.height), p);
            flock.addBoid(b);
        }

        starsGraphics = p.createGraphics(p.width, p.height);
        for (let i = 0; i < NUMBER_OF_STARS; i++) {
            stars[i] = new Star(p);
        }
    };

    p.draw = () => {
        p.background(188, 47, 74);
        let g = flock.run();

        starsGraphics.clear();
        starsGraphics.fill(189, 112, 100);
        for (let i = 0; i < stars.length; i++) {
            stars[i].draw(starsGraphics);
        }

        p.image(starsGraphics, 0, 0);
        p.image(g, 0, 0);

        // Draw FPS (rounded to 2 decimal places) at the bottom left of the screen
        let fps = p.frameRate();
        p.fill(255);
        p.stroke(0);
        p.text("FPS: " + fps.toFixed(2), 10, p.height - 10);
    };
};
