# Script sửa lỗi GitHub Authentication
# Chạy script này sau khi đã tạo Personal Access Token

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FIX GITHUB AUTHENTICATION ERROR" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Bước 1: Hướng dẫn tạo token
Write-Host "BƯỚC 1: Tạo Personal Access Token" -ForegroundColor Green
Write-Host "1. Mở browser: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "2. Click 'Generate new token (classic)'" -ForegroundColor White
Write-Host "3. Chọn scope: repo (tất cả)" -ForegroundColor White
Write-Host "4. Click 'Generate token'" -ForegroundColor White
Write-Host "5. Copy token (bắt đầu bằng ghp_...)" -ForegroundColor White
Write-Host ""

# Bước 2: Nhập token
Write-Host "BƯỚC 2: Nhập Token của bạn" -ForegroundColor Green
Write-Host "Token bắt đầu bằng: ghp_" -ForegroundColor Yellow
$token = Read-Host "Dán token vào đây"

if ([string]::IsNullOrWhiteSpace($token)) {
    Write-Host "ERROR: Token không được để trống!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "BƯỚC 3: Cấu hình Git Repository" -ForegroundColor Green

# Di chuyển vào thư mục
cd E:\ASAweb

# Xóa remote cũ (nếu có)
Write-Host "Đang xóa remote cũ..." -ForegroundColor Yellow
git remote remove origin 2>$null

# Thêm remote mới với token
Write-Host "Đang thêm remote mới với token..." -ForegroundColor Yellow
$remoteUrl = "https://$token@github.com/quangtunguyenn/ASAweb.git"
git remote add origin $remoteUrl

Write-Host "✓ Remote đã được cấu hình!" -ForegroundColor Green
Write-Host ""

# Kiểm tra xem đã commit chưa
Write-Host "BƯỚC 4: Kiểm tra và Commit" -ForegroundColor Green
$status = git status --porcelain
if ($status) {
    Write-Host "Có files chưa commit, đang commit..." -ForegroundColor Yellow
    git add .
    git commit -m "Initial commit: AI Study Assistant with landing page and dashboard"
    Write-Host "✓ Đã commit thành công!" -ForegroundColor Green
} else {
    Write-Host "✓ Không có thay đổi mới, sẵn sàng push!" -ForegroundColor Green
}
Write-Host ""

# Push lên GitHub
Write-Host "BƯỚC 5: Push lên GitHub" -ForegroundColor Green
Write-Host "Đang push code..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "    PUSH THÀNH CÔNG! 🎉" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Truy cập repository tại:" -ForegroundColor White
    Write-Host "https://github.com/quangtunguyenn/ASAweb" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "    PUSH THẤT BẠI!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Vui lòng kiểm tra:" -ForegroundColor Yellow
    Write-Host "1. Token có đúng không?" -ForegroundColor White
    Write-Host "2. Token có quyền 'repo' không?" -ForegroundColor White
    Write-Host "3. Repository đã tạo trên GitHub chưa?" -ForegroundColor White
    Write-Host ""
    Write-Host "Xem hướng dẫn chi tiết trong file:" -ForegroundColor Yellow
    Write-Host "FIX_GITHUB_AUTH_ERROR.md" -ForegroundColor Cyan
}
