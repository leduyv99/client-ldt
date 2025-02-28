import { Application, Assets, Color, Sprite } from "pixi.js";
import { APP_CONTAINER_ID } from "../constants";
import { Camera } from "../Controller/CameraController";

interface IEngine {
    initialize: () => Promise<IEngine>;
}

class Engine implements IEngine {
    private masterContainer: HTMLDivElement;
    app: Application;
    camera: Camera;

    constructor() {
        this.app = new Application()
        this.masterContainer = document.getElementById(APP_CONTAINER_ID) as HTMLDivElement
        this.camera = new Camera()
    }

    async initialize() {
        await this.app.init({
            antialias: true,
            resizeTo: window,
            backgroundColor: new Color('#1E1E1E')
        })

        this.masterContainer.appendChild(this.app.canvas)

        const map = await Assets.load('assets/map.webp')
        const map_sprite = Sprite.from(map)
        map_sprite.scale.set(5)
        
        this.camera.addChild(map_sprite)
        this.app.stage.addChild(this.camera)
        
        return this
    }
}

export default Engine