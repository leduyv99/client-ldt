import { KeyboardController } from "./Controller/InputController/KeyboardController";
import { MultiplayerController } from "./Controller/MultiplayerController";
import Engine from "./Engine";



(async () => {
  const engine = new Engine()
  const game = await engine.initialize()

  const control = new KeyboardController()

  const multiplayerController = new MultiplayerController()
  await multiplayerController.initialize(game)

  game.app.ticker.add((ticker) => {
    const pos = multiplayerController.updatePlayerInput(ticker.deltaTime, control.getAction())
    if (pos) {
      game.camera.trackEntity(engine.app, pos)
    }
  })

})();
