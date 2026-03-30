import { Clipboard, showToast, Toast, closeMainWindow, showHUD } from "@raycast/api";
import { exec } from "child_process";
import { promisify } from "util";
import { writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

const execAsync = promisify(exec);

export default async function OpenInPhotoshop() {
  const clipboardContent = await Clipboard.read();

  let imagePath: string | null = null;

  // Case 1: clipboard holds a file reference
  if (clipboardContent.file) {
    imagePath = decodeURIComponent(clipboardContent.file.replace(/^file:\/\//, ""));
  }
  // Case 2: clipboard text is a path to an image file
  else if (clipboardContent.text) {
    const text = clipboardContent.text.trim();
    if (/\.(png|jpe?g|gif|webp|tiff?|bmp|psd|svg)$/i.test(text)) {
      imagePath = text;
    }
  }

  // Case 3: clipboard holds raw image data — dump it to a temp PNG via osascript
  if (!imagePath) {
    const tempPath = join(tmpdir(), `raycast-ps-${randomUUID()}.png`);
    try {
      await execAsync(
        `osascript -e 'set theFile to open for access POSIX file "${tempPath}" with write permission' ` +
        `-e 'set theData to the clipboard as «class PNGf»' ` +
        `-e 'write theData to theFile' ` +
        `-e 'close access theFile'`
      );
      imagePath = tempPath;
    } catch (e) {
      await showToast({
        style: Toast.Style.Failure,
        title: "No image in clipboard",
        message: e instanceof Error ? e.message : String(e),
      });
      return;
    }
  }

  // Open in Photoshop — try versions newest first
  const photoshopApps = ["Adobe Photoshop 2026", "Adobe Photoshop 2025", "Adobe Photoshop (Beta)", "Adobe Photoshop"];
  await closeMainWindow();
  const errors: string[] = [];
  for (const app of photoshopApps) {
    try {
      const { stderr } = await execAsync(`open -a "${app}" "${imagePath}"`);
      if (stderr) {
        errors.push(`${app} stderr: ${stderr}`);
        continue;
      }
      await showHUD(`Opened in ${app}`);
      return;
    } catch (e) {
      errors.push(`${app}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  await showToast({
    style: Toast.Style.Failure,
    title: "Could not open Photoshop",
    message: errors.join(" | "),
  });
}
