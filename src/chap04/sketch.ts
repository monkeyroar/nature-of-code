import p5 from "p5";
import { ParticleSystem } from "./ParticleSystem";

export const sketch = (p: p5) => {
    const FRAME_RATE = 60;
    const NUM_OF_PS = 10;
    const thetaVel = 0.01;
    let dim: number;
    let thetas: number[];
    let ps: ParticleSystem[];

    p.setup = () => {
        dim = p.windowHeight - (p.windowHeight % 10);
        p.frameRate(FRAME_RATE);
        p.createCanvas(dim, dim);
        p.colorMode(p.HSB);

        thetas = [];
        ps = [];
        for (let i = 0; i < NUM_OF_PS; i++) {
            thetas[i] = (p.TWO_PI * i) / NUM_OF_PS;
            ps[i] = new ParticleSystem();
        }
    };

    p.draw = () => {
        p.background(0);
        p.translate(dim / 2, dim / 2);
        p.scale(1, -1);
        let t = p.frameCount / 100;

        for (let i = 0; i < NUM_OF_PS; i++) {
            let r = p.map(p.noise(t), 0, 1, 32, dim / 2);
            let thetaAdd = p.noise(1000 + t) >= 0.5 ? thetaVel : -thetaVel;
            thetas[i] += thetaAdd;

            ps[i].origin = p.createVector(r * Math.cos(thetas[i]), r * Math.sin(thetas[i]));
            ps[i].isClockwise = thetaAdd > 0;
            ps[i].addParticles(p);
            ps[i].run(p);
        }
    };
};
