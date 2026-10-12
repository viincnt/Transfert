import { NextResponse } from "next/server";

const script = `$ErrorActionPreference = "Stop"

$release = Invoke-RestMethod "https://api.github.com/repos/viincnt/Transfert/releases/latest" -Headers @{ Accept = "application/vnd.github+json" }
$installer = $release.assets | Where-Object { $_.name -match "\\.msi$" } | Select-Object -First 1

if (-not $installer) {
  throw "The latest Transfert release does not include a Windows installer."
}

$path = Join-Path $env:TEMP $installer.name
Invoke-WebRequest -Uri $installer.browser_download_url -OutFile $path
$installerProcess = Start-Process msiexec.exe -ArgumentList @("/i", $path, "/passive", "/norestart") -Wait -PassThru
if ($installerProcess.ExitCode -notin 0, 3010, 1641) {
  throw "Transfert installation failed with exit code $($installerProcess.ExitCode)."
}
Remove-Item $path -Force
`;

export function GET() {
  return new NextResponse(script, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
