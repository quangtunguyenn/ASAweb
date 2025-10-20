# ✅ Checklist đẩy code lên GitHub

## 📋 Chuẩn bị (Làm 1 lần)

- [ ] **Cài đặt Git**
  - Download: https://git-scm.com/download/win
  - Hoặc dùng: `winget install Git.Git`
  - Khởi động lại PowerShell sau khi cài

- [ ] **Cấu hình Git**
  ```powershell
  git config --global user.name "Tên của bạn"
  git config --global user.email "email@example.com"
  ```

- [ ] **Tạo GitHub Repository**
  1. Vào https://github.com
  2. Click "New repository"
  3. Tên: `ASAweb`
  4. Mô tả: "AI Study Assistant - Smart Learning Platform"
  5. Chọn Public hoặc Private
  6. **KHÔNG** tick "Initialize with README"
  7. Click "Create repository"

- [ ] **Tạo Personal Access Token** (để xác thực)
  1. GitHub → Settings → Developer settings
  2. Personal access tokens → Tokens (classic)
  3. "Generate new token (classic)"
  4. Chọn scope: `repo` (tất cả)
  5. Click "Generate token"
  6. **LƯU TOKEN VÀO CHỖ AN TOÀN** (chỉ hiện 1 lần!)

## 🚀 Đẩy code lên GitHub

### Bước 1: Mở PowerShell tại thư mục project
```powershell
cd E:\ASAweb
```

### Bước 2: Khởi tạo Git repository
```powershell
git init
```

### Bước 3: Thêm tất cả files
```powershell
git add .
```

### Bước 4: Kiểm tra files sẽ commit
```powershell
git status
```

Kết quả mong đợi:
- ✅ Có: frontend/, backend/src/, README.md, .gitignore, etc.
- ❌ KHÔNG có: target/, node_modules/, .env, *.log

### Bước 5: Commit lần đầu
```powershell
git commit -m "Initial commit: AI Study Assistant with landing page and dashboard"
```

### Bước 6: Kết nối với GitHub
**THAY `YOUR_USERNAME` BẰNG USERNAME GITHUB CỦA BẠN!**

```powershell
git remote add origin https://github.com/YOUR_USERNAME/ASAweb.git
```

Ví dụ: `git remote add origin https://github.com/quangtu/ASAweb.git`

### Bước 7: Đẩy code lên GitHub
```powershell
git branch -M main
git push -u origin main
```

Khi được hỏi:
- **Username**: Nhập GitHub username của bạn
- **Password**: Dán **Personal Access Token** (không phải password GitHub!)

## ✅ Xác nhận thành công

- [ ] Truy cập: https://github.com/YOUR_USERNAME/ASAweb
- [ ] Thấy tất cả files đã được đẩy lên
- [ ] README.md hiển thị đúng
- [ ] File structure đầy đủ

## 👥 Mời bạn bè cộng tác

### Nếu repository **Public**:
- Bạn bè có thể clone ngay: `git clone https://github.com/YOUR_USERNAME/ASAweb.git`

### Nếu repository **Private**:
1. Vào repository trên GitHub
2. Tab "Settings"
3. Sidebar → "Collaborators"
4. Click "Add people"
5. Nhập username hoặc email của bạn bè
6. Click "Add"
7. Bạn bè sẽ nhận email mời

## 📝 Bạn bè làm gì sau khi được mời?

### Bước 1: Clone repository
```powershell
git clone https://github.com/YOUR_USERNAME/ASAweb.git
cd ASAweb
```

### Bước 2: Setup database
```sql
CREATE DATABASE ai_study_db;
-- Hoặc thay đổi password trong application.properties
```

### Bước 3: Chạy backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### Bước 4: Truy cập frontend
- Backend: http://localhost:8080
- Landing: Mở `frontend/index-new.html`

### Bước 5: Tạo branch để code
```powershell
git checkout -b feature/ten-tinh-nang-moi
# Code...
git add .
git commit -m "Add: mô tả thay đổi"
git push origin feature/ten-tinh-nang-moi
```

### Bước 6: Tạo Pull Request
1. Vào GitHub repository
2. Click "Pull requests" → "New pull request"
3. Chọn branch của mình
4. Thêm mô tả
5. Click "Create pull request"
6. Chờ review và merge

## 🔄 Cập nhật code (sau này)

### Khi có thay đổi mới:
```powershell
# Xem thay đổi
git status

# Thêm files
git add .

# Commit
git commit -m "Update: mô tả thay đổi"

# Đẩy lên GitHub
git push
```

### Khi muốn lấy code mới nhất:
```powershell
git pull origin main
```

## ❌ Xử lý lỗi

### Lỗi: "Git is not recognized"
→ Cài đặt Git và khởi động lại PowerShell

### Lỗi: "failed to push"
```powershell
git pull origin main --rebase
git push origin main
```

### Lỗi: "Please tell me who you are"
```powershell
git config --global user.name "Your Name"
git config --global user.email "email@example.com"
```

### Lỗi: Authentication failed
→ Dùng Personal Access Token thay vì password GitHub

## 📚 Tài liệu tham khảo

- File chi tiết: `GITHUB_GUIDE.md`
- Script nhanh: `push-to-github.ps1`
- Project README: `README.md`

---

## 🎯 Mục tiêu

- [x] Tạo checklist này
- [ ] Cài đặt Git
- [ ] Tạo GitHub repository
- [ ] Đẩy code lên GitHub
- [ ] Mời bạn bè cộng tác
- [ ] Bạn bè clone và chạy được project

**Chúc bạn thành công! 🚀**
