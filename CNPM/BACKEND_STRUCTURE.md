# BACKEND STRUCTURE - TEMPLATE & GUIDELINES

## 📁 Cấu trúc thư mục Backend

```
backend/
├── src/
│   ├── server.js
│   ├── config/
│   ├── middlewares/
│   ├── services/
│   ├── controllers/
│   ├── validators/
│   ├── utils/
│   └── routes/
├── data/
│   ├── users.json
│   ├── sessions.json
│   ├── registrations.json
│   ├── feedback.json
│   └── notifications.json
├── .env
└── package.json
```

---

## 📄 File Templates

### 1. server.js (Entry Point)

```javascript
// backend/src/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handler (phải đặt cuối cùng)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route không tồn tại' }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

### 2. config/index.js

```javascript
// backend/src/config/index.js
module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: '7d',
  bcryptRounds: 10,
  
  dataDir: './data',
  
  roles: {
    STUDENT: 'STUDENT',
    TUTOR: 'TUTOR'
  },
  
  sessionStatus: {
    OPEN: 'OPEN',
    FULL: 'FULL',
    PENDING: 'PENDING',
    ONGOING: 'ONGOING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED'
  },
  
  registrationStatus: {
    JOINED: 'JOINED',
    CANCELLED: 'CANCELLED'
  },
  
  feedbackState: {
    DRAFT: 'DRAFT',
    SAVED: 'SAVED',
    SEEN: 'SEEN'
  },
  
  notificationType: {
    SESSION_UPDATED: 'SESSION_UPDATED',
    SESSION_CANCELLED: 'SESSION_CANCELLED',
    SESSION_REMINDER: 'SESSION_REMINDER'
  }
};
```

---

### 3. services/dataService.js (Core JSON CRUD)

```javascript
// backend/src/services/dataService.js
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const config = require('../config');

class DataService {
  constructor(fileName) {
    this.filePath = path.join(config.dataDir, fileName);
    this.ensureFileExists();
  }

  // Đảm bảo file tồn tại
  async ensureFileExists() {
    if (!await fs.pathExists(this.filePath)) {
      await fs.ensureDir(config.dataDir);
      await fs.writeJSON(this.filePath, { [this.getCollectionName()]: [] });
    }
  }

  // Lấy collection name từ file name (users.json → users)
  getCollectionName() {
    return path.basename(this.filePath, '.json');
  }

  // Đọc toàn bộ data
  async readAll() {
    const data = await fs.readJSON(this.filePath);
    return data[this.getCollectionName()] || [];
  }

  // Ghi toàn bộ data (atomic)
  async writeAll(items) {
    const collectionName = this.getCollectionName();
    const tempFile = this.filePath + '.tmp';
    
    await fs.writeJSON(tempFile, { [collectionName]: items }, { spaces: 2 });
    await fs.move(tempFile, this.filePath, { overwrite: true });
  }

  // Tìm một item theo điều kiện
  async findOne(predicate) {
    const items = await this.readAll();
    return items.find(predicate);
  }

  // Tìm nhiều items theo điều kiện
  async find(predicate) {
    const items = await this.readAll();
    return predicate ? items.filter(predicate) : items;
  }

  // Tìm theo ID
  async findById(id) {
    return this.findOne(item => item.id === id);
  }

  // Tạo mới
  async create(data) {
    const items = await this.readAll();
    const newItem = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    await this.writeAll(items);
    return newItem;
  }

  // Cập nhật theo ID
  async updateById(id, updates) {
    const items = await this.readAll();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await this.writeAll(items);
    return items[index];
  }

  // Xóa theo ID (hard delete)
  async deleteById(id) {
    const items = await this.readAll();
    const filtered = items.filter(item => item.id !== id);
    
    if (filtered.length === items.length) return false;
    
    await this.writeAll(filtered);
    return true;
  }

  // Count
  async count(predicate) {
    const items = await this.readAll();
    return predicate ? items.filter(predicate).length : items.length;
  }

  // Transaction-like: lock, update, unlock
  async transaction(callback) {
    const lockFile = this.filePath + '.lock';
    
    // Simple file-based lock
    while (await fs.pathExists(lockFile)) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    await fs.writeFile(lockFile, '');
    
    try {
      const items = await this.readAll();
      const result = await callback(items);
      await this.writeAll(items);
      return result;
    } finally {
      await fs.remove(lockFile);
    }
  }
}

module.exports = DataService;
```

**Usage:**
```javascript
const DataService = require('./dataService');
const usersDB = new DataService('users.json');

// Create
const user = await usersDB.create({ name: 'John', email: 'john@email.com' });

// Find
const allUsers = await usersDB.find();
const student = await usersDB.findOne(u => u.role === 'STUDENT');
const userById = await usersDB.findById('uuid');

// Update
await usersDB.updateById('uuid', { name: 'Jane' });

// Delete
await usersDB.deleteById('uuid');

// Transaction
await usersDB.transaction(async (users) => {
  const user = users.find(u => u.id === userId);
  user.balance += 100;
  return user;
});
```

---

### 4. middlewares/auth.js (JWT Auth)

```javascript
// backend/src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const config = require('../config');

// Verify JWT token
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Token không được cung cấp' }
      });
    }
    
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded; // { userId, role }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token không hợp lệ hoặc đã hết hạn' }
    });
  }
};

// Kiểm tra role (RBAC)
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Vui lòng đăng nhập' }
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Bạn không có quyền truy cập' }
      });
    }
    
    next();
  };
};

module.exports = { authenticate, authorize };
```

---

### 5. middlewares/errorHandler.js

```javascript
// backend/src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  // Validation error (express-validator)
  if (err.type === 'VALIDATION_ERROR') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dữ liệu không hợp lệ',
        details: err.details
      }
    });
  }
  
  // Business logic error
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || 'ERROR',
        message: err.message
      }
    });
  }
  
  // Default server error
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Đã có lỗi xảy ra, vui lòng thử lại sau'
    }
  });
};

module.exports = errorHandler;
```

---

### 6. utils/response.js (Standard Response)

```javascript
// backend/src/utils/response.js
const success = (res, data, message = 'Thành công', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

const error = (res, message, code = 'ERROR', statusCode = 400, details = null) => {
  const response = {
    success: false,
    error: { code, message }
  };
  
  if (details) {
    response.error.details = details;
  }
  
  return res.status(statusCode).json(response);
};

const created = (res, data, message = 'Tạo thành công') => {
  return success(res, data, message, 201);
};

module.exports = { success, error, created };
```

---

### 7. controllers/authController.js (Example)

```javascript
// backend/src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const DataService = require('../services/dataService');
const config = require('../config');
const { success, error } = require('../utils/response');

const usersDB = new DataService('users.json');

// POST /auth/register
const register = async (req, res) => {
  try {
    const { email, password, name, role, phone, gender, dob, faculty } = req.body;
    
    // Check email exists
    const existingUser = await usersDB.findOne(u => u.email === email);
    if (existingUser) {
      return error(res, 'Email đã tồn tại', 'EMAIL_EXISTS', 400);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, config.bcryptRounds);
    
    // Create user
    const user = await usersDB.create({
      email,
      password: hashedPassword,
      name,
      role: role || config.roles.STUDENT,
      phone,
      gender,
      dob,
      faculty,
      tutorProfile: null
    });
    
    // Remove password from response
    delete user.password;
    
    return success(res, user, 'Đăng ký thành công', 201);
  } catch (err) {
    console.error('Register error:', err);
    return error(res, 'Lỗi đăng ký', 'REGISTER_ERROR', 500);
  }
};

// POST /auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await usersDB.findOne(u => u.email === email);
    if (!user) {
      return error(res, 'Email hoặc mật khẩu không đúng', 'INVALID_CREDENTIALS', 401);
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 'Email hoặc mật khẩu không đúng', 'INVALID_CREDENTIALS', 401);
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
    
    // Remove password
    delete user.password;
    
    return success(res, { token, user }, 'Đăng nhập thành công');
  } catch (err) {
    console.error('Login error:', err);
    return error(res, 'Lỗi đăng nhập', 'LOGIN_ERROR', 500);
  }
};

// GET /auth/me
const getMe = async (req, res) => {
  try {
    const user = await usersDB.findById(req.user.userId);
    if (!user) {
      return error(res, 'Không tìm thấy người dùng', 'USER_NOT_FOUND', 404);
    }
    
    delete user.password;
    return success(res, user);
  } catch (err) {
    console.error('GetMe error:', err);
    return error(res, 'Lỗi lấy thông tin', 'GET_ME_ERROR', 500);
  }
};

module.exports = { register, login, getMe };
```

---

### 8. routes/index.js (Aggregator)

```javascript
// backend/src/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const sessionRoutes = require('./session.routes');
// ... import more routes

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/sessions', sessionRoutes);
// ... use more routes

module.exports = router;
```

---

### 9. routes/auth.routes.js

```javascript
// backend/src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, getMe);

module.exports = router;
```

---

### 10. services/conflictService.js (Business Logic)

```javascript
// backend/src/services/conflictService.js
const DataService = require('./dataService');

const sessionsDB = new DataService('sessions.json');
const registrationsDB = new DataService('registrations.json');

// Kiểm tra trùng lịch của tutor
const checkTutorConflict = async (tutorId, startAt, endAt, excludeSessionId = null) => {
  const sessions = await sessionsDB.find(s => 
    s.tutorId === tutorId &&
    s.id !== excludeSessionId &&
    s.status !== 'CANCELLED'
  );
  
  return sessions.find(s => 
    new Date(s.startAt) < new Date(endAt) &&
    new Date(s.endAt) > new Date(startAt)
  );
};

// Kiểm tra trùng phòng
const checkRoomConflict = async (room, startAt, endAt, excludeSessionId = null) => {
  const sessions = await sessionsDB.find(s => 
    s.mode === 'OFFLINE' &&
    s.room === room &&
    s.id !== excludeSessionId &&
    s.status !== 'CANCELLED'
  );
  
  return sessions.find(s => 
    new Date(s.startAt) < new Date(endAt) &&
    new Date(s.endAt) > new Date(startAt)
  );
};

// Kiểm tra trùng lịch của student
const checkStudentConflict = async (studentId, startAt, endAt, excludeSessionId = null) => {
  const registrations = await registrationsDB.find(r => 
    r.studentId === studentId &&
    r.status === 'JOINED'
  );
  
  const sessionIds = registrations.map(r => r.sessionId);
  const sessions = await sessionsDB.find(s => 
    sessionIds.includes(s.id) &&
    s.id !== excludeSessionId &&
    s.status !== 'CANCELLED'
  );
  
  return sessions.find(s => 
    new Date(s.startAt) < new Date(endAt) &&
    new Date(s.endAt) > new Date(startAt)
  );
};

module.exports = {
  checkTutorConflict,
  checkRoomConflict,
  checkStudentConflict
};
```

---

## 📦 package.json

```json
{
  "name": "tutor-management-backend",
  "version": "1.0.0",
  "description": "Backend API for Tutor Management System",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "fs-extra": "^11.2.0",
    "uuid": "^9.0.1",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "express-validator": "^7.0.1",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0"
  }
}
```

---

## 🔐 .env Template

```env
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:3000

# Optional: Email (nếu muốn gửi email)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-password
```

---

## 🚀 Setup Instructions

```bash
# 1. Tạo thư mục backend
mkdir backend
cd backend

# 2. Initialize npm
npm init -y

# 3. Install dependencies
npm install express cors helmet dotenv fs-extra uuid bcrypt jsonwebtoken express-validator date-fns

# 4. Install dev dependencies
npm install -D nodemon

# 5. Tạo cấu trúc thư mục
mkdir -p src/{config,middlewares,services,controllers,validators,utils,routes}
mkdir data

# 6. Tạo file .env
touch .env

# 7. Copy các templates trên vào file tương ứng

# 8. Tạo data files
echo '{"users":[]}' > data/users.json
echo '{"sessions":[]}' > data/sessions.json
echo '{"registrations":[]}' > data/registrations.json
echo '{"feedback":[]}' > data/feedback.json
echo '{"notifications":[]}' > data/notifications.json

# 9. Run dev
npm run dev
```

---

Với structure này, bạn có:
✅ JSON-based database với CRUD operations
✅ Authentication & Authorization
✅ Standard error handling
✅ Modular, scalable structure
✅ Easy to swap JSON → SQL later



