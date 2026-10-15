import {
  check,
  type DownloadEvent,
  type Update,
} from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";

const UPDATE_CHECKS_STORAGE_KEY = "transfert-update-checks-enabled";
export const UPDATE_CHECKS_CHANGED_EVENT = "transfert-update-checks-changed";

export function areUpdateChecksEnabled() {
  if (typeof window === "undefined") return true;

  return localStorage.getItem(UPDATE_CHECKS_STORAGE_KEY) !== "false";
}

export function setUpdateChecksEnabled(enabled: boolean) {
  localStorage.setItem(UPDATE_CHECKS_STORAGE_KEY, String(enabled));
  window.dispatchEvent(new Event(UPDATE_CHECKS_CHANGED_EVENT));
}

export { type Update };

export function checkForUpdate() {
  return check();
}

export async function installUpdate(
  update: Update,
  onProgress?: (event: DownloadEvent) => void,
) {
  await update.downloadAndInstall(onProgress);
  await relaunch();
}
