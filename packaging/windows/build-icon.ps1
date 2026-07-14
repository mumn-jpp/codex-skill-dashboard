$ErrorActionPreference = 'Stop'
$Root = Resolve-Path "$PSScriptRoot\..\.."
New-Item -ItemType Directory -Force "$Root\build\generated-icons" | Out-Null
magick "$Root\assets\app-icon.svg" -define icon:auto-resize=256,128,64,48,32,16 "$Root\build\generated-icons\app.ico"
