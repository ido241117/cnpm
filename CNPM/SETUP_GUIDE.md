# 🚀 HƯỚNG DẪN CHẠY DỰ ÁN

## 📋 Yêu cầu hệ thống

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0

Kiểm tra version:
```bash
node --version
npm --version
```

---

## ⚙️ CÀI ĐẶT

### 1. Clone hoặc tải project

```bash
cd C:\Users\User\Documents\university\CNPM
```

### 2. Cài đặt Backend

```bash
# Di chuyển vào thư mục server
cd server

# Cài đặt dependencies
npm install

# Tạo thư mục data (nếu chưa có)
mkdir data

# Chạy script để hash passwords cho tài khoản test
node scripts/hashPasswords.js
```

**Lưu ý:** Script `hashPasswords.js` sẽ tự động hash password `student123` và `tutor123` cho các tài khoản test trong file `data/users.json`.

### 3. Cài đặt Frontend

```bash
# Quay lại thư mục root
cd ..

# Di chuyển vào thư mục client
cd client

# Cài đặt dependencies
npm install

# Tạo file .env (copy từ .env.example)
# Trên Windows PowerShell:
Copy-Item .env.example .env

# Hoặc tạo thủ công file .env với nội dung:
# VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 CHẠY DỰ ÁN

### Cách 1: Chạy từng phần (Khuyến nghị)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Backend sẽ chạy tại: **http://localhost:5000**

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

Frontend sẽ chạy tại: **http://localhost:5173** (hoặc port khác nếu 5173 đang bị dùng)

### Cách 2: Chạy production

**Backend:**
```bash
cd server
npm start
```

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

---

## 🔐 TÀI KHOẢN TEST

Xem chi tiết tại [TEST_ACCOUNTS.md](./TEST_ACCOUNTS.md)

### Sinh viên

| Email | Mật khẩu | Họ tên |
|-------|----------|--------|
| student1@hcmut.edu.vn | student123 | Nguyễn Văn An |
| student2@hcmut.edu.vn | student123 | Trần Thị Bình |

### Giảng viên/Tutor

| Email | Mật khẩu | Họ tên |
|-------|----------|--------|
| tutor1@hcmut.edu.vn | tutor123 | TS. Nguyễn Văn Cường |
| tutor2@hcmut.edu.vn | tutor123 | TS. Lê Thị Diệu |

---

## 📝 KIỂM TRA HỆ THỐNG

### 1. Kiểm tra Backend

Mở browser hoặc Postman và truy cập:

**Health Check:**
```
http://localhost:5000/health
```

Kết quả mong đợi:
```json
{
  "status": "OK",
  "timestamp": "2025-11-20T10:00:00.000Z"
}
```

**Test Login API:**
```bash
# Sử dụng curl (Git Bash/WSL) hoặc Postman
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"student1@hcmut.edu.vn\",\"password\":\"student123\"}"
```

### 2. Kiểm tra Frontend

1. Mở browser tại `http://localhost:5173`
2. Bạn sẽ thấy trang Login
3. Đăng nhập với tài khoản test
4. Kiểm tra các tính năng:
   - ✅ Dashboard hiển thị đúng
   - ✅ Navigation menu hoạt động
   - ✅ Có thể xem danh sách sessions
   - ✅ Logout thành công

---

## 🐛 TROUBLESHOOTING

### Lỗi: "Cannot find module"

**Giải pháp:**
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install
```

### Lỗi: "Port 5000 already in use"

**Giải pháp:**
```bash
# Windows PowerShell - Tìm process đang dùng port 5000
netstat -ano | findstr :5000

# Kill process (thay PID bằng số từ lệnh trên)
taskkill /PID <PID> /F

# Hoặc đổi port trong server/server.js:
# const PORT = 5001
```

### Lỗi: "Failed to fetch" trên Frontend

**Nguyên nhân:** Backend chưa chạy hoặc URL API sai

**Giải pháp:**
1. Kiểm tra backend đang chạy tại `http://localhost:5000`
2. Kiểm tra file `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```
3. Restart frontend sau khi sửa .env

### Lỗi: "Invalid credentials" khi login

**Nguyên nhân:** Password chưa được hash

**Giải pháp:**
```bash
cd server
node scripts/hashPasswords.js
```

Script này sẽ tự động cập nhật passwords trong `data/users.json`.

### Lỗi: CORS

**Giải pháp:** Đảm bảo backend có cấu hình CORS cho phép frontend:

```javascript
// server/server.js
app.use(cors({
  origin: 'http://localhost:5173', // URL của frontend
  credentials: true
}));
```

---

## 📂 CẤU TRÚC THƯ MỤC

```
CNPM/
├── server/                  # Backend
│   ├── data/               # JSON database
│   │   ├── users.json
│   │   ├── sessions.json
│   │   ├── registrations.json
│   │   ├── feedback.json
│   │   └── notifications.json
│   ├── scripts/
│   │   └── hashPasswords.js
│   ├── server.js
│   └── package.json
│
├── client/                  # Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── contexts/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── .env
│   └── package.json
│
└── docs/                    # Documentation
    ├── PROJECT_PLAN.md
    ├── API_CONTRACT.md
    ├── TEST_ACCOUNTS.md
    └── ...
```

---

## 🧪 TEST SCENARIOS

### Scenario 1: Login và xem Dashboard (Student)

1. Truy cập `http://localhost:5173`
2. Login: `student1@hcmut.edu.vn` / `student123`
3. Xem Dashboard với:
   - Thống kê số buổi đã đăng ký
   - Danh sách buổi sắp tới
   - Quick actions

### Scenario 2: Login và xem Dashboard (Tutor)

1. Logout (nếu đang login)
2. Login: `tutor1@hcmut.edu.vn` / `tutor123`
3. Xem Dashboard với:
   - Thống kê số buổi đã tạo
   - Số sinh viên tham gia
   - Danh sách buổi sắp tới

### Scenario 3: Test API trực tiếp

**Postman Collection:**

1. **Login**
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "student1@hcmut.edu.vn",
  "password": "student123"
}
```

2. **Get Sessions**
```
GET http://localhost:5000/api/sessions
Headers:
Authorization: Bearer <token-from-login>
```

---

## 🔄 CẬP NHẬT DỮ LIỆU TEST

Để thêm/sửa dữ liệu test, chỉnh sửa trực tiếp các file JSON trong `server/data/`:

- `users.json` - Tài khoản
- `sessions.json` - Buổi tư vấn
- `registrations.json` - Đăng ký
- `feedback.json` - Feedback
- `notifications.json` - Thông báo

**Lưu ý:** Sau khi sửa, restart backend để load dữ liệu mới.

---

## 📞 HỖ TRỢ

- **Issues:** Tạo issue trên GitHub
- **Documentation:** Xem thêm tại [PROJECT_PLAN.md](./PROJECT_PLAN.md)
- **API Reference:** [API_CONTRACT.md](./API_CONTRACT.md)

---

**Chúc bạn thành công! 🎉**



