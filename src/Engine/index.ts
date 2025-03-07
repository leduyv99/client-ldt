import { Application, Assets, UnresolvedAsset } from "pixi.js";
import { Camera } from "../Controller/CameraController";
import { APP_CONTAINER_ID, LABELS } from "../constants"

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
        const word = this.instance.stage.getChildByLabel(LABELS.world)

        if (!word) {
            const word = new Camera()
            word.label = LABELS.world
            this.instance.stage.addChild(word)
        }

        return this.instance
    }

    static getWorld(): Camera {
        this.instance = Engine.getInstance()
        const word = this.instance.stage.getChildByLabel(LABELS.world) as Camera | null

        if (word === null) {
            this.instance = this.addMainCamera()
            return this.instance.stage.getChildByLabel(LABELS.world) as Camera
        }

        return word
    }

    // static getAssests(key: string) {

    // }

    static async init() {
        const htmlContainer = document.getElementById(APP_CONTAINER_ID)
        if (!htmlContainer) return console.log('HTML Container not found.')
        this.instance = Engine.getInstance()
        await this.instance.init({ antialias: true, resizeTo: window })
        htmlContainer.appendChild(this.instance.canvas)

        // load assets 
        const assets: Array<UnresolvedAsset> = [
            { alias: 'bunny', src: 'assets/bunny1.png' },
            { alias: 'map', src: 'assets/map.webp' },
            { alias: 'character1', src: 'assets/Characters/Char_001_Idle.png' },
            { alias: 'character2', src: 'assets/Characters/Char_002_Idle.png' },
            { alias: 'character3', src: 'assets/Characters/Char_003_Idle.png' },
            { alias: 'character4', src: 'assets/Characters/Char_004_Idle.png' },
            { alias: 'character5', src: 'assets/Characters/Char_005_Idle.png' },
            { alias: 'character6', src: 'assets/Characters/Char_006_Idle.png' }
        ]

        Assets.add(assets)
        await Assets.load(assets.map(a => a.alias))
    }
}
