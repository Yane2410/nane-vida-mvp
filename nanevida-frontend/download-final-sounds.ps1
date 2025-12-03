param()

Set-Location "public\sounds"

Write-Host "Descargando sonidos profesionales faltantes..." -ForegroundColor Cyan

# Wind sound - Opciones alternativas
$windUrls = @(
    "http://soundbible.com/grab.php?id=2229&type=mp3",  # Wind Howling
    "http://soundbible.com/grab.php?id=1810&type=mp3",  # Wind
    "http://soundbible.com/grab.php?id=1804&type=mp3"   # Blowing Wind
)

# Bell sound - Opciones alternativas
$bellUrls = @(
    "http://soundbible.com/grab.php?id=2218&type=mp3",  # Tibetan Bell
    "http://soundbible.com/grab.php?id=2215&type=mp3",  # Ship Bell
    "http://soundbible.com/grab.php?id=1598&type=mp3"   # Service Bell
)

function Download-WithRetry {
    param($urls, $outputFile)
    
    foreach ($url in $urls) {
        try {
            Write-Host "Intentando: $url" -ForegroundColor Yellow
            Invoke-WebRequest -Uri $url -OutFile $outputFile -TimeoutSec 30 -UseBasicParsing
            $size = (Get-Item $outputFile).Length
            if ($size -gt 1000) {
                Write-Host "Exito! Descargado $outputFile ($size bytes)" -ForegroundColor Green
                return $true
            } else {
                Write-Host "Archivo muy pequeño, probando siguiente..." -ForegroundColor Yellow
                Remove-Item $outputFile -ErrorAction SilentlyContinue
            }
        } catch {
            Write-Host "Fallo: $_" -ForegroundColor Red
        }
    }
    return $false
}

# Intentar descargar wind
Write-Host "`nDescargando wind.mp3..." -ForegroundColor Cyan
$windSuccess = Download-WithRetry -urls $windUrls -outputFile "wind.mp3"

# Intentar descargar bell
Write-Host "`nDescargando bell.mp3..." -ForegroundColor Cyan
$bellSuccess = Download-WithRetry -urls $bellUrls -outputFile "bell.mp3"

# Resumen final
Write-Host "`n=== RESUMEN ===" -ForegroundColor Cyan
Get-ChildItem *.mp3 | ForEach-Object {
    $sizeMB = [math]::Round($_.Length / 1MB, 2)
    $sizeKB = [math]::Round($_.Length / 1KB, 2)
    $status = if ($_.Length -gt 1000) { "REAL" } else { "PLACEHOLDER" }
    Write-Host "$($_.Name): $sizeKB KB - $status" -ForegroundColor $(if ($status -eq "REAL") { "Green" } else { "Red" })
}

Write-Host "`nWind: $(if ($windSuccess) { 'EXITO' } else { 'FALLO' })" -ForegroundColor $(if ($windSuccess) { "Green" } else { "Red" })
Write-Host "Bell: $(if ($bellSuccess) { 'EXITO' } else { 'FALLO' })" -ForegroundColor $(if ($bellSuccess) { "Green" } else { "Red" })
