# FRONTEND STRUCTURE - TEMPLATE & GUIDELINES

## 📁 Cấu trúc thư mục Frontend

```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── index.js
│   ├── App.js
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── contexts/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   └── styles/
├── .env
└── package.json
```

---

## 📄 File Templates

### 1. src/index.js (Entry Point)

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

### 2. src/App.js

```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

import PrivateRoute from './components/auth/PrivateRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import StudentDashboard from './pages/student/Dashboard';
import SessionList from './pages/student/SessionList';
import Schedule from './pages/student/Schedule';

import TutorDashboard from './pages/tutor/Dashboard';
import CreateSession from './pages/tutor/CreateSession';
import ManageSessions from './pages/tutor/ManageSessions';

import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Student routes */}
            <Route path="/student/dashboard" element={
              <PrivateRoute role="STUDENT">
                <StudentDashboard />
              </PrivateRoute>
            } />
            <Route path="/student/sessions" element={
              <PrivateRoute role="STUDENT">
                <SessionList />
              </PrivateRoute>
            } />
            <Route path="/student/schedule" element={
              <PrivateRoute role="STUDENT">
                <Schedule />
              </PrivateRoute>
            } />
            
            {/* Tutor routes */}
            <Route path="/tutor/dashboard" element={
              <PrivateRoute role="TUTOR">
                <TutorDashboard />
              </PrivateRoute>
            } />
            <Route path="/tutor/sessions/create" element={
              <PrivateRoute role="TUTOR">
                <CreateSession />
              </PrivateRoute>
            } />
            <Route path="/tutor/sessions" element={
              <PrivateRoute role="TUTOR">
                <ManageSessions />
              </PrivateRoute>
            } />
            
            {/* Common routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
```

---

### 3. src/services/api.js (Axios Instance)

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor: Tự động thêm token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors
api.interceptors.response.use(
  (response) => response.data, // Return chỉ data
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
```

---

### 4. src/services/authService.js

```javascript
import api from './api';

const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;
```

---

### 5. src/contexts/AuthContext.js

```javascript
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    setUser(response.data.user);
    return response;
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

---

### 6. src/contexts/ToastContext.js

```javascript
import React, { createContext, useState, useContext, useCallback } from 'react';
import Toast from '../components/common/Toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const value = { showToast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};
```

---

### 7. src/components/auth/PrivateRoute.js

```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Hoặc Spinner
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // Không đúng role → redirect về dashboard của họ
    const redirectPath = user.role === 'STUDENT' 
      ? '/student/dashboard' 
      : '/tutor/dashboard';
    return <Navigate to={redirectPath} />;
  }

  return children;
};

export default PrivateRoute;
```

---

### 8. src/components/common/Button.js (Example Component)

```javascript
import React from 'react';
import './Button.css';

const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  children
}) => {
  const classNames = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading'
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="spinner" />}
      {children}
    </button>
  );
};

export default Button;
```

**Button.css:**
```css
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-primary:hover {
  background-color: #1565c0;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-ghost {
  background-color: transparent;
  color: #1976d2;
  border: 1px solid #1976d2;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-loading {
  pointer-events: none;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
```

---

### 9. src/pages/auth/Login.js (Example Page)

```javascript
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Redirect nếu đã login
  React.useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'STUDENT' 
        ? '/student/dashboard' 
        : '/tutor/dashboard';
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email là bắt buộc';
    if (!password) newErrors.password = 'Mật khẩu là bắt buộc';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await login(email, password);
      showToast({
        type: 'success',
        message: 'Đăng nhập thành công!'
      });
      // Navigate được xử lý bởi useEffect
    } catch (error) {
      showToast({
        type: 'error',
        message: error?.error?.message || 'Đăng nhập thất bại'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Đăng nhập</h1>
        <p className="subtitle">Hệ thống quản lý buổi tư vấn</p>
        
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            placeholder="student@hcmut.edu.vn"
            autoComplete="email"
          />
          
          <Input
            label="Mật khẩu"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={loading}
          >
            Đăng nhập
          </Button>
        </form>
        
        <p className="register-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
```

---

### 10. src/constants/routes.js

```javascript
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Student
  STUDENT_DASHBOARD: '/student/dashboard',
  STUDENT_SESSIONS: '/student/sessions',
  STUDENT_SESSION_DETAIL: '/student/sessions/:id',
  STUDENT_SCHEDULE: '/student/schedule',
  STUDENT_FEEDBACK: '/student/feedback/:id',
  
  // Tutor
  TUTOR_DASHBOARD: '/tutor/dashboard',
  TUTOR_SESSIONS: '/tutor/sessions',
  TUTOR_CREATE_SESSION: '/tutor/sessions/create',
  TUTOR_EDIT_SESSION: '/tutor/sessions/:id/edit',
  TUTOR_SESSION_REGISTRATIONS: '/tutor/sessions/:id/registrations',
  
  // Common
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications'
};
```

---

### 11. src/utils/datetime.js

```javascript
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (isoString) => {
  return format(parseISO(isoString), 'dd/MM/yyyy', { locale: vi });
};

export const formatTime = (isoString) => {
  return format(parseISO(isoString), 'HH:mm', { locale: vi });
};

export const formatDateTime = (isoString) => {
  return format(parseISO(isoString), 'dd/MM/yyyy HH:mm', { locale: vi });
};

export const formatDateTimeLong = (isoString) => {
  return format(parseISO(isoString), "EEEE, dd 'tháng' MM, yyyy 'lúc' HH:mm", { locale: vi });
};
```

---

## 📦 package.json

```json
{
  "name": "tutor-management-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

---

## 🔐 .env Template

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 Setup Instructions

```bash
# 1. Tạo React app
npx create-react-app frontend
cd frontend

# 2. Install dependencies
npm install react-router-dom axios date-fns

# 3. Tạo cấu trúc thư mục
mkdir -p src/{components/{common,auth,Layout,student,tutor,notification},pages/{auth,student,tutor},services,contexts,hooks,utils,constants,styles}

# 4. Copy các templates trên vào file tương ứng

# 5. Tạo file .env
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# 6. Run dev
npm start
```

---

## 🎨 Optional: Tailwind CSS Setup

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**tailwind.config.js:**
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1976d2',
        secondary: '#6c757d',
        success: '#28a745',
        danger: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
      }
    },
  },
  plugins: [],
}
```

**src/index.css:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

Với structure này, bạn có:
✅ React Router với protected routes
✅ Context API cho global state
✅ Axios với interceptors
✅ Reusable components
✅ Modular structure
✅ Easy to scale



