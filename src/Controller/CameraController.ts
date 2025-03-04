import { Container } from "pixi.js";
import { Engine } from "../Engine";

export class Camera extends Container {
    private zoomFactor;
    private lerpSpeed;

    constructor() {
        super()
        this.zoomFactor = 2
        this.lerpSpeed = 0.1
    }

    trackEntity({ x, y }: Vector2) {
        const app = Engine.getInstance()

        const screenCenterX = app.renderer.width / 2;
        const screenCenterY = app.renderer.height / 2;

        this.x += (screenCenterX - x * this.zoomFactor - this.x) * this.lerpSpeed;
        this.y += (screenCenterY - y * this.zoomFactor - this.y) * this.lerpSpeed;

        this.scale.set(this.zoomFactor);
    }
}