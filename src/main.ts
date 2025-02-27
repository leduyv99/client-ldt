import { MultiplayerController } from "./Controller/MultiplayerController";
import Engine from "./Engine";



(async () => {
  const engine = new Engine()
  const app = await engine.initialize()
  const multiplayerController = new MultiplayerController()

  await multiplayerController.initialize(app)

  app.ticker.add(ticker => {
    multiplayerController.localInputUpdate(ticker.deltaTime)
  })

})();
