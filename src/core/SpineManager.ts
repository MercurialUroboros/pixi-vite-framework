import { Spine, ISkeletonData, TextureAtlas } from "pixi-spine"

interface DownloadedSpine {
  spineAtlas: TextureAtlas
  spineData: ISkeletonData
}

class SpineManager {
  private pool = new Map<string, Spine[]>()
  private rawSpineData = new Map<string, DownloadedSpine>()

  public setupSpines(resources: Record<string, DownloadedSpine>) {
    for (const [name, resource] of Object.entries(resources)) {
      if (!("spineData" in resource)) continue
      this.rawSpineData.set(name, resource)

      const spine = new Spine(resource.spineData)

      spine.name = name
      spineManager.returnSpineToPool(spine)
      console.log(name, resource, spine)
    }
  }

  public getSpineFromPool = (key: string) => {
    const spinePool = this.pool.get(key)
    if (!spinePool) {
      this.pool.set(key, [])
    }
    if ((spinePool ?? []).length > 0) {
      return spinePool?.pop() as NonNullable<Spine>
    } else if (this.rawSpineData.get(key)?.spineData) {
      const spineData = this.rawSpineData.get(key)?.spineData as ISkeletonData
      const spine = new Spine(spineData)

      spine.name = key

      return spine
    }
    throw new Error("spineData has not parsed or spine name is wrong")
  }

  public returnSpineToPool = (spine: Spine) => {
    spine.removeFromParent()
    // spine reset
    // https://github.com/pixijs/pixi-spine/issues/166
    spine.lastTime = null
    spine.visible = true
    spine.alpha = 1
    spine.position.set(0, 0)
    spine.scale.set(1, 1)
    spine.state.clearListeners()
    spine.state.clearTracks()
    spine.skeleton.setToSetupPose()
    spine.state.setEmptyAnimations(0)

    const spineName = spine.name as string
    const spinePool = this.pool.get(spineName)
    if (!spinePool) {
      this.pool.set(spineName, [])
    }
    if (spinePool) {
      spinePool.push(spine)
    }
  }
}

export const spineManager = new SpineManager()
