import { MOVE } from "./constants";

export class KeyboardController {
  private keysMap: Map<KeyboardEvent["key"], boolean> = new Map([
    ["ArrowUp", false],
    ["ArrowDown", false],
    ["ArrowLeft", false],
    ["ArrowRight", false],
  ]);

  constructor() {
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
  }

  getAction(): Array<MOVE> {
		// console.log("this.keysMap", this.keysMap)
    const moves: MOVE[] = [];	
    for (let key of this.keysMap.keys()) {
      if (this.keysMap.get(key)) {
        switch (key) {
          case "ArrowUp": {
            moves.push(MOVE.up);
            break;
          }
          case "ArrowDown": {
            moves.push(MOVE.down);
            break;
          }
          case "ArrowLeft": {
            moves.push(MOVE.left);
            break;
          }
          case "ArrowRight": {
            moves.push(MOVE.right);
            break;
          }
          default:
        }
      }
    }
    return moves;
  }
}
