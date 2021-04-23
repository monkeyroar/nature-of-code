import p5, { Graphics, Color, Vector } from "p5";

export class Texture {
    private w: number;
    private h: number;
    private numOfStripes: number;
    private stripeHeight: number;
    private stripeSpread: number;
    private pixelsPerFrame: number;
    private pg: Graphics;
    private tOffset: number;
    private stripes: Graphics[];
    private needToRegenerate: boolean[];
    private lightColor: Color;
    private darkColor: Color;

    constructor(w: number, h: number, numOfStripes: number, pixelsPerFrame: number, p: p5) {
        this.w = w;
        this.h = h;
        let randomColors = [
            Math.round(Math.random() * 127) + 127,
            Math.round(Math.random() * 127) + 127,
            Math.round(Math.random() * 127) + 127,
        ];
        this.lightColor = p.color(randomColors[0], randomColors[1], randomColors[2]);
        this.darkColor = p.color(randomColors[0] / 2, randomColors[1] / 2, randomColors[2] / 2);
        this.numOfStripes = numOfStripes;
        this.stripeHeight = h / (numOfStripes * 2);
        this.stripeSpread = this.stripeHeight / 4;
        this.pixelsPerFrame = pixelsPerFrame;
        this.pg = p.createGraphics(w, h);
        this.tOffset = 0;
        this.stripes = [];
        this.needToRegenerate = [];
        for (let i = 0; i < numOfStripes + 1; i++) {
            this.stripes[i] = this.generateShape(p);
            this.needToRegenerate[i] = false;
        }
    }

    draw(p: p5): Graphics {
        this.pg.background(this.lightColor);
        for (let i = 0; i < this.numOfStripes + 1; i++) {
            let pixels = Math.floor(p.frameCount * this.pixelsPerFrame);
            let y = ((i * 2 * this.stripeHeight + pixels) % (this.h + 2 * this.stripeHeight)) - 2 * this.stripeHeight;
            this.pg.image(this.stripes[i], 0, y);
            if (y > 0 && !this.needToRegenerate[i]) this.needToRegenerate[i] = true;
            if (y < 0 && this.needToRegenerate[i]) {
                this.stripes[i] = this.generateShape(p);
                this.needToRegenerate[i] = false;
            }
        }
        return this.pg;
    }

    generateShape(p: p5): Graphics {
        let stripe = p.createGraphics(this.w, this.stripeHeight + this.stripeSpread * 2);
        let smoothFactor = 10;
        stripe.background(this.lightColor);
        stripe.stroke(this.darkColor);
        stripe.fill(this.darkColor);
        stripe.beginShape();
        for (let i = 0; i < this.w / smoothFactor; i++) {
            let noiseOffset = p.map(p.noise(this.tOffset + i), 0, 1, -this.stripeSpread, this.stripeSpread);
            stripe.vertex(i * smoothFactor, this.stripeSpread + noiseOffset);
        }
        stripe.vertex(this.w, this.stripeSpread);
        this.tOffset += this.w / smoothFactor;
        for (let i = 0; i < this.w / smoothFactor; i++) {
            let noiseOffset = p.map(p.noise(this.tOffset + i), 0, 1, -this.stripeSpread, this.stripeSpread);
            stripe.vertex(this.w - i * smoothFactor, this.stripeHeight + this.stripeSpread + noiseOffset);
        }
        stripe.vertex(0, this.stripeHeight + this.stripeSpread);
        this.tOffset += this.w / smoothFactor;
        stripe.endShape(p.CLOSE);
        return stripe;
    }
}
