import { Engine } from "./Engine";
import { KeyboardController } from "./Controller/InputController/KeyboardController";
import { MultiplayerController } from "./Controller/MultiplayerController";
import { Ticker } from "pixi.js";
// import { SwitcherController } from "./Controller/SwitcherController";

(async () => {
  const engine = Engine.getInstance()
  await Engine.init()

  const word = Engine.getWorld()
  const control = KeyboardController.getInstance()

  // const switcher = new SwitcherController(Array.from({ length: 5 }, (_, index) => assets[`player${index}`]));

  const multiplayerController = new MultiplayerController()
  await multiplayerController.Start()

  engine.ticker.add(Update)

  function Update(ticker: Ticker) {
    const playerPosition = multiplayerController.UpdatePlayerInput(ticker.deltaTime, control.getActions())
    const isPlayerMoved = playerPosition !== null && playerPosition.animation !== 'idle'
    if (isPlayerMoved) word.trackEntity(playerPosition)
  }
})();
