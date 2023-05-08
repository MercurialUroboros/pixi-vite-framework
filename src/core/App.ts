import { Application } from "pixi.js"
import { assetLoaderInstance } from "./AssetLoader"
import { sceneManagerInstance } from "./SceneManager"
import { LoadingScene } from "../scenes/Loading.scene"
import { GameScene } from "../scenes/Game.scene"

class App extends Application {
  private sceneManager = sceneManagerInstance

  constructor() {
    super({
      view: document.querySelector("#app") as HTMLCanvasElement,
      antialias: true,
      backgroundColor: 0x000000,
      backgroundAlpha: 1,
      autoDensity: true,
      resolution: devicePixelRatio,
      width: window.innerWidth,
      height: window.innerHeight
    })
  }

  private async preload() {
    await assetLoaderInstance.loadAssetsGroup("game")
    this.sceneManager.addScenes([LoadingScene, GameScene], this)
  }

  public async init() {
    await this.preload()
    await this.sceneManager.switchScene(LoadingScene)
  }
}

export const appInstance = new App()
