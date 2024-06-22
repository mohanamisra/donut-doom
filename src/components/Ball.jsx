import Matter from 'matter-js'

export default class Ball {
    constructor(x, y, r, world) {
        this.body = Matter.Bodies.circle(x, y, r);
        Matter.World.add(world, this.body);
        this.r = r;
    }

    show(p) {
        const pos = this.body.position;
        const angle = this.body.angle;
        p.push();
        p.translate(pos.x, pos.y);
        p.rotate(angle);
        p.rectMode(p.CENTER);
        p.fill("white");
        p.strokeWeight(0);
        p.circle(0, 0, this.r);
        p.pop();
    }
}