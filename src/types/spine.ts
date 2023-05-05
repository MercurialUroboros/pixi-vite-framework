// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Spine } from "pixi-spine"

declare module "pixi-spine" {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  interface Spine {
    lastTime: number | null
  }
}
