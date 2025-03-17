import {
  AnimatedSprite,
  Assets,
  // Assets,
  Container,
  // Sprite,
  Spritesheet,
  SpritesheetData,
  Texture,
} from "pixi.js";
import { getPlayerAssetsAlias } from "../Utils";

const spriteBox = { w: 72 - 36, h: 72 - 16 };
const atlas = (src: string): SpritesheetData => ({
    frames: {
      front_0: { frame: { x: 18, y: 16, ...spriteBox } },
      front_1: { frame: { x: 72 * 1 + 18, y: 16, ...spriteBox } },
      front_2: { frame: { x: 72 * 2 + 18, y: 16, ...spriteBox } },
      front_3: { frame: { x: 72 * 3 + 18, y: 16, ...spriteBox } },

      left_0: { frame: { x: 18, y: 72 + 16, ...spriteBox } },
      left_1: { frame: { x: 72 * 1 + 18, y: 72 + 16, ...spriteBox } },
      left_2: { frame: { x: 72 * 2 + 18, y: 72 + 16, ...spriteBox } },
      left_3: { frame: { x: 72 * 3 + 18, y: 72 + 16, ...spriteBox } },

      right_0: { frame: { x: 18, y: 144 + 16, ...spriteBox } },
      right_1: { frame: { x: 72 * 1 + 18, y: 144 + 16, ...spriteBox } },
      right_2: { frame: { x: 72 * 2 + 18, y: 144 + 16, ...spriteBox } },
      right_3: { frame: { x: 72 * 3 + 18, y: 144 + 16, ...spriteBox } },

      back_0: { frame: { x: 18, y: 216 + 16, ...spriteBox } },
      back_1: { frame: { x: 72 * 1 + 18, y: 216 + 16, ...spriteBox } },
      back_2: { frame: { x: 72 * 2 + 18, y: 216 + 16, ...spriteBox } },
      back_3: { frame: { x: 72 * 3 + 18, y: 216 + 16, ...spriteBox } },
    },
    meta: {
      image: src,
      format: "RGBA8888",
      size: { w: 288, h: 288 },
      scale: 1,
    },
    animations: {
      front: Array.from({ length: 4 }, (_, index) => `front_${index}`),
      left: Array.from({ length: 4 }, (_, index) => `left_${index}`),
      right: Array.from({ length: 4 }, (_, index) => `right_${index}`),
      back: Array.from({ length: 4 }, (_, index) => `back_${index}`),
    },
  }
);

export type PlayerDirection = 'front' | 'left' | 'right' | 'back'
export type PlayerAnimation = 'idle' | 'move'

export class Player extends Container {
  private animation!: AnimatedSprite;
  private spriteSheet!: Spritesheet<SpritesheetData>;
  
  public currentAnimation: PlayerAnimation = "idle";
  public currentDirection: PlayerDirection = 'front';

  public ready: Promise<void>;
  private sheetNo = 0;

  constructor() {
    super();
    this.width = 26;
    this.height = 37;
    this.ready = this.Init();
  }

  private async Init() {
    const assets = Assets.get(getPlayerAssetsAlias('idle', this.sheetNo))

    this.spriteSheet = new Spritesheet(
      assets,
      atlas(assets.label)
    );

    await this.spriteSheet.parse();

    this.animation = new AnimatedSprite(this.spriteSheet.animations['front']);

    console.log(this.animation)
    this.animation.animationSpeed = 0.1;
    this.animation.play();
    this.animation.anchor.set(0.5);
    this.addChild(this.animation);
  }

  setSpriteSheet(no: number) {
    this.sheetNo = no;
  }

  async setAnimation(animation: PlayerAnimation, direction: PlayerDirection) {
    if (
        this.currentAnimation === animation &&
        this.currentDirection === direction 
    ) return;

    if (this.currentAnimation !== animation) {
      const assets = Assets.get(getPlayerAssetsAlias(animation, this.sheetNo))
        this.spriteSheet = new Spritesheet(
            assets,
            atlas(assets.label)
          );
        await this.spriteSheet.parse();
    }

    this.animation.textures = this.spriteSheet.animations[direction] 
    this.animation.play()

    this.currentAnimation = animation
    this.currentDirection = direction
  }
}
