import Matter from 'matter-js'

export default class Box {
    constructor(x, y, w, h, world) {
        this.body = Matter.Bodies.rectangle(x,  y, w, h);
        Matter.World.add(world, this.body)
        this.w = w;
        this.h = h;
    }

    show(p) {
        const pos = this.body.position;
        const angle = this.body.angle;
        p.push();
        p.translate(pos.x, pos.y);
        p.rotate(angle);
        p.rectMode(p.CENTER);
        p.fill("white");
        p.rect(0, 0, this.w, this.h);
        p.pop();
    }
}