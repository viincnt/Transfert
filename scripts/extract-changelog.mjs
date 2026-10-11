import { readFile } from "node:fs/promises";

const [changelogPath, version] = process.argv.slice(2);

if (!changelogPath || !version) {
  throw new Error("Usage: extract-changelog.mjs <path> <version>");
}

const changelog = await readFile(changelogPath, "utf8");
const lines = changelog.split(/\r?\n/);
const heading = new RegExp(
  `^## \\[${version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\]`,
);
const start = lines.findIndex((line) => heading.test(line));

if (start === -1) {
  throw new Error(`No changelog entry found for ${version}.`);
}

const end = lines.findIndex(
  (line, index) => index > start && line.startsWith("## "),
);
console.log(
  lines
    .slice(start, end === -1 ? undefined : end)
    .join("\n")
    .trim(),
);
