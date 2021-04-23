import p5 from "p5";

export class Star {
    private x: number;
    private y: number;
    private size: number;
    private t: number;
    constructor(p: p5) {
        this.x = p.random(p.width);
        this.y = p.random(p.height);
        this.size = p.random(0.25, 3);
        this.t = p.random(p.TAU);
    }

    draw(p: p5) {
        this.t += 0.1;
        var scale = this.size + Math.sin(this.t) * 2;
        p.push();
        p.noStroke();
        p.ellipse(this.x, this.y, scale, scale);
        p.pop();
    }
}
