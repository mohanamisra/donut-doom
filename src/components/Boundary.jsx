import Box from "./Box.jsx";

export default class Boundary extends Box {
    constructor(x, y, w, h, world) {
        super(x, y, w, h, world);
        this.body.isStatic = true;
        this.color = "rgba(255, 0, 0, 0)";
    }
}