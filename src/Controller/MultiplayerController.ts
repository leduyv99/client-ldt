import { Client, getStateCallbacks, Room } from "colyseus.js";

import { ACTIONS, GAME_CONFIG, LABELS, ROOMS } from "../constants";
import { Player } from "../Entity/Player";
import { MOVE } from "./InputController/constants";
import { Engine } from "../Engine";

const socket_server_ip = "http://localhost:2567";

export class MultiplayerController {
  private client: Client;
  private room: Room<any> | null = null;
  private players: Map<string, Player> = new Map();

  constructor() {
    this.client = new Client(socket_server_ip);
  }

  async initialize() {
    const word = Engine.getWorld()

    this.room = await this.client.joinOrCreate(ROOMS.main);

    if (this.room !== null) {
      document.title = this.room.name;
      const callback = getStateCallbacks(this.room);

      callback(this.room.state).players.onAdd(async (player, sessionId) => {
        const _player = new Player();
        await _player.ready
        _player.x = player.x;
        _player.y = player.y;

        this.players.set(sessionId, _player);
        word.addChild(_player);

        // callback(player).onChange(async () => {
        //   await _player.ready;
        // })
      });

      callback(this.room.state).players.onRemove((_, sessionId) => {
        const _player = this.players.get(sessionId);
        if (_player) {
          word.removeChild(_player);
          this.players.delete(sessionId);
        }
      });

      this.room.onMessage(ACTIONS.move, ({ sessionId, x, y, animation, direction }) => {
        const _player = this.players.get(sessionId);
        if (_player) {
          _player.x = x;
          _player.y = y;
          _player.setAnimation(animation, direction)
        }
      });

      this.room.onMessage(ACTIONS.updateAsset, ({ sessionId, indexAsset }) => {
        console.log(this.players)
        const _player = this.players.get(sessionId);
        if (_player) {
          _player.setSpriteSheet(indexAsset)
        }
      });
    }
  }

  // async updatePlayerAsset(idx: number) {
  //   if (!this.room) return;
  //   if (!this.players.has(this.room.sessionId)) return;
  //   const player = this.players.get(this.room.sessionId) as Player;
  //   if (player.getIdx() !== idx) {
  //     this.room.send(ACTIONS.updateAsset, idx);
  //     player.setIdx(idx)
  //     await player.initialize();
  //   }
  // }

  updatePlayerInput(deltaTime: number, moves: MOVE[]) {
    if (!this.room) return;
    if (!this.players.has(this.room.sessionId)) return;

    const player = this.players.get(this.room.sessionId) as Player;
    const params = { 
      x: player.x, 
      y: player.y, 
      animation: player.currentAnimation, 
      direction: player.currentDirection 
    };

    if (moves.length === 0) {
      player.setAnimation("idle", player.currentDirection)
      return params;
    }

    const speed = deltaTime * GAME_CONFIG.velocity;
    for (const move of moves) {
      switch (move) {
        case MOVE.up: {
          params.y -= speed;
          player.setAnimation("move", "back")
          break;
        }
        case MOVE.down: {
          params.y += speed;
          player.setAnimation("move", "front")
          break;
        }
        case MOVE.left: {
          params.x -= speed;
          player.setAnimation("move", "left")
          break;
        }
        case MOVE.right: {
          params.x += speed;
          player.setAnimation("move", "right")
          break;
        }
      }
    }

    const world = Engine.getWorld()
    const worldMap = world.getChildByLabel(LABELS.world_map)
    if (worldMap === null) return

    const playerWCenter = player.width / 2
    const playerHCenter = player.height / 2

    params.x = Math.max(playerWCenter, Math.min(params.x, worldMap.width - playerWCenter))
    params.y = Math.max(playerHCenter, Math.min(params.y, worldMap.height - playerHCenter));
    params.animation = player.currentAnimation;
    params.direction = player.currentDirection;

    player.x = params.x;
    player.y = params.y;

    this.room.send(ACTIONS.move, params);

    return params
  }
}
