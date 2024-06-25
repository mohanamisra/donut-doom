import Matter from 'matter-js'

export default class Ball {
    constructor(x, y, r, world, ballImage, collisionCategory) {
        this.body = Matter.Bodies.circle(x, y, r, {
            collisionFilter: {
                category: 0b0001,
                mask: 0b0011,
            }
        });
        Matter.World.add(world, this.body);
        this.world = world;
        this.r = r;
        this.ballImage = ballImage;
        this.visible = true;
    }

    show(p) {
        if(this.visible) {
            const pos = this.body.position;
            if(pos.y > 600) {
                // this.body.collisionFilter.group = 1;
                // console.log(this.body.collisionFilter.group);
            }
            else {
                // this.body.collisionFilter.group = -1;
                // console.log(this.body.collisionFilter.group);
            }
            const angle = this.body.angle;
            Matter.Body.setSpeed(this.body, Math.min(this.body.speed, 40));
            p.push();
            p.translate(pos.x, pos.y);
            p.rotate(angle);
            p.imageMode(p.CENTER);
            p.image(this.ballImage, 0, 0, this.r*2, this.r*2);
            p.pop();
        }
    }

    hide() {
        this.visible = false;
    }

    reset(p) {
        Matter.Body.setPosition(this.body, { x: p.width / 2, y: p.height - 100 });
        Matter.Body.setAngle(this.body, 0);
        Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
        setTimeout(() => {
            this.visible = true
        }, 300)
    }
}