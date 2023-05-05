import { Container, Application } from "pixi.js"
import { assetLoaderInstance } from "./AssetLoader"

/**
 * The entry point for the app
 */
class App extends Application {
  // private readonly viewPortRatio = GAME_VIEWPORT[0] / GAME_VIEWPORT[1]
  private readonly app = new Container()

  constructor() {
    super({
      view: document.querySelector("#app") as HTMLCanvasElement,
      antialias: true,
      backgroundColor: 0x000000,
      backgroundAlpha: 1,
      autoDensity: true,
      resolution: devicePixelRatio,
      width: window.innerWidth,
      height: window.innerHeight,
    })
    this.stage.addChild(this.app)
  }

  public async init() {
    await assetLoaderInstance.loadAssetsGroup("game")
  }
}

export const appInstance = new App()
