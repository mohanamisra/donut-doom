import Box from "./Box.jsx";
import Matter from "matter-js";

export default class Boundary {
    constructor(x, y, w, h, world, collisionCategory) {
        this.body = Matter.Bodies.rectangle(x,  y, w, h, {
            collisionFilter: {
                category: collisionCategory,
                mask: collisionCategory,
            }
        });
        Matter.World.add(world, this.body);
        this.body.isStatic = true;
        this.color = "rgba(255, 0, 0, 0)";
        this.body.restitution = 0.85;
        this.body.friction = 0.09;
    }
    async show(p) {
        const pos = this.body.position;
        const angle = this.body.angle;
        p.push();
        p.translate(pos.x, pos.y);
        p.rotate(angle);
        p.imageMode(p.CENTER);
        p.rectMode(p.CENTER);
        p.fill(this.color);
        p.strokeWeight(0);
        p.rect(0, 0, this.w, this.h);
        p.pop();
    }

}