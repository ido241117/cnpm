# API CONTRACT - REST API ENDPOINTS

Base URL: `http://localhost:5000/api`

---

## 🔐 Authentication Endpoints

### POST /auth/register
Đăng ký tài khoản mới

**Request Body:**
```json
{
  "email": "student@hcmut.edu.vn",
  "password": "password123",
  "name": "Nguyễn Văn A",
  "role": "STUDENT",
  "phone": "0123456789",
  "gender": "MALE",
  "dob": "2002-05-15",
  "faculty": "Khoa Khoa học và Kỹ thuật Máy tính"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "student@hcmut.edu.vn",
    "name": "Nguyễn Văn A",
    "role": "STUDENT"
  },
  "message": "Đăng ký thành công"
}
```

**Errors:**
- 400: Email đã tồn tại
- 400: Validation errors

---

### POST /auth/login
Đăng nhập

**Request Body:**
```json
{
  "email": "student@hcmut.edu.vn",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": "uuid",
      "email": "student@hcmut.edu.vn",
      "name": "Nguyễn Văn A",
      "role": "STUDENT"
    }
  },
  "message": "Đăng nhập thành công"
}
```

**Errors:**
- 401: Email hoặc mật khẩu không đúng

---

### GET /auth/me
Lấy thông tin user hiện tại

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "student@hcmut.edu.vn",
    "name": "Nguyễn Văn A",
    "role": "STUDENT",
    "phone": "0123456789",
    "gender": "MALE",
    "dob": "2002-05-15",
    "faculty": "Khoa Khoa học và Kỹ thuật Máy tính",
    "tutorProfile": null
  }
}
```

---

## 👤 User Profile Endpoints

### GET /users/me
Lấy profile đầy đủ (alias của /auth/me)

### PATCH /users/me
Cập nhật profile

**Headers:** `Authorization: Bearer <token>`

**Request Body (partial update):**
```json
{
  "name": "Nguyễn Văn B",
  "phone": "0987654321",
  "tutorProfile": {
    "expertise": ["Lập trình web", "Cơ sở dữ liệu"],
    "bio": "Giảng viên môn Web",
    "officeRoom": "H6-101"
  }
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { /* updated user */ },
  "message": "Cập nhật thông tin thành công"
}
```

**Errors:**
- 400: Validation errors
- 403: Không được đổi role

---

## 📅 Session Endpoints (Tutor)

### POST /sessions
Tạo buổi tư vấn (chỉ Tutor)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "Hướng dẫn làm đồ án Web",
  "description": "Tư vấn về React, Node.js",
  "mode": "OFFLINE",
  "room": "H6-101",
  "url": null,
  "startAt": "2025-11-20T14:00:00Z",
  "endAt": "2025-11-20T16:00:00Z",
  "capacity": 10,
  "subjects": ["Web Development", "React"]
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tutorId": "uuid",
    "title": "Hướng dẫn làm đồ án Web",
    "status": "OPEN",
    "currentCount": 0,
    /* ... other fields */
  },
  "message": "Tạo buổi tư vấn thành công"
}
```

**Errors:**
- 403: Chỉ Tutor mới được tạo
- 409: Trùng lịch với buổi khác
- 409: Phòng đã được đặt (nếu OFFLINE)
- 400: startAt phải < endAt

---

### GET /sessions?mine=true
Lấy danh sách sessions của Tutor

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `mine=true` (bắt buộc để lọc theo tutor)
- `status=OPEN,PENDING` (filter theo status)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Hướng dẫn làm đồ án Web",
      "startAt": "2025-11-20T14:00:00Z",
      "endAt": "2025-11-20T16:00:00Z",
      "status": "OPEN",
      "currentCount": 5,
      "capacity": 10
    }
  ]
}
```

---

### GET /sessions/:id
Lấy chi tiết session

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "tutor": {
      "id": "uuid",
      "name": "TS. Nguyễn Văn C",
      "expertise": ["Web Development"]
    },
    "title": "Hướng dẫn làm đồ án Web",
    "description": "...",
    "mode": "OFFLINE",
    "room": "H6-101",
    "startAt": "2025-11-20T14:00:00Z",
    "endAt": "2025-11-20T16:00:00Z",
    "capacity": 10,
    "currentCount": 5,
    "status": "OPEN",
    "subjects": ["Web Development"]
  }
}
```

---

### PATCH /sessions/:id
Cập nhật session (chỉ Tutor sở hữu)

**Headers:** `Authorization: Bearer <token>`

**Request Body (partial):**
```json
{
  "title": "Hướng dẫn React nâng cao",
  "startAt": "2025-11-20T15:00:00Z"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { /* updated session */ },
  "message": "Cập nhật buổi tư vấn thành công. Đã gửi thông báo đến sinh viên."
}
```

**Errors:**
- 403: Không phải Tutor sở hữu
- 400: Không thể sửa khi status = ONGOING/COMPLETED/CANCELLED
- 409: Trùng lịch mới

---

### DELETE /sessions/:id
Hủy session (chuyển status → CANCELLED)

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "message": "Đã hủy buổi tư vấn. Thông báo đã được gửi đến sinh viên."
}
```

**Errors:**
- 403: Không phải Tutor sở hữu
- 400: Không thể xóa khi đã COMPLETED

---

### GET /sessions/:id/registrations
Xem danh sách sinh viên đã đăng ký (chỉ Tutor sở hữu)

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "registration-uuid",
      "student": {
        "id": "uuid",
        "name": "Nguyễn Văn A",
        "email": "student@hcmut.edu.vn",
        "faculty": "KHMT"
      },
      "status": "JOINED",
      "createdAt": "2025-11-15T10:00:00Z"
    }
  ]
}
```

---

## 📝 Session Registration Endpoints (Student)

### GET /sessions
Lấy danh sách sessions có thể đăng ký

**Query Params:**
- `subject=Web Development` (filter theo subject)
- `tutorId=uuid` (filter theo tutor)
- `from=2025-11-20T00:00:00Z` (từ ngày)
- `to=2025-11-30T23:59:59Z` (đến ngày)
- `status=OPEN` (chỉ hiển thị OPEN)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Hướng dẫn làm đồ án Web",
      "tutor": {
        "id": "uuid",
        "name": "TS. Nguyễn Văn C"
      },
      "startAt": "2025-11-20T14:00:00Z",
      "endAt": "2025-11-20T16:00:00Z",
      "mode": "OFFLINE",
      "room": "H6-101",
      "capacity": 10,
      "currentCount": 5,
      "status": "OPEN",
      "subjects": ["Web Development"]
    }
  ]
}
```

---

### POST /sessions/:id/register
Đăng ký tham gia session

**Headers:** `Authorization: Bearer <token>`

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "registration-uuid",
    "sessionId": "uuid",
    "studentId": "uuid",
    "status": "JOINED"
  },
  "message": "Đăng ký thành công!"
}
```

**Errors:**
- 400: Session đã FULL
- 400: Session không còn OPEN
- 409: Trùng lịch với buổi khác đã đăng ký
- 409: Đã đăng ký buổi này rồi

---

### DELETE /sessions/:id/register
Hủy đăng ký

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "message": "Đã hủy đăng ký"
}
```

**Errors:**
- 404: Không tìm thấy đăng ký

---

### GET /registrations/me
Lấy danh sách các buổi đã đăng ký của Student

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "registration-uuid",
      "session": {
        "id": "uuid",
        "title": "Hướng dẫn làm đồ án Web",
        "tutor": { "name": "TS. Nguyễn Văn C" },
        "startAt": "2025-11-20T14:00:00Z",
        "endAt": "2025-11-20T16:00:00Z",
        "status": "OPEN"
      },
      "status": "JOINED",
      "createdAt": "2025-11-15T10:00:00Z"
    }
  ]
}
```

---

## 💡 Tutor Suggestion Endpoint

### GET /tutors/suggest
Gợi ý tutor theo chuyên ngành và thời gian

**Query Params:**
- `subject=Web Development` (subject cần tư vấn)
- `from=2025-11-20T00:00:00Z` (thời gian mong muốn)
- `to=2025-11-30T23:59:59Z`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "TS. Nguyễn Văn C",
      "expertise": ["Web Development", "Database"],
      "bio": "Giảng viên môn Web",
      "officeRoom": "H6-101",
      "availableSessions": [
        {
          "id": "uuid",
          "title": "Hướng dẫn làm đồ án Web",
          "startAt": "2025-11-20T14:00:00Z",
          "endAt": "2025-11-20T16:00:00Z",
          "capacity": 10,
          "currentCount": 5
        }
      ]
    }
  ]
}
```

---

## ⭐ Feedback Endpoints

### POST /sessions/:id/feedback
Tạo hoặc lưu feedback

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Buổi tư vấn rất hữu ích!",
  "state": "SAVED"
}
```

- `state`: `"DRAFT"` (lưu nháp) hoặc `"SAVED"` (gửi đi)

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "sessionId": "uuid",
    "studentId": "uuid",
    "rating": 5,
    "comment": "Buổi tư vấn rất hữu ích!",
    "state": "SAVED"
  },
  "message": "Cảm ơn bạn đã đánh giá!"
}
```

**Errors:**
- 400: Chỉ được feedback khi session COMPLETED
- 403: Chỉ Student đã tham gia mới được feedback
- 409: Đã feedback rồi (nếu muốn update dùng PATCH)

---

### PATCH /feedback/:id
Cập nhật feedback (update draft → saved hoặc chỉnh sửa)

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated comment",
  "state": "SAVED"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": { /* updated feedback */ },
  "message": "Đã cập nhật đánh giá"
}
```

---

### GET /feedback/me
Lấy danh sách feedback của mình

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "session": {
        "id": "uuid",
        "title": "Hướng dẫn làm đồ án Web",
        "tutor": { "name": "TS. Nguyễn Văn C" }
      },
      "rating": 5,
      "comment": "Buổi tư vấn rất hữu ích!",
      "state": "SAVED",
      "createdAt": "2025-11-20T17:00:00Z"
    }
  ]
}
```

---

## 🔔 Notification Endpoints

### GET /notifications
Lấy danh sách thông báo

**Headers:** `Authorization: Bearer <token>`

**Query Params:**
- `unread=true` (chỉ lấy chưa đọc)

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "type": "SESSION_UPDATED",
      "payload": {
        "sessionId": "uuid",
        "message": "Buổi 'Hướng dẫn làm đồ án Web' đã được cập nhật thời gian",
        "metadata": {
          "oldStartAt": "2025-11-20T14:00:00Z",
          "newStartAt": "2025-11-20T15:00:00Z"
        }
      },
      "readAt": null,
      "createdAt": "2025-11-15T12:00:00Z"
    }
  ],
  "meta": {
    "unreadCount": 3
  }
}
```

---

### PATCH /notifications/:id/read
Đánh dấu đã đọc

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "message": "Đã đánh dấu đã đọc"
}
```

---

### PATCH /notifications/read-all
Đánh dấu tất cả đã đọc

**Headers:** `Authorization: Bearer <token>`

**Response 200:**
```json
{
  "success": true,
  "message": "Đã đánh dấu tất cả đã đọc"
}
```

---

## 🚨 Error Response Format

Tất cả errors đều trả về format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message in Vietnamese"
  }
}
```

### Common Error Codes:
- `UNAUTHORIZED` (401): Chưa đăng nhập hoặc token hết hạn
- `FORBIDDEN` (403): Không có quyền
- `NOT_FOUND` (404): Không tìm thấy resource
- `VALIDATION_ERROR` (400): Dữ liệu không hợp lệ
- `CONFLICT` (409): Xung đột (trùng lịch, trùng email, etc)
- `INTERNAL_ERROR` (500): Lỗi server

### Validation Error Format:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dữ liệu không hợp lệ",
    "details": [
      {
        "field": "email",
        "message": "Email không hợp lệ"
      },
      {
        "field": "phone",
        "message": "Số điện thoại phải có 10-11 số"
      }
    ]
  }
}
```

---

## 📍 Constants Reference

### User Roles
- `STUDENT`: Sinh viên
- `TUTOR`: Giảng viên/Tutor

### Session Status
- `OPEN`: Đang mở đăng ký
- `FULL`: Đã đủ người
- `PENDING`: Chờ diễn ra (gần tới giờ)
- `ONGOING`: Đang diễn ra
- `COMPLETED`: Đã hoàn thành
- `CANCELLED`: Đã hủy

### Session Mode
- `OFFLINE`: Tại phòng
- `ONLINE`: Online qua link

### Registration Status
- `JOINED`: Đã tham gia
- `CANCELLED`: Đã hủy

### Feedback State
- `DRAFT`: Lưu nháp
- `SAVED`: Đã gửi
- `SEEN`: Tutor đã xem (future feature)

### Notification Types
- `SESSION_UPDATED`: Session bị sửa
- `SESSION_CANCELLED`: Session bị hủy
- `SESSION_REMINDER`: Nhắc nhở trước giờ học
- `FEEDBACK_RECEIVED`: Tutor nhận feedback (future)

---

## 🔒 Authentication & Authorization

### JWT Payload:
```json
{
  "userId": "uuid",
  "role": "STUDENT | TUTOR",
  "exp": 1700000000
}
```

### Authorization Rules:
- Tất cả endpoints trừ `/auth/login` và `/auth/register` đều cần JWT
- Tutor mới được: POST/PATCH/DELETE `/sessions`
- Student mới được: POST `/sessions/:id/register`, POST `/feedback`
- Chỉ sở hữu mới được: PATCH `/feedback/:id`, PATCH `/users/me`

---

## 📊 HTTP Status Codes Summary

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | GET, PATCH, DELETE thành công |
| 201 | Created | POST tạo mới thành công |
| 400 | Bad Request | Validation error, business rule violation |
| 401 | Unauthorized | Chưa login hoặc token invalid |
| 403 | Forbidden | Không có quyền |
| 404 | Not Found | Resource không tồn tại |
| 409 | Conflict | Trùng lịch, trùng email, capacity đầy |
| 500 | Internal Error | Lỗi server |

---

Tài liệu này là contract giữa Frontend và Backend. Mọi thay đổi cần update document này trước khi implement.



