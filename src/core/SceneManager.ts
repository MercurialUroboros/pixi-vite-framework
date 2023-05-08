import { Application } from "pixi.js"
import { Scene } from "./Scene"

class SceneManager {
  private sceneCtors = new Map<string, ConstructorType<typeof Scene>>()
  private sceneInstances = new Map<string, Scene>()
  private rootApplication: Application | null = null

  currentScene?: Scene

  constructor() {
    window.addEventListener("resize", (ev: UIEvent) => {
      const target = ev.target as Window

      this.currentScene?.onResize?.(target.innerWidth, target.innerHeight)
    })
  }

  public addScenes(scenes: ConstructorType<typeof Scene>[], root: Application) {
    for (const scene of scenes) {
      this.sceneCtors.set(scene.name, scene)
    }
    this.rootApplication = root
  }

  async switchScene(
    scene: ConstructorType<typeof Scene>,
    deletePrevious = true
  ): Promise<Scene> {
    await this.removeScene(deletePrevious)

    this.currentScene = this.sceneInstances.get(scene.name)

    if (!this.currentScene) this.currentScene = await this.initScene(scene.name)

    if (!this.currentScene)
      throw new Error(`Failed to initialize scene: ${scene.name}`)

    this.rootApplication?.stage.addChild(this.currentScene)

    await this.currentScene.start?.()

    return this.currentScene
  }

  private async removeScene(destroyScene: boolean) {
    if (!this.currentScene) return

    if (destroyScene) {
      this.sceneInstances.delete(this.currentScene.name)

      this.currentScene.destroy({ children: true })
    } else {
      this.rootApplication?.stage.removeChild(this.currentScene)
    }

    await this.currentScene.unload?.()

    this.currentScene = undefined
  }

  private async initScene(sceneName: string) {
    const sceneCtor = this.sceneCtors.get(sceneName)

    if (!sceneCtor)
      throw new Error(`Scene ${sceneName} doesn't have a constructor`)

    const scene = new sceneCtor()

    this.sceneInstances.set(sceneName, scene)

    await scene.load?.()

    return scene
  }
}

export const sceneManagerInstance = new SceneManager()
