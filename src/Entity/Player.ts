import { Assets, Container, Sprite } from "pixi.js";

export class Player extends Container {
    constructor () {
        super()
    }
    
    async initialize() {
        const bunnyAsset = await Assets.load('assets/bunny.png')
        const bunny = Sprite.from(bunnyAsset)
        bunny.x = this.width / 2
        bunny.y = this.height / 2
        this.addChild(bunny)
    }
}