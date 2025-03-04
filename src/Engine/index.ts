import { Application } from "pixi.js";
import { Camera } from "../Controller/CameraController";
import { APP_CONTAINER_ID } from "../constants"

const MAIN_WORLD_LABEL = 'main_world'
export class Engine extends Application {
    private static instance: Engine

    static getInstance() {
        if (!this.instance) {
            this.instance = new Application()
        }
        return this.instance
    }

    private static addMainCamera() {
        this.instance = Engine.getInstance()
        const word = this.instance.stage.getChildByLabel(MAIN_WORLD_LABEL)

        if (!word) {
            const word = new Camera()
            word.label = MAIN_WORLD_LABEL
            this.instance.stage.addChild(word)
        }

        return this.instance
    }

    static getWorld(): Camera {
        this.instance = Engine.getInstance()
        const word = this.instance.stage.getChildByLabel(MAIN_WORLD_LABEL) as Camera | null

        if (word === null) {
            this.instance = this.addMainCamera()
            return this.instance.stage.getChildByLabel(MAIN_WORLD_LABEL) as Camera
        }

        return word
    }

    static async init() {
        const htmlContainer = document.getElementById(APP_CONTAINER_ID)
        if (!htmlContainer) return console.log('HTML Container not found.')
        this.instance = Engine.getInstance()
        await this.instance.init({ antialias: true, resizeTo: window })
        htmlContainer.appendChild(this.instance.canvas)
    }
}
