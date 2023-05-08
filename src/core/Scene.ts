import { Container } from "pixi.js"

export interface SceneUtils {
  store?: unknown
}

export abstract class Scene extends Container {
  get name() {
    return this.constructor.name
  }

  load?(): void | Promise<void>
  unload?(): void | Promise<void>
  start?(): void | Promise<void>
  onResize?(width: number, height: number): void

  constructor(protected utils?: SceneUtils) {
    super()
  }
}
