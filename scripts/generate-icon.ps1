$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$projectRoot = Split-Path -Parent $PSScriptRoot
$sourcePath = Join-Path $projectRoot 'build\logo-liquid.png'
$iconPath = Join-Path $projectRoot 'build\icon.ico'
$previewPath = Join-Path $projectRoot 'build\icon.png'
$faviconPath = Join-Path $projectRoot 'public\favicon.ico'
$sizes = @(16, 24, 32, 48, 64, 128, 256)

if (-not (Test-Path -LiteralPath $sourcePath)) {
  throw "Logo source not found: $sourcePath"
}

$source = [System.Drawing.Image]::FromFile($sourcePath)
$entries = @()

try {
  foreach ($size in $sizes) {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    try {
      $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
      try {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
        $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $margin = [Math]::Max(1.0, $size * 0.035)
        $diameter = $size * 0.42
        $edge = $size - $margin
        $clip = New-Object System.Drawing.Drawing2D.GraphicsPath
        try {
          $clip.AddArc($margin, $margin, $diameter, $diameter, 180, 90)
          $clip.AddArc($edge - $diameter, $margin, $diameter, $diameter, 270, 90)
          $clip.AddArc($edge - $diameter, $edge - $diameter, $diameter, $diameter, 0, 90)
          $clip.AddArc($margin, $edge - $diameter, $diameter, $diameter, 90, 90)
          $clip.CloseFigure()
          $graphics.SetClip($clip)
          $graphics.DrawImage($source, 0, 0, $size, $size)
        } finally {
          $clip.Dispose()
        }
      } finally {
        $graphics.Dispose()
      }

      $stream = New-Object System.IO.MemoryStream
      try {
        $bitmap.Save($stream, [System.Drawing.Imaging.ImageFormat]::Png)
        $entries += ,@($size, $stream.ToArray())
      } finally {
        $stream.Dispose()
      }

      if ($size -eq 256) {
        $bitmap.Save($previewPath, [System.Drawing.Imaging.ImageFormat]::Png)
      }
    } finally {
      $bitmap.Dispose()
    }
  }
} finally {
  $source.Dispose()
}

$output = New-Object System.IO.MemoryStream
$writer = New-Object System.IO.BinaryWriter($output)
try {
  $writer.Write([UInt16]0)
  $writer.Write([UInt16]1)
  $writer.Write([UInt16]$entries.Count)
  $offset = 6 + (16 * $entries.Count)

  foreach ($entry in $entries) {
    $size = [int]$entry[0]
    $bytes = [byte[]]$entry[1]
    $writer.Write([byte]$(if ($size -ge 256) { 0 } else { $size }))
    $writer.Write([byte]$(if ($size -ge 256) { 0 } else { $size }))
    $writer.Write([byte]0)
    $writer.Write([byte]0)
    $writer.Write([UInt16]1)
    $writer.Write([UInt16]32)
    $writer.Write([UInt32]$bytes.Length)
    $writer.Write([UInt32]$offset)
    $offset += $bytes.Length
  }

  foreach ($entry in $entries) {
    $writer.Write([byte[]]$entry[1])
  }

  [System.IO.File]::WriteAllBytes($iconPath, $output.ToArray())
  [System.IO.File]::WriteAllBytes($faviconPath, $output.ToArray())
} finally {
  $writer.Dispose()
  $output.Dispose()
}

Write-Output "Generated liquid-glass icons from $sourcePath"
