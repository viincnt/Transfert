import { NextResponse } from "next/server";

const script = `$ErrorActionPreference = "Stop"

$release = Invoke-RestMethod "https://api.github.com/repos/viincnt/Transfert/releases/latest" -Headers @{ Accept = "application/vnd.github+json" }
$installer = $release.assets | Where-Object { $_.name -match "\\.msi$" } | Select-Object -First 1

if (-not $installer) {
  throw "The latest Transfert release does not include a Windows installer."
}

$path = Join-Path $env:TEMP $installer.name
Invoke-WebRequest -Uri $installer.browser_download_url -OutFile $path
& msiexec.exe /i $path /passive /norestart
if ($LASTEXITCODE -ne 0) {
  throw "Transfert installation failed with exit code $LASTEXITCODE."
}
Remove-Item $path -Force
`;

export function GET() {
  return new NextResponse(script, {
    headers: {
      "Cache-Control": "public, max-age=300",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
