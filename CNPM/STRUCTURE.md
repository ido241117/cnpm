# CẤU TRÚC THƯ MỤC CHI TIẾT

## 📁 Backend Structure

```
backend/
├── src/
│   ├── server.js                    # Entry point
│   │
│   ├── config/
│   │   ├── index.js                 # Config loader
│   │   └── constants.js             # Constants (roles, status)
│   │
│   ├── middlewares/
│   │   ├── auth.js                  # JWT authentication
│   │   ├── rbac.js                  # Role-based access control
│   │   ├── errorHandler.js          # Global error handler
│   │   └── validator.js             # Request validation
│   │
│   ├── services/
│   │   ├── dataService.js           # JSON file CRUD operations
│   │   ├── conflictService.js       # Schedule & room conflict detection
│   │   ├── notificationService.js   # Create notifications
│   │   └── suggestionService.js     # Tutor suggestion algorithm
│   │
│   ├── controllers/
│   │   ├── authController.js        # Login, register, me
│   │   ├── userController.js        # Profile management
│   │   ├── sessionController.js     # Session CRUD (Tutor)
│   │   ├── registrationController.js # Session registration (Student)
│   │   ├── feedbackController.js    # Feedback management
│   │   └── notificationController.js # Notification endpoints
│   │
│   ├── validators/
│   │   ├── authValidator.js         # Login/register validation
│   │   ├── userValidator.js         # Profile validation
│   │   ├── sessionValidator.js      # Session validation
│   │   └── feedbackValidator.js     # Feedback validation
│   │
│   ├── utils/
│   │   ├── jwt.js                   # JWT generate/verify
│   │   ├── datetime.js              # DateTime helpers
│   │   ├── response.js              # Standard response format
│   │   └── logger.js                # Logging utility
│   │
│   └── routes/
│       ├── index.js                 # Route aggregator
│       ├── auth.routes.js
│       ├── user.routes.js
│       ├── session.routes.js
│       ├── registration.routes.js
│       ├── feedback.routes.js
│       └── notification.routes.js
│
├── data/                            # JSON Database
│   ├── users.json                   # Users (students + tutors)
│   ├── sessions.json                # Counseling sessions
│   ├── registrations.json           # Student registrations
│   ├── feedback.json                # Feedback & ratings
│   ├── notifications.json           # Notifications
│   └── rooms.json                   # Rooms (optional)
│
├── .env                             # Environment variables
├── .gitignore
└── package.json
```

---

## 📁 Frontend Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── assets/
│       ├── logo.png
│       └── icons/
│
├── src/
│   ├── App.js                       # Root component
│   ├── index.js                     # Entry point
│   │
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.js            # Top header with logo, user, logout
│   │   │   ├── Sidebar.js           # Navigation sidebar
│   │   │   ├── MainLayout.js        # Layout wrapper
│   │   │   └── Footer.js            # Footer (optional)
│   │   │
│   │   ├── common/                  # Reusable components
│   │   │   ├── Button.js            # Button variants
│   │   │   ├── Input.js             # Text input
│   │   │   ├── Select.js            # Dropdown select
│   │   │   ├── TextArea.js          # Textarea
│   │   │   ├── DateTimePicker.js    # Date & time picker
│   │   │   ├── FormGroup.js         # Label + Input + Error
│   │   │   ├── Modal.js             # Modal dialog
│   │   │   ├── Toast.js             # Toast notification
│   │   │   ├── Card.js              # Card container
│   │   │   ├── Badge.js             # Status badge
│   │   │   ├── Spinner.js           # Loading spinner
│   │   │   ├── Skeleton.js          # Loading skeleton
│   │   │   ├── EmptyState.js        # No data state
│   │   │   ├── DataTable.js         # Table with pagination
│   │   │   └── ConfirmDialog.js     # Confirmation dialog
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.js         # Login form
│   │   │   ├── RegisterForm.js      # Register form
│   │   │   └── PrivateRoute.js      # Protected route wrapper
│   │   │
│   │   ├── student/
│   │   │   ├── SessionCard.js       # Session card for list
│   │   │   ├── TutorSuggestion.js   # Tutor suggestion widget
│   │   │   ├── ScheduleCalendar.js  # Calendar view
│   │   │   └── FeedbackForm.js      # Feedback form
│   │   │
│   │   ├── tutor/
│   │   │   ├── SessionForm.js       # Create/Edit session form
│   │   │   ├── SessionDetailCard.js # Session detail with actions
│   │   │   ├── RegistrationTable.js # Student registration table
│   │   │   └── ConflictModal.js     # Conflict resolution modal
│   │   │
│   │   ├── profile/
│   │   │   ├── ProfileCard.js       # Profile display card
│   │   │   ├── ProfileEditForm.js   # Profile edit form
│   │   │   └── TutorProfileForm.js  # Tutor-specific fields
│   │   │
│   │   └── notification/
│   │       ├── NotificationBell.js  # Bell icon with badge
│   │       ├── NotificationItem.js  # Single notification
│   │       └── NotificationList.js  # List of notifications
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.js
│   │   │   └── Register.js
│   │   │
│   │   ├── student/
│   │   │   ├── Dashboard.js         # Student home
│   │   │   ├── SessionList.js       # Browse sessions
│   │   │   ├── SessionDetail.js     # Session detail & register
│   │   │   ├── Schedule.js          # My schedule
│   │   │   └── Feedback.js          # Submit feedback
│   │   │
│   │   ├── tutor/
│   │   │   ├── Dashboard.js         # Tutor home
│   │   │   ├── CreateSession.js     # Create new session
│   │   │   ├── ManageSessions.js    # List of my sessions
│   │   │   ├── EditSession.js       # Edit session
│   │   │   └── ViewRegistrations.js # Students who registered
│   │   │
│   │   ├── Profile.js               # User profile
│   │   ├── Notifications.js         # All notifications
│   │   ├── NotFound.js              # 404 page
│   │   └── Home.js                  # Landing page
│   │
│   ├── services/
│   │   ├── api.js                   # Axios instance config
│   │   ├── authService.js           # Auth API calls
│   │   ├── userService.js           # User API calls
│   │   ├── sessionService.js        # Session API calls
│   │   ├── registrationService.js   # Registration API calls
│   │   ├── feedbackService.js       # Feedback API calls
│   │   └── notificationService.js   # Notification API calls
│   │
│   ├── contexts/
│   │   ├── AuthContext.js           # Auth state & actions
│   │   ├── ToastContext.js          # Toast notifications
│   │   └── NotificationContext.js   # Notification state
│   │
│   ├── hooks/
│   │   ├── useAuth.js               # Auth hook
│   │   ├── useToast.js              # Toast hook
│   │   ├── useDebounce.js           # Debounce hook
│   │   ├── useLocalStorage.js       # LocalStorage hook
│   │   └── useNotifications.js      # Notifications hook
│   │
│   ├── utils/
│   │   ├── datetime.js              # Date formatting
│   │   ├── validation.js            # Validation helpers
│   │   ├── constants.js             # Constants (status, roles)
│   │   └── helpers.js               # Misc helpers
│   │
│   ├── constants/
│   │   ├── roles.js                 # User roles
│   │   ├── sessionStatus.js         # Session statuses
│   │   ├── routes.js                # Route paths
│   │   └── messages.js              # UI messages (i18n ready)
│   │
│   ├── styles/
│   │   ├── index.css                # Global styles
│   │   ├── tailwind.css             # Tailwind imports
│   │   └── variables.css            # CSS variables
│   │
│   └── assets/
│       └── images/
│
├── .env                             # Environment variables
├── .gitignore
├── package.json
└── tailwind.config.js               # Tailwind config
```

---

## 📋 File JSON Schema Templates

### users.json
```json
{
  "users": [
    {
      "id": "uuid",
      "role": "STUDENT | TUTOR",
      "email": "string",
      "password": "hashed",
      "name": "string",
      "phone": "string",
      "gender": "MALE | FEMALE | OTHER",
      "dob": "ISO date",
      "faculty": "string",
      "createdAt": "ISO datetime",
      "tutorProfile": {
        "expertise": ["subject1", "subject2"],
        "bio": "string",
        "officeRoom": "string"
      }
    }
  ]
}
```

### sessions.json
```json
{
  "sessions": [
    {
      "id": "uuid",
      "tutorId": "uuid",
      "title": "string",
      "description": "string",
      "mode": "OFFLINE | ONLINE",
      "room": "string | null",
      "url": "string | null",
      "startAt": "ISO datetime",
      "endAt": "ISO datetime",
      "capacity": "number",
      "currentCount": "number",
      "status": "OPEN | FULL | PENDING | ONGOING | COMPLETED | CANCELLED",
      "subjects": ["string"],
      "createdAt": "ISO datetime",
      "updatedAt": "ISO datetime"
    }
  ]
}
```

### registrations.json
```json
{
  "registrations": [
    {
      "id": "uuid",
      "sessionId": "uuid",
      "studentId": "uuid",
      "status": "JOINED | CANCELLED",
      "createdAt": "ISO datetime",
      "updatedAt": "ISO datetime"
    }
  ]
}
```

### feedback.json
```json
{
  "feedback": [
    {
      "id": "uuid",
      "sessionId": "uuid",
      "studentId": "uuid",
      "rating": "1-5",
      "comment": "string",
      "state": "DRAFT | SAVED | SEEN",
      "createdAt": "ISO datetime",
      "updatedAt": "ISO datetime"
    }
  ]
}
```

### notifications.json
```json
{
  "notifications": [
    {
      "id": "uuid",
      "userId": "uuid",
      "type": "SESSION_UPDATED | SESSION_CANCELLED | SESSION_REMINDER",
      "payload": {
        "sessionId": "uuid",
        "message": "string",
        "metadata": {}
      },
      "readAt": "ISO datetime | null",
      "createdAt": "ISO datetime"
    }
  ]
}
```

### rooms.json (optional)
```json
{
  "rooms": [
    {
      "id": "uuid",
      "name": "string",
      "location": "string",
      "capacity": "number"
    }
  ]
}
```

---

## 🎨 Component Props Interface (Reference)

### Button Props
```javascript
{
  variant: 'primary' | 'secondary' | 'danger' | 'ghost',
  size: 'sm' | 'md' | 'lg',
  disabled: boolean,
  loading: boolean,
  onClick: function,
  children: ReactNode
}
```

### Input Props
```javascript
{
  type: 'text' | 'email' | 'password' | 'number' | 'tel',
  name: string,
  value: string,
  onChange: function,
  error: string,
  label: string,
  placeholder: string,
  required: boolean,
  disabled: boolean
}
```

### Modal Props
```javascript
{
  isOpen: boolean,
  onClose: function,
  title: string,
  size: 'sm' | 'md' | 'lg' | 'xl',
  children: ReactNode,
  footer: ReactNode
}
```

### SessionCard Props
```javascript
{
  session: {
    id, title, description, tutor, startAt, endAt,
    mode, room, url, capacity, currentCount, status, subjects
  },
  onRegister: function,
  onViewDetail: function,
  isRegistered: boolean
}
```

---

## 🔄 Routing Structure

```javascript
/                          → Home / Landing
/login                     → Login page
/register                  → Register page

// Student routes
/student/dashboard         → Student dashboard
/student/sessions          → Browse sessions
/student/sessions/:id      → Session detail
/student/schedule          → My schedule
/student/feedback/:id      → Submit feedback

// Tutor routes
/tutor/dashboard           → Tutor dashboard
/tutor/sessions            → Manage sessions
/tutor/sessions/create     → Create session
/tutor/sessions/:id/edit   → Edit session
/tutor/sessions/:id/registrations → View registrations

// Common routes
/profile                   → User profile
/notifications             → Notifications
/404                       → Not found
```

---

## 🔐 Authentication Flow

```
1. User login → POST /auth/login → receive JWT
2. Store JWT in localStorage
3. Set Authorization header for all API calls
4. JWT contains: { userId, role, exp }
5. Frontend check role → redirect to appropriate dashboard
6. PrivateRoute wraps protected routes
7. Auto-refresh user data on app load
8. Logout → clear localStorage → redirect to /login
```

---

## 📊 State Management Strategy

### Option 1: React Context + useReducer
```
AuthContext      → user, token, login, logout, register
ToastContext     → show toast messages
NotificationContext → notifications, unread count, mark as read
```

### Option 2: Zustand (simpler alternative)
```
authStore        → same as AuthContext
toastStore       → same as ToastContext
notificationStore → same as NotificationContext
```

### Server State: React Query (TanStack Query)
```
useQuery for GET requests (auto-caching, refetch)
useMutation for POST/PATCH/DELETE
```

---

## 🧪 Testing Structure (Optional)

```
backend/
├── tests/
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   └── integration/
│       └── api/

frontend/
├── src/
│   ├── components/
│   │   └── __tests__/
│   └── pages/
│       └── __tests__/
```

---

## 🚀 Deployment Structure

```
Production:
- Frontend: Vercel / Netlify
- Backend: Render / Railway / Fly.io
- Data: JSON files in backend (hoặc mount volume)

Development:
- Frontend: localhost:3000
- Backend: localhost:5000
- CORS: allow localhost:3000
```

---

Cấu trúc này được thiết kế để:
✅ Module hóa rõ ràng
✅ Dễ maintain và scale
✅ Thay thế component/service dễ dàng
✅ Test được từng phần riêng biệt
✅ Onboard developer mới nhanh



