import {
  AnimatedSprite,
  Container,
  Spritesheet,
  SpritesheetData,
  Texture,
} from "pixi.js";

const spriteBox = { w: 72 - 36, h: 72 - 16 };
const atlas: SpritesheetData = {
  frames: {
    // Idle frames
    idle_1: { frame: { x: 18, y: 16, ...spriteBox } },
    idle_2: { frame: { x: 72 * 1 + 18, y: 16, ...spriteBox } },
    idle_3: { frame: { x: 72 * 2 + 18, y: 16, ...spriteBox } },
    idle_4: { frame: { x: 72 * 3 + 18, y: 16, ...spriteBox } },

    // Moving left frames
    left_1: { frame: { x: 18, y: 72 + 16, ...spriteBox } },
    left_2: { frame: { x: 72 * 1 + 18, y: 72 + 16, ...spriteBox } },
    left_3: { frame: { x: 72 * 2 + 18, y: 72 + 16, ...spriteBox } },
    left_4: { frame: { x: 72 * 3 + 18, y: 72 + 16, ...spriteBox } },

    // Moving right frames
    right_1: { frame: { x: 18, y: 144 + 16, ...spriteBox } },
    right_2: { frame: { x: 72 * 1 + 18, y: 144 + 16, ...spriteBox } },
    right_3: { frame: { x: 72 * 2 + 18, y: 144 + 16, ...spriteBox } },
    right_4: { frame: { x: 72 * 3 + 18, y: 144 + 16, ...spriteBox } },

    // Moving right frames
    behind_1: { frame: { x: 18, y: 216 + 16, ...spriteBox } },
    behind_2: { frame: { x: 72 * 1 + 18, y: 216 + 16, ...spriteBox } },
    behind_3: { frame: { x: 72 * 2 + 18, y: 216 + 16, ...spriteBox } },
    behind_4: { frame: { x: 72 * 3 + 18, y: 216 + 16, ...spriteBox } },
  },
  meta: {
    image: "assets/Characters/Char_001_Idle.png",
    format: "RGBA8888",
    size: { w: 288, h: 288 },
    scale: 1,
  },
  animations: {
    idle: ["idle_1", "idle_2", "idle_3", "idle_4"],
    left: ["left_1", "left_2", "left_3", "left_4"],
    right: ["right_1", "right_2", "right_3", "right_4"],
    behind: ["behind_1", "behind_2", "behind_3", "behind_4"],
  },
};

type Animation = 'idle' | 'left' | 'right' | 'behind'

export class Player extends Container {
  private animation!: AnimatedSprite;
  private spriteSheet!: Spritesheet<SpritesheetData>;
  private currentAnimation: string = "idle";
  ready: Promise<void>;

  constructor() {
    super();
    this.width = 26;
    this.height = 37;
    this.ready = this.Init();
  }

  private async Init() {
    this.spriteSheet = new Spritesheet(
      Texture.from(atlas.meta.image as string),
      atlas
    );
    await this.spriteSheet.parse();

    this.animation = new AnimatedSprite(this.spriteSheet.animations.idle);
    this.animation.animationSpeed = 0.1;
    this.animation.play();
    this.animation.anchor.set(0.5);
    this.addChild(this.animation);
  }

  setAnimation(name: Animation) {
    if (this.currentAnimation === name) return;
    if (this.spriteSheet.animations[name]) {
      this.animation.textures = this.spriteSheet.animations[name];
      this.animation.play();
      this.currentAnimation = name;
    }
  }
}
