import { Client, getStateCallbacks, Room } from "colyseus.js";
import { ROOMS } from "../constants";
import { Player } from "../Entity/Player";
import { Application, Renderer } from "pixi.js";

const socket_server_ip = "http://26.217.91.46:2567";

export class MultiplayerController {
  private client: Client;
  private room: Room<any> | null = null;
  private players: Map<string, Player> = new Map();
	player: Player | null = null;

  constructor() {
    this.client = new Client(socket_server_ip);
  }

  async initialize(app: Application<Renderer>) {
    this.room = await this.client.joinOrCreate(ROOMS.main);

    if (this.room !== null) {
      document.title = this.room.roomId;
      const callback = getStateCallbacks(this.room);

      callback(this.room.state).players
				.onAdd(async (player, sessionId) => {
					const _player = new Player();
					await _player.initialize();
					_player.x = player.x
					_player.y = player.y
					this.players.set(sessionId, _player);

					callback(player).bindTo(_player);

					callback(player).onChange(() => {
						_player.x = player.x
						_player.y = player.y
					})

					app.stage.addChild(_player);
				})

			callback(this.room.state).players
				.onRemove((_, sessionId) => {
					const removePlayer = this.players.get(sessionId);
					if (removePlayer) {
						app.stage.removeChild(removePlayer)
						this.players.delete(sessionId)
					}
				})
    }
  }

	localInputUpdate(deltaTime: number) {
		if (!this.room) return
		const player = this.players.get(this.room.sessionId);
		if (player) {
			player.x += deltaTime
			player.y += deltaTime
		}
	}
}
