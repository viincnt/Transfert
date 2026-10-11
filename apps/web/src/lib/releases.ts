const LATEST_RELEASE_URL =
  "https://api.github.com/repos/viincnt/Transfert/releases/latest";

type ReleaseAsset = {
  browser_download_url: string;
  name: string;
};

type GitHubRelease = {
  html_url: string;
  name: string | null;
  tag_name: string;
  assets: ReleaseAsset[];
};

export type LatestRelease = {
  name: string;
  url: string;
  windows?: ReleaseAsset;
  macos?: ReleaseAsset;
};

export async function getLatestRelease(): Promise<LatestRelease | null> {
  const response = await fetch(LATEST_RELEASE_URL, {
    headers: { Accept: "application/vnd.github+json" },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return null;

  const release = (await response.json()) as GitHubRelease;

  return {
    name: release.name ?? release.tag_name,
    url: release.html_url,
    windows: release.assets.find((asset) => asset.name.endsWith(".msi")),
    macos: release.assets.find((asset) => asset.name.endsWith(".dmg")),
  };
}
