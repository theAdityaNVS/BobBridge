# scripts/smoke.ps1 — POST a demo prompt, then GET the returned mock URL
$ErrorActionPreference = 'Stop'
$body = @{ prompt = "Create an endpoint to fetch user order history with item name, price, and status." } | ConvertTo-Json
$result = Invoke-RestMethod -Uri http://localhost:3000/api/generate -Method Post -Body $body -ContentType "application/json"
Write-Host "OK Generated id: $($result.id)"
Write-Host "   Mock URL:    $($result.mockUrl)"
$mock = Invoke-RestMethod -Uri $result.mockUrl -Method Get
$chars = ($mock | ConvertTo-Json -Depth 6).Length
Write-Host "OK Mock returned $chars chars of JSON"

# Made with Bob
