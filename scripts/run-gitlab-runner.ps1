# Launches a local GitLab Runner for this project's CI (see .gitlab-ci.yml).
# Meant to be started before pushing a version tag, and left running until
# the "build-msi" job finishes - this machine has no CI job queue to poll,
# it just needs to be up while a pipeline is actually running.
#
# First run: downloads the gitlab-runner binary and walks you through
# registering it (needs a one-time token from the project's CI/CD settings).
# Every run after that just starts it and waits for jobs.

$ErrorActionPreference = "Stop"

$RunnerDir = "C:\GitLab-Runner"
$RunnerExe = Join-Path $RunnerDir "gitlab-runner.exe"
$ConfigFile = Join-Path $RunnerDir "config.toml"

if (-not (Test-Path $RunnerDir)) {
    New-Item -ItemType Directory -Path $RunnerDir | Out-Null
}

if (-not (Test-Path $RunnerExe)) {
    Write-Host "gitlab-runner.exe not found - downloading it to $RunnerDir..."
    $downloadUrl = "https://gitlab-runner-downloads.s3.amazonaws.com/latest/binaries/gitlab-runner-windows-amd64.exe"
    Invoke-WebRequest -Uri $downloadUrl -OutFile $RunnerExe
}

if (-not (Test-Path $ConfigFile)) {
    Write-Host ""
    Write-Host "This runner isn't registered to the project yet. Get a token from:"
    Write-Host "  GitLab project -> Settings -> CI/CD -> Runners -> New project runner"
    Write-Host "  (platform: Windows, tag: windows)"
    Write-Host ""
    $token = Read-Host "Paste the registration token"

    # Tags aren't passed here on purpose: with a runner-authentication token
    # (the kind "New project runner" gives you), tags/locked/access-level
    # etc. are configured server-side when you created the runner in
    # GitLab's UI, and gitlab-runner now refuses to also set them here.
    & $RunnerExe register `
        --url "https://gitlab.com" `
        --token $token `
        --executor "shell" `
        --description "windows-local" `
        --config $ConfigFile

    if ($LASTEXITCODE -ne 0 -or -not (Test-Path $ConfigFile)) {
        Write-Host ""
        Write-Host "Registration failed - see the error above. Re-run this script to try again."
        exit 1
    }

    Write-Host ""
    Write-Host "Registered. Re-run this script whenever you want the runner up."
}

Write-Host ""
Write-Host "Runner is up, waiting for jobs. Leave this window open during a release build; Ctrl+C or close it when you're done."
& $RunnerExe run --config $ConfigFile
