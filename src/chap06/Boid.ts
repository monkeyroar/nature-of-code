import p5, { Vector, Graphics } from "p5";
import { Mover } from "./Mover";

export class Boid extends Mover {
    private viewRadius: number;
    private viewAngle: number;
    private desiredSeparation: number;
    private wanderTheta: number;

    constructor(x: number, y: number, p: p5) {
        super(x, y, p);
        this.viewRadius = 50;
        this.viewAngle = 120;
        this.desiredSeparation = this.viewRadius / 2;
        this.wanderTheta = 0;
    }

    runBoid(allBoids: Boid[], g: Graphics) {
        this.flock(allBoids);
        super.update();
        super.render(g);
    }

    filterBoids(allBoids: Boid[], distance: number = this.viewRadius, angle: number = this.viewAngle) {
        return allBoids.filter((boid) => {
            let posRelative = Vector.sub(boid.position, this.position);
            let dSquared = posRelative.magSq();
            if (dSquared > 0 && dSquared < distance * distance) {
                let angleBetween = this.p.degrees(this.velocity.angleBetween(posRelative));
                return Math.abs(angleBetween) < angle;
            }
            return false;
        });
    }

    // We accumulate a new acceleration each time based on three rules
    flock(allBoids: Boid[]) {
        let neighboringBoids = this.filterBoids(allBoids, this.desiredSeparation, 360);
        let boidsInView = this.filterBoids(allBoids);
        this.applyForce(this.wander().mult(0.75));
        this.applyForce(this.boundaries().mult(5));
        this.applyForce(this.separate(neighboringBoids).mult(2));
        this.applyForce(this.align(boidsInView));
        this.applyForce(this.cohesion(boidsInView));
    }

    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target: Vector) {
        return Vector.sub(target, this.position)
            .normalize()
            .mult(this.maxSpeed)
            .sub(this.velocity)
            .limit(this.maxForce);
    }

    wander() {
        let wanderR = 25; // Radius for our "wander circle"
        let wanderD = 80; // Distance for our "wander circle"
        let change = 0.3;
        this.wanderTheta += Math.random() * change * 2 - change; // Randomly change wander theta

        let circlePos = this.velocity.copy().normalize().mult(wanderD).add(this.position);
        let h = this.velocity.heading();

        let circleOffSet = this.p.createVector(
            wanderR * Math.cos(this.wanderTheta + h),
            wanderR * Math.sin(this.wanderTheta + h)
        );
        return this.seek(circlePos.add(circleOffSet));
    }

    boundaries() {
        let desired = null;
        if (this.position.x < this.desiredSeparation) {
            desired = this.p.createVector(this.maxSpeed, this.velocity.y);
        } else if (this.position.x > this.p.width - this.desiredSeparation) {
            desired = this.p.createVector(-this.maxSpeed, this.velocity.y);
        }
        if (this.position.y < this.desiredSeparation) {
            desired = this.p.createVector(this.velocity.x, this.maxSpeed);
        } else if (this.position.y > this.p.height - this.desiredSeparation) {
            desired = this.p.createVector(this.velocity.x, -this.maxSpeed);
        }
        if (desired === null) return this.p.createVector(0, 0);
        return desired.normalize().mult(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
    }

    // Separation
    // Method checks for nearby boids and steers away
    separate(neighboringBoids: Boid[]) {
        if (neighboringBoids.length == 0) return this.p.createVector(0, 0);
        let steer = neighboringBoids
            .map((boid) => Vector.sub(this.position, boid.position))
            .map((diff) => diff.div(diff.magSq()))
            .reduce((acc, cur) => acc.add(cur), this.p.createVector(0, 0))
            .div(neighboringBoids.length);
        // As long as the vector is greater than 0
        if (steer.magSq() > 0) {
            // Implement Reynolds: Steering = Desired - Velocity
            steer.normalize().mult(this.maxSpeed).sub(this.velocity).limit(this.maxForce);
        }
        return steer;
    }

    // Alignment
    // For every nearby boid in the system, calculate the average velocity
    align(boidsInView: Boid[]) {
        if (boidsInView.length == 0) return this.p.createVector(0, 0);
        return boidsInView
            .map((boid) => boid.velocity)
            .reduce((acc, cur) => acc.add(cur), this.p.createVector(0, 0))
            .div(boidsInView.length)
            .normalize()
            .mult(this.maxSpeed)
            .sub(this.velocity)
            .limit(this.maxForce);
    }

    // Cohesion
    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
    cohesion(boidsInView: Boid[]) {
        if (boidsInView.length == 0) return this.p.createVector(0, 0);
        return this.seek(
            boidsInView
                .map((boid) => boid.position)
                .reduce((acc, cur) => acc.add(cur), this.p.createVector(0, 0))
                .div(boidsInView.length)
        );
    }
}
