# ⚡ QUICK START - CHẠY NGAY

## 🎯 Mục tiêu
Chạy được web trong **5 phút**!

---

## 🚀 Các bước thực hiện

### Bước 1: Hash passwords (CHỈ LẦN ĐẦU)

```bash
cd server
npm install
node scripts/hashPasswords.js
cd ..
```

✅ Sau khi chạy, bạn sẽ thấy message: "✅ Updated users.json with hashed passwords"

---

### Bước 2: Chạy Backend

**Mở Terminal 1:**

```bash
cd server
npm run dev
```

✅ Thấy message: `🚀 Server running on http://localhost:5000`

**Kiểm tra:** Mở browser tại `http://localhost:5000/health` → Thấy `{"status":"OK"}`

---

### Bước 3: Chạy Frontend

**Mở Terminal 2:**

```bash
cd client
npm install
npm run dev
```

✅ Thấy message: `Local: http://localhost:5173`

---

### Bước 4: Test web

1. **Mở browser:** `http://localhost:5173`

2. **Đăng nhập với tài khoản Student:**
   - Email: `student1@hcmut.edu.vn`
   - Password: `student123`

3. **Xem Dashboard:**
   - Thấy thống kê
   - Thấy buổi tư vấn sắp tới
   - Menu bên trái hoạt động

4. **Logout và test Tutor:**
   - Logout (click avatar → Đăng xuất)
   - Login với:
     - Email: `tutor1@hcmut.edu.vn`
     - Password: `tutor123`
   - Xem Dashboard của Tutor

---

## 🎉 XONG!

Nếu tất cả các bước trên OK → Web đã chạy thành công!

---

## ❓ Gặp lỗi?

### Lỗi 1: "Cannot find module" hoặc lỗi import

**Giải pháp:**
```bash
# Backend
cd server
rm -rf node_modules package-lock.json
npm install

# Frontend
cd client
rm -rf node_modules package-lock.json
npm install
```

### Lỗi 2: "Port already in use"

**Backend (Port 5000):**
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Frontend (Port 5173):**
- Vite sẽ tự động dùng port khác (5174, 5175...)
- Hoặc dùng: `npm run dev -- --port 3000`

### Lỗi 3: "Invalid credentials" khi login

**Nguyên nhân:** Chưa chạy script hash passwords

**Giải pháp:**
```bash
cd server
node scripts/hashPasswords.js
npm run dev
```

### Lỗi 4: "Failed to fetch" trên web

**Nguyên nhân:** Backend chưa chạy

**Giải pháp:**
1. Kiểm tra Terminal 1 có message server running không
2. Test: `http://localhost:5000/health` phải OK
3. Kiểm tra file `client/.env` có `VITE_API_URL=http://localhost:5000/api`

---

## 📝 TÀI KHOẢN TEST

| Loại | Email | Password |
|------|-------|----------|
| Sinh viên | student1@hcmut.edu.vn | student123 |
| Sinh viên | student2@hcmut.edu.vn | student123 |
| Giảng viên | tutor1@hcmut.edu.vn | tutor123 |
| Giảng viên | tutor2@hcmut.edu.vn | tutor123 |

---

## 📚 Xem thêm

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Hướng dẫn chi tiết
- [TEST_ACCOUNTS.md](./TEST_ACCOUNTS.md) - Thông tin tài khoản test
- [API_CONTRACT.md](./API_CONTRACT.md) - API documentation

---

## ✅ Checklist

- [ ] Backend chạy tại http://localhost:5000
- [ ] Frontend chạy tại http://localhost:5173
- [ ] Login thành công với student1
- [ ] Dashboard hiển thị đúng
- [ ] Login thành công với tutor1
- [ ] Dashboard Tutor hiển thị đúng
- [ ] Logout hoạt động

**Tất cả OK?** → Bạn đã sẵn sàng phát triển! 🎊



