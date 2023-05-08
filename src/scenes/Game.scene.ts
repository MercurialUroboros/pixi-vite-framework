import { Text } from "pixi.js"
import { Scene } from "../core/Scene"

export class GameScene extends Scene {
  constructor() {
    super()

    const text = new Text("Game", { fill: "white" })
    text.anchor.set(0.5)
    text.position.set(innerWidth / 2, innerHeight / 2)
    this.addChild(text)
  }
}
