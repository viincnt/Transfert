import { getLatestRelease } from "@/lib/releases";

export async function GET() {
  const release = await getLatestRelease();

  if (!release?.macos) {
    return new Response(
      "No macOS installer is available in the latest release.\n",
      {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  }

  const script = `#!/usr/bin/env bash
set -euo pipefail

dmg_url=${JSON.stringify(release.macos.browser_download_url)}
temp_dir="$(mktemp -d)"
mount_point="$temp_dir/mount"

cleanup() {
  hdiutil detach "$mount_point" -quiet 2>/dev/null || true
  rm -rf "$temp_dir"
}
trap cleanup EXIT

curl --fail --location --output "$temp_dir/Transfert.dmg" "$dmg_url"
mkdir "$mount_point"
hdiutil attach "$temp_dir/Transfert.dmg" -nobrowse -readonly -mountpoint "$mount_point" -quiet

sudo rm -rf "/Applications/Transfert.app"
sudo cp -R "$mount_point/Transfert.app" "/Applications/Transfert.app"
sudo xattr -dr com.apple.quarantine "/Applications/Transfert.app"

echo "Transfert installed in /Applications."
`;

  return new Response(script, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
