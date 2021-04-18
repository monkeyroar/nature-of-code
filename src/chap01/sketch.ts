import p5, { Graphics, Vector } from "p5";
import { Arrow } from "./Arrow";

export const sketch = (p: p5) => {
    let arrows: Arrow[];
    let inkArray: Vector[];
    let maxSize: number[];
    let bloodGraphics: Graphics;
    let reverse = false;
    let arrowThickness = 1;
    const FRAME_RATE = 60;
    const TIME_IN_FLIGHT = 3 * FRAME_RATE;
    const NUM_OF_ARROWS = 100;
    const SPREAD = NUM_OF_ARROWS * 5;

    p.setup = () => {
        let dim = p.windowHeight - (p.windowHeight % 10);
        p.frameRate(FRAME_RATE);
        p.createCanvas(dim, dim);
        p.background(255);

        arrows = initArrows();
        bloodGraphics = p.createGraphics(p.width, p.height);
        inkArray = new Array();
        maxSize = new Array();
    };

    p.draw = () => {
        p.background(255);
        drawBlood();

        if (reverse) {
            p.translate(p.width, p.height);
            p.scale(-1, -1);
        } else {
            p.translate(0, p.height);
            p.scale(1, -1);
        }

        arrows
            .filter((arrow) => !arrow.isStopped)
            .forEach((arrow) => {
                arrow.update();
                arrow.checkEdges();
                if (arrow.isStopped) {
                    inkArray.push(p.createVector(p.random(0, p.width), 0));
                    maxSize.push(p.random(p.height / 2));
                }
                arrow.display(p);
            });

        if (arrows.every((arrow) => arrow.isStopped)) {
            reverse = !reverse;
            arrowThickness += 1;
            if (arrowThickness == 4) arrowThickness = 1;
            arrows = initArrows();
        }
    };

    function drawBlood() {
        let indicesToDelete = [];
        for (let i = 0; i < inkArray.length; i++) {
            let prevPos = inkArray[i].copy();
            inkArray[i].add(p.createVector(p.random(-0.5, 0.5), p.random(3)));
            let w = Math.abs(maxSize[i] / (inkArray[i].y + 25));
            let a = p.map(inkArray[i].y, maxSize[i], 0, 0, 200);
            bloodGraphics.strokeWeight(w);
            let otherChannels = 26 * (3 - arrowThickness);
            bloodGraphics.stroke(255, otherChannels, otherChannels, a);
            if (inkArray[i].y < maxSize[i]) {
                bloodGraphics.line(prevPos.x, prevPos.y, inkArray[i].x, inkArray[i].y);
            } else {
                indicesToDelete.push(i);
            }
        }
        p.image(bloodGraphics, 0, 0);
        inkArray = inkArray.filter((_, i) => !indicesToDelete.includes(i));
        maxSize = maxSize.filter((_, i) => !indicesToDelete.includes(i));
    }

    function initArrows(): Arrow[] {
        let arrows: Arrow[] = new Array(NUM_OF_ARROWS);
        arrows[0] = new Arrow(p, TIME_IN_FLIGHT, SPREAD, arrowThickness);
        for (let i = 1; i < NUM_OF_ARROWS; i++) {
            let theta = p.random(90, 360);
            let r = p.random(0, SPREAD);
            let x = r * Math.cos(p.radians(theta));
            let y = r * Math.sin(p.radians(theta));
            arrows[i] = new Arrow(p, TIME_IN_FLIGHT, SPREAD, arrowThickness, p.createVector(x, y));
        }
        return arrows;
    }
};
