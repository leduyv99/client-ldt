import { Assets, Sprite } from "pixi.js";
import { KeyboardController } from "./Controller/InputController/KeyboardController";
import { MultiplayerController } from "./Controller/MultiplayerController";
import { Engine } from "./Engine";
import { SwitcherController } from "./Controller/SwitcherController";
import { LABELS } from "./constants";

(async () => {
  const engine = Engine.getInstance()
  await Engine.init()

  const word = Engine.getWorld()
  const control = KeyboardController.getInstance()

  const img = [
    'assets/bunny1.png',
    'assets/bunny2.png',
    'assets/bunny3.png',
    'assets/bunny4.png',
    'assets/bunny5.png'
  ]
  img.forEach((v, idx) => Assets.add({ alias: `player${idx}`, src: v }))
  Assets.add({ alias: 'map', src: './assets/map.webp' })

  const assets = await Assets.load([...img.map((_, idx) => (`player${idx}`)), 'map'])

  img.forEach((_, idx) => engine.stage.addChild(Sprite.from(assets[`player${idx}`])))


  const switcher = new SwitcherController(Array.from({ length: 5 }, (_, index) => assets[`player${index}`]));

  engine.stage.addChild(switcher.switcher)
  // add world map
  const mapSprite = Sprite.from(assets.map)
  mapSprite.label = LABELS.world_map
  mapSprite.setSize(2048)
  word.addChildAt(mapSprite, 0)
  //

  const multiplayerController = new MultiplayerController()
  await multiplayerController.initialize()

  engine.ticker.add((ticker) => {
    // console.log(switcher.idx)
    multiplayerController.updatePlayerAsset(switcher.idx)
    const playerPosition = multiplayerController.updatePlayerInput(ticker.deltaTime, control.getActions())
    if (playerPosition) {
      word.trackEntity(playerPosition)
    }
  })

})();
