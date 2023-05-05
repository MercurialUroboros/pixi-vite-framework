import { Assets } from "pixi.js"
import "@pixi/sound" // Side effects for pixi sound
import "pixi-spine" // Side effects for pixi spines
import { spineManager } from "./SpineManager"

interface RegexpMatch {
  name: string
  ext: string
  category: "spritesheets" | "images" | "sounds" | "spines" | string
  group: string
}

interface Asset extends RegexpMatch {
  url: string
}

class AssetLoader {
  private assetFileUrls = this.importAssetFiles()

  private manifest = this.generateManifest()

  private importAssetFiles() {
    const assetFiles = import.meta.glob("/public/assets/**/*.*")
    return Object.keys(assetFiles)
  }

  private generateManifest() {
    const assetsManifest: Asset[] = []
    const assetPathRegexp =
      /public\/assets\/(?<group>[\w.-]+)\/(?<category>[\w.-]+)\/(?<name>[\w.-]+)\.(?<ext>\w+)$/

    this.assetFileUrls.forEach((assetPath) => {
      const match = assetPathRegexp.exec(assetPath)

      if (!match || !match.groups) {
        return console.error(
          `Invalid asset path: ${assetPath}, should match ${assetPathRegexp}`
        )
      }

      const { group, category, name, ext } =
        match.groups as unknown as RegexpMatch

      //Spritesheets and spines need just the json
      if (
        (category === "spritesheets" || category === "spines") &&
        ext !== "json"
      )
        return

      assetsManifest.push({
        group,
        category,
        name,
        ext,
        url:
          assetPath.replace(/.*public/, "") +
          // Add cache busting
          `?version=${import.meta.env.VITE_APP_VERSION}`,
      })
    })

    return assetsManifest
  }

  async loadAssetsGroup(group: string) {
    const sceneAssets = this.manifest.filter((asset) => asset.group === group)

    for (const asset of sceneAssets) {
      Assets.add(asset.name, asset.url)
    }
    const resources = await Assets.load(
      sceneAssets.map((asset) => asset.name),
      (a) => {
        console.log("progress", a)
      }
    )
    spineManager.setupSpines(resources)
    console.log("✅ Loaded assets group", group, resources, sceneAssets)

    return resources
  }
}

export const assetLoaderInstance = new AssetLoader()
