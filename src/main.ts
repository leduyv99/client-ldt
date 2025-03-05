import { Assets, Sprite } from "pixi.js";
import { KeyboardController } from "./Controller/InputController/KeyboardController";
import { MultiplayerController } from "./Controller/MultiplayerController";
import { Engine } from "./Engine";
import { LABELS } from "./constants";

(async () => {
  const engine = Engine.getInstance()
  await Engine.init()

  const word = Engine.getWorld()
  const control = KeyboardController.getInstance()

  // add world map
  const mapAsset = await Assets.load('./assets/map.webp')
  const mapSprite = Sprite.from(mapAsset)
  mapSprite.label = LABELS.world_map
  mapSprite.setSize(2048)
  word.addChildAt(mapSprite, 0)
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
