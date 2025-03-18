import { Client, getStateCallbacks, Room } from "colyseus.js";

import { ACTIONS, GAME_CONFIG, LABELS, ROOMS } from "../constants";
import { Player } from "../Entity/Player";
import { MOVE } from "./InputController/constants";
import { Engine } from "../Engine";
import { Assets, Container, ContainerChild, Sprite } from "pixi.js";

const socket_server_ip = "http://localhost:2567";

export class MultiplayerController {
  private client: Client;
  private room: Room<any> | null = null;
  private players: Map<string, Player> = new Map();
  private currentMap: Container<ContainerChild> | null = null

  constructor() {
    this.client = new Client(socket_server_ip);
    this.SetCurrentMap();
  }

  async Start() {
    const word = Engine.getWorld()
    this.room = await this.client.joinOrCreate(ROOMS.main);

    if (this.room !== null) {
      document.title = this.room.name;
      const $ = getStateCallbacks(this.room);

      $(this.room.state).players.onAdd(async (player, sessionId) => {
        const _player = new Player();
        await _player.ready

        _player.position.set(player.x, player.y)

        this.players.set(sessionId, _player);
        word.addChild(_player);
      });

      $(this.room.state).players.onRemove((_, sessionId) => {
        const _player = this.players.get(sessionId);
        if (_player) {
          word.removeChild(_player);
          this.players.delete(sessionId);
        }
      });

      this.room.onMessage(ACTIONS.move, ({ sessionId, x, y, animation, direction }) => {
        const _player = this.players.get(sessionId);
        if (_player) {
          _player.position.set(x, y)
          _player.setAnimation(animation, direction)
        }
      });
    }
  }

  SetCurrentMap(mapName: string = LABELS.world_map) {
    const mapSprite = Sprite.from(Assets.get(mapName))
    mapSprite.label = mapName
    mapSprite.setSize(2048)
    const word = Engine.getWorld()
    word.addChildAt(mapSprite, 0)
    this.currentMap = Engine.getMap(mapName)
  }

  UpdatePlayerInput(deltaTime: number, moves: MOVE[]) {
    if (!this.room) return null;
    if (!this.players.has(this.room.sessionId)) return null;

    const player = this.players.get(this.room.sessionId) as Player;
    const state = player.getCurrentState()

    const params = { 
      x: player.x, 
      y: player.y, 
      animation: state.animation, 
      direction: state.direction 
    };

    if (moves.length === 0) {
      params.animation = 'idle'
      player.setAnimation(params.animation, params.direction)
      if (state.animation !== 'idle') {
        this.room.send(ACTIONS.move, params);
      }
      return params;
    }

    const speed = deltaTime * GAME_CONFIG.velocity;

    params.animation = 'move'
    for (const move of moves) {
      switch (move) {
        case MOVE.up: {
          params.y -= speed;
          params.direction = 'back'
          break;
        }
        case MOVE.down: {
          params.y += speed;
          params.direction = 'front'
          break;
        }
        case MOVE.left: {
          params.x -= speed;
          params.direction = 'left'
          break;
        }
        case MOVE.right: {
          params.x += speed;
          params.direction = 'right'
          break;
        }
      }
    }

    if (this.currentMap !== null) {
      const playerWCenter = player.width / 2
      const playerHCenter = player.height / 2
  
      params.x = Math.max(playerWCenter, Math.min(params.x, this.currentMap.width - playerWCenter))
      params.y = Math.max(playerHCenter, Math.min(params.y, this.currentMap.height - playerHCenter));
    }

    player.position.set(params.x, params.y)
    player.setAnimation(params.animation, params.direction)

    this.room.send(ACTIONS.move, params);

    return params
  }
}
