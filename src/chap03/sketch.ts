import p5 from "p5";

export const sketch = (p: p5) => {
    const FRAME_RATE = 60;
    let waveAngle = 0;
    let waveAngleVel = 0.03;
    let colorAngle = 0;
    let colorAngleVel = 0.06;
    let numOfWaves = 10;

    p.setup = () => {
        let dim = p.windowWidth - 16;
        p.frameRate(FRAME_RATE);
        p.createCanvas(dim, dim / 2);
        p.noFill();
        p.colorMode(p.HSB);
    };

    p.draw = () => {
        p.translate(0, p.height / 2);
        p.background(0);
        p.strokeWeight(3);

        let maxAmplitude = p.height / 2;
        for (let i = 1; i <= numOfWaves; i++) {
            let theta = (p.PI * (numOfWaves - i)) / numOfWaves + colorAngle;
            let alpha = Math.max(Math.sin(theta), 0.05);
            let t = p.frameCount / 100;
            let hue = p.map(p.noise(t), 0, 1, 0, 360);
            let sat = p.map(p.noise(1000 + t), 0, 1, 0, 100);
            let bri = p.map(p.noise(2000 + t), 0, 1, 50, 100);
            p.stroke(hue, sat, bri, alpha);
            drawWave(waveAngle, (maxAmplitude * i) / numOfWaves);
            drawWave(-waveAngle + Math.PI, (maxAmplitude * i) / numOfWaves);
        }
        let colorAngleMod = colorAngle % p.TWO_PI;
        if (Math.abs(colorAngleMod - Math.PI) <= colorAngleVel / 2) {
            numOfWaves = Math.round(p.random(2, 12));
        }
        waveAngle += waveAngleVel;
        colorAngle += colorAngleVel;
    };

    function drawWave(startAngle: number, amplitude: number) {
        let angle = startAngle;
        let angleVel = 0.1;
        let increment = p.map(angleVel, 0, p.TWO_PI, 0, p.width);
        p.beginShape();
        for (let x = 0; x <= p.width; x += increment) {
            let y = p.map(Math.sin(angle), -1, 1, -amplitude, amplitude);
            p.vertex(x, y);
            angle += angleVel;
        }
        p.vertex(p.width, p.map(Math.sin(startAngle + p.TWO_PI), -1, 1, -amplitude, amplitude));
        p.endShape();
    }
};
