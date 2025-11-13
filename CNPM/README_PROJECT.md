# 🎓 HỆ THỐNG QUẢN LÝ BUỔI TƯ VẤN

## 📖 Giới thiệu

Hệ thống quản lý buổi tư vấn giữa sinh viên và giảng viên/tutor, được phát triển cho môn **Công nghệ Phần mềm - HCMUT**.

### ✨ Tính năng chính

**Dành cho Sinh viên:**
- 🔍 Tìm kiếm và đăng ký buổi tư vấn
- 📅 Quản lý lịch trình đã đăng ký
- ⭐ Đánh giá và phản hồi sau buổi tư vấn
- 🔔 Nhận thông báo khi buổi tư vấn thay đổi

**Dành cho Giảng viên:**
- ➕ Tạo và quản lý buổi tư vấn
- 👥 Xem danh sách sinh viên đăng ký
- ✏️ Chỉnh sửa thông tin buổi tư vấn
- 📊 Xem feedback từ sinh viên

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - REST API
- **JSON Files** - Database (không cần MySQL/MongoDB)
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React 18** + **Vite** - UI Framework
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP Client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

---

## 🚀 Hướng dẫn chạy

### ⚡ Quick Start (5 phút)

Xem [QUICK_START.md](./QUICK_START.md) để chạy nhanh nhất.

### 📝 Setup chi tiết

Xem [SETUP_GUIDE.md](./SETUP_GUIDE.md) để có hướng dẫn đầy đủ.

### TL;DR

```bash
# 1. Hash passwords
cd server
npm install
node scripts/hashPasswords.js

# 2. Run backend
npm run dev

# 3. Run frontend (terminal mới)
cd ../client
npm install
npm run dev

# 4. Mở browser: http://localhost:5173
# Login: student1@hcmut.edu.vn / student123
```

---

## 🔐 Tài khoản Test

| Email | Password | Vai trò |
|-------|----------|---------|
| student1@hcmut.edu.vn | student123 | Sinh viên |
| student2@hcmut.edu.vn | student123 | Sinh viên |
| tutor1@hcmut.edu.vn | tutor123 | Giảng viên |
| tutor2@hcmut.edu.vn | tutor123 | Giảng viên |

Chi tiết xem [TEST_ACCOUNTS.md](./TEST_ACCOUNTS.md)

---

## 📂 Cấu trúc dự án

```
CNPM/
├── server/                     # Backend API
│   ├── data/                  # JSON Database
│   │   ├── users.json
│   │   ├── sessions.json
│   │   └── ...
│   ├── scripts/
│   │   └── hashPasswords.js
│   ├── server.js
│   └── package.json
│
├── client/                     # Frontend React
│   ├── src/
│   │   ├── components/        # Components
│   │   ├── pages/            # Pages
│   │   ├── services/         # API calls
│   │   └── contexts/         # React Context
│   ├── .env
│   └── package.json
│
└── docs/                       # Documentation
    ├── PROJECT_PLAN.md
    ├── API_CONTRACT.md
    ├── SETUP_GUIDE.md
    └── ...
```

---

## 📚 Tài liệu

### Cho Developer

- [PROJECT_PLAN.md](./PROJECT_PLAN.md) - Kế hoạch triển khai chi tiết (10 phases)
- [STRUCTURE.md](./STRUCTURE.md) - Cấu trúc thư mục đầy đủ
- [API_CONTRACT.md](./API_CONTRACT.md) - API documentation (30+ endpoints)
- [DATA_SCHEMA.md](./DATA_SCHEMA.md) - Schema JSON database
- [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md) - React components

### Cho Backend

- [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md) - Template và hướng dẫn backend

### Cho Frontend

- [FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md) - Template và hướng dẫn frontend

### Testing

- [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) - Checklist kiểm thử (200+ test cases)
- [TEST_ACCOUNTS.md](./TEST_ACCOUNTS.md) - Tài khoản và data mẫu

---

## 🧪 Testing

### Test nhanh

1. **Login/Logout:**
   - Login với student1 → OK
   - Login với tutor1 → OK
   - Logout → redirect về /login

2. **Dashboard:**
   - Student dashboard hiển thị stats
   - Tutor dashboard hiển thị stats
   - Navigation menu hoạt động

3. **API:**
   ```bash
   # Health check
   curl http://localhost:5000/health
   
   # Login
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"student1@hcmut.edu.vn","password":"student123"}'
   ```

### Test đầy đủ

Xem [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) để có danh sách đầy đủ các test cases.

---

## 📊 Dữ liệu mẫu có sẵn

- **4 users** (2 students + 2 tutors)
- **5 sessions** (buổi tư vấn)
- **5 registrations** (đăng ký của sinh viên)
- **2 feedback** (đánh giá)
- **2 notifications** (thông báo)

Tất cả data được lưu trong `server/data/*.json`

---

## 🔧 Development

### Thêm tính năng mới

1. **Backend:**
   - Thêm route trong `server/server.js`
   - Thêm validation nếu cần
   - Test với Postman/curl

2. **Frontend:**
   - Tạo component trong `client/src/components/`
   - Tạo page trong `client/src/pages/`
   - Thêm route trong `App.jsx`
   - Thêm API call trong `services/`

### Code Style

- **Backend:** ES6+ modules, async/await
- **Frontend:** React hooks, functional components
- **Naming:** camelCase cho biến/hàm, PascalCase cho components
- **Format:** 2 spaces indent

---

## 🐛 Troubleshooting

Xem [SETUP_GUIDE.md#troubleshooting](./SETUP_GUIDE.md#troubleshooting) để giải quyết các lỗi thường gặp.

**Lỗi phổ biến:**
- Port already in use → Đổi port hoặc kill process
- Cannot find module → `rm -rf node_modules && npm install`
- Invalid credentials → Chạy lại `node scripts/hashPasswords.js`
- Failed to fetch → Kiểm tra backend có chạy không

---

## 🎯 Roadmap

### ✅ Đã hoàn thành (MVP)

- [x] Authentication (Login/Register)
- [x] Dashboard (Student & Tutor)
- [x] Basic layout với responsive design
- [x] Data mẫu đầy đủ

### 🚧 Đang phát triển

- [ ] Session List (Student) - Xem danh sách buổi tư vấn
- [ ] Session Detail & Registration
- [ ] Create/Edit Session (Tutor)
- [ ] My Schedule (Student)
- [ ] Feedback form
- [ ] Notifications

### 📅 Kế hoạch tương lai

- [ ] Profile management
- [ ] Advanced filters
- [ ] Calendar view
- [ ] Email notifications
- [ ] Real-time updates (WebSocket)
- [ ] Export schedule (PDF)

---

## 👥 Contributors

- **Nhóm:** [Tên nhóm]
- **Môn:** Công nghệ Phần mềm
- **Trường:** HCMUT

---

## 📄 License

MIT License - Dự án học tập

---

## 📞 Liên hệ

- **Email:** [your-email@hcmut.edu.vn]
- **GitHub:** [repository-url]

---

## 🙏 Acknowledgments

- Tài liệu tham khảo: [architecture.md](./architecture.md)
- Design reference: [Figma](https://www.figma.com/proto/n2BJRIVcv5UlGLmbFL4aEn/)

---

**Chúc bạn code vui vẻ! 🚀**



