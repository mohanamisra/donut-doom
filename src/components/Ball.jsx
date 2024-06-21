export default class Ball {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    show(p) {
        p.fill("white");
        p.circle(this.x, this.y, this.r);
    }
}