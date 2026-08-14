# Downloads and silently installs the latest Transfert release for Windows.
# No admin rights needed - the MSI installs per-user (see src-tauri/wix/main.wxs).
#
# Usage:
#   curl.exe -sSL https://gitlab.com/viincnt/transfert/-/raw/main/scripts/install.ps1 | iex

$ErrorActionPreference = "Stop"

$ProjectId = "85385402"
$ReleaseApiUrl = "https://gitlab.com/api/v4/projects/$ProjectId/releases/permalink/latest"

Write-Host "Finding the latest Transfert release..."
$releaseJson = curl.exe -sSL --fail $ReleaseApiUrl -H "Accept: application/json"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Could not reach GitLab to check the latest release (curl exit $LASTEXITCODE)."
    exit 1
}
$release = $releaseJson | ConvertFrom-Json

$asset = $release.assets.links | Where-Object { $_.name -like "*.msi" } | Select-Object -First 1
if (-not $asset) {
    Write-Error "No MSI found in release $($release.tag_name)."
    exit 1
}

Write-Host "Downloading $($asset.name) ($($release.tag_name))..."
$installerPath = Join-Path $env:TEMP $asset.name
curl.exe -sSL --fail $asset.url -o $installerPath
if ($LASTEXITCODE -ne 0) {
    Write-Error "Download failed (curl exit $LASTEXITCODE)."
    exit 1
}

Write-Host "Installing..."
$proc = Start-Process msiexec.exe -ArgumentList "/i `"$installerPath`" /quiet /norestart" -Wait -PassThru
Remove-Item $installerPath -ErrorAction SilentlyContinue

if ($proc.ExitCode -ne 0) {
    Write-Error "Installer exited with code $($proc.ExitCode)."
    exit 1
}

Write-Host "Transfert $($release.tag_name) installed. Find it in your Start Menu."
