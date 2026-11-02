param(
    [string]$OutputPath
)

$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot

if ([string]::IsNullOrWhiteSpace($OutputPath)) {
    $OutputPath = Join-Path (Split-Path -Parent $projectRoot) 'Foodie-World-submission.zip'
}

$OutputPath = [System.IO.Path]::GetFullPath($OutputPath)
if (Test-Path -LiteralPath $OutputPath) {
    throw "Refusing to overwrite an existing archive: $OutputPath"
}

$files = @(
    Get-ChildItem -LiteralPath $projectRoot -File |
        Where-Object { $_.Extension -in @('.html', '.md', '.json', '.ps1') }
)

foreach ($directory in @('css', 'images', 'js')) {
    $path = Join-Path $projectRoot $directory
    if (-not (Test-Path -LiteralPath $path -PathType Container)) {
        throw "Required project directory is missing: $directory"
    }

    $files += Get-ChildItem -LiteralPath $path -File -Recurse
}

if ($files.Count -eq 0) {
    throw 'No project files were found to package.'
}

$outputDirectory = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [System.IO.Compression.ZipFile]::Open(
    $OutputPath,
    [System.IO.Compression.ZipArchiveMode]::Create
)

try {
    foreach ($file in $files) {
        $relativePath = [System.IO.Path]::GetRelativePath($projectRoot, $file.FullName)
        $entryName = $relativePath.Replace('\', '/')
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile(
            $archive,
            $file.FullName,
            $entryName,
            [System.IO.Compression.CompressionLevel]::Optimal
        ) | Out-Null
    }
}
finally {
    $archive.Dispose()
}

Write-Output "Created $OutputPath with $($files.Count) project files."
