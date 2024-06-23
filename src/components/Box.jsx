import Matter from 'matter-js'

export default class Box {
    constructor(x, y, w, h, world) {
        this.body = Matter.Bodies.rectangle(x,  y, w, h);
        Matter.World.add(world, this.body)
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = "rgba(255, 255, 255, 1";
        this.body.isStatic = true;
    }

    async show(p, boxImage) {
        const pos = this.body.position;
        const angle = this.body.angle;
        p.push();
        p.translate(pos.x, pos.y);
        p.rotate(angle);
        p.imageMode(p.CENTER);
        console.log(boxImage);
        p.rectMode(p.CENTER);
        p.fill(this.color);
        p.strokeWeight(0);
        p.rect(0, 0, this.w, this.h);
        p.pop();
    }
}