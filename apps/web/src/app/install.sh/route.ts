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
  if mount | grep -Fq "on $mount_point "; then
    hdiutil detach "$mount_point" -quiet
  fi
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
      "Cache-Control": "public, max-age=300",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
