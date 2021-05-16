import p5 from "p5";
import { Cell } from "./Cell";

export class Board {
    private w: number;
    private columns: number;
    private rows: number;
    private board: Cell[][];
    private generation: number;
    private generationReset: number;

    constructor(p: p5, animFrames: number, frameRate: number) {
        this.w = 10;
        this.columns = p.width / this.w;
        this.rows = p.height / this.w;

        this.board = new Array(this.columns);
        for (var i = 0; i < this.columns; i++) {
            this.board[i] = new Array(this.rows);
        }

        for (var i = 0; i < this.columns; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.board[i][j] = new Cell(i * this.w, j * this.w, this.w, animFrames);
            }
        }
        this.generation = 0;
        this.generationReset = (frameRate / animFrames) * 60 * 2;
    }

    generate() {
        for (var i = 0; i < this.columns; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.board[i][j].savePrevious();
            }
        }

        this.generation++;
        if (this.generation % this.generationReset == 0) {
            for (var x = 0; x < this.columns; x++) {
                for (var y = 0; y < this.rows; y++) {
                    this.board[x][y].newState(Math.round(Math.random()));
                }
            }
            return;
        }

        // Loop through every spot in our 2D array and check spots neighbors
        for (var x = 0; x < this.columns; x++) {
            for (var y = 0; y < this.rows; y++) {
                // Add up all the states in a 3x3 surrounding grid
                var neighbors = 0;
                for (var i = -1; i <= 1; i++) {
                    for (var j = -1; j <= 1; j++) {
                        neighbors +=
                            this.board[(x + i + this.columns) % this.columns][(y + j + this.rows) % this.rows].previous;
                    }
                }

                // A little trick to subtract the current cell's state since
                // we added it in the above loop
                neighbors -= this.board[x][y].previous;

                // Rules of Life
                if (this.board[x][y].state == 1 && neighbors < 2) this.board[x][y].newState(0);
                else if (this.board[x][y].state == 1 && neighbors > 3) this.board[x][y].newState(0);
                else if (this.board[x][y].state === 0 && neighbors == 3) this.board[x][y].newState(1);
                // else do nothing!
            }
        }
    }

    display(p: p5) {
        for (var i = 0; i < this.columns; i++) {
            for (var j = 0; j < this.rows; j++) {
                this.board[i][j].display(p, this.generation);
            }
        }
    }
}
