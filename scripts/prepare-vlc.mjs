import { cp, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const destination = path.join(root, "apps/desktop/src-tauri/resources/vlc");
const platform = process.platform;
if (!["win32", "darwin"].includes(platform)) {
  throw new Error(
    "VLC bundling currently supports Windows and macOS. Linux uses the distribution's LibVLC 3 runtime.",
  );
}
const source =
  process.env.TRANSFERT_VLC_DIR ??
  (platform === "win32"
    ? path.join(process.env.ProgramFiles ?? "C:/Program Files", "VideoLAN/VLC")
    : "/Applications/VLC.app/Contents/MacOS/lib");
const library = platform === "win32" ? "libvlc.dll" : "libvlc.dylib";
await stat(path.join(source, library));
if (path.resolve(source).startsWith(path.resolve(destination))) {
  throw new Error(
    "Use the original VLC distribution as the source, not the staging directory",
  );
}
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });

if (platform === "win32") {
  for (const name of [
    "libvlc.dll",
    "libvlccore.dll",
    "plugins",
    "COPYING.txt",
    "AUTHORS.txt",
  ]) {
    await cp(path.join(source, name), path.join(destination, name), {
      recursive: true,
    });
  }
} else {
  // Keep lib/ and plugins/ relative to each other, as in VLC.app.
  const macos = path.dirname(source);
  for (const name of ["lib", "plugins"]) {
    await cp(path.join(macos, name), path.join(destination, name), {
      recursive: true,
      dereference: true,
    });
  }
}

// The macOS app bundle does not include the COPYING file that ships alongside
// VLC in its distribution. Preserve the license texts in our runtime resources.
for (const [name, url] of [
  [
    "COPYING-LGPL-2.1.txt",
    "https://www.gnu.org/licenses/old-licenses/lgpl-2.1.txt",
  ],
  ...(platform === "darwin"
    ? [
        [
          "COPYING-GPL-2.0.txt",
          "https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt",
        ],
      ]
    : []),
]) {
  const response = await fetch(url);
  if (!response.ok)
    throw new Error(`Cannot retrieve license ${url}: ${response.status}`);
  await writeFile(path.join(destination, name), await response.text());
}

// Drop caches containing paths from the source installation. VLC rebuilds its
// in-memory plugin index from the bundled files on first use.
async function removeCaches(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) await removeCaches(target);
    else if (entry.name === "plugins.dat") await rm(target);
  }
}
await removeCaches(destination);
await cp(
  path.join(root, "THIRD_PARTY_NOTICES.md"),
  path.join(destination, "THIRD_PARTY_NOTICES.md"),
);
await writeFile(
  path.join(destination, "TRANSFERT-NOTICE.txt"),
  "LibVLC and VLC plugins by VideoLAN and contributors.\n" +
    "This runtime includes native third-party codecs; it is not pure Rust.\n" +
    "Licenses and source: https://www.videolan.org/legal.html\n" +
    "VLC source releases: https://download.videolan.org/pub/videolan/vlc/\n",
);
console.log(`Staged LibVLC runtime in ${destination}`);
