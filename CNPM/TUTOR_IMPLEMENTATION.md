# TUTOR IMPLEMENTATION - Tài liệu triển khai giao diện Tutor

Tài liệu chi tiết về việc triển khai đầy đủ giao diện và chức năng cho Tutor trong hệ thống tư vấn.

---

## 📋 TỔNG QUAN

Đã triển khai hoàn chỉnh 4 trang chính cho Tutor:

1. **Tutor Profile** - Quản lý thông tin cá nhân
2. **Create Session** - Tạo buổi tư vấn mới
3. **Manage Sessions** - Quản lý và sửa/xóa buổi tư vấn
4. **View Registrations** - Xem danh sách sinh viên đăng ký

---

## 🎯 CÁC TRANG ĐÃ TRIỂN KHAI

### 1. Tutor Profile (`/tutor/profile`)

**File:** `client/src/pages/tutor/TutorProfile.jsx`

**Chức năng:**
- Hiển thị và chỉnh sửa thông tin cá nhân của giảng viên
- Form gồm 8 trường: Họ tên, Mã số, Giới tính, Khoa, Ngày sinh, Lĩnh vực chuyên môn, Email, SĐT
- 3 trạng thái: View (disabled), Edit (enabled), Confirm/Success (modals)

**Tính năng:**
- ✅ Edit mode - cho phép chỉnh sửa thông tin
- ✅ Validation - kiểm tra dữ liệu trước khi lưu
- ✅ Confirm modal - xác nhận trước khi lưu thay đổi
- ✅ Success modal - thông báo lưu thành công
- ✅ Cancel - hủy bỏ thay đổi và khôi phục dữ liệu gốc
- ✅ Integration với backend API (`PATCH /me`)

**Design:**
- Header với logo, notification bell, user info
- 2 tabs: "Tạo buổi tư vấn" và "Thay đổi lịch" (navigation buttons)
- Form 2 cột với spacing đều
- Buttons: Edit / Save & Cancel
- Modals: Confirm (Hủy/Oke), Success (Oke)

---

### 2. Create Session (`/tutor/sessions/create`)

**File:** `client/src/pages/tutor/CreateSession.jsx`

**Chức năng:**
- Tạo buổi tư vấn mới với đầy đủ thông tin
- Form gồm 8 trường: Mô tả, Giờ (start-end), Ngày, Địa điểm, Mô tả chi tiết, Hạn đăng ký, Số lượng SV
- Auto-detect mode (ONLINE/OFFLINE) dựa trên địa điểm (URL hay phòng)

**Tính năng:**
- ✅ Time picker - chọn giờ bắt đầu và kết thúc
- ✅ Date picker - chọn ngày tổ chức
- ✅ Location input - tự động phát hiện Online (URL) hoặc Offline (room)
- ✅ Capacity input - số lượng sinh viên tối đa
- ✅ Validation - kiểm tra các trường bắt buộc
- ✅ Loading state - hiển thị trạng thái đang lưu
- ✅ Success modal - thông báo tạo thành công và redirect về Manage Sessions
- ✅ Cancel button - reset form về mặc định
- ✅ Integration với backend API (`POST /sessions`)

**Validation Rules:**
- Mô tả (title) - bắt buộc
- Ngày (date) - bắt buộc
- Số lượng SV (capacity) - bắt buộc, > 0
- Thời gian bắt đầu < Thời gian kết thúc (backend check)
- Không xung đột lịch với buổi tư vấn khác (backend check)
- Không xung đột phòng nếu offline (backend check)

**Design:**
- Header giống Tutor Profile
- Title: "Add Schedule" (màu xanh, center)
- Form 1 cột với label bên trái, input bên phải
- Ratio label:input = 1:3
- Buttons: Cancel (white/blue border) + Save (blue fill)
- Success modal: "Lưu thành công" (Oke button)

---

### 3. Manage Sessions (`/tutor/sessions`)

**File:** `client/src/pages/tutor/ManageSessions.jsx`

**Chức năng:**
- Hiển thị danh sách tất cả buổi tư vấn của giảng viên
- Sửa thông tin buổi tư vấn
- Xóa/Hủy buổi tư vấn
- Xem danh sách sinh viên đăng ký

**Tính năng:**
- ✅ List view - danh sách buổi tư vấn với thông tin đầy đủ
- ✅ Session card - hiển thị: title, date, time, location, capacity, status
- ✅ Edit modal - form đầy đủ để sửa thông tin
- ✅ Delete confirmation - modal xác nhận trước khi xóa
- ✅ Success modal - thông báo thành công sau khi sửa/xóa
- ✅ "Thông tin khác" button - link đến trang View Registrations
- ✅ "+ Create Event" button - link đến trang Create Session
- ✅ Empty state - hiển thị khi chưa có buổi tư vấn nào
- ✅ Loading state - hiển thị spinner khi đang tải
- ✅ Integration với backend API:
  - `GET /sessions?mine=true` - lấy danh sách
  - `PATCH /sessions/:id` - cập nhật
  - `DELETE /sessions/:id` - xóa (chuyển status sang CANCELLED)

**Edit Modal Fields:**
- Mô tả, Giờ (start-end), Ngày, Địa điểm, Mô tả chi tiết, Số lượng SV
- Buttons: Cancel, Save, Delete

**Delete Flow:**
1. Click "Xóa" trên session card hoặc "Delete" trong edit modal
2. Hiển thị confirm modal: "Bạn có muốn xóa buổi tư vấn?"
3. Cancel / Delete buttons
4. Nếu Delete → gọi API → hiển thị success modal "Xóa lịch thành công"
5. Refresh danh sách sessions

**Design:**
- Header + navigation button "Thay đổi lịch"
- List of session cards với layout: info (left) + actions (right)
- Actions: "Thông tin khác", "Sửa", "Xóa"
- Edit modal: form giống Create nhưng pre-filled
- Modals: Edit, Delete confirm, Success

---

### 4. View Registrations (`/tutor/sessions/:id/registrations`)

**File:** `client/src/pages/tutor/ViewRegistrations.jsx`

**Chức năng:**
- Hiển thị danh sách sinh viên đã đăng ký buổi tư vấn
- Hiển thị thông tin buổi tư vấn
- Back button để quay lại Manage Sessions

**Tính năng:**
- ✅ Session info banner - hiển thị title, date, capacity
- ✅ Table view - danh sách sinh viên với 4 cột: MSSV, Họ, Tên, Email
- ✅ Empty state - hiển thị khi chưa có sinh viên đăng ký
- ✅ Loading state - spinner khi đang tải
- ✅ Back button - quay lại Manage Sessions
- ✅ Integration với backend API:
  - `GET /sessions/:id` - lấy thông tin buổi tư vấn
  - `GET /sessions/:id/registrations` - lấy danh sách sinh viên đăng ký

**Table Structure:**
```
| Mssv   | Họ       | Tên    | Email                   |
|--------|----------|--------|-------------------------|
| 2311111| Nguyễn   | Văn A  | student1@example.com    |
| 2311112| Trần     | Thị B  | student2@example.com    |
```

**Design:**
- Header giống các trang khác
- Session info: gradient blue background, rounded
- Table: full width, hover effect trên rows
- Back button: bottom center, blue fill

---

## 🔌 BACKEND API ENDPOINTS

Đã thêm 3 endpoints mới cho Tutor:

### 1. PATCH `/api/sessions/:id`

**Auth:** TUTOR only

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "mode": "ONLINE | OFFLINE",
  "room": "string | null",
  "url": "string | null",
  "startAt": "ISO datetime",
  "endAt": "ISO datetime",
  "capacity": "number",
  "subjects": ["string"]
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated session */ },
  "message": "Cập nhật buổi tư vấn thành công"
}
```

**Validations:**
- Session tồn tại
- Tutor sở hữu session
- startAt < endAt
- Không được thay đổi: id, tutorId, currentCount

**Errors:**
- 404: Session not found
- 403: Không có quyền sửa
- 400: Validation error

---

### 2. DELETE `/api/sessions/:id`

**Auth:** TUTOR only

**Behavior:**
- Không xóa thật, chỉ chuyển `status` sang `CANCELLED`
- Tự động hủy tất cả registrations liên quan (status → CANCELLED)

**Response:**
```json
{
  "success": true,
  "message": "Xóa buổi tư vấn thành công"
}
```

**Validations:**
- Session tồn tại
- Tutor sở hữu session

**Errors:**
- 404: Session not found
- 403: Không có quyền xóa

---

### 3. GET `/api/sessions/:id/registrations`

**Auth:** TUTOR only

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "sessionId": "string",
      "studentId": "string",
      "status": "JOINED",
      "createdAt": "ISO datetime",
      "student": {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "role": "STUDENT"
        // ... (no password)
      }
    }
  ]
}
```

**Validations:**
- Session tồn tại
- Tutor sở hữu session

**Errors:**
- 404: Session not found
- 403: Không có quyền xem danh sách

---

## 🛣️ ROUTING

Đã cập nhật `client/src/App.jsx`:

```jsx
{/* Tutor routes */}
<Route path="/tutor/dashboard" element={<PrivateRoute role="TUTOR"><TutorDashboard /></PrivateRoute>} />
<Route path="/tutor/profile" element={<PrivateRoute role="TUTOR"><TutorProfile /></PrivateRoute>} />
<Route path="/tutor/sessions" element={<PrivateRoute role="TUTOR"><ManageSessions /></PrivateRoute>} />
<Route path="/tutor/sessions/create" element={<PrivateRoute role="TUTOR"><CreateSession /></PrivateRoute>} />
<Route path="/tutor/sessions/:id/registrations" element={<PrivateRoute role="TUTOR"><ViewRegistrations /></PrivateRoute>} />
```

**Navigation Flow:**

```
Login (TUTOR)
    ↓
Tutor Dashboard (/tutor/dashboard)
    ├─→ Profile (/tutor/profile)
    ├─→ Create Session (/tutor/sessions/create)
    │       ↓ (on success)
    │   Manage Sessions (/tutor/sessions)
    │
    └─→ Manage Sessions (/tutor/sessions)
            ├─→ Edit (modal)
            ├─→ Delete (modal)
            └─→ View Registrations (/tutor/sessions/:id/registrations)
                    ↓ (Back button)
                Manage Sessions
```

---

## 🎨 DESIGN SYSTEM

### Colors

- **Primary Blue:** `#3B82F6` (bg-blue-500)
- **Blue Hover:** `#2563EB` (bg-blue-600)
- **Light Blue:** `#DBEAFE` (bg-blue-100)
- **Gray:** `#6B7280` (text-gray-600)
- **White:** `#FFFFFF`
- **Success Green:** `#10B981`
- **Danger Red:** `#EF4444`

### Typography

- **Page Title:** `text-2xl font-semibold text-blue-500`
- **Section Title:** `text-xl font-semibold text-gray-900`
- **Label:** `text-sm font-medium text-gray-700`
- **Body:** `text-sm text-gray-600`
- **Input:** `text-sm text-gray-900`

### Components

**Button Primary:**
```css
px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm
```

**Button Secondary:**
```css
px-10 py-2.5 bg-white hover:bg-gray-50 text-blue-500 border-2 border-blue-500 font-medium rounded-lg transition-colors
```

**Input Field:**
```css
w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors
```

**Modal:**
```css
fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
// Content:
bg-white rounded-2xl p-8 max-w-md w-full mx-4
```

### Layout

- **Max Width:** `max-w-7xl mx-auto`
- **Padding:** `px-6 py-8`
- **Spacing:** `space-y-6`, `space-x-4`
- **Grid:** `grid grid-cols-2 gap-6`

---

## ✅ TESTING CHECKLIST

### Tutor Profile

- [ ] Load profile data from backend
- [ ] Click Edit → enable form fields
- [ ] Change data → Click Save → Show confirm modal
- [ ] Confirm modal → Click "Oke" → API call → Show success modal
- [ ] Success modal → Click "Oke" → Close modal → Form updated
- [ ] Click Edit → Change data → Click Cancel → Data restored
- [ ] Validate: empty required fields → Show error
- [ ] Navigate: Click "Tạo buổi tư vấn" → Redirect to Create Session
- [ ] Navigate: Click "Thay đổi lịch" → Redirect to Manage Sessions
- [ ] Navigate: Click "Thoát" → Redirect to Dashboard

### Create Session

- [ ] Load empty form
- [ ] Fill all fields → Click Save → API call → Show success modal
- [ ] Success modal → Click "Oke" → Redirect to Manage Sessions
- [ ] Required fields: empty → Show error toast
- [ ] Time validation: startTime >= endTime → Show backend error
- [ ] Schedule conflict → Show backend error with details
- [ ] Room conflict → Show backend error with details
- [ ] Location detection: "http..." → mode = ONLINE
- [ ] Location detection: "Phòng H6" → mode = OFFLINE
- [ ] Click Cancel → Reset form to default
- [ ] Loading state: Show "Đang lưu..." on button

### Manage Sessions

- [ ] Load sessions list from backend
- [ ] Empty state: No sessions → Show message + "Tạo buổi tư vấn" button
- [ ] Session card: Display all info (title, date, time, location, capacity, status)
- [ ] Click "Thông tin khác" → Redirect to View Registrations
- [ ] Click "Sửa" → Show edit modal with pre-filled data
- [ ] Edit modal: Change data → Click Save → API call → Show success modal → Refresh list
- [ ] Edit modal: Click Cancel → Close modal without saving
- [ ] Edit modal: Click Delete → Close edit modal → Show delete confirm modal
- [ ] Click "Xóa" on card → Show delete confirm modal
- [ ] Delete modal: Click Cancel → Close modal
- [ ] Delete modal: Click Delete → API call → Show success modal → Refresh list
- [ ] Click "+ Create Event" → Redirect to Create Session
- [ ] Status badges: Different colors for OPEN/FULL/COMPLETED/CANCELLED

### View Registrations

- [ ] Load session info + registrations list from backend
- [ ] Session banner: Display title, date, capacity
- [ ] Table: Display MSSV, Họ, Tên, Email
- [ ] Empty state: No registrations → Show message
- [ ] Name parsing: "Nguyễn Văn A" → Họ: "Nguyễn Văn", Tên: "A"
- [ ] Click Back button (top left) → Redirect to Manage Sessions
- [ ] Click Back button (bottom center) → Redirect to Manage Sessions
- [ ] Authorization: Only owner tutor can access
- [ ] 403 Error: Show error toast → Redirect to Manage Sessions

### Integration

- [ ] Login as TUTOR → Redirect to /tutor/dashboard
- [ ] Dashboard → Links work correctly
- [ ] Profile → Create → Manage → Registrations → Flow works
- [ ] Backend API: All endpoints return correct data
- [ ] Authentication: JWT token in requests
- [ ] Authorization: RBAC middleware works
- [ ] Error handling: Show user-friendly messages
- [ ] Loading states: Consistent spinners
- [ ] Success states: Consistent modals

---

## 🚀 DEPLOYMENT

### Frontend

Tất cả file React components đã được tạo trong `client/src/pages/tutor/`:
- `TutorProfile.jsx`
- `CreateSession.jsx`
- `ManageSessions.jsx`
- `ViewRegistrations.jsx`

Routes đã được cấu hình trong `client/src/App.jsx`.

### Backend

Các endpoints đã được thêm vào `server/server.js`:
- Line 474-533: `PATCH /api/sessions/:id`
- Line 535-592: `DELETE /api/sessions/:id`
- Line 594-646: `GET /api/sessions/:id/registrations`

### Services

`client/src/services/sessionService.js` đã có đầy đủ methods:
- `createSession()`
- `updateSession()`
- `deleteSession()`
- `getSessionRegistrations()`

---

## 📝 NOTES

### Known Issues

- [ ] EditSession.jsx vẫn là placeholder (không dùng đến, có thể xóa)
- [ ] Calendar view trong Manage Sessions có thể cải thiện UX
- [ ] Chưa có notification khi tutor tạo/sửa/xóa session

### Future Enhancements

- [ ] Add real calendar view (FullCalendar.js)
- [ ] Add export registrations to CSV
- [ ] Add email notification to students when session changed
- [ ] Add attendance tracking
- [ ] Add feedback viewing for tutors
- [ ] Add analytics dashboard
- [ ] Add search/filter in Manage Sessions
- [ ] Add pagination for large lists

---

## 🎓 USAGE

### Đăng nhập Tutor

1. Vào `/login`
2. Chọn role: "Giảng Viên"
3. Nhập email: `tutor1@example.com`
4. Nhập password: `password123`
5. Click "Đăng nhập"

### Tạo buổi tư vấn

1. Dashboard → Click "Tạo buổi tư vấn mới"
2. Điền form:
   - Mô tả: "Tư vấn học tập"
   - Giờ: 14:00 - 16:00
   - Ngày: 2024-12-20
   - Địa điểm: "H6-101" hoặc "https://meet.google.com/abc"
   - Mô tả chi tiết: "..."
   - Số lượng SV: 30
3. Click "Save"
4. Confirm → Success → Redirect

### Quản lý buổi tư vấn

1. Dashboard → Click "Quản lý buổi tư vấn"
2. Xem danh sách sessions
3. Click "Sửa" để edit
4. Click "Xóa" để cancel session
5. Click "Thông tin khác" để xem danh sách SV đăng ký

---

## 📚 REFERENCES

- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [React Hot Toast](https://react-hot-toast.com/)

---

**Ngày tạo:** 13/11/2024  
**Phiên bản:** 1.0  
**Tác giả:** AI Assistant  
**Status:** ✅ Hoàn thành


