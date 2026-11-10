$ErrorActionPreference = 'Stop'
$root = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8080/')
$listener.Start()
Write-Host 'Server started at http://localhost:8080/' -ForegroundColor Green
Write-Host "Serving from: $root" -ForegroundColor Cyan
while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $req = $ctx.Request
  $res = $ctx.Response
  $path = $req.Url.LocalPath
  if ($path -eq '/') { $path = '/index.html' }
  $file = Join-Path $root $path.TrimStart('/')
  if (Test-Path $file -PathType Leaf) {
    $ext = [System.IO.Path]::GetExtension($file).ToLower()
    $mime = switch ($ext) {
      '.html' { 'text/html; charset=utf-8' }
      '.css'  { 'text/css; charset=utf-8' }
      '.js'   { 'application/javascript; charset=utf-8' }
      '.jpg'  { 'image/jpeg' }
      '.jpeg' { 'image/jpeg' }
      '.png'  { 'image/png' }
      '.mp3'  { 'audio/mpeg' }
      default { 'application/octet-stream' }
    }
    $bytes = [System.IO.File]::ReadAllBytes($file)
    $res.ContentType = $mime
    $res.ContentLength64 = $bytes.Length
    $res.OutputStream.Write($bytes, 0, $bytes.Length)
    $res.Close()
  } else {
    $res.StatusCode = 404
    $res.Close()
  }
}
