import { appInstance } from "./core/App"
import * as PIXI from "pixi.js"
import "normalize.css"

// Enabling pixi-devtools by code
if (import.meta.env.DEV) {
  window.__PIXI_INSPECTOR_GLOBAL_HOOK__?.register({ PIXI })
}

appInstance.init()
