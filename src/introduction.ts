import p5 from "p5";

export const sketch = (p: p5) => {
    let dim: number, maxRadius: number, b: number;
    let t = 0;

    const tStep = 0.02;
    const thetaStep = 0.05;
    const numberOfLoops = 8;
    const maxTheta = numberOfLoops * 2 * Math.PI;

    const from = p.color(217, 184, 196);
    const to = p.color(64, 42, 44);

    p.setup = () => {
        p.frameRate(120);
        dim = p.windowHeight - (p.windowHeight % 10);
        maxRadius = dim / 8;
        p.createCanvas(dim, dim);
        b = (dim / 2 + 3 * maxRadius) / maxTheta;
        p.background(149, 113, 134);
    };

    p.draw = () => {
        p.translate(p.width / 2, p.height / 2);
        p.scale(1, -1);
        p.rotate(t);

        for (let i = 0; i < Math.floor(maxTheta / thetaStep); i++) {
            let theta = i * thetaStep;
            let r = b * theta;

            let noise = p.noise(t + i * tStep);

            let x = r * Math.cos(theta);
            let y = r * Math.sin(theta);

            p.stroke(p.lerpColor(from, to, noise));
            p.point(x, y);
        }
        t += tStep;
    };
};
