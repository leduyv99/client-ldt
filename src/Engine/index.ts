import { Application, Color, Renderer } from "pixi.js";
import { APP_CONTAINER_ID } from "../constants";

interface IEngine {
    initialize: () => Promise<Application<Renderer>>;
}

class Engine implements IEngine {
    private app: Application;
    private masterContainer: HTMLDivElement;

    constructor() {
        this.app = new Application()
        this.masterContainer = document.getElementById(APP_CONTAINER_ID) as HTMLDivElement
    }

    async initialize() {
        await this.app.init({
            antialias: true,
            resizeTo: window,
            backgroundColor: new Color('#1E1E1E')
        })

        this.masterContainer.appendChild(this.app.canvas)
        return this.app
    }
}

export default Engine