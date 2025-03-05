import { Container } from "pixi.js";
import { Engine } from "../Engine";
import { LABELS } from "../constants";

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
        const worldMap = Engine.getWorld().getChildByLabel(LABELS.world_map)
        if (worldMap === null) return

        const screenCenterX = app.renderer.width / 2;
        const screenCenterY = app.renderer.height / 2;

        // Calculate desired camera position
        const targetX = this.x + (screenCenterX - x * this.zoomFactor - this.x) * this.lerpSpeed;
        const targetY = this.y + (screenCenterY - y * this.zoomFactor - this.y) * this.lerpSpeed;

        // Clamp the camera position to ensure it doesn't move beyond the map's edges
        this.x = Math.max(Math.min(targetX, 0), app.screen.width - worldMap.width * this.zoomFactor);
        this.y = Math.max(Math.min(targetY, 0), app.screen.height - worldMap.height * this.zoomFactor);

        this.scale.set(this.zoomFactor);
    }
}