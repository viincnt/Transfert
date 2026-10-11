#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <dmg-url>" >&2
  exit 1
fi

dmg_url="$1"
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
