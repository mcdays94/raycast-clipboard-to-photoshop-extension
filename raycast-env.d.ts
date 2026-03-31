/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Target Application - Override which application opens the clipboard image. Leave empty to auto-detect the latest Photoshop. Accepts any app name (e.g. "Affinity Photo 2", "Adobe Photoshop 2025") or a full path (e.g. "/Applications/Pixelmator Pro.app"). */
  "photoshopApp"?: string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `open-in-photoshop` command */
  export type OpenInPhotoshop = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `open-in-photoshop` command */
  export type OpenInPhotoshop = {}
}

