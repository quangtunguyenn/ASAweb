# 🚀 Hướng dẫn đẩy code lên GitHub

## Bước 1: Cài đặt Git

### Windows:
1. Tải Git từ: https://git-scm.com/download/win
2. Chạy file cài đặt và làm theo hướng dẫn
3. Khởi động lại terminal/PowerShell sau khi cài

### Hoặc dùng winget:
```powershell
winget install Git.Git
```

## Bước 2: Cấu hình Git

Mở PowerShell/Terminal và chạy:

```powershell
git config --global user.name "Tên của bạn"
git config --global user.email "email@example.com"
```

## Bước 3: Tạo Repository trên GitHub

1. Truy cập https://github.com
2. Đăng nhập vào tài khoản GitHub
3. Click nút **"New"** hoặc **"+"** → **"New repository"**
4. Điền thông tin:
   - **Repository name**: `ASAweb` (hoặc tên bạn muốn)
   - **Description**: "AI Study Assistant - Smart Learning Platform"
   - **Visibility**: Chọn **Public** hoặc **Private**
   - **KHÔNG** chọn "Initialize with README" (vì đã có sẵn)
5. Click **"Create repository"**

## Bước 4: Khởi tạo Git trong project

Mở PowerShell tại thư mục `E:\ASAweb`:

```powershell
cd E:\ASAweb

# Khởi tạo Git repository
git init

# Thêm tất cả files
git add .

# Commit lần đầu
git commit -m "Initial commit: AI Study Assistant with landing page and dashboard"
```

## Bước 5: Kết nối với GitHub Repository

Thay `YOUR_USERNAME` bằng username GitHub của bạn:

```powershell
# Thêm remote repository
git remote add origin https://github.com/YOUR_USERNAME/ASAweb.git

# Kiểm tra remote
git remote -v
```

## Bước 6: Đẩy code lên GitHub

```powershell
# Đẩy code lên branch main
git branch -M main
git push -u origin main
```

**Lưu ý**: Lần đầu push, GitHub sẽ yêu cầu xác thực:
- **Username**: Nhập GitHub username
- **Password**: Sử dụng **Personal Access Token** (không phải password thông thường)

### Tạo Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Chọn scopes: `repo` (full control of private repositories)
4. Click **"Generate token"**
5. Copy token và dán vào khi Git yêu cầu password

## Bước 7: Mời bạn bè cộng tác

### Nếu repository là Public:
- Bạn bè có thể clone trực tiếp: `git clone https://github.com/YOUR_USERNAME/ASAweb.git`

### Nếu repository là Private:
1. Vào repository trên GitHub
2. Click tab **"Settings"**
3. Sidebar → **"Collaborators"**
4. Click **"Add people"**
5. Nhập username hoặc email của bạn bè
6. Click **"Add [username] to this repository"**
7. Bạn bè sẽ nhận email mời

## Bước 8: Bạn bè clone và làm việc

Bạn bè chạy lệnh:

```powershell
# Clone repository
git clone https://github.com/YOUR_USERNAME/ASAweb.git

# Di chuyển vào thư mục
cd ASAweb

# Tạo branch mới để làm việc
git checkout -b feature/ten-tinh-nang

# Sau khi code xong, commit và push
git add .
git commit -m "Add: mô tả thay đổi"
git push origin feature/ten-tinh-nang
```

## Các lệnh Git thường dùng

```powershell
# Kiểm tra trạng thái
git status

# Xem thay đổi
git diff

# Pull code mới nhất từ GitHub
git pull origin main

# Tạo branch mới
git checkout -b feature/new-feature

# Chuyển branch
git checkout main

# Merge branch
git merge feature/new-feature

# Xem lịch sử commit
git log --oneline

# Hủy thay đổi chưa commit
git checkout -- filename

# Xem danh sách branch
git branch -a
```

## Workflow làm việc nhóm

### 1. Trước khi bắt đầu code:
```powershell
git checkout main
git pull origin main
git checkout -b feature/my-feature
```

### 2. Sau khi code xong:
```powershell
git add .
git commit -m "Add: feature description"
git push origin feature/my-feature
```

### 3. Tạo Pull Request trên GitHub:
- Vào repository trên GitHub
- Click **"Pull requests"** → **"New pull request"**
- Chọn branch của bạn
- Click **"Create pull request"**
- Thêm mô tả và click **"Create pull request"**

### 4. Review và merge:
- Team members review code
- Sau khi approve, click **"Merge pull request"**

## Cấu trúc Branch đề xuất

```
main (branch chính - luôn stable)
  ├── develop (branch phát triển)
  │   ├── feature/landing-page
  │   ├── feature/dashboard
  │   ├── feature/file-upload
  │   └── feature/ai-chat
  └── hotfix/bug-fix (sửa lỗi khẩn cấp)
```

## File nào KHÔNG nên commit?

Đã được config trong `.gitignore`:
- `target/` - Build output
- `node_modules/` - Dependencies
- `.env` - Environment variables
- `*.log` - Log files
- `backend/uploads/*` - User uploaded files
- IDE config files

## Xử lý lỗi thường gặp

### Lỗi: "Please tell me who you are"
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Lỗi: "failed to push some refs"
```powershell
git pull origin main --rebase
git push origin main
```

### Lỗi: Conflict khi merge
```powershell
# Mở file có conflict, sửa thủ công
git add .
git commit -m "Resolve merge conflict"
```

## 📞 Support

Nếu gặp vấn đề, liên hệ:
- Email: quangtu.dev@example.com
- GitHub Issues: https://github.com/YOUR_USERNAME/ASAweb/issues

---

**Chúc may mắn với project! 🎉**
