import { Assets, Sprite } from "pixi.js";
import { KeyboardController } from "./Controller/InputController/KeyboardController";
import { MultiplayerController } from "./Controller/MultiplayerController";
import { Engine } from "./Engine";

(async () => {
  const engine = Engine.getInstance()
  await Engine.init()

  const word = Engine.getWorld()
  const control = KeyboardController.getInstance()

  // add world map
  const mapAsset = await Assets.load('./assets/map.webp')
  word.addChildAt(Sprite.from(mapAsset), 0)
  //

  const multiplayerController = new MultiplayerController()
  await multiplayerController.initialize()


  engine.ticker.add((ticker) => {
    const playerPosition = multiplayerController.updatePlayerInput(ticker.deltaTime, control.getActions())
    if (playerPosition) {
      word.trackEntity(playerPosition)
    }
  })

})();
