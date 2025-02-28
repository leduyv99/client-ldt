import { Client, getStateCallbacks, Room } from "colyseus.js";
import { ACTIONS, GAME_CONFIG, ROOMS } from "../constants";
import { Player } from "../Entity/Player";
import { MOVE } from "./InputController/constants";
import Engine from "../Engine";

const socket_server_ip = "http://26.217.91.46:2567";

export class MultiplayerController {
  private client: Client;
  private room: Room<any> | null = null;
  private players: Map<string, Player> = new Map();

  constructor() {
    this.client = new Client(socket_server_ip);
  }

  async initialize(game: Engine) {
    this.room = await this.client.joinOrCreate(ROOMS.main);

    if (this.room !== null) {
      document.title = this.room.roomId;
      const callback = getStateCallbacks(this.room);

      callback(this.room.state).players.onAdd(async (player, sessionId) => {
        const _player = new Player();
        await _player.initialize();
        _player.x = player.x;
        _player.y = player.y;
        this.players.set(sessionId, _player);
				game.camera.addChild(_player);
      });

      callback(this.room.state).players.onRemove((_, sessionId) => {
        const _player = this.players.get(sessionId);
        if (_player) {
          game.camera.removeChild(_player);
          this.players.delete(sessionId);
        }
      });

      this.room.onMessage(ACTIONS.move, ({ sessionId, x, y }) => {
        const _player = this.players.get(sessionId);
        if (_player) {
          _player.x = x;
          _player.y = y;
        }
      });
    }
  }

  getPlayers() {
    return this.players;
  }

  updatePlayerInput(deltaTime: number, moves: MOVE[]) {
		
		if (!this.room) return;
    if (!this.players.has(this.room.sessionId)) return;

    const player = this.players.get(this.room.sessionId) as Player;
    const params = { x: player.x, y: player.y };

    if (moves.length === 0) return params;

    const speed = deltaTime * GAME_CONFIG.velocity;
    for (const move of moves) {
      switch (move) {
        case MOVE.up: {
          params.y -= speed;
          break;
        }
        case MOVE.down: {
          params.y += speed;
          break;
        }
        case MOVE.left: {
          params.x -= speed;
          break;
        }
        case MOVE.right: {
          params.x += speed;
          break;
        }
      }
    }
		params.x = Math.max(0, Math.min(params.x , 5120 - player.width))
		params.y = Math.max(0, Math.min(params.y, 5120 - player.height));
    player.x = params.x;
    player.y = params.y;
    this.room.send(ACTIONS.move, params);
		return params
  }
}
