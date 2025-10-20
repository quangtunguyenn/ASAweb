# Script đẩy code lên GitHub
# Chạy từng lệnh một trong PowerShell

# Bước 1: Khởi tạo Git (nếu chưa có)
Write-Host "=== Bước 1: Khởi tạo Git ===" -ForegroundColor Green
cd E:\ASAweb
git init

# Bước 2: Thêm tất cả files
Write-Host "=== Bước 2: Thêm files ===" -ForegroundColor Green
git add .

# Bước 3: Commit
Write-Host "=== Bước 3: Commit ===" -ForegroundColor Green
git commit -m "Initial commit: AI Study Assistant

- Professional landing page with 'Learn Smarter, Not Harder' tagline
- Modern dashboard with stats, charts, tasks, activity feed
- JWT authentication system (register, login, logout)
- Spring Boot 3.3.5 backend with Java 21
- MySQL database integration
- Responsive design with smooth animations
- Pricing plans: Free, Pro, Teams
- Files: 19 backend Java files, 10+ frontend files"

# Bước 4: Kết nối với GitHub
Write-Host "=== Bước 4: Kết nối với GitHub ===" -ForegroundColor Yellow
Write-Host "QUAN TRỌNG: Thay YOUR_USERNAME bằng GitHub username của bạn!" -ForegroundColor Red
Write-Host "Ví dụ: git remote add origin https://github.com/quangtu/ASAweb.git" -ForegroundColor Cyan
Write-Host ""
Write-Host "Nhập lệnh sau (thay YOUR_USERNAME):" -ForegroundColor Yellow
Write-Host "git remote add origin https://github.com/YOUR_USERNAME/ASAweb.git" -ForegroundColor White

# Bước 5: Đẩy lên GitHub
Write-Host ""
Write-Host "=== Bước 5: Đẩy lên GitHub ===" -ForegroundColor Yellow
Write-Host "Sau khi chạy lệnh ở bước 4, chạy:" -ForegroundColor Yellow
Write-Host "git branch -M main" -ForegroundColor White
Write-Host "git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "Lưu ý: Bạn sẽ cần Personal Access Token để xác thực!" -ForegroundColor Red
Write-Host "Xem hướng dẫn tạo token trong file GITHUB_GUIDE.md" -ForegroundColor Cyan
