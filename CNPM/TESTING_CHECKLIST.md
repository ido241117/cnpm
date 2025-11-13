# TESTING CHECKLIST

## ✅ ACCEPTANCE CRITERIA TESTING

### 1. Authentication & Authorization

- [ ] **Đăng ký tài khoản**
  - [ ] Đăng ký Student thành công
  - [ ] Đăng ký Tutor thành công
  - [ ] Email trùng → hiển thị lỗi
  - [ ] Email không hợp lệ → hiển thị lỗi
  - [ ] Password ngắn hơn 6 ký tự → hiển thị lỗi
  - [ ] Thiếu trường bắt buộc → hiển thị lỗi

- [ ] **Đăng nhập**
  - [ ] Đăng nhập Student → redirect /student/dashboard
  - [ ] Đăng nhập Tutor → redirect /tutor/dashboard
  - [ ] Sai email/password → hiển thị lỗi
  - [ ] JWT được lưu vào localStorage
  - [ ] Refresh page → vẫn login

- [ ] **Protected Routes**
  - [ ] Chưa login → redirect /login
  - [ ] Student truy cập /tutor/* → forbidden
  - [ ] Tutor truy cập /student/* → forbidden

- [ ] **Logout**
  - [ ] Logout → clear localStorage
  - [ ] Logout → redirect /login

---

### 2. Profile Management

- [ ] **Xem profile**
  - [ ] Student xem đầy đủ thông tin
  - [ ] Tutor xem thêm expertise, bio, office_room

- [ ] **Chỉnh sửa profile**
  - [ ] Edit → hiển thị form với dữ liệu hiện tại
  - [ ] Save thành công → cập nhật UI
  - [ ] Cancel → không thay đổi dữ liệu
  - [ ] Phone không hợp lệ → hiển thị lỗi
  - [ ] Email không cho đổi (hoặc validate unique)
  - [ ] Tutor cập nhật expertise thành công

- [ ] **Validation**
  - [ ] DOB phải < ngày hiện tại
  - [ ] Phone 10-11 số
  - [ ] Faculty bắt buộc

---

### 3. Session Management (Tutor)

#### 3.1 Tạo buổi tư vấn

- [ ] **Tạo session OFFLINE**
  - [ ] Điền đầy đủ → tạo thành công
  - [ ] Hiển thị toast "Tạo thành công"
  - [ ] Session xuất hiện trong danh sách
  - [ ] Status = OPEN, currentCount = 0

- [ ] **Tạo session ONLINE**
  - [ ] Bắt buộc nhập URL
  - [ ] URL không hợp lệ → hiển thị lỗi
  - [ ] Tạo thành công

- [ ] **Conflict detection - Lịch của Tutor**
  - [ ] Tạo 2 session cùng thời gian → lỗi 409
  - [ ] Hiển thị message rõ ràng: "Bạn đã có buổi tư vấn khác vào thời gian này"
  - [ ] Session cũ vẫn giữ nguyên

- [ ] **Conflict detection - Phòng**
  - [ ] Tạo OFFLINE cùng phòng, cùng thời gian → hiển thị modal
  - [ ] Modal gợi ý "Chuyển sang Online"
  - [ ] Chọn "Chuyển Online" → hiển thị field URL
  - [ ] Nhập URL → tạo thành công với mode=ONLINE
  - [ ] Chọn "Cancel" → không tạo session

- [ ] **Validation**
  - [ ] startAt < endAt (nếu không → lỗi)
  - [ ] Capacity >= 1
  - [ ] Mode OFFLINE bắt buộc có Room
  - [ ] Mode ONLINE bắt buộc có URL
  - [ ] Tiêu đề bắt buộc

#### 3.2 Sửa buổi tư vấn

- [ ] **Sửa session**
  - [ ] Click Edit → hiển thị form với dữ liệu cũ
  - [ ] Sửa tiêu đề → Save → cập nhật thành công
  - [ ] Sửa thời gian → re-check conflict → OK nếu không trùng
  - [ ] Sửa thời gian trùng → lỗi 409
  - [ ] Toast "Đã cập nhật. Thông báo đã gửi đến sinh viên."

- [ ] **Notification gửi đến Student**
  - [ ] Sửa session → SV đã đăng ký nhận notification
  - [ ] Notification type = SESSION_UPDATED
  - [ ] Nội dung rõ ràng (thay đổi gì)

- [ ] **Không cho sửa**
  - [ ] Session ONGOING → disable Edit button
  - [ ] Session COMPLETED → disable Edit button
  - [ ] Session CANCELLED → disable Edit button

#### 3.3 Xóa (Hủy) buổi tư vấn

- [ ] **Hủy session**
  - [ ] Click Delete → hiển thị confirm dialog
  - [ ] Confirm "Có" → session.status = CANCELLED
  - [ ] Toast "Đã hủy buổi tư vấn"
  - [ ] Session không hiển thị ở list OPEN (nếu filter)

- [ ] **Notification gửi đến Student**
  - [ ] Hủy session → SV đã đăng ký nhận notification
  - [ ] Notification type = SESSION_CANCELLED

- [ ] **Không cho xóa**
  - [ ] Session COMPLETED → không cho xóa hoặc cảnh báo

#### 3.4 Xem danh sách sinh viên tham gia

- [ ] **Danh sách registrations**
  - [ ] Click "Danh sách tham gia" → hiển thị table
  - [ ] Hiển thị: tên SV, email, khoa, thời gian đăng ký
  - [ ] Số lượng đúng với currentCount
  - [ ] Empty state nếu chưa có ai đăng ký

---

### 4. Session Registration (Student)

#### 4.1 Xem danh sách sessions

- [ ] **Danh sách sessions**
  - [ ] Hiển thị tất cả sessions OPEN
  - [ ] Hiển thị: tiêu đề, tutor, thời gian, địa điểm, slots (5/10)
  - [ ] Status badge rõ ràng (OPEN màu xanh, FULL màu đỏ)
  - [ ] Empty state nếu không có sessions

- [ ] **Filter**
  - [ ] Filter theo subject → chỉ hiển thị sessions có subject đó
  - [ ] Filter theo tutor → chỉ hiển thị sessions của tutor đó
  - [ ] Filter theo thời gian (from-to) → chỉ hiển thị trong khoảng
  - [ ] Clear filter → hiển thị lại tất cả

#### 4.2 Gợi ý tutor

- [ ] **Tutor suggestion**
  - [ ] Click "Gợi ý tutor"
  - [ ] Nhập subject → hiển thị tutors có expertise match
  - [ ] Nhập thời gian → hiển thị tutors có sessions trong thời gian đó
  - [ ] Hiển thị: tên tutor, expertise, bio, office, list sessions
  - [ ] Click tutor → filter sessions theo tutor đó

#### 4.3 Đăng ký buổi tư vấn

- [ ] **Đăng ký thành công**
  - [ ] Click "Tham gia" → hiển thị confirm dialog
  - [ ] Confirm "Có" → đăng ký thành công
  - [ ] Toast "Đăng ký thành công!"
  - [ ] Session xuất hiện trong "Lịch trình của tôi"
  - [ ] currentCount tăng lên 1

- [ ] **Conflict detection - Lịch của Student**
  - [ ] Đăng ký session trùng với session khác đã đăng ký → lỗi 409
  - [ ] Hiển thị message: "Bạn đã có buổi tư vấn khác vào thời gian này"
  - [ ] Hiển thị chi tiết buổi nào trùng

- [ ] **Capacity full**
  - [ ] Session đã FULL (currentCount = capacity) → disable "Tham gia"
  - [ ] Click vẫn không được đăng ký
  - [ ] Hiển thị "Đã đủ người"

- [ ] **Đã đăng ký rồi**
  - [ ] Đăng ký session đã đăng ký → hiển thị "Đã đăng ký"
  - [ ] Disable nút "Tham gia"

- [ ] **Race condition (concurrent)**
  - [ ] 2 SV đăng ký cùng lúc vào slot cuối
  - [ ] 1 người thành công, 1 người nhận lỗi "Đã đủ người"

#### 4.4 Hủy đăng ký

- [ ] **Hủy đăng ký**
  - [ ] Từ "Lịch trình" → click "Hủy đăng ký"
  - [ ] Hiển thị confirm dialog
  - [ ] Confirm "Có" → hủy thành công
  - [ ] Toast "Đã hủy đăng ký"
  - [ ] Session biến mất khỏi "Lịch trình"
  - [ ] currentCount giảm xuống 1

- [ ] **Không cho hủy**
  - [ ] Session ONGOING/COMPLETED → disable "Hủy đăng ký"

---

### 5. Feedback & Rating (Student)

#### 5.1 Tạo feedback

- [ ] **Điều kiện tạo feedback**
  - [ ] Chỉ hiển thị nút "Đánh giá" khi session COMPLETED
  - [ ] Chỉ được đánh giá nếu đã tham gia session
  - [ ] Không tham gia → không thấy nút

- [ ] **Form feedback**
  - [ ] Click "Đánh giá" → mở form
  - [ ] Rating stars 1-5 (bắt buộc)
  - [ ] Comment textarea (optional)
  - [ ] 3 nút: Lưu, Lưu trữ, Hủy

- [ ] **Nút "Lưu" (SAVED)**
  - [ ] Click "Lưu" → gửi feedback
  - [ ] Toast "Cảm ơn bạn đã đánh giá!"
  - [ ] State = SAVED
  - [ ] Không thể chỉnh sửa nữa (hoặc cho chỉnh sửa trong thời gian ngắn)

- [ ] **Nút "Lưu trữ" (DRAFT)**
  - [ ] Click "Lưu trữ" → lưu draft
  - [ ] Toast "Đã lưu nháp"
  - [ ] State = DRAFT
  - [ ] Quay lại sau → form hiển thị nội dung draft
  - [ ] Có thể chỉnh sửa và Lưu sau

- [ ] **Nút "Hủy"**
  - [ ] Click "Hủy" → hiển thị confirm dialog
  - [ ] Confirm "Có" → đóng form, không lưu gì
  - [ ] Confirm "Không" → giữ nguyên form

- [ ] **Validation**
  - [ ] Rating bắt buộc
  - [ ] Rating phải từ 1-5

#### 5.2 Sửa feedback

- [ ] **Chỉnh sửa DRAFT**
  - [ ] Có thể mở lại và chỉnh sửa
  - [ ] Lưu lại → cập nhật DRAFT
  - [ ] Lưu → chuyển sang SAVED

- [ ] **Không cho sửa SAVED**
  - [ ] Feedback đã SAVED → không cho sửa (hoặc chỉ trong 24h)

---

### 6. Notifications

- [ ] **Notification bell**
  - [ ] Hiển thị icon bell ở header
  - [ ] Badge hiển thị số thông báo chưa đọc
  - [ ] Click bell → dropdown hiển thị 5 thông báo gần nhất

- [ ] **Danh sách notifications**
  - [ ] Click "Xem tất cả" → trang Notifications
  - [ ] Hiển thị tất cả thông báo
  - [ ] Thông báo chưa đọc: bold, màu nổi bật
  - [ ] Thông báo đã đọc: màu nhạt

- [ ] **Đánh dấu đã đọc**
  - [ ] Click vào notification → đánh dấu đã đọc
  - [ ] Badge giảm xuống
  - [ ] Notification chuyển sang màu nhạt

- [ ] **Auto-refresh**
  - [ ] Polling mỗi 30s hoặc 1 phút
  - [ ] Có notification mới → badge update

- [ ] **Notification types**
  - [ ] SESSION_UPDATED: "Buổi X đã được cập nhật thời gian/địa điểm"
  - [ ] SESSION_CANCELLED: "Buổi X đã bị hủy"
  - [ ] SESSION_REMINDER: "Buổi X sắp diễn ra trong 1 giờ nữa" (optional)

---

### 7. UI/UX States

#### 7.1 Loading States

- [ ] **API call loading**
  - [ ] Hiển thị spinner khi đang gọi API
  - [ ] Button disable + loading icon khi đang submit
  - [ ] Skeleton loader cho list/cards

#### 7.2 Empty States

- [ ] **Không có data**
  - [ ] Danh sách sessions rỗng → hiển thị "Chưa có buổi tư vấn nào"
  - [ ] Lịch trình rỗng → hiển thị "Bạn chưa đăng ký buổi nào"
  - [ ] Notifications rỗng → hiển thị "Không có thông báo mới"

#### 7.3 Error States

- [ ] **Form validation errors**
  - [ ] Error message hiển thị dưới input bị lỗi
  - [ ] Màu đỏ, rõ ràng
  - [ ] Tiếng Việt

- [ ] **API errors**
  - [ ] 500 server error → toast "Có lỗi xảy ra, vui lòng thử lại"
  - [ ] 404 not found → hiển thị 404 page
  - [ ] Network error → toast "Mất kết nối mạng"

#### 7.4 Disabled States

- [ ] **Button disabled**
  - [ ] Form invalid → Save button disabled
  - [ ] Session FULL → "Tham gia" button disabled
  - [ ] Đã đăng ký → "Tham gia" button disabled
  - [ ] Disabled button có cursor not-allowed, màu xám

---

### 8. Responsive Design

- [ ] **Mobile (< 640px)**
  - [ ] Header collapse → hamburger menu
  - [ ] Form layout 1 cột
  - [ ] Table responsive (scroll hoặc stack)
  - [ ] Modal full-screen

- [ ] **Tablet (641-1024px)**
  - [ ] Sidebar collapse hoặc overlay
  - [ ] Form layout 1-2 cột
  - [ ] Cards grid 2 columns

- [ ] **Desktop (> 1024px)**
  - [ ] Sidebar cố định
  - [ ] Form layout 2 cột
  - [ ] Cards grid 3 columns

---

### 9. Accessibility

- [ ] **Keyboard navigation**
  - [ ] Tab qua các input theo thứ tự
  - [ ] Enter để submit form
  - [ ] Esc để đóng modal

- [ ] **Focus states**
  - [ ] Input focus → border highlight
  - [ ] Button focus → outline rõ ràng

- [ ] **ARIA labels**
  - [ ] Icon-only button có aria-label
  - [ ] Modal có role="dialog"

---

### 10. Session State Machine

- [ ] **OPEN → FULL**
  - [ ] currentCount đạt capacity → auto chuyển FULL
  - [ ] FULL → không đăng ký được nữa

- [ ] **OPEN → PENDING**
  - [ ] Gần tới giờ (30 phút trước?) → chuyển PENDING (optional)
  - [ ] Hoặc không implement PENDING

- [ ] **PENDING → ONGOING**
  - [ ] Tới giờ startAt → chuyển ONGOING (optional, có thể dùng cron job)

- [ ] **ONGOING → COMPLETED**
  - [ ] Tới giờ endAt → chuyển COMPLETED (optional, có thể dùng cron job)

- [ ] **Any → CANCELLED**
  - [ ] Tutor xóa → CANCELLED
  - [ ] CANCELLED → không thể đăng ký/hủy/feedback

---

### 11. Data Integrity

- [ ] **Unique constraints**
  - [ ] (sessionId, studentId) unique trong registrations
  - [ ] Email unique trong users
  - [ ] (sessionId, studentId) unique trong feedback

- [ ] **Datetime constraints**
  - [ ] startAt < endAt
  - [ ] DOB < current date

- [ ] **Number constraints**
  - [ ] Capacity >= 1
  - [ ] currentCount <= capacity
  - [ ] Rating 1-5

---

### 12. Edge Cases

- [ ] **Concurrent registration**
  - [ ] 2 users đăng ký cùng lúc → 1 thành công, 1 lỗi
  - [ ] Sử dụng lock mechanism hoặc check trước khi insert

- [ ] **Tutor tự đăng ký session của mình**
  - [ ] Có cho phép không? (quyết định business)
  - [ ] Nếu không → hiển thị lỗi

- [ ] **Sửa session khi đã có người đăng ký**
  - [ ] Cho phép sửa
  - [ ] Gửi notification đến tất cả SV đã đăng ký

- [ ] **Xóa user đã có sessions/registrations**
  - [ ] Không implement xóa user (soft delete)
  - [ ] Hoặc cascade delete (không recommend)

---

### 13. Performance

- [ ] **List pagination**
  - [ ] Danh sách sessions phân trang (10-20 items/page)
  - [ ] Hoặc infinite scroll

- [ ] **API caching**
  - [ ] Dùng React Query cache
  - [ ] Stale time hợp lý (1-5 phút)

- [ ] **Optimistic updates**
  - [ ] Đăng ký/hủy đăng ký → update UI ngay, rollback nếu lỗi

---

### 14. Security

- [ ] **JWT expiration**
  - [ ] Token hết hạn → redirect login
  - [ ] Refresh token (optional, nâng cao)

- [ ] **Input sanitization**
  - [ ] XSS protection (React tự động escape)
  - [ ] SQL injection không có (dùng JSON, không có SQL)

- [ ] **RBAC**
  - [ ] Tutor không truy cập được student routes
  - [ ] Student không tạo/sửa/xóa sessions

---

## ✅ CHECKLIST TÓM TẮT

### Critical (Phải có)
- [x] Authentication & authorization hoạt động
- [x] Tutor tạo/sửa/xóa session
- [x] Conflict detection (lịch, phòng)
- [x] Student đăng ký/hủy đăng ký
- [x] Capacity control
- [x] Feedback sau COMPLETED
- [x] Notifications khi sửa/xóa

### High Priority (Nên có)
- [x] Profile management
- [x] Tutor suggestion
- [x] Filter sessions
- [x] Responsive design
- [x] Loading/Empty/Error states
- [x] Form validation

### Medium Priority (Có thể có)
- [ ] Notification auto-refresh
- [ ] Session state machine auto-transition (ONGOING, COMPLETED)
- [ ] Calendar view
- [ ] Export schedule (PDF/iCal)

### Low Priority (Nâng cao)
- [ ] Email notifications (ngoài in-app)
- [ ] Real-time updates (WebSocket)
- [ ] Advanced search
- [ ] Analytics/statistics

---

## 🧪 TESTING PROCESS

1. **Manual Testing**
   - Test theo từng module
   - Test theo user flow (Student flow, Tutor flow)
   - Test cross-browser (Chrome, Firefox, Safari)
   - Test responsive (mobile, tablet, desktop)

2. **Automated Testing** (Optional)
   - Unit test: các utils, services
   - Integration test: API endpoints
   - E2E test: user flows với Cypress/Playwright

3. **User Acceptance Testing**
   - Demo cho stakeholders
   - Thu thập feedback
   - Fix bugs

---

## 📝 BUG REPORT TEMPLATE

```
**Tiêu đề:** [Module] Mô tả ngắn gọn bug

**Mô tả:**
- Tôi đang: [action]
- Tôi mong đợi: [expected]
- Nhưng thực tế: [actual]

**Các bước tái hiện:**
1. Đăng nhập với role X
2. Click vào Y
3. Điền Z
4. ...

**Screenshots:**
[attach ảnh]

**Môi trường:**
- Browser: Chrome 120
- Device: Desktop / Mobile
- OS: Windows 11

**Mức độ:**
- [ ] Critical: Hệ thống không dùng được
- [ ] High: Tính năng chính bị lỗi
- [ ] Medium: Tính năng phụ bị lỗi
- [ ] Low: UI/UX nhỏ
```

---

Hoàn thành checklist này = hệ thống sẵn sàng demo/deploy! 🚀



