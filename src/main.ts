import { Assets, Sprite } from "pixi.js";
import { KeyboardController } from "./Controller/InputController/KeyboardController";
import { MultiplayerController } from "./Controller/MultiplayerController";
import { Engine } from "./Engine";
// import { SwitcherController } from "./Controller/SwitcherController";
import { LABELS } from "./constants";

(async () => {
  const engine = Engine.getInstance()
  await Engine.init()

  const word = Engine.getWorld()
  const control = KeyboardController.getInstance()

  // const switcher = new SwitcherController(Array.from({ length: 5 }, (_, index) => assets[`player${index}`]));

  // engine.stage.addChild(switcher.switcher)
  // add world map
  const mapSprite = Sprite.from(Assets.get("map"))

  mapSprite.label = LABELS.world_map
  mapSprite.setSize(2048)
  word.addChildAt(mapSprite, 0)
  //

  const multiplayerController = new MultiplayerController()
  await multiplayerController.initialize()

  engine.ticker.add((ticker) => {
    // console.log(switcher.idx)
    // multiplayerController.updatePlayerAsset(switcher.idx)
    const playerPosition = multiplayerController.updatePlayerInput(ticker.deltaTime, control.getActions())
    if (playerPosition) {
      word.trackEntity(playerPosition)
    }
  })

})();
