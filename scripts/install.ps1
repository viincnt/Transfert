# Downloads and silently installs the latest Transfert release for Windows.
# No admin rights needed - the MSI installs per-user (see src-tauri/wix/main.wxs).
#
# Usage:
#   irm https://gitlab.com/viincnt/transfert/-/raw/main/scripts/install.ps1 | iex

$ErrorActionPreference = "Stop"

$ProjectId = "85385402"
$ReleaseApiUrl = "https://gitlab.com/api/v4/projects/$ProjectId/releases/permalink/latest"

Write-Host "Finding the latest Transfert release..."
$release = Invoke-RestMethod -Uri $ReleaseApiUrl -Headers @{ Accept = "application/json" }

$asset = $release.assets.links | Where-Object { $_.name -like "*.msi" } | Select-Object -First 1
if (-not $asset) {
    Write-Error "No MSI found in release $($release.tag_name)."
    exit 1
}

Write-Host "Downloading $($asset.name) ($($release.tag_name))..."
$installerPath = Join-Path $env:TEMP $asset.name
Invoke-WebRequest -Uri $asset.url -OutFile $installerPath

Write-Host "Installing..."
$proc = Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait -PassThru
Remove-Item $installerPath -ErrorAction SilentlyContinue

if ($proc.ExitCode -ne 0) {
    Write-Error "Installer exited with code $($proc.ExitCode)."
    exit 1
}

Write-Host "Transfert $($release.tag_name) installed. Find it in your Start Menu."
