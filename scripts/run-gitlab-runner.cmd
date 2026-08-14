@echo off
rem Double-click launcher for run-gitlab-runner.ps1 - bypasses PowerShell's
rem default execution policy for just this one script, instead of changing
rem it machine-wide.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-gitlab-runner.ps1"
pause
