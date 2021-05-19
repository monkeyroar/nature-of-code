import p5, { Graphics } from "p5";
import { KochFractal } from "./KochFractal";

export const sketch = (p: p5) => {
    const FRAME_RATE = 60;
    const NUM_OF_FRACTALS = 20;
    const sat = 40;
    const bri = 80;
    let fractals: KochFractal[];
    let primary: Graphics[], secondary: Graphics[];
    let isTransition: boolean;
    let currentIndex: boolean;
    let transitionFrames: number;
    const transitionLength = FRAME_RATE / 2;

    p.setup = () => {
        let dim = p.windowHeight - (p.windowHeight % 10);
        p.disableFriendlyErrors = true;
        p.createCanvas(dim, dim);
        p.frameRate(FRAME_RATE);
        p.colorMode(p.HSB);
        p.imageMode(p.CENTER);

        let a = dim / (3 + Math.sqrt(3));
        let offset = (a * Math.sqrt(3)) / 2;

        fractals = [];
        primary = [];
        secondary = [];
        for (let i = 0; i < 2; i++) {
            fractals[i] = new KochFractal(p, offset, FRAME_RATE);
            primary[i] = p.createGraphics(dim, dim);
            primary[i].colorMode(p.HSB);
            secondary[i] = p.createGraphics(dim, dim);
            secondary[i].colorMode(p.HSB);
        }

        isTransition = false;
        currentIndex = false;
    };

    p.draw = () => {
        p.translate(p.width / 2, p.height / 2);
        let huePrim = p.map(p.noise(p.frameCount / 250), 0, 1, 0, 180);
        let hueSecond = (huePrim + 180) % 360;
        p.background(hueSecond, sat - 20, bri);

        fractals[+currentIndex].update();
        let alpha = isTransition ? p.map(transitionFrames, 0, transitionLength, 0, 1) : 1;
        fractals[+currentIndex].render(primary[+currentIndex], huePrim, sat, bri, alpha);
        fractals[+currentIndex].render(secondary[+currentIndex], hueSecond, sat, bri - 30, alpha);
        fractals[+!currentIndex].render(primary[+!currentIndex], huePrim, sat, bri, 1 - alpha);
        fractals[+!currentIndex].render(secondary[+!currentIndex], hueSecond, sat, bri - 30, 1 - alpha);
        render();

        if (isTransition) {
            transitionFrames++;
        }
        if (transitionFrames == transitionLength) {
            isTransition = false;
        }
        if (p.frameCount % (FRAME_RATE * 2) == 0) {
            if (fractals[+currentIndex].getCount() == 4) {
                isTransition = true;
                currentIndex = !currentIndex;
                transitionFrames = 0;
                fractals[+currentIndex].restart();
            } else fractals[+currentIndex].nextLevel();
        }
    };

    let render = () => {
        for (let i = 0; i < NUM_OF_FRACTALS; i++) {
            p.push();
            let scale = 1 - i / NUM_OF_FRACTALS;
            p.rotate((p.frameCount / 100) * (i % 2 === 0 ? 1 : -1));
            p.scale(scale, scale);
            p.image(i % 2 === 0 ? primary[+currentIndex] : secondary[+currentIndex], 0, 0);
            p.image(i % 2 === 0 ? primary[+!currentIndex] : secondary[+!currentIndex], 0, 0);
            p.pop();
        }
    };
};
