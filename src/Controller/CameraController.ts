import { Application, Container, Renderer } from "pixi.js";

export const CAMERA_CONFIG = {
    cameraSpeed: 5,
    zoomFactor: 2,
    lerpSpeed: 0.1,
};

export class Camera extends Container {
    constructor() {
        super()
    }

    trackEntity(app: Application<Renderer>, { x, y }: Vector2) {
        const screenCenterX = app.renderer.width / 2;
        const screenCenterY = app.renderer.height / 2;

        this.x += (screenCenterX - x * CAMERA_CONFIG.zoomFactor - this.x) * CAMERA_CONFIG.lerpSpeed;
        this.y += (screenCenterY - y * CAMERA_CONFIG.zoomFactor - this.y) * CAMERA_CONFIG.lerpSpeed;

        this.scale.set(CAMERA_CONFIG.zoomFactor);
    }
}