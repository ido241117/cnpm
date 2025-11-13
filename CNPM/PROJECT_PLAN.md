# KẾ HOẠCH THIẾT KẾ HỆ THỐNG QUẢN LÝ BUỔI TƯ VẤN

## 📋 TỔNG QUAN DỰ ÁN

**Mục tiêu:** Xây dựng hệ thống quản lý buổi tư vấn giữa sinh viên và tutor
**Tech Stack:** 
- Frontend: React + React Router + Axios
- Backend: Node.js + Express
- Database: File JSON (không cần setup DB)
- UI: Tailwind CSS / Material-UI

---

## 🗂️ CẤU TRÚC DỰ ÁN

```
tutor-management-system/
├── frontend/                    # React Application
│   ├── public/
│   ├── src/
│   │   ├── components/         # UI Components
│   │   ├── pages/              # Route Pages
│   │   ├── services/           # API Services
│   │   ├── contexts/           # React Contexts
│   │   ├── hooks/              # Custom Hooks
│   │   ├── utils/              # Utilities
│   │   ├── constants/          # Constants
│   │   └── App.js
│   └── package.json
│
├── backend/                     # Express API
│   ├── src/
│   │   ├── controllers/        # Route Controllers
│   │   ├── services/           # Business Logic
│   │   ├── middlewares/        # Middlewares
│   │   ├── utils/              # Utilities
│   │   ├── validators/         # Input Validation
│   │   └── server.js
│   ├── data/                   # JSON Database Files
│   │   ├── users.json
│   │   ├── sessions.json
│   │   ├── registrations.json
│   │   ├── feedback.json
│   │   └── notifications.json
│   └── package.json
│
└── docs/                       # Documentation
    ├── api-contract.md
    ├── component-guide.md
    └── testing-checklist.md
```

---

## 📦 PHASE 1: SETUP CƠ BẢN (2-3 giờ)

### 1.1 Khởi tạo dự án
- [ ] Tạo thư mục frontend với Create React App
- [ ] Tạo thư mục backend với Express
- [ ] Cài đặt dependencies cơ bản
- [ ] Setup ESLint và Prettier

### 1.2 Cấu hình môi trường
- [ ] Tạo file .env cho frontend (API_URL)
- [ ] Tạo file .env cho backend (PORT, JWT_SECRET)
- [ ] Tạo .gitignore

### 1.3 Tạo file JSON database
- [ ] users.json (chứa students và tutors)
- [ ] sessions.json (buổi tư vấn)
- [ ] registrations.json (đăng ký của sinh viên)
- [ ] feedback.json (phản hồi đánh giá)
- [ ] notifications.json (thông báo)

**Kiểm tra:** Chạy được cả frontend và backend, kết nối thành công

---

## 📦 PHASE 2: BACKEND API (5-7 giờ)

### 2.1 Tạo Data Service Layer (1-2 giờ)
**File:** `backend/src/services/dataService.js`
- [ ] Hàm đọc JSON file
- [ ] Hàm ghi JSON file (atomic write)
- [ ] Hàm tìm kiếm (find, findOne, filter)
- [ ] Hàm tạo mới (create)
- [ ] Hàm cập nhật (update)
- [ ] Hàm xóa (delete)

**Test:** CRUD operations hoạt động đúng

### 2.2 Authentication Module (1-2 giờ)
**Files:** 
- `backend/src/controllers/authController.js`
- `backend/src/middlewares/auth.js`

Chức năng:
- [ ] POST /auth/login (đăng nhập)
- [ ] POST /auth/register (đăng ký)
- [ ] GET /auth/me (thông tin user hiện tại)
- [ ] Middleware xác thực JWT
- [ ] Middleware phân quyền (STUDENT/TUTOR)

**Test:** Login thành công, JWT được tạo và verify đúng

### 2.3 User Profile Module (1 giờ)
**File:** `backend/src/controllers/userController.js`

Chức năng:
- [ ] GET /me (xem profile)
- [ ] PATCH /me (cập nhật profile)
- [ ] Validation: email, phone, DOB, faculty
- [ ] Riêng tutor: expertise[], bio, office_room

**Test:** Cập nhật profile thành công, validation hoạt động

### 2.4 Session Management Module - TUTOR (2 giờ)
**File:** `backend/src/controllers/sessionController.js`

Chức năng:
- [ ] POST /sessions (tạo buổi tư vấn)
- [ ] GET /sessions?mine=true (sessions của tutor)
- [ ] PATCH /sessions/:id (sửa buổi)
- [ ] DELETE /sessions/:id (hủy buổi → status=CANCELLED)
- [ ] GET /sessions/:id/registrations (danh sách SV tham gia)

Business Logic:
- [ ] Kiểm tra conflict lịch của tutor
- [ ] Kiểm tra conflict phòng (nếu offline)
- [ ] Gửi notification khi sửa/xóa

**Test:** Không tạo được buổi trùng lịch, notification được gửi

### 2.5 Session Registration Module - STUDENT (1-2 giờ)
**File:** `backend/src/controllers/registrationController.js`

Chức năng:
- [ ] GET /sessions (danh sách sessions có thể đăng ký)
- [ ] GET /sessions?subject=&tutor=&from=&to= (filter)
- [ ] POST /sessions/:id/register (đăng ký)
- [ ] DELETE /sessions/:id/register (hủy đăng ký)
- [ ] GET /tutors?suggest=true (gợi ý tutor)

Business Logic:
- [ ] Kiểm tra capacity (không đăng ký khi FULL)
- [ ] Kiểm tra trùng lịch của student
- [ ] Auto set status=FULL khi đủ người
- [ ] Lock mechanism (transaction-like)

**Test:** Trùng lịch bị chặn, không vượt capacity

### 2.6 Feedback Module (1 giờ)
**File:** `backend/src/controllers/feedbackController.js`

Chức năng:
- [ ] POST /sessions/:id/feedback (tạo feedback)
- [ ] PATCH /feedback/:id (cập nhật state: DRAFT/SAVED)
- [ ] GET /feedback?mine=true (feedback của user)

Business Logic:
- [ ] Chỉ được feedback khi session COMPLETED
- [ ] Chỉ được feedback khi đã tham gia
- [ ] Rating 1-5, comment

**Test:** Chỉ feedback được sau khi session hoàn thành

### 2.7 Notification Module (30 phút)
**File:** `backend/src/controllers/notificationController.js`

Chức năng:
- [ ] GET /notifications (danh sách thông báo)
- [ ] PATCH /notifications/:id/read (đánh dấu đã đọc)

**Test:** Notification hiển thị đúng user

---

## 📦 PHASE 3: FRONTEND FOUNDATION (3-4 giờ)

### 3.1 Setup Core Infrastructure (1 giờ)
- [ ] Cài đặt React Router
- [ ] Cài đặt Axios
- [ ] Setup Tailwind CSS / Material-UI
- [ ] Tạo API service base (axios instance)
- [ ] Setup React Context cho Auth

**Test:** Routing hoạt động, API call được

### 3.2 Authentication Flow (1-2 giờ)
**Files:**
- `src/contexts/AuthContext.js`
- `src/components/Login.js`
- `src/components/PrivateRoute.js`

Chức năng:
- [ ] Login form
- [ ] Lưu JWT vào localStorage
- [ ] Auto-refresh user info
- [ ] Protected routes
- [ ] Redirect theo role (Student/Tutor)

**Test:** Login thành công, redirect đúng trang

### 3.3 Layout Components (1 giờ)
**Files:**
- `src/components/Layout/Header.js`
- `src/components/Layout/Sidebar.js`
- `src/components/Layout/MainLayout.js`

Chức năng:
- [ ] Header với logo, user info, logout
- [ ] Sidebar/Navigation menu (khác nhau theo role)
- [ ] Responsive layout

**Test:** Layout hiển thị đúng, navigation hoạt động

---

## 📦 PHASE 4: SHARED COMPONENTS (2-3 giờ)

### 4.1 Form Components (1 giờ)
**Files trong:** `src/components/common/`

- [ ] Input.js (text, email, phone)
- [ ] Select.js (dropdown)
- [ ] TextArea.js
- [ ] DateTimePicker.js
- [ ] Button.js (variants: primary, secondary, danger)
- [ ] FormGroup.js (label + input + error)

**Props chuẩn:** value, onChange, error, disabled, required

### 4.2 UI Components (1 giờ)
- [ ] Modal.js (confirm, form modal)
- [ ] Toast.js (success, error, info)
- [ ] Card.js
- [ ] Badge.js (status)
- [ ] Spinner.js (loading)
- [ ] EmptyState.js

### 4.3 Data Display Components (1 giờ)
- [ ] DataTable.js (với pagination)
- [ ] SessionCard.js
- [ ] UserAvatar.js
- [ ] StatusBadge.js

**Test:** Mỗi component hiển thị đúng với props khác nhau

---

## 📦 PHASE 5: STUDENT FEATURES (4-5 giờ)

### 5.1 Student Dashboard (1 giờ)
**File:** `src/pages/student/Dashboard.js`

Hiển thị:
- [ ] Buổi tư vấn sắp tới
- [ ] Thống kê (số buổi đã tham gia, sắp tới)
- [ ] Notification gần đây

### 5.2 Session Registration (2 giờ)
**Files:**
- `src/pages/student/SessionList.js`
- `src/pages/student/SessionDetail.js`
- `src/components/student/TutorSuggestion.js`

Chức năng:
- [ ] Danh sách sessions (filter theo subject, tutor, time)
- [ ] Tìm kiếm tutor
- [ ] Gợi ý tutor (theo chuyên ngành + thời gian)
- [ ] Chi tiết session
- [ ] Nút "Tham gia" với xác nhận
- [ ] Xử lý conflict lịch
- [ ] Toast thông báo kết quả

**Test:** Đăng ký thành công, trùng lịch bị chặn, FULL không đăng ký được

### 5.3 Student Schedule (1 giờ)
**File:** `src/pages/student/Schedule.js`

Hiển thị:
- [ ] Lịch các buổi đã đăng ký
- [ ] Filter theo status
- [ ] Hủy đăng ký (với confirm)
- [ ] Link tới feedback (nếu COMPLETED)

### 5.4 Feedback Form (1 giờ)
**File:** `src/pages/student/FeedbackForm.js`

Chức năng:
- [ ] Rating stars (1-5)
- [ ] Comment textarea
- [ ] 3 nút: Lưu, Lưu trữ (DRAFT), Hủy
- [ ] Confirm modal khi hủy
- [ ] Load draft nếu có

**Test:** Lưu/Lưu trữ/Hủy hoạt động đúng

---

## 📦 PHASE 6: TUTOR FEATURES (4-5 giờ)

### 6.1 Tutor Dashboard (1 giờ)
**File:** `src/pages/tutor/Dashboard.js`

Hiển thị:
- [ ] Buổi tư vấn sắp tới
- [ ] Thống kê (số buổi tạo, SV tham gia)
- [ ] Feedback gần đây

### 6.2 Create Session (2 giờ)
**Files:**
- `src/pages/tutor/CreateSession.js`
- `src/components/tutor/SessionForm.js`

Form fields:
- [ ] Tiêu đề
- [ ] Mô tả
- [ ] Mode (offline/online)
- [ ] Room (nếu offline) / URL (nếu online)
- [ ] Start time, End time
- [ ] Capacity
- [ ] Subject/chuyên ngành

Business Logic:
- [ ] Validation (start < end, capacity >= 1)
- [ ] Kiểm tra conflict lịch
- [ ] Kiểm tra conflict phòng → modal suggest chuyển online
- [ ] Toast thông báo kết quả

**Test:** Không tạo được trùng lịch, modal chuyển online hoạt động

### 6.3 Manage Sessions (2 giờ)
**Files:**
- `src/pages/tutor/SessionList.js`
- `src/pages/tutor/EditSession.js`
- `src/pages/tutor/SessionRegistrations.js`

Chức năng:
- [ ] Danh sách sessions của tutor
- [ ] Edit session (modal hoặc page)
- [ ] Delete session (confirm → CANCELLED)
- [ ] Xem danh sách SV tham gia
- [ ] Disable edit/delete nếu ONGOING/COMPLETED

**Test:** Sửa/Xóa gửi notification đến SV

---

## 📦 PHASE 7: PROFILE & SETTINGS (2 giờ)

### 7.1 Profile Page (2 giờ)
**File:** `src/pages/Profile.js`

Hiển thị theo role:
- [ ] Student: name, email, phone, gender, DOB, faculty
- [ ] Tutor: thêm expertise[], bio, office_room

Chức năng:
- [ ] Edit mode (toggle)
- [ ] Validation
- [ ] Save/Cancel
- [ ] Confirm modal
- [ ] Success toast

**Test:** Cập nhật thành công, cancel không lưu

---

## 📦 PHASE 8: NOTIFICATIONS (1-2 giờ)

### 8.1 Notification Center (1-2 giờ)
**Files:**
- `src/components/NotificationBell.js`
- `src/pages/Notifications.js`

Chức năng:
- [ ] Icon bell với badge (số unread)
- [ ] Dropdown xem nhanh
- [ ] Trang notifications đầy đủ
- [ ] Đánh dấu đã đọc
- [ ] Auto-refresh (polling hoặc interval)

**Test:** Thông báo hiển thị real-time

---

## 📦 PHASE 9: POLISH & TESTING (3-4 giờ)

### 9.1 UI/UX Improvements (1-2 giờ)
- [ ] Loading states (skeleton, spinner)
- [ ] Empty states (no data)
- [ ] Error states (error boundary)
- [ ] Disabled states
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Focus states
- [ ] Aria-labels

### 9.2 Error Handling (1 giờ)
- [ ] Global error handler
- [ ] API error messages hiển thị đúng
- [ ] 404 page
- [ ] Network error handling
- [ ] Form validation errors

### 9.3 Testing (1-2 giờ)
- [ ] Test tất cả use-cases trong architecture.md
- [ ] Test edge cases (capacity, conflict, concurrent)
- [ ] Test responsive
- [ ] Test cross-browser

---

## 📦 PHASE 10: DOCUMENTATION (1-2 giờ)

### 10.1 Documentation
- [ ] README.md (setup, run)
- [ ] API_DOCUMENTATION.md
- [ ] COMPONENT_GUIDE.md
- [ ] USER_GUIDE.md (screenshots)
- [ ] TESTING_CHECKLIST.md

---

## ✅ CHECKLIST KIỂM TRA CUỐI CÙNG

### Functional Requirements
- [ ] Tutor không thể tạo buổi trùng giờ
- [ ] Tutor không thể tạo buổi trùng phòng (offline)
- [ ] Student không thể đăng ký buổi trùng lịch
- [ ] Không vượt quá capacity
- [ ] Sửa/Xóa session → SV nhận notification
- [ ] Feedback chỉ sau COMPLETED
- [ ] State machine: OPEN → FULL → PENDING → ONGOING → COMPLETED/CANCELLED

### Non-functional Requirements
- [ ] Responsive trên mobile/tablet/desktop
- [ ] Loading states mượt mà
- [ ] Error messages rõ ràng (tiếng Việt)
- [ ] Accessibility cơ bản (focus, aria-label)
- [ ] Code clean, có comments
- [ ] Git commit messages rõ ràng

---

## 🔄 QUYẾT ĐỊNH KỸ THUẬT

### Backend
- **Express** cho API server
- **fs-extra** cho JSON file operations
- **jsonwebtoken** cho authentication
- **express-validator** cho validation
- **uuid** cho ID generation
- **date-fns** cho datetime operations

### Frontend
- **Create React App** cho boilerplate
- **React Router v6** cho routing
- **Axios** cho HTTP client
- **React Context + useReducer** cho state management (hoặc Zustand nếu muốn đơn giản hơn)
- **Tailwind CSS** hoặc **Material-UI** cho UI
- **date-fns** cho datetime formatting
- **react-hook-form** cho form handling
- **yup** cho validation schema

---

## 📊 ƯỚC TÍNH THỜI GIAN

| Phase | Thời gian | Độ ưu tiên |
|-------|-----------|------------|
| Phase 1: Setup | 2-3h | Critical |
| Phase 2: Backend API | 5-7h | Critical |
| Phase 3: Frontend Foundation | 3-4h | Critical |
| Phase 4: Shared Components | 2-3h | High |
| Phase 5: Student Features | 4-5h | High |
| Phase 6: Tutor Features | 4-5h | High |
| Phase 7: Profile & Settings | 2h | Medium |
| Phase 8: Notifications | 1-2h | Medium |
| Phase 9: Polish & Testing | 3-4h | High |
| Phase 10: Documentation | 1-2h | Medium |
| **TOTAL** | **27-37h** | **~1 tuần** |

---

## 🎯 MỤC TIÊU TỪNG MILESTONE

**Milestone 1 (Ngày 1-2):** Backend hoàn thiện + Auth flow
- Có thể login, tạo user, gọi API thành công

**Milestone 2 (Ngày 3-4):** Student flow hoàn chỉnh
- Student đăng ký, xem lịch, feedback được

**Milestone 3 (Ngày 5-6):** Tutor flow hoàn chỉnh
- Tutor tạo/sửa/xóa session, xem danh sách SV

**Milestone 4 (Ngày 7):** Polish, test, deploy
- Hệ thống hoàn chỉnh, không bug, ready to demo

---

## 📝 GHI CHÚ

- Mỗi phase có thể làm độc lập
- Mỗi module có thể test riêng trước khi tích hợp
- Components có thể thay thế UI library dễ dàng (Material-UI ↔ Ant Design ↔ Chakra UI)
- Backend service layer có thể swap JSON → SQL sau này
- Sử dụng TypeScript (optional) để tăng type safety



