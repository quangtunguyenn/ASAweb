# 🔑 Hướng dẫn tạo GitHub Personal Access Token

## Lỗi bạn đang gặp:
```
remote: Invalid username or token. Password authentication is not supported for Git operations.
fatal: Authentication failed
```

→ GitHub **KHÔNG** còn chấp nhận password thông thường để push code!

## ✅ Giải pháp: Tạo Personal Access Token

### Bước 1: Tạo Token trên GitHub

1. **Đăng nhập GitHub**: https://github.com
2. Click vào **avatar** (góc phải trên) → **Settings**
3. Kéo xuống sidebar bên trái → Click **Developer settings** (ở cuối)
4. Click **Personal access tokens** → **Tokens (classic)**
5. Click nút **"Generate new token"** → Chọn **"Generate new token (classic)"**

### Bước 2: Cấu hình Token

1. **Note**: Đặt tên để nhớ, ví dụ: `ASAweb-Project`
2. **Expiration**: Chọn `No expiration` (hoặc 90 days)
3. **Select scopes**: Tích vào những mục sau:
   - ✅ **repo** (tất cả các mục con sẽ tự động được chọn)
     - repo:status
     - repo_deployment
     - public_repo
     - repo:invite
     - security_events
   
4. Kéo xuống dưới cùng → Click **"Generate token"**

### Bước 3: Copy Token

⚠️ **QUAN TRỌNG**: Token sẽ chỉ hiển thị **MỘT LẦN DUY NHẤT**!

1. Copy token (dạng: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
2. **LƯU VÀO FILE TXT** hoặc notepad để dùng sau này
3. **ĐỪNG ĐÓng TAB** cho đến khi push thành công!

### Bước 4: Sử dụng Token

#### Cách 1: Push với Token (Đơn giản nhất)

```powershell
cd E:\ASAweb

# Xóa remote cũ (nếu có)
git remote remove origin

# Thêm remote mới với token trong URL
git remote add origin https://ghp_YOUR_TOKEN_HERE@github.com/quangtunguyenn/ASAweb.git

# Push code
git push -u origin main
```

**Thay `ghp_YOUR_TOKEN_HERE`** bằng token bạn vừa copy!

Ví dụ:
```powershell
git remote add origin https://ghp_1234abcd5678efgh9012ijkl@github.com/quangtunguyenn/ASAweb.git
```

#### Cách 2: Dùng Git Credential Manager (Tốt hơn cho dài hạn)

```powershell
cd E:\ASAweb

# Cập nhật lại remote URL
git remote set-url origin https://github.com/quangtunguyenn/ASAweb.git

# Khi push, Git sẽ hỏi:
git push -u origin main
```

Khi được hỏi:
- **Username**: Nhập `quangtunguyenn`
- **Password**: Dán **TOKEN** (không phải password GitHub!)

Windows sẽ tự động lưu token vào Credential Manager.

#### Cách 3: Cấu hình Git Credential Helper (Khuyên dùng!)

```powershell
# Lưu credential vĩnh viễn
git config --global credential.helper store

# Hoặc lưu tạm thời (15 phút)
git config --global credential.helper cache

# Push (sẽ hỏi 1 lần duy nhất)
git push -u origin main
```

Nhập:
- **Username**: `quangtunguyenn`
- **Password**: Dán **TOKEN**

Lần sau sẽ không hỏi nữa!

## 🚀 Các bước đầy đủ

```powershell
# 1. Vào thư mục project
cd E:\ASAweb

# 2. Kiểm tra trạng thái
git status

# 3. Nếu chưa commit, hãy commit:
git add .
git commit -m "Initial commit: AI Study Assistant"

# 4. Xóa remote cũ (nếu có lỗi)
git remote remove origin

# 5. Thêm remote với token
git remote add origin https://ghp_YOUR_TOKEN@github.com/quangtunguyenn/ASAweb.git

# 6. Push lên GitHub
git branch -M main
git push -u origin main
```

## ✅ Kiểm tra thành công

Sau khi push thành công, bạn sẽ thấy:

```
Enumerating objects: 123, done.
Counting objects: 100% (123/123), done.
Delta compression using up to 8 threads
Compressing objects: 100% (98/98), done.
Writing objects: 100% (123/123), 45.67 KiB | 2.28 MiB/s, done.
Total 123 (delta 34), reused 0 (delta 0), pack-reused 0
To https://github.com/quangtunguyenn/ASAweb.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

Truy cập: https://github.com/quangtunguyenn/ASAweb để xem code!

## ❌ Xử lý lỗi khác

### Lỗi: "Please tell me who you are"
```powershell
git config --global user.name "Quang Tu Nguyen"
git config --global user.email "your.email@example.com"
```

### Lỗi: "failed to push some refs"
```powershell
# Pull code về trước
git pull origin main --allow-unrelated-histories

# Rồi push lại
git push -u origin main
```

### Lỗi: "fatal: not a git repository"
```powershell
# Khởi tạo lại Git
git init
git add .
git commit -m "Initial commit"
```

## 🔒 Bảo mật Token

- ❌ **ĐỪNG** commit token vào code
- ❌ **ĐỪNG** share token công khai
- ✅ Lưu token vào nơi an toàn (password manager)
- ✅ Có thể revoke (thu hồi) token bất cứ lúc nào trên GitHub

## 📞 Cần thêm trợ giúp?

Nếu vẫn gặp lỗi, chụp màn hình và hỏi lại!

---

**Chúc bạn push thành công! 🎉**
