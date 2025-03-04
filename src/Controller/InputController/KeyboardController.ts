import { MOVE } from "./constants";

export class KeyboardController {
  private static instance: KeyboardController | null = null
  private static keysMap: Map<KeyboardEvent["key"], boolean> = new Map([
    ["ArrowUp", false],
    ["ArrowDown", false],
    ["ArrowLeft", false],
    ["ArrowRight", false],
  ]);

  static getInstance() {
    if (this.instance === null) {
      document.addEventListener("keydown", (e) => {
        if (this.keysMap.has(e.key)) {
          this.keysMap.set(e.key, true);
        }
      });
  
      document.addEventListener("keyup", (e) => {
        if (this.keysMap.has(e.key)) {
          this.keysMap.set(e.key, false);
        }
      });
      this.instance = new KeyboardController()
    }
    return this.instance
  }

  private getAction(key: string) {
    switch (key) {
      case "ArrowUp": {
        return MOVE.up;
      }
      case "ArrowDown": {
        return MOVE.down
      }
      case "ArrowLeft": {
        return MOVE.left;
      }
      case "ArrowRight": {
        return MOVE.right;
      }
    }
  }

  public getActions(): Array<MOVE> {
    if (KeyboardController.instance === null) {
      console.log("Keyboard controller doesn't init.")
      return []
    }

    const moves: MOVE[] = [];	

    KeyboardController.keysMap.forEach((value, key) => {
      if (!!value) {
        moves.push(this.getAction(key) as MOVE)
      }
    })

    return moves;
  }
}
