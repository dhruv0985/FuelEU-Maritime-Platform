<#
Simple helper to start local Postgres (docker-compose), wait for readiness, then run migrations + seed.
Usage: Run from project root in PowerShell:
  .\scripts\start-local.ps1
#>

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location $projectRoot

Write-Host "Starting Postgres via docker-compose..."
docker-compose up -d db

Write-Host "Waiting for Postgres to accept connections..."
$maxRetries = 30
$i = 0
while ($true) {
  try {
    docker run --rm --network host postgres:15 pg_isready -h host.docker.internal -p 5432  -U postgres > $null 2>&1
  } catch {
    # fall back to local check
  }
  # try using psql if available
  try {
    psql -U postgres -c '\q' > $null 2>&1
    if ($LASTEXITCODE -eq 0) { break }
  } catch {
    Start-Sleep -Seconds 2
    $i++
    if ($i -ge $maxRetries) { Write-Host "Timed out waiting for Postgres."; break }
  }
}

Write-Host "Running migrations and seed (backend)..."
cd .\backend
npm install
npm run db:migrate
npm run db:seed

Write-Host "Done. Start backend and frontend in separate terminals:"
Write-Host "  cd ./backend; npm run dev"
Write-Host "  cd ../frontend; npm run dev"

Pop-Location
