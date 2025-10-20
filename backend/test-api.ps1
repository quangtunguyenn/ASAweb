# Phase 2 API Testing Script
# Tests all file upload endpoints

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Phase 2 Module A - API Testing" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:8080/api/files"
$testFile = "test-sample.txt"

# Test 1: Upload File
Write-Host "Test 1: Upload File" -ForegroundColor Yellow
Write-Host "Endpoint: POST $baseUrl/upload" -ForegroundColor Gray
try {
    $boundary = [System.Guid]::NewGuid().ToString()
    $fileContent = [System.IO.File]::ReadAllBytes($testFile)
    $fileName = [System.IO.Path]::GetFileName($testFile)
    
    $bodyLines = @(
        "--$boundary",
        "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
        "Content-Type: text/plain",
        "",
        [System.Text.Encoding]::UTF8.GetString($fileContent),
        "--$boundary--"
    )
    
    $body = $bodyLines -join "`r`n"
    
    $response = Invoke-RestMethod -Uri "$baseUrl/upload" -Method Post `
        -ContentType "multipart/form-data; boundary=$boundary" `
        -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
    
    Write-Host "✅ SUCCESS: File uploaded" -ForegroundColor Green
    Write-Host "Response: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 2: Get All Files
Write-Host "Test 2: Get All Files" -ForegroundColor Yellow
Write-Host "Endpoint: GET $baseUrl" -ForegroundColor Gray
try {
    $files = Invoke-RestMethod -Uri $baseUrl -Method Get
    Write-Host "✅ SUCCESS: Retrieved $($files.Count) file(s)" -ForegroundColor Green
    $files | ForEach-Object {
        Write-Host "  - ID: $($_.id), Name: $($_.originalFileName), Size: $($_.fileSize) bytes" -ForegroundColor Cyan
    }
    Write-Host ""
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Get File Statistics
Write-Host "Test 3: Get File Statistics" -ForegroundColor Yellow
Write-Host "Endpoint: GET $baseUrl/stats" -ForegroundColor Gray
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/stats" -Method Get
    Write-Host "✅ SUCCESS: Statistics retrieved" -ForegroundColor Green
    Write-Host "  Total Files: $($stats.totalFiles)" -ForegroundColor Cyan
    Write-Host "  Total Size: $($stats.totalSize) bytes" -ForegroundColor Cyan
    Write-Host "  Processed: $($stats.processedFiles)" -ForegroundColor Cyan
    Write-Host "  Unprocessed: $($stats.unprocessedFiles)" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 4: Health Check
Write-Host "Test 4: Application Health Check" -ForegroundColor Yellow
Write-Host "Endpoint: GET http://localhost:8080/actuator/health" -ForegroundColor Gray
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8080/actuator/health" -Method Get
    Write-Host "✅ SUCCESS: Application is $($health.status)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "⚠️  Actuator not enabled (this is okay)" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
