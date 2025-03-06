import { Switcher } from "@pixi/ui"
import { Container } from "pixi.js"

export class SwitcherController {
  switcher: Switcher;
  idx: number = 0;

  constructor(props: (Container | string)[]) {
    this.switcher = new Switcher(props, 'onPress')
    this.switcher.onChange.connect(state => this.idx = state as number)
  }

}