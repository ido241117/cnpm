# 🔐 TÀI KHOẢN TEST

## Tài khoản mẫu để test hệ thống

### 👨‍🎓 Tài khoản Sinh viên

#### Student 1
- **Email:** `student1@hcmut.edu.vn`
- **Mật khẩu:** `student123`
- **Họ tên:** Nguyễn Văn An
- **Vai trò:** STUDENT
- **Đã đăng ký:** 3 buổi tư vấn

#### Student 2
- **Email:** `student2@hcmut.edu.vn`
- **Mật khẩu:** `student123`
- **Họ tên:** Trần Thị Bình
- **Vai trò:** STUDENT
- **Đã đăng ký:** 2 buổi tư vấn

---

### 👨‍🏫 Tài khoản Giảng viên/Tutor

#### Tutor 1
- **Email:** `tutor1@hcmut.edu.vn`
- **Mật khẩu:** `tutor123`
- **Họ tên:** TS. Nguyễn Văn Cường
- **Vai trò:** TUTOR
- **Chuyên môn:** Lập trình web, React, Node.js, Cơ sở dữ liệu
- **Phòng:** H6-101
- **Đã tạo:** 3 buổi tư vấn

#### Tutor 2
- **Email:** `tutor2@hcmut.edu.vn`
- **Mật khẩu:** `tutor123`
- **Họ tên:** TS. Lê Thị Diệu
- **Vai trò:** TUTOR
- **Chuyên môn:** Machine Learning, Python, Data Science, AI
- **Phòng:** H6-202
- **Đã tạo:** 2 buổi tư vấn

---

## 📊 Dữ liệu mẫu có sẵn

### Buổi tư vấn (Sessions)
1. **Hướng dẫn làm đồ án Web với React** (OPEN)
   - Tutor: TS. Nguyễn Văn Cường
   - Thời gian: 25/11/2025 14:00-16:00
   - Địa điểm: H6-101 (Offline)
   - Đã đăng ký: 2/10 người

2. **Tư vấn thiết kế cơ sở dữ liệu** (OPEN)
   - Tutor: TS. Nguyễn Văn Cường
   - Thời gian: 26/11/2025 09:00-11:00
   - Địa điểm: Online (Google Meet)
   - Đã đăng ký: 8/15 người

3. **Nhập môn Machine Learning với Python** (OPEN)
   - Tutor: TS. Lê Thị Diệu
   - Thời gian: 27/11/2025 14:00-16:30
   - Địa điểm: H6-202 (Offline)
   - Đã đăng ký: 5/12 người

4. **Deep Learning và Neural Networks** (FULL)
   - Tutor: TS. Lê Thị Diệu
   - Thời gian: 28/11/2025 10:00-12:00
   - Địa điểm: Online (Google Meet)
   - Đã đăng ký: 20/20 người (ĐẦY)

5. **Review buổi tư vấn Web Development** (COMPLETED)
   - Tutor: TS. Nguyễn Văn Cường
   - Thời gian: 15/11/2025 (Đã hoàn thành)
   - Có 2 feedback từ sinh viên

---

## 🧪 Kịch bản test

### Test với tài khoản Student
1. Đăng nhập với `student1@hcmut.edu.vn`
2. Xem danh sách buổi tư vấn
3. Đăng ký buổi tư vấn mới
4. Xem lịch trình đã đăng ký
5. Hủy đăng ký (nếu muốn)
6. Xem buổi COMPLETED và đánh giá feedback

### Test với tài khoản Tutor
1. Đăng nhập với `tutor1@hcmut.edu.vn`
2. Xem danh sách buổi tư vấn đã tạo
3. Tạo buổi tư vấn mới
4. Sửa thông tin buổi tư vấn
5. Xem danh sách sinh viên đã đăng ký
6. Xem feedback từ sinh viên

---

## 🔒 Lưu ý về mật khẩu

Trong môi trường production, mật khẩu sẽ được hash bằng bcrypt.
Hiện tại để test, mật khẩu mặc định là:
- Student: `student123`
- Tutor: `tutor123`

**⚠️ KHÔNG BAO GIỜ sử dụng mật khẩu đơn giản như vậy trong production!**

---

## 📝 Thêm tài khoản mới

Để thêm tài khoản test mới, chỉnh sửa file `server/data/users.json` và thêm object mới với cấu trúc:

```json
{
  "id": "uuid-unique",
  "role": "STUDENT hoặc TUTOR",
  "email": "email@hcmut.edu.vn",
  "password": "$2a$10$...", 
  "name": "Họ và tên",
  "phone": "0123456789",
  "gender": "MALE/FEMALE/OTHER",
  "dob": "2002-01-01",
  "faculty": "Tên khoa",
  "tutorProfile": null hoặc {...}
}
```

**Lưu ý:** Password cần được hash. Sử dụng tool online hoặc chạy:
```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-password', 10);
console.log(hash);
```



