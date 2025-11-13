# DATA SCHEMA - JSON DATABASE

Đây là schema chi tiết cho các file JSON database

---

## 📄 users.json

**Mô tả:** Lưu trữ thông tin tất cả users (Students và Tutors)

**Schema:**
```json
{
  "users": [
    {
      "id": "string (uuid)",
      "role": "STUDENT | TUTOR",
      "email": "string (unique)",
      "password": "string (hashed với bcrypt)",
      "name": "string",
      "phone": "string (10-11 số)",
      "gender": "MALE | FEMALE | OTHER",
      "dob": "string (ISO date YYYY-MM-DD)",
      "faculty": "string",
      "createdAt": "string (ISO datetime)",
      "updatedAt": "string (ISO datetime)",
      "tutorProfile": {
        "expertise": ["string"],
        "bio": "string",
        "officeRoom": "string"
      }
    }
  ]
}
```

**Sample Data:**
```json
{
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "role": "STUDENT",
      "email": "student1@hcmut.edu.vn",
      "password": "$2b$10$...",
      "name": "Nguyễn Văn A",
      "phone": "0123456789",
      "gender": "MALE",
      "dob": "2002-05-15",
      "faculty": "Khoa Khoa học và Kỹ thuật Máy tính",
      "createdAt": "2025-11-01T10:00:00Z",
      "updatedAt": "2025-11-01T10:00:00Z",
      "tutorProfile": null
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "role": "TUTOR",
      "email": "tutor1@hcmut.edu.vn",
      "password": "$2b$10$...",
      "name": "TS. Trần Thị B",
      "phone": "0987654321",
      "gender": "FEMALE",
      "dob": "1985-03-20",
      "faculty": "Khoa Khoa học và Kỹ thuật Máy tính",
      "createdAt": "2025-11-01T10:00:00Z",
      "updatedAt": "2025-11-01T10:00:00Z",
      "tutorProfile": {
        "expertise": ["Lập trình web", "Cơ sở dữ liệu", "Công nghệ phần mềm"],
        "bio": "Giảng viên bộ môn Công nghệ Phần mềm với 10 năm kinh nghiệm",
        "officeRoom": "H6-101"
      }
    }
  ]
}
```

**Indexes (trong code):**
- `email` (unique lookup)
- `id` (primary)
- `role` (filter)

---

## 📄 sessions.json

**Mô tả:** Lưu trữ các buổi tư vấn

**Schema:**
```json
{
  "sessions": [
    {
      "id": "string (uuid)",
      "tutorId": "string (uuid, FK to users)",
      "title": "string",
      "description": "string",
      "mode": "OFFLINE | ONLINE",
      "room": "string | null",
      "url": "string | null",
      "startAt": "string (ISO datetime)",
      "endAt": "string (ISO datetime)",
      "capacity": "number (>= 1)",
      "currentCount": "number (>= 0, <= capacity)",
      "status": "OPEN | FULL | PENDING | ONGOING | COMPLETED | CANCELLED",
      "subjects": ["string"],
      "createdAt": "string (ISO datetime)",
      "updatedAt": "string (ISO datetime)"
    }
  ]
}
```

**Sample Data:**
```json
{
  "sessions": [
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "tutorId": "550e8400-e29b-41d4-a716-446655440002",
      "title": "Hướng dẫn làm đồ án Web với React",
      "description": "Tư vấn về React, Node.js, và các best practices trong phát triển web",
      "mode": "OFFLINE",
      "room": "H6-101",
      "url": null,
      "startAt": "2025-11-20T14:00:00Z",
      "endAt": "2025-11-20T16:00:00Z",
      "capacity": 10,
      "currentCount": 5,
      "status": "OPEN",
      "subjects": ["Lập trình web", "React", "Node.js"],
      "createdAt": "2025-11-10T09:00:00Z",
      "updatedAt": "2025-11-10T09:00:00Z"
    },
    {
      "id": "650e8400-e29b-41d4-a716-446655440002",
      "tutorId": "550e8400-e29b-41d4-a716-446655440002",
      "title": "Tư vấn thiết kế cơ sở dữ liệu",
      "description": "Hướng dẫn thiết kế schema, normalization, indexing",
      "mode": "ONLINE",
      "room": null,
      "url": "https://meet.google.com/abc-defg-hij",
      "startAt": "2025-11-22T09:00:00Z",
      "endAt": "2025-11-22T11:00:00Z",
      "capacity": 15,
      "currentCount": 15,
      "status": "FULL",
      "subjects": ["Cơ sở dữ liệu", "SQL"],
      "createdAt": "2025-11-10T10:00:00Z",
      "updatedAt": "2025-11-15T14:30:00Z"
    }
  ]
}
```

**Business Rules:**
- `mode = OFFLINE` → `room` bắt buộc, `url = null`
- `mode = ONLINE` → `url` bắt buộc, `room = null`
- `startAt < endAt`
- `currentCount <= capacity`
- `currentCount = capacity` → auto `status = FULL`

**Indexes:**
- `tutorId` (filter sessions by tutor)
- `startAt, endAt` (conflict detection)
- `status` (filter)
- `subjects` (search/filter)

---

## 📄 registrations.json

**Mô tả:** Lưu trữ đăng ký tham gia của sinh viên

**Schema:**
```json
{
  "registrations": [
    {
      "id": "string (uuid)",
      "sessionId": "string (uuid, FK to sessions)",
      "studentId": "string (uuid, FK to users)",
      "status": "JOINED | CANCELLED",
      "createdAt": "string (ISO datetime)",
      "updatedAt": "string (ISO datetime)"
    }
  ]
}
```

**Sample Data:**
```json
{
  "registrations": [
    {
      "id": "750e8400-e29b-41d4-a716-446655440001",
      "sessionId": "650e8400-e29b-41d4-a716-446655440001",
      "studentId": "550e8400-e29b-41d4-a716-446655440001",
      "status": "JOINED",
      "createdAt": "2025-11-12T08:30:00Z",
      "updatedAt": "2025-11-12T08:30:00Z"
    },
    {
      "id": "750e8400-e29b-41d4-a716-446655440002",
      "sessionId": "650e8400-e29b-41d4-a716-446655440002",
      "studentId": "550e8400-e29b-41d4-a716-446655440001",
      "status": "CANCELLED",
      "createdAt": "2025-11-11T10:00:00Z",
      "updatedAt": "2025-11-14T09:00:00Z"
    }
  ]
}
```

**Business Rules:**
- Unique `(sessionId, studentId)` cho status = JOINED
- Khi tạo → `sessions.currentCount++`
- Khi hủy (status → CANCELLED) → `sessions.currentCount--`

**Indexes:**
- `sessionId` (get registrations of a session)
- `studentId` (get registrations of a student)
- Composite: `(sessionId, studentId)` (unique check)

---

## 📄 feedback.json

**Mô tả:** Lưu trữ phản hồi và đánh giá của sinh viên

**Schema:**
```json
{
  "feedback": [
    {
      "id": "string (uuid)",
      "sessionId": "string (uuid, FK to sessions)",
      "studentId": "string (uuid, FK to users)",
      "rating": "number (1-5)",
      "comment": "string",
      "state": "DRAFT | SAVED | SEEN",
      "createdAt": "string (ISO datetime)",
      "updatedAt": "string (ISO datetime)"
    }
  ]
}
```

**Sample Data:**
```json
{
  "feedback": [
    {
      "id": "850e8400-e29b-41d4-a716-446655440001",
      "sessionId": "650e8400-e29b-41d4-a716-446655440001",
      "studentId": "550e8400-e29b-41d4-a716-446655440001",
      "rating": 5,
      "comment": "Buổi tư vấn rất bổ ích, giảng viên nhiệt tình và giải đáp chi tiết!",
      "state": "SAVED",
      "createdAt": "2025-11-20T17:00:00Z",
      "updatedAt": "2025-11-20T17:00:00Z"
    },
    {
      "id": "850e8400-e29b-41d4-a716-446655440002",
      "sessionId": "650e8400-e29b-41d4-a716-446655440002",
      "studentId": "550e8400-e29b-41d4-a716-446655440001",
      "rating": 4,
      "comment": "Chưa hoàn thiện",
      "state": "DRAFT",
      "createdAt": "2025-11-22T12:00:00Z",
      "updatedAt": "2025-11-22T12:00:00Z"
    }
  ]
}
```

**Business Rules:**
- Unique `(sessionId, studentId)` (mỗi SV chỉ feedback 1 lần/session)
- Chỉ được tạo khi:
  - Session status = COMPLETED
  - Student đã JOINED (có registration với status=JOINED)
- `rating` phải từ 1-5
- `state = DRAFT` → có thể update
- `state = SAVED` → không thể update (hoặc có time limit)

**Indexes:**
- `sessionId` (get all feedback of a session)
- `studentId` (get all feedback of a student)

---

## 📄 notifications.json

**Mô tả:** Lưu trữ thông báo cho users

**Schema:**
```json
{
  "notifications": [
    {
      "id": "string (uuid)",
      "userId": "string (uuid, FK to users)",
      "type": "SESSION_UPDATED | SESSION_CANCELLED | SESSION_REMINDER",
      "payload": {
        "sessionId": "string (uuid)",
        "sessionTitle": "string",
        "message": "string",
        "metadata": "object (flexible)"
      },
      "readAt": "string (ISO datetime) | null",
      "createdAt": "string (ISO datetime)"
    }
  ]
}
```

**Sample Data:**
```json
{
  "notifications": [
    {
      "id": "950e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440001",
      "type": "SESSION_UPDATED",
      "payload": {
        "sessionId": "650e8400-e29b-41d4-a716-446655440001",
        "sessionTitle": "Hướng dẫn làm đồ án Web với React",
        "message": "Buổi tư vấn 'Hướng dẫn làm đồ án Web với React' đã được cập nhật thời gian từ 14:00 sang 15:00",
        "metadata": {
          "oldStartAt": "2025-11-20T14:00:00Z",
          "newStartAt": "2025-11-20T15:00:00Z"
        }
      },
      "readAt": null,
      "createdAt": "2025-11-15T10:30:00Z"
    },
    {
      "id": "950e8400-e29b-41d4-a716-446655440002",
      "userId": "550e8400-e29b-41d4-a716-446655440001",
      "type": "SESSION_CANCELLED",
      "payload": {
        "sessionId": "650e8400-e29b-41d4-a716-446655440002",
        "sessionTitle": "Tư vấn thiết kế cơ sở dữ liệu",
        "message": "Buổi tư vấn 'Tư vấn thiết kế cơ sở dữ liệu' đã bị hủy",
        "metadata": {}
      },
      "readAt": "2025-11-16T08:00:00Z",
      "createdAt": "2025-11-15T16:00:00Z"
    }
  ]
}
```

**Business Rules:**
- `readAt = null` → chưa đọc
- `readAt != null` → đã đọc

**Indexes:**
- `userId` (get notifications of a user)
- `readAt` (filter unread)

---

## 📄 rooms.json (Optional)

**Mô tả:** Quản lý danh sách phòng (nếu cần kiểm tra conflict phòng)

**Schema:**
```json
{
  "rooms": [
    {
      "id": "string (uuid)",
      "name": "string",
      "location": "string",
      "capacity": "number"
    }
  ]
}
```

**Sample Data:**
```json
{
  "rooms": [
    {
      "id": "a50e8400-e29b-41d4-a716-446655440001",
      "name": "H6-101",
      "location": "Nhà H6, Tầng 1",
      "capacity": 30
    },
    {
      "id": "a50e8400-e29b-41d4-a716-446655440002",
      "name": "H6-201",
      "location": "Nhà H6, Tầng 2",
      "capacity": 50
    }
  ]
}
```

---

## 🔍 Helper Queries (Reference)

### Find user by email
```javascript
users.find(u => u.email === email)
```

### Find sessions by tutor
```javascript
sessions.filter(s => s.tutorId === tutorId)
```

### Check session conflict (overlap)
```javascript
// Kiểm tra có session nào trùng thời gian không
sessions.filter(s => 
  s.tutorId === tutorId && 
  s.status !== 'CANCELLED' &&
  s.startAt < newEndAt && 
  s.endAt > newStartAt
)
```

### Check room conflict
```javascript
// Kiểm tra phòng có bị trùng không
sessions.filter(s => 
  s.mode === 'OFFLINE' &&
  s.room === roomName &&
  s.status !== 'CANCELLED' &&
  s.startAt < newEndAt && 
  s.endAt > newStartAt
)
```

### Get student's registrations with status JOINED
```javascript
registrations
  .filter(r => r.studentId === studentId && r.status === 'JOINED')
  .map(r => sessions.find(s => s.id === r.sessionId))
```

### Check student schedule conflict
```javascript
// Lấy tất cả sessions student đã đăng ký
const studentSessions = registrations
  .filter(r => r.studentId === studentId && r.status === 'JOINED')
  .map(r => sessions.find(s => s.id === r.sessionId))

// Kiểm tra trùng với session mới
const conflict = studentSessions.find(s =>
  s.startAt < newEndAt && s.endAt > newStartAt
)
```

### Suggest tutors by subject and time
```javascript
// Tìm tutors có expertise match
const tutors = users.filter(u => 
  u.role === 'TUTOR' &&
  u.tutorProfile.expertise.includes(subject)
)

// Lọc tutors có sessions trong khoảng thời gian
tutors.map(tutor => ({
  ...tutor,
  availableSessions: sessions.filter(s =>
    s.tutorId === tutor.id &&
    s.status === 'OPEN' &&
    s.startAt >= from &&
    s.endAt <= to
  )
}))
```

---

## 📝 NOTES

### ID Generation
Sử dụng `uuid v4` cho tất cả IDs:
```javascript
const { v4: uuidv4 } = require('uuid');
const id = uuidv4();
```

### Password Hashing
Sử dụng `bcrypt`:
```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
const isMatch = await bcrypt.compare(password, hashedPassword);
```

### DateTime Format
- Tất cả datetime lưu dưới dạng ISO 8601 string
- UTC timezone
- Format: `2025-11-20T14:00:00Z`

### Atomic Write
Để tránh data corruption khi concurrent writes:
```javascript
const fs = require('fs-extra');

async function writeData(filePath, data) {
  const tempFile = filePath + '.tmp';
  await fs.writeJSON(tempFile, data, { spaces: 2 });
  await fs.move(tempFile, filePath, { overwrite: true });
}
```

### Data Validation
Sử dụng `express-validator` hoặc `joi`:
```javascript
const { body } = require('express-validator');

body('email').isEmail(),
body('phone').matches(/^0\d{9,10}$/),
body('dob').isBefore(new Date().toISOString()),
body('capacity').isInt({ min: 1 })
```

---

Schema này là foundation cho toàn bộ backend. Mọi thay đổi cần cập nhật document này!



