# Simple Professional Sound Downloader
$ErrorActionPreference = "Stop"
$SoundsDir = "public\sounds"

Write-Host "Downloading professional sounds..." -ForegroundColor Cyan

$sounds = @(
    @{Name = "wind.mp3"; Url = "https://actions.google.com/sounds/v1/ambiences/gentle_wind_loop.ogg"},
    @{Name = "bell.mp3"; Url = "https://actions.google.com/sounds/v1/alarms/meditation_bell.ogg"}
)

foreach ($sound in $sounds) {
    $dest = Join-Path $SoundsDir $sound.Name
    Write-Host "Downloading $($sound.Name)..." -ForegroundColor Yellow
    
    try {
        Invoke-WebRequest -Uri $sound.Url -OutFile $dest -UserAgent "Mozilla/5.0" -TimeoutSec 30
        $size = (Get-Item $dest).Length / 1KB
        Write-Host "Success! Size: $([math]::Round($size, 2)) KB" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nDone! Check public/sounds/ folder" -ForegroundColor Cyan
