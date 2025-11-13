# COMPONENT LIBRARY - REACT COMPONENTS

Thư viện components chuẩn hóa để sử dụng trong toàn bộ ứng dụng

---

## 📦 1. FORM COMPONENTS

### Button Component

**File:** `src/components/common/Button.js`

**Props:**
```typescript
{
  variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  disabled: boolean = false,
  loading: boolean = false,
  fullWidth: boolean = false,
  onClick: (e: Event) => void,
  type: 'button' | 'submit' | 'reset' = 'button',
  children: ReactNode
}
```

**Usage:**
```jsx
<Button variant="primary" onClick={handleSubmit}>
  Lưu
</Button>

<Button variant="danger" loading={isDeleting}>
  Xóa
</Button>

<Button variant="ghost" size="sm">
  Hủy
</Button>
```

**States:**
- Default: màu chủ đạo
- Hover: màu đậm hơn
- Disabled: màu xám, cursor not-allowed
- Loading: hiển thị spinner, disable click

---

### Input Component

**File:** `src/components/common/Input.js`

**Props:**
```typescript
{
  type: 'text' | 'email' | 'password' | 'number' | 'tel' = 'text',
  name: string,
  value: string,
  onChange: (e: Event) => void,
  label: string,
  placeholder: string,
  error: string,
  required: boolean = false,
  disabled: boolean = false,
  autoComplete: string
}
```

**Usage:**
```jsx
<Input
  label="Email"
  type="email"
  name="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  required
/>
```

---

### Select Component

**File:** `src/components/common/Select.js`

**Props:**
```typescript
{
  name: string,
  value: string,
  onChange: (e: Event) => void,
  options: Array<{ value: string, label: string }>,
  label: string,
  error: string,
  required: boolean = false,
  disabled: boolean = false,
  placeholder: string = 'Chọn...'
}
```

**Usage:**
```jsx
<Select
  label="Giới tính"
  name="gender"
  value={gender}
  onChange={(e) => setGender(e.target.value)}
  options={[
    { value: 'MALE', label: 'Nam' },
    { value: 'FEMALE', label: 'Nữ' },
    { value: 'OTHER', label: 'Khác' }
  ]}
/>
```

---

### TextArea Component

**File:** `src/components/common/TextArea.js`

**Props:**
```typescript
{
  name: string,
  value: string,
  onChange: (e: Event) => void,
  label: string,
  placeholder: string,
  error: string,
  rows: number = 4,
  required: boolean = false,
  disabled: boolean = false,
  maxLength: number
}
```

---

### DateTimePicker Component

**File:** `src/components/common/DateTimePicker.js`

**Props:**
```typescript
{
  name: string,
  value: string (ISO datetime),
  onChange: (value: string) => void,
  label: string,
  error: string,
  required: boolean = false,
  disabled: boolean = false,
  minDate: string,
  maxDate: string
}
```

**Usage:**
```jsx
<DateTimePicker
  label="Thời gian bắt đầu"
  value={startAt}
  onChange={setStartAt}
  minDate={new Date().toISOString()}
/>
```

---

### FormGroup Component

**File:** `src/components/common/FormGroup.js`

**Props:**
```typescript
{
  label: string,
  required: boolean = false,
  error: string,
  children: ReactNode
}
```

**Usage:**
```jsx
<FormGroup label="Email" required error={errors.email}>
  <input type="email" value={email} onChange={...} />
</FormGroup>
```

---

## 📦 2. UI COMPONENTS

### Modal Component

**File:** `src/components/common/Modal.js`

**Props:**
```typescript
{
  isOpen: boolean,
  onClose: () => void,
  title: string,
  size: 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md',
  children: ReactNode,
  footer: ReactNode,
  closeOnOverlayClick: boolean = true,
  showCloseButton: boolean = true
}
```

**Usage:**
```jsx
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Tạo buổi tư vấn"
  size="lg"
  footer={
    <>
      <Button variant="ghost" onClick={handleCancel}>Hủy</Button>
      <Button variant="primary" onClick={handleSubmit}>Lưu</Button>
    </>
  }
>
  <SessionForm />
</Modal>
```

---

### ConfirmDialog Component

**File:** `src/components/common/ConfirmDialog.js`

**Props:**
```typescript
{
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  title: string,
  message: string,
  confirmText: string = 'Xác nhận',
  cancelText: string = 'Hủy',
  variant: 'primary' | 'danger' = 'primary'
}
```

**Usage:**
```jsx
<ConfirmDialog
  isOpen={showDeleteConfirm}
  onClose={() => setShowDeleteConfirm(false)}
  onConfirm={handleDelete}
  title="Xác nhận xóa"
  message="Bạn có chắc muốn xóa buổi tư vấn này?"
  confirmText="Xóa"
  cancelText="Hủy"
  variant="danger"
/>
```

---

### Toast Component

**File:** `src/components/common/Toast.js`

**Props:**
```typescript
{
  type: 'success' | 'error' | 'info' | 'warning',
  message: string,
  duration: number = 3000,
  onClose: () => void
}
```

**Usage (với Context):**
```jsx
// ToastContext.js
const { showToast } = useToast();

showToast({
  type: 'success',
  message: 'Đăng ký thành công!'
});
```

---

### Card Component

**File:** `src/components/common/Card.js`

**Props:**
```typescript
{
  title: string,
  subtitle: string,
  children: ReactNode,
  footer: ReactNode,
  onClick: () => void,
  hoverable: boolean = false,
  className: string
}
```

**Usage:**
```jsx
<Card
  title="Thống kê"
  hoverable
  footer={<Button>Xem thêm</Button>}
>
  <p>Số buổi đã tham gia: 10</p>
</Card>
```

---

### Badge Component

**File:** `src/components/common/Badge.js`

**Props:**
```typescript
{
  variant: 'success' | 'warning' | 'danger' | 'info' | 'default',
  children: ReactNode,
  size: 'sm' | 'md' | 'lg' = 'md'
}
```

**Usage:**
```jsx
<Badge variant="success">OPEN</Badge>
<Badge variant="danger">FULL</Badge>
<Badge variant="warning">PENDING</Badge>
```

**Mapping Status → Badge Variant:**
```javascript
const statusVariant = {
  OPEN: 'success',
  FULL: 'danger',
  PENDING: 'warning',
  ONGOING: 'info',
  COMPLETED: 'default',
  CANCELLED: 'danger'
};
```

---

### Spinner Component

**File:** `src/components/common/Spinner.js`

**Props:**
```typescript
{
  size: 'sm' | 'md' | 'lg' = 'md',
  color: string = 'primary',
  fullScreen: boolean = false
}
```

**Usage:**
```jsx
<Spinner size="lg" fullScreen />
```

---

### Skeleton Component

**File:** `src/components/common/Skeleton.js`

**Props:**
```typescript
{
  type: 'text' | 'circle' | 'rect',
  width: string,
  height: string,
  count: number = 1
}
```

**Usage:**
```jsx
<Skeleton type="text" width="100%" count={3} />
<Skeleton type="rect" width="300px" height="200px" />
```

---

### EmptyState Component

**File:** `src/components/common/EmptyState.js`

**Props:**
```typescript
{
  icon: ReactNode,
  title: string,
  message: string,
  action: ReactNode
}
```

**Usage:**
```jsx
<EmptyState
  icon={<CalendarIcon />}
  title="Chưa có buổi tư vấn nào"
  message="Bạn chưa đăng ký buổi tư vấn nào. Hãy khám phá các buổi tư vấn có sẵn!"
  action={<Button onClick={goToSessions}>Xem buổi tư vấn</Button>}
/>
```

---

## 📦 3. DATA DISPLAY COMPONENTS

### DataTable Component

**File:** `src/components/common/DataTable.js`

**Props:**
```typescript
{
  columns: Array<{
    key: string,
    label: string,
    render?: (value, row) => ReactNode
  }>,
  data: Array<Object>,
  loading: boolean = false,
  emptyMessage: string = 'Không có dữ liệu',
  pagination: {
    page: number,
    pageSize: number,
    total: number,
    onPageChange: (page: number) => void
  }
}
```

**Usage:**
```jsx
<DataTable
  columns={[
    { key: 'name', label: 'Họ tên' },
    { key: 'email', label: 'Email' },
    { 
      key: 'status', 
      label: 'Trạng thái',
      render: (status) => <Badge variant={statusVariant[status]}>{status}</Badge>
    }
  ]}
  data={students}
  loading={isLoading}
/>
```

---

### SessionCard Component

**File:** `src/components/SessionCard.js`

**Props:**
```typescript
{
  session: {
    id: string,
    title: string,
    description: string,
    tutor: { name: string },
    startAt: string,
    endAt: string,
    mode: string,
    room: string,
    url: string,
    capacity: number,
    currentCount: number,
    status: string,
    subjects: Array<string>
  },
  onRegister: (sessionId: string) => void,
  onViewDetail: (sessionId: string) => void,
  isRegistered: boolean = false,
  showActions: boolean = true
}
```

**Usage:**
```jsx
<SessionCard
  session={session}
  onRegister={handleRegister}
  onViewDetail={handleViewDetail}
  isRegistered={false}
/>
```

---

### UserAvatar Component

**File:** `src/components/common/UserAvatar.js`

**Props:**
```typescript
{
  name: string,
  size: 'sm' | 'md' | 'lg' = 'md',
  src: string (image URL, optional)
}
```

**Usage:**
```jsx
<UserAvatar name="Nguyễn Văn A" size="md" />
```

**Logic:**
- Nếu có `src` → hiển thị ảnh
- Nếu không → hiển thị initials (e.g. "Nguyễn Văn A" → "NVA")

---

### StatusBadge Component

**File:** `src/components/common/StatusBadge.js`

**Props:**
```typescript
{
  status: string,
  type: 'session' | 'registration' | 'feedback'
}
```

**Usage:**
```jsx
<StatusBadge status="OPEN" type="session" />
```

**Mapping:**
```javascript
const sessionStatus = {
  OPEN: { label: 'Đang mở', variant: 'success' },
  FULL: { label: 'Đã đủ', variant: 'danger' },
  PENDING: { label: 'Chờ diễn ra', variant: 'warning' },
  ONGOING: { label: 'Đang diễn ra', variant: 'info' },
  COMPLETED: { label: 'Hoàn thành', variant: 'default' },
  CANCELLED: { label: 'Đã hủy', variant: 'danger' }
};
```

---

## 📦 4. LAYOUT COMPONENTS

### Header Component

**File:** `src/components/Layout/Header.js`

**Props:**
```typescript
{
  user: {
    name: string,
    role: string
  },
  onLogout: () => void
}
```

**Elements:**
- Logo (link về trang chủ)
- User info dropdown
- Notification bell
- Logout button

---

### Sidebar Component

**File:** `src/components/Layout/Sidebar.js`

**Props:**
```typescript
{
  role: 'STUDENT' | 'TUTOR',
  currentPath: string
}
```

**Student Menu:**
- Dashboard
- Tìm buổi tư vấn
- Lịch trình của tôi
- Thông báo
- Profile

**Tutor Menu:**
- Dashboard
- Quản lý buổi tư vấn
- Tạo buổi tư vấn
- Thông báo
- Profile

---

### MainLayout Component

**File:** `src/components/Layout/MainLayout.js`

**Props:**
```typescript
{
  children: ReactNode
}
```

**Structure:**
```
+-------------------+
|      Header       |
+------+------------+
| Side |            |
| bar  |   Content  |
|      |            |
+------+------------+
```

---

## 📦 5. DOMAIN-SPECIFIC COMPONENTS

### TutorSuggestion Component

**File:** `src/components/student/TutorSuggestion.js`

**Props:**
```typescript
{
  onSelectTutor: (tutorId: string) => void
}
```

**Features:**
- Input subject
- Input time range
- Hiển thị danh sách tutors match
- Click tutor → filter sessions

---

### SessionForm Component

**File:** `src/components/tutor/SessionForm.js`

**Props:**
```typescript
{
  initialData: Session (optional, for edit mode),
  onSubmit: (data: Session) => void,
  onCancel: () => void
}
```

**Fields:**
- Tiêu đề (required)
- Mô tả
- Mode (offline/online)
- Room/URL (conditional)
- Start time (required)
- End time (required)
- Capacity (required, >= 1)
- Subjects (array)

---

### RegistrationTable Component

**File:** `src/components/tutor/RegistrationTable.js`

**Props:**
```typescript
{
  sessionId: string
}
```

**Features:**
- Fetch registrations
- Display: STT, Họ tên, Email, Khoa, Thời gian đăng ký
- Empty state

---

### FeedbackForm Component

**File:** `src/components/student/FeedbackForm.js`

**Props:**
```typescript
{
  sessionId: string,
  initialData: Feedback (optional, for draft),
  onSubmit: (data: Feedback) => void,
  onSaveDraft: (data: Feedback) => void,
  onCancel: () => void
}
```

**Fields:**
- Rating (1-5 stars, required)
- Comment (textarea, optional)

**Actions:**
- Lưu (submit SAVED)
- Lưu trữ (submit DRAFT)
- Hủy (confirm dialog)

---

### NotificationBell Component

**File:** `src/components/notification/NotificationBell.js`

**Features:**
- Icon bell
- Badge (unread count)
- Click → dropdown với 5 notifications gần nhất
- "Xem tất cả" link

---

### NotificationItem Component

**File:** `src/components/notification/NotificationItem.js`

**Props:**
```typescript
{
  notification: {
    id: string,
    type: string,
    payload: object,
    readAt: string,
    createdAt: string
  },
  onClick: (id: string) => void
}
```

---

## 🎨 DESIGN TOKENS (Reference)

### Colors
```css
--primary: #1976d2;
--secondary: #6c757d;
--success: #28a745;
--danger: #dc3545;
--warning: #ffc107;
--info: #17a2b8;
--light: #f8f9fa;
--dark: #343a40;
```

### Spacing
```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

### Typography
```css
--font-family: 'Inter', 'Segoe UI', sans-serif;
--font-size-sm: 12px;
--font-size-md: 14px;
--font-size-lg: 16px;
--font-size-xl: 18px;
--font-size-2xl: 24px;
```

### Border Radius
```css
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-full: 9999px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

---

Tất cả components đều phải:
✅ Responsive
✅ Accessible (ARIA labels)
✅ Có loading/error states
✅ Có PropTypes validation (hoặc TypeScript)
✅ Có storybook/documentation (optional)



