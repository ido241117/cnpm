Ok mình đã đọc file. Dưới đây là checklist cô đọng nhưng đủ “triển khai được ngay”, bám theo 5 use-case trong tài liệu, kèm các hạng mục để MCP có thể bám Figma và build/deploy web.

Tổng quan nhanh
- Actor: Student (SV), Tutor
- Use-cases: 
  1) Quản lý thông tin
  2) Tạo buổi tư vấn (+ xem danh sách tham gia)
  3) Thay đổi lịch (sửa/xóa, thông báo)
  4) Đăng ký buổi tư vấn (lọc theo tutor, gợi ý theo chuyên ngành/thời gian, chống trùng lịch)
  5) Phản hồi & đánh giá (lưu/lưu trữ/hủy)
- Điểm mấu chốt kỹ thuật: 
  - Xung đột lịch (của Tutor và của Student)
  - Xung đột phòng -> chuyển Online
  - Trạng thái buổi tư vấn (state machine)
  - Quyền truy cập theo vai trò
  - Thông báo (in-app/email) khi sửa/xóa

Checklist chung (trước khi code + đồng bộ Figma)
- Figma handoff
  - Thiết lập Design tokens: màu, font, spacing, radii, shadows, breakpoints.
  - Export assets (logo, icon), cấu hình biến thể component (Button: default/hover/disabled/loading; Input: normal/error).
  - Rà soát tất cả state: loading/empty/error/success/confirm modal.
  - Mapping màn hình → route: 
    - / (home SV), /profile, /tutor (home Tutor), /sessions, /sessions/:id, /schedule, /feedback, /admin (nếu có).
- Quyền & điều hướng
  - RBAC: Student, Tutor (có thể thêm Admin sau).
  - Route guards: chỉ Tutor được tạo/sửa/xóa buổi; Student đăng ký/hủy.
- Dữ liệu & đồng bộ UI
  - Quy ước format datetime (UTC trong DB, localize trên UI).
  - Validation thống nhất theo Figma (error message cụ thể từng field).
- Công nghệ đề xuất (nhanh để deploy)
  - Frontend: Next.js + React Query/TanStack Query + Tailwind/Chakra + shadcn (tùy team).
  - Backend: NestJS/Express hoặc Supabase/Firebase (nếu muốn tăng tốc).
  - DB: Postgres (Supabase/Neon) hoặc MySQL.
  - Auth: JWT hoặc Supabase Auth (hoặc SSO BK nếu có).
  - Deploy: Vercel (FE), Render/Railway/Fly (BE), Supabase DB.
- Phi chức năng
  - Kiểm thử: unit + e2e (Playwright/Cypress).
  - Logging/Audit: log các thao tác tạo/sửa/xóa, đăng ký/hủy.
  - Accessibility cơ bản: focus state, aria-label, tương phản.
  - I18n: vi- VN trước, chuẩn bị sẵn file messages.

Mô hình dữ liệu tối thiểu (có thể map sang Prisma/SQL)
- users(id, role: 'STUDENT'|'TUTOR', name, email, phone, gender, dob, faculty, created_at)
- tutor_profiles(user_id PK/FK, expertise[], bio, office_room)
- sessions(id, tutor_id FK→users, title, description, mode: 'offline'|'online', room, url, start_at, end_at, capacity, status: 'OPEN'|'FULL'|'PENDING'|'ONGOING'|'COMPLETED'|'CANCELLED', created_at, updated_at)
- registrations(id, session_id FK, student_id FK, created_at, status: 'JOINED'|'CANCELLED')
- feedback(id, session_id FK, student_id FK, rating 1-5, comment, state: 'DRAFT'|'SAVED'|'SEEN', created_at, updated_at)
- notifications(id, user_id, type, payload JSON, read_at, created_at)
- rooms(id, name, location) [optional nếu quản lý phòng]
- subjects(id, name) + tutor_subjects(tutor_id, subject_id) [phục vụ gợi ý]

API contract tối thiểu
- Auth: POST /auth/login; GET /auth/me
- Profile:
  - GET /me; PATCH /me
  - GET /tutors/:id (public info); PATCH /tutors/me (nếu tách profile)
- Sessions (Tutor):
  - POST /sessions
  - GET /sessions?mine=true (của Tutor)
  - PATCH /sessions/:id
  - DELETE /sessions/:id
  - GET /sessions/:id/registrations
- Sessions (Student):
  - GET /sessions?subject=&tutor=&from=&to=
  - POST /sessions/:id/register
  - DELETE /sessions/:id/register (hủy)
- Suggestion:
  - GET /tutors?suggest=true&subject=&from=&to=
- Feedback:
  - POST /sessions/:id/feedback (create or save)
  - PATCH /feedback/:id (update state: draft→saved)
  - GET /feedback?mine=true
- Notifications:
  - GET /notifications; PATCH /notifications/:id/read

Checklist theo từng module

1) Quản lý thông tin
- UI/Flow
  - Xem thông tin theo vai trò.
  - Edit → Save/Cancel → Confirm modal → Success toast.
- Validation
  - Email hợp lệ, phone 10-11 số, DOB < hiện tại, bắt buộc khoa/họ tên.
  - Tutor: ít nhất 1 expertise nếu bật “muốn làm tutor”.
- API
  - GET /me hiển thị toàn bộ trường.
  - PATCH /me với các field cho phép sửa; reject nếu role không hợp lệ.
- DB
  - users + tutor_profiles (nullable khi SV chưa là tutor).
- Test/AC
  - Lưu thành công cập nhật UI ngay.
  - Cancel không thay đổi dữ liệu.
  - Không cho SV đổi role thành tutor nếu thiếu expertise.

2) Tạo buổi tư vấn (và xem danh sách tham gia)
- UI/Flow
  - Form: tiêu đề, mô tả, mode, room/url, thời gian, capacity.
  - Save/Cancel; nếu offline và phòng bận → modal hỏi chuyển online, yêu cầu nhập URL.
  - “Thông tin khác” → “Danh sách tham gia”.
- Validation
  - start_at < end_at; capacity >= 1; mode offline requires room; online requires url hợp lệ.
- Conflict checks
  - Trùng lịch của Tutor (overlap [start,end]) → chặn.
  - Trùng phòng (offline) → gợi ý chuyển online.
- API
  - POST /sessions (server làm conflict check).
  - GET /sessions/:id/registrations để render bảng SV tham gia.
- DB
  - sessions + rooms (nếu quản lý).
- Test/AC
  - Tạo offline trùng phòng → hiển thị modal chuyển online.
  - Tạo trùng lịch tutor → 409 Conflict với message rõ ràng.

3) Thay đổi lịch (sửa/xóa)
- UI/Flow
  - Trang lịch Tutor → click một session → modal edit: Save, Delete, Cancel.
  - Delete → modal confirm; Save thành công → thông báo; gửi thông báo đến SV.
- Validation & logic
  - Không cho sửa khi status là ONGOING/COMPLETED/CANCELLED.
  - Khi sửa thời gian/địa điểm: re-check conflict.
- API
  - PATCH /sessions/:id (partial update).
  - DELETE /sessions/:id (chuyển status CANCELLED).
  - Service gửi notifications đến SV đã đăng ký.
- DB
  - sessions.status; notifications.
- Test/AC
  - Cập nhật thất bại → giữ nguyên modal và error; thành công → close + refresh.
  - Xóa: session status đổi sang CANCELLED; SV nhận thông báo.

4) Đăng ký buổi tư vấn (Student)
- UI/Flow
  - Trang đăng ký: list session có thể đăng ký; nút “Chọn tutor”.
  - “Chọn tutor”: nhập tên/mã hoặc “Gợi ý tutor” (lọc theo chuyên ngành + thời gian).
  - Chọn lớp → trang chi tiết → Tham gia/Trở lại → thành công/ trùng lịch/ lỗi.
- Business rules
  - Không cho đăng ký nếu FULL hoặc CANCELLED.
  - Check trùng lịch với các session JOINED khác của SV.
  - Khi full → auto set session.status = FULL.
- API
  - GET /tutors?suggest=...; GET /sessions?subject=&tutor=&from=&to=
  - POST /sessions/:id/register
- DB
  - registrations(status=JOINED); unique (session_id, student_id).
- Test/AC
  - Trùng lịch → báo rõ slot nào trùng.
  - Cạnh tranh: 2 SV đăng ký cuối cùng → một người nhận 409 FULL.

5) Phản hồi & đánh giá
- UI/Flow
  - Từ Lịch trình SV → Đánh giá (chỉ sau COMPLETED).
  - Form rating 1-5 + comment; nút Lưu (submit), Lưu trữ (draft), Hủy (confirm).
- Rules
  - Mỗi SV 1 feedback/session; chỉ cho tạo khi SV đã tham gia session và session COMPLETED.
- API
  - POST /sessions/:id/feedback (state=‘SAVED’); hoặc state=‘DRAFT’.
  - PATCH /feedback/:id (update state hoặc nội dung draft→saved).
- DB
  - feedback(state: DRAFT|SAVED|SEEN).
- Test/AC
  - Hủy → confirm → không lưu gì; Lưu trữ → có thể sửa tiếp; Lưu → hiển thị message “ghi nhận”.

Checklist kỹ thuật khi bám Figma để implement
- Component inventory
  - Header, Navbar/Sidebar, ProfileCard, SessionCard, DataTable (registrations), Modal (confirm, form), Form controls (Input, Select, DateTimePicker), Toast/Alert.
- States bắt buộc có
  - Loading skeleton cho list/cards/forms.
  - Empty state: không có lớp/không có feedback.
  - Error state: server error, validation error.
  - Disabled state: nút Save khi form invalid.
- Date/Time
  - Dùng DateTime picker đồng nhất; timezone: lưu UTC, hiển thị local.
- Form & Validation
  - Zod/Yup schema; hiển thị error dưới từng input (theo Figma).
- Responsive
  - Breakpoints: mobile <640, tablet 641–1024, desktop >1024; test 3 cỡ.
- Accessibility
  - Focus ring rõ ràng; aria-label cho icon-only; modal trap focus.
- Copy & i18n
  - Text theo tài liệu (Oke → OK), thông báo tiếng Việt nhất quán.
- Điều hướng
  - Logo về trang chủ; nút “Thoát” quay về trang Đăng ký; Back hoạt động đúng như mô tả.

Checklist triển khai backend
- Ràng buộc DB
  - Unique (session_id, student_id) trên registrations.
  - Check: sessions.start_at < end_at; capacity >= 1.
  - Index: sessions(tutor_id, start_at, end_at), registrations(student_id), feedback(session_id).
- Giao dịch & cạnh tranh
  - Đăng ký: transaction tăng số lượng, kiểm tra capacity, lock row (SELECT ... FOR UPDATE) để tránh overbook.
- Conflict detection
  - Overlap: tồn tại session khác với (start_at < new_end && end_at > new_start).
- Notification
  - Sau PATCH/DELETE sessions: tạo notification records; optionally gửi email.
- Bảo mật
  - RBAC middleware: Tutor-only cho POST/PATCH/DELETE /sessions.
  - Input sanitization; rate-limit cho register.
- Observability
  - Log event: create/update/cancel session; register/unregister; create feedback.

Checklist deploy
- Frontend
  - Env: NEXT_PUBLIC_API_BASE_URL; NEXTAUTH_SECRET (nếu dùng).
  - Build trên Vercel; cấu hình rewrites proxy API nếu cùng domain.
- Backend
  - Env: DATABASE_URL, JWT_SECRET, SMTP_*, ALLOWED_ORIGINS.
  - Migrate DB (Prisma migrate/SQL).
  - Deploy Render/Railway; bật CORS cho FE domain.
- Domain & HTTPS
  - Cấu hình custom domain (nếu có), SSL auto.
- CI/CD
  - GitHub Actions: lint/test/build; auto-deploy on main.
- Giám sát
  - Health check endpoint; uptime monitor (UptimeRobot).

Acceptance checklist (end-to-end)
- Tutor không thể tạo buổi trùng giờ hoặc phòng trùng (offline).
- Tutor sửa/xóa: SV đã đăng ký nhận thông báo.
- Student đăng ký: 
  - Gợi ý tutor hoạt động đúng theo chuyên ngành + thời gian.
  - Không trùng lịch, không vượt capacity.
  - Thành công hiển thị toast + session vào lịch trình SV.
- State machine buổi tư vấn:
  - OPEN → FULL khi đủ; tới hạn đăng ký → PENDING/“Chờ diễn ra”; tới giờ → ONGOING; kết thúc → COMPLETED; hủy → CANCELLED.
- Feedback:
  - Chỉ sau COMPLETED; lưu/lưu trữ/hủy đúng như flow; Tutor xem → state = SEEN (nếu có).
- UI
  - Tất cả modal/confirm và đường tắt (Logo/Thoát/Back) đúng như mô tả.
