# 🎓 HỆ THỐNG QUẢN LÝ BUỔI TƯ VẤN

Hệ thống quản lý buổi tư vấn giữa sinh viên và giảng viên/tutor với đầy đủ tính năng đăng ký, quản lý lịch, phản hồi và thông báo.

---

## 📚 Tài liệu

Dự án này được tổ chức thành nhiều tài liệu chi tiết để dễ dàng theo dõi và triển khai:

### 📋 Kế hoạch & Tổng quan
- **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** - Kế hoạch triển khai chi tiết từng phase (27-37 giờ)
- **[STRUCTURE.md](./STRUCTURE.md)** - Cấu trúc thư mục tổng thể frontend + backend
- **[architecture.md](./architecture.md)** - Kiến trúc hệ thống và use-cases chi tiết

### 🔧 Kỹ thuật
- **[BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md)** - Template và hướng dẫn backend với Express + JSON
- **[FRONTEND_STRUCTURE.md](./FRONTEND_STRUCTURE.md)** - Template và hướng dẫn frontend với React
- **[DATA_SCHEMA.md](./DATA_SCHEMA.md)** - Schema các file JSON database
- **[API_CONTRACT.md](./API_CONTRACT.md)** - API endpoints đầy đủ (REST API)
- **[COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)** - Thư viện React components

### ✅ Testing
- **[TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)** - Checklist kiểm thử đầy đủ cho tất cả tính năng

---

## 🚀 Tính năng chính

### 👨‍🎓 Dành cho Sinh viên
- ✅ Xem danh sách buổi tư vấn có sẵn
- ✅ Tìm kiếm và lọc theo tutor, môn học, thời gian
- ✅ Gợi ý tutor phù hợp với nhu cầu
- ✅ Đăng ký tham gia buổi tư vấn (với kiểm tra trùng lịch)
- ✅ Xem lịch trình các buổi đã đăng ký
- ✅ Hủy đăng ký
- ✅ Đánh giá và phản hồi sau buổi tư vấn
- ✅ Nhận thông báo khi buổi tư vấn thay đổi/hủy

### 👨‍🏫 Dành cho Tutor/Giảng viên
- ✅ Tạo buổi tư vấn mới (online/offline)
- ✅ Kiểm tra xung đột lịch và phòng tự động
- ✅ Chỉnh sửa thông tin buổi tư vấn
- ✅ Hủy buổi tư vấn (tự động thông báo sinh viên)
- ✅ Xem danh sách sinh viên đã đăng ký
- ✅ Xem feedback từ sinh viên

### 🔔 Tính năng chung
- ✅ Quản lý thông tin cá nhân
- ✅ Hệ thống thông báo real-time
- ✅ Giao diện responsive (mobile, tablet, desktop)
- ✅ Authentication & Authorization (JWT)

---

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - REST API
- **JSON Files** - Database (không cần setup DB phức tạp)
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React** 18+ - UI Library
- **React Router** v6 - Routing
- **Axios** - HTTP Client
- **Context API** - State Management
- **date-fns** - Date formatting

### Optional
- **Tailwind CSS** - Styling
- **React Query** - Server state management

---

## 📦 Cài đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd tutor-management-system
```

### 2. Setup Backend

```bash
cd backend
npm install

# Tạo file .env
cp .env.example .env

# Tạo data files
mkdir -p data
echo '{"users":[]}' > data/users.json
echo '{"sessions":[]}' > data/sessions.json
echo '{"registrations":[]}' > data/registrations.json
echo '{"feedback":[]}' > data/feedback.json
echo '{"notifications":[]}' > data/notifications.json

# Chạy dev server
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

### 3. Setup Frontend

```bash
cd frontend
npm install

# Tạo file .env
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Chạy dev server
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

---

## 🗂️ Cấu trúc dự án

```
tutor-management-system/
├── docs/                         # Tài liệu
│   ├── PROJECT_PLAN.md
│   ├── API_CONTRACT.md
│   └── ...
│
├── backend/                      # Express API
│   ├── src/
│   │   ├── server.js            # Entry point
│   │   ├── config/              # Configuration
│   │   ├── middlewares/         # Auth, RBAC, Error handler
│   │   ├── services/            # Business logic
│   │   ├── controllers/         # Route handlers
│   │   ├── validators/          # Input validation
│   │   ├── utils/               # Helper functions
│   │   └── routes/              # API routes
│   ├── data/                    # JSON Database
│   │   ├── users.json
│   │   ├── sessions.json
│   │   └── ...
│   └── package.json
│
└── frontend/                     # React App
    ├── src/
    │   ├── App.js               # Root component
    │   ├── components/          # Reusable components
    │   │   ├── common/          # Button, Input, Modal...
    │   │   ├── Layout/          # Header, Sidebar
    │   │   ├── student/         # Student-specific
    │   │   └── tutor/           # Tutor-specific
    │   ├── pages/               # Route pages
    │   │   ├── auth/            # Login, Register
    │   │   ├── student/         # Student pages
    │   │   └── tutor/           # Tutor pages
    │   ├── services/            # API calls
    │   ├── contexts/            # React Contexts
    │   ├── hooks/               # Custom hooks
    │   ├── utils/               # Helper functions
    │   └── constants/           # Constants
    └── package.json
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user hiện tại

### Profile
- `GET /api/users/me` - Xem profile
- `PATCH /api/users/me` - Cập nhật profile

### Sessions (Tutor)
- `POST /api/sessions` - Tạo buổi tư vấn
- `GET /api/sessions?mine=true` - Danh sách sessions của tutor
- `PATCH /api/sessions/:id` - Sửa buổi tư vấn
- `DELETE /api/sessions/:id` - Hủy buổi tư vấn
- `GET /api/sessions/:id/registrations` - Danh sách sinh viên đã đăng ký

### Sessions (Student)
- `GET /api/sessions` - Danh sách sessions có thể đăng ký
- `POST /api/sessions/:id/register` - Đăng ký tham gia
- `DELETE /api/sessions/:id/register` - Hủy đăng ký
- `GET /api/registrations/me` - Lịch trình của tôi

### Feedback
- `POST /api/sessions/:id/feedback` - Tạo feedback
- `PATCH /api/feedback/:id` - Cập nhật feedback
- `GET /api/feedback/me` - Feedback của tôi

### Notifications
- `GET /api/notifications` - Danh sách thông báo
- `PATCH /api/notifications/:id/read` - Đánh dấu đã đọc
- `PATCH /api/notifications/read-all` - Đánh dấu tất cả đã đọc

Chi tiết xem [API_CONTRACT.md](./API_CONTRACT.md)

---

## 👥 Vai trò & Quyền

### Student (Sinh viên)
- Xem, tìm kiếm sessions
- Đăng ký/hủy đăng ký sessions
- Xem lịch trình của mình
- Đánh giá feedback
- Xem thông báo

### Tutor (Giảng viên)
- Tạo/sửa/xóa sessions
- Xem danh sách sinh viên đã đăng ký
- Xem feedback từ sinh viên
- Xem thông báo

---

## 🔒 Bảo mật

- ✅ Password được hash bằng bcrypt
- ✅ JWT token cho authentication
- ✅ Protected routes với middleware
- ✅ RBAC (Role-Based Access Control)
- ✅ Input validation với express-validator
- ✅ CORS configuration
- ✅ Helmet.js cho security headers

---

## ✅ Testing

Xem chi tiết tại [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md)

### Các use-case chính cần test:
1. ✅ Tutor không thể tạo buổi trùng lịch hoặc phòng
2. ✅ Student không thể đăng ký buổi trùng lịch
3. ✅ Không vượt quá capacity
4. ✅ Sửa/Xóa session → SV nhận notification
5. ✅ Feedback chỉ sau session COMPLETED
6. ✅ State machine: OPEN → FULL → COMPLETED/CANCELLED

---

## 📊 Milestones

### ✅ Milestone 1: Backend Foundation (Ngày 1-2)
- Authentication flow hoàn thiện
- JSON CRUD operations
- API endpoints cơ bản

### ✅ Milestone 2: Student Features (Ngày 3-4)
- Đăng ký sessions
- Xem lịch trình
- Feedback

### ✅ Milestone 3: Tutor Features (Ngày 5-6)
- Tạo/sửa/xóa sessions
- Conflict detection
- Xem registrations

### ✅ Milestone 4: Polish & Deploy (Ngày 7)
- UI/UX improvements
- Testing
- Deployment

---

## 🚧 Roadmap

### Phase 1 (MVP) ✅
- Authentication
- Session management
- Registration
- Feedback
- Notifications

### Phase 2 (Future)
- [ ] Email notifications
- [ ] Real-time updates (WebSocket)
- [ ] Calendar view
- [ ] Export schedule (PDF/iCal)
- [ ] Advanced search & filters
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode

### Phase 3 (Advanced)
- [ ] Video call integration
- [ ] File upload (materials)
- [ ] Chat system
- [ ] Mobile app (React Native)
- [ ] Admin dashboard

---

## 🤝 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

---

## 📝 License

MIT License - Xem [LICENSE](LICENSE) để biết chi tiết

---

## 👨‍💻 Tác giả

Được phát triển cho môn **Công nghệ Phần mềm** - HCMUT

---

## 📞 Liên hệ & Hỗ trợ

- 📧 Email: [your-email@example.com](mailto:your-email@example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Wiki: [GitHub Wiki](https://github.com/your-repo/wiki)

---

## 🙏 Lời cảm ơn

Cảm ơn đã sử dụng hệ thống này! Nếu có bất kỳ câu hỏi hoặc đề xuất nào, vui lòng tạo issue hoặc liên hệ trực tiếp.

---

**Happy Coding! 🚀**



