export default class Box {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    show(p) {
        p.fill("white");
        p.rect(this.x, this.y, this.w, this.h);
    }
}