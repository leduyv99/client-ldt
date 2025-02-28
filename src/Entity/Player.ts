import { Assets, Container, Sprite } from "pixi.js";

export class Player extends Container {
    constructor () {
        super()
    }
    
    async initialize() {
        const bunnyAsset = await Assets.load('assets/bunny.png')
        const bunny = Sprite.from(bunnyAsset)
        bunny.anchor.set(0.5)
        this.addChild(bunny)
    }
}