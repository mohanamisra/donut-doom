import Matter from 'matter-js'

export default class Scoreboard {
    constructor(x, y, w, h, world, boardImage) {
        this.body = Matter.Bodies.rectangle(x,  y, w, h);
        Matter.World.add(world, this.body);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.boardImage = boardImage;
        this.body.isStatic = true;
    }

    async show(p, score, time ) {
        const pos = this.body.position;
        const angle = this.body.angle;
        p.push();
        p.translate(pos.x, pos.y);
        p.rotate(angle);
        p.image(this.boardImage, 0, 0, this.w, this.h);
        p.fill("rgb(255, 255, 255)");
        p.textSize(40);
        p.textStyle(p.BOLD);
        p.textFont('Pixelify Sans Variable');
        p.text(`Hits: ${score}`, this.x + 10, this.y + 10, this.w, this.h);
        // p.textAlign(p.RIGHT);
        p.text(`Time: ${time}`, this.w - 170 , this.y + 10, this.w, this.h);
        p.pop();
    }
}