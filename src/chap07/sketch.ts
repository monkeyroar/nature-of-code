import p5 from "p5";
import { Board } from "./Board";

export const sketch = (p: p5) => {
    const FRAME_RATE = 60;
    const ANIM_FRAMES = 30;
    let board: Board;

    p.setup = () => {
        let dim = p.windowHeight - (p.windowHeight % 10);
        p.disableFriendlyErrors = true;
        p.frameRate(FRAME_RATE);
        p.createCanvas(dim, dim);
        p.colorMode(p.HSB);
        p.noStroke();

        board = new Board(p, ANIM_FRAMES, FRAME_RATE);
    };

    p.draw = () => {
        p.background(0);
        if (p.frameCount % ANIM_FRAMES == 0) board.generate();
        board.display(p);
    };
};
