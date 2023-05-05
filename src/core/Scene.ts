import { Container } from "pixi.js"

export abstract class Scene extends Container {
  abstract name: string

  load?(): void | Promise<void>
  unload?(): void | Promise<void>
  start?(): void | Promise<void>
  onResize?(width: number, height: number): void

  constructor(protected utils: unknown) {
    super()
  }
}
