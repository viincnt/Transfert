const LATEST_RELEASE_URL =
  "https://api.github.com/repos/viincnt/Transfert/releases/latest";
const UPDATE_CHECKS_STORAGE_KEY = "transfert-update-checks-enabled";
export const UPDATE_CHECKS_CHANGED_EVENT = "transfert-update-checks-changed";

type LatestRelease = {
  html_url: string;
  tag_name: string;
};

export function areUpdateChecksEnabled() {
  if (typeof window === "undefined") return true;

  return localStorage.getItem(UPDATE_CHECKS_STORAGE_KEY) !== "false";
}

export function setUpdateChecksEnabled(enabled: boolean) {
  localStorage.setItem(UPDATE_CHECKS_STORAGE_KEY, String(enabled));
  window.dispatchEvent(new Event(UPDATE_CHECKS_CHANGED_EVENT));
}

function versionParts(version: string) {
  const normalized = version.trim().replace(/^v/i, "");

  if (!/^\d+(\.\d+)*$/.test(normalized)) return null;

  return normalized.split(".").map(Number);
}

function isNewerVersion(candidate: string, current: string) {
  const candidateParts = versionParts(candidate);
  const currentParts = versionParts(current);

  if (!candidateParts || !currentParts) return false;

  const length = Math.max(candidateParts.length, currentParts.length);

  for (let index = 0; index < length; index += 1) {
    const difference =
      (candidateParts[index] ?? 0) - (currentParts[index] ?? 0);
    if (difference !== 0) return difference > 0;
  }

  return false;
}

export async function checkForUpdate(currentVersion: string) {
  const response = await fetch(LATEST_RELEASE_URL, {
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!response.ok) throw new Error("Unable to check for updates.");

  const release = (await response.json()) as LatestRelease;

  return {
    available: isNewerVersion(release.tag_name, currentVersion),
    url: release.html_url,
    version: release.tag_name.replace(/^v/i, ""),
  };
}
