import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Helper: Read JSON file
async function readJSON(filename) {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
}

// Helper: Write JSON file
async function writeJSON(filename, data) {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// Auth Middleware
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Token không được cung cấp' }
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Token không hợp lệ hoặc đã hết hạn' }
    });
  }
};

// RBAC Middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Bạn không có quyền truy cập' }
      });
    }
    next();
  };
};

// ============ AUTH ROUTES ============

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role, phone, gender, dob, faculty } = req.body;
    
    const usersData = await readJSON('users.json');
    if (!usersData) {
      return res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Không thể đọc dữ liệu' }
      });
    }
    
    // Check email exists
    const existingUser = usersData.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMAIL_EXISTS', message: 'Email đã tồn tại' }
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email,
      password: hashedPassword,
      name,
      role: role || 'STUDENT',
      phone,
      gender,
      dob,
      faculty,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tutorProfile: null
    };
    
    usersData.users.push(newUser);
    await writeJSON('users.json', usersData);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      success: true,
      data: userWithoutPassword,
      message: 'Đăng ký thành công'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi đăng ký' }
    });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const usersData = await readJSON('users.json');
    if (!usersData) {
      return res.status(500).json({
        success: false,
        error: { code: 'SERVER_ERROR', message: 'Không thể đọc dữ liệu' }
      });
    }
    
    // Find user
    const user = usersData.users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng' }
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Email hoặc mật khẩu không đúng' }
      });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Remove password
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: { token, user: userWithoutPassword },
      message: 'Đăng nhập thành công'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi đăng nhập' }
    });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const usersData = await readJSON('users.json');
    const user = usersData.users.find(u => u.id === req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng' }
      });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi lấy thông tin' }
    });
  }
});

// ============ USER/PROFILE ROUTES ============

// PATCH /api/users/me
app.patch('/api/users/me', authenticate, async (req, res) => {
  try {
    const updates = req.body;
    const usersData = await readJSON('users.json');
    
    const userIndex = usersData.users.findIndex(u => u.id === req.user.userId);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng' }
      });
    }
    
    // Don't allow role change
    delete updates.role;
    delete updates.id;
    delete updates.password;
    
    usersData.users[userIndex] = {
      ...usersData.users[userIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    await writeJSON('users.json', usersData);
    
    const { password: _, ...userWithoutPassword } = usersData.users[userIndex];
    res.json({
      success: true,
      data: userWithoutPassword,
      message: 'Cập nhật thông tin thành công'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi cập nhật thông tin' }
    });
  }
});

// ============ SESSION ROUTES ============

// GET /api/sessions
app.get('/api/sessions', authenticate, async (req, res) => {
  try {
    const { mine, status, subject, tutorId } = req.query;
    const sessionsData = await readJSON('sessions.json');
    const usersData = await readJSON('users.json');
    
    let sessions = sessionsData.sessions;
    
    // Filter by tutor (mine=true for tutors)
    if (mine === 'true' && req.user.role === 'TUTOR') {
      sessions = sessions.filter(s => s.tutorId === req.user.userId);
    }
    
    // Filter by status
    if (status) {
      const statuses = status.split(',');
      sessions = sessions.filter(s => statuses.includes(s.status));
    }
    
    // Filter by subject
    if (subject) {
      sessions = sessions.filter(s => s.subjects.some(subj => 
        subj.toLowerCase().includes(subject.toLowerCase())
      ));
    }
    
    // Filter by tutor
    if (tutorId) {
      sessions = sessions.filter(s => s.tutorId === tutorId);
    }
    
    // Add tutor info
    sessions = sessions.map(session => {
      const tutor = usersData.users.find(u => u.id === session.tutorId);
      return {
        ...session,
        tutor: tutor ? {
          id: tutor.id,
          name: tutor.name,
          expertise: tutor.tutorProfile?.expertise || []
        } : null
      };
    });
    
    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi lấy danh sách buổi tư vấn' }
    });
  }
});

// GET /api/sessions/:id
app.get('/api/sessions/:id', authenticate, async (req, res) => {
  try {
    const sessionsData = await readJSON('sessions.json');
    const usersData = await readJSON('users.json');
    
    const session = sessionsData.sessions.find(s => s.id === req.params.id);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Không tìm thấy buổi tư vấn' }
      });
    }
    
    // Add tutor info
    const tutor = usersData.users.find(u => u.id === session.tutorId);
    const sessionWithTutor = {
      ...session,
      tutor: tutor ? {
        id: tutor.id,
        name: tutor.name,
        expertise: tutor.tutorProfile?.expertise || [],
        bio: tutor.tutorProfile?.bio || '',
        officeRoom: tutor.tutorProfile?.officeRoom || ''
      } : null
    };
    
    res.json({ success: true, data: sessionWithTutor });
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi lấy thông tin buổi tư vấn' }
    });
  }
});

// POST /api/sessions (Tutor only)
app.post('/api/sessions', authenticate, authorize('TUTOR'), async (req, res) => {
  try {
    const { title, description, mode, room, url, startAt, endAt, capacity, subjects } = req.body;
    
    // Validation
    if (!title || !startAt || !endAt || !capacity || !mode) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Thiếu thông tin bắt buộc' }
      });
    }
    
    if (new Date(startAt) >= new Date(endAt)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Thời gian bắt đầu phải trước thời gian kết thúc' }
      });
    }
    
    if (mode === 'OFFLINE' && !room) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Buổi offline phải có phòng' }
      });
    }
    
    if (mode === 'ONLINE' && !url) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Buổi online phải có link' }
      });
    }
    
    const sessionsData = await readJSON('sessions.json');
    
    // Check tutor conflict
    const tutorConflict = sessionsData.sessions.find(s =>
      s.tutorId === req.user.userId &&
      s.status !== 'CANCELLED' &&
      new Date(s.startAt) < new Date(endAt) &&
      new Date(s.endAt) > new Date(startAt)
    );
    
    if (tutorConflict) {
      return res.status(409).json({
        success: false,
        error: { 
          code: 'SCHEDULE_CONFLICT', 
          message: 'Bạn đã có buổi tư vấn khác vào thời gian này',
          details: tutorConflict
        }
      });
    }
    
    // Check room conflict
    if (mode === 'OFFLINE') {
      const roomConflict = sessionsData.sessions.find(s =>
        s.mode === 'OFFLINE' &&
        s.room === room &&
        s.status !== 'CANCELLED' &&
        new Date(s.startAt) < new Date(endAt) &&
        new Date(s.endAt) > new Date(startAt)
      );
      
      if (roomConflict) {
        return res.status(409).json({
          success: false,
          error: { 
            code: 'ROOM_CONFLICT', 
            message: 'Phòng đã được đặt vào thời gian này',
            details: roomConflict
          }
        });
      }
    }
    
    // Create session
    const newSession = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      tutorId: req.user.userId,
      title,
      description,
      mode,
      room: mode === 'OFFLINE' ? room : null,
      url: mode === 'ONLINE' ? url : null,
      startAt,
      endAt,
      capacity,
      currentCount: 0,
      status: 'OPEN',
      subjects: subjects || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    sessionsData.sessions.push(newSession);
    await writeJSON('sessions.json', sessionsData);
    
    res.status(201).json({
      success: true,
      data: newSession,
      message: 'Tạo buổi tư vấn thành công'
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi tạo buổi tư vấn' }
    });
  }
});

// PATCH /api/sessions/:id (Tutor only)
app.patch('/api/sessions/:id', authenticate, authorize('TUTOR'), async (req, res) => {
  try {
    const sessionId = req.params.id;
    const updates = req.body;
    
    const sessionsData = await readJSON('sessions.json');
    
    // Find session
    const sessionIndex = sessionsData.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Không tìm thấy buổi tư vấn' }
      });
    }
    
    const session = sessionsData.sessions[sessionIndex];
    
    // Check if tutor owns this session
    if (session.tutorId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Bạn không có quyền sửa buổi tư vấn này' }
      });
    }
    
    // Validation if time is updated
    if (updates.startAt && updates.endAt && new Date(updates.startAt) >= new Date(updates.endAt)) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Thời gian bắt đầu phải trước thời gian kết thúc' }
      });
    }
    
    // Update session
    sessionsData.sessions[sessionIndex] = {
      ...session,
      ...updates,
      id: session.id, // Don't allow ID change
      tutorId: session.tutorId, // Don't allow tutor change
      currentCount: session.currentCount, // Don't allow count change
      updatedAt: new Date().toISOString()
    };
    
    await writeJSON('sessions.json', sessionsData);
    
    res.json({
      success: true,
      data: sessionsData.sessions[sessionIndex],
      message: 'Cập nhật buổi tư vấn thành công'
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi cập nhật buổi tư vấn' }
    });
  }
});

// DELETE /api/sessions/:id (Tutor only)
app.delete('/api/sessions/:id', authenticate, authorize('TUTOR'), async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    const sessionsData = await readJSON('sessions.json');
    const registrationsData = await readJSON('registrations.json');
    
    // Find session
    const sessionIndex = sessionsData.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Không tìm thấy buổi tư vấn' }
      });
    }
    
    const session = sessionsData.sessions[sessionIndex];
    
    // Check if tutor owns this session
    if (session.tutorId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Bạn không có quyền xóa buổi tư vấn này' }
      });
    }
    
    // Update session status to CANCELLED instead of deleting
    sessionsData.sessions[sessionIndex].status = 'CANCELLED';
    sessionsData.sessions[sessionIndex].updatedAt = new Date().toISOString();
    
    // Cancel all registrations for this session
    registrationsData.registrations = registrationsData.registrations.map(r => {
      if (r.sessionId === sessionId && r.status === 'JOINED') {
        return {
          ...r,
          status: 'CANCELLED',
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    });
    
    await writeJSON('sessions.json', sessionsData);
    await writeJSON('registrations.json', registrationsData);
    
    res.json({
      success: true,
      message: 'Xóa buổi tư vấn thành công'
    });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi xóa buổi tư vấn' }
    });
  }
});

// GET /api/sessions/:id/registrations (Tutor only)
app.get('/api/sessions/:id/registrations', authenticate, authorize('TUTOR'), async (req, res) => {
  try {
    const sessionId = req.params.id;
    
    const sessionsData = await readJSON('sessions.json');
    const registrationsData = await readJSON('registrations.json');
    const usersData = await readJSON('users.json');
    
    // Find session
    const session = sessionsData.sessions.find(s => s.id === sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Không tìm thấy buổi tư vấn' }
      });
    }
    
    // Check if tutor owns this session
    if (session.tutorId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Bạn không có quyền xem danh sách này' }
      });
    }
    
    // Get registrations for this session
    const sessionRegistrations = registrationsData.registrations.filter(r =>
      r.sessionId === sessionId && r.status === 'JOINED'
    );
    
    // Populate with student info
    const populatedRegistrations = sessionRegistrations.map(reg => {
      const student = usersData.users.find(u => u.id === reg.studentId);
      if (student) {
        const { password, ...studentWithoutPassword } = student;
        return {
          ...reg,
          student: studentWithoutPassword
        };
      }
      return reg;
    });
    
    res.json({ success: true, data: populatedRegistrations });
  } catch (error) {
    console.error('Get session registrations error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi lấy danh sách đăng ký' }
    });
  }
});

// POST /api/sessions/:id/register (Student only)
app.post('/api/sessions/:id/register', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const sessionId = req.params.id;
    const studentId = req.user.userId;
    
    const sessionsData = await readJSON('sessions.json');
    const registrationsData = await readJSON('registrations.json');
    
    // Find session
    const sessionIndex = sessionsData.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Không tìm thấy buổi tư vấn' }
      });
    }
    
    const session = sessionsData.sessions[sessionIndex];
    
    // Check if session is open
    if (session.status !== 'OPEN') {
      return res.status(400).json({
        success: false,
        error: { code: 'SESSION_NOT_OPEN', message: 'Buổi tư vấn không còn mở đăng ký' }
      });
    }
    
    // Check if already registered
    const existingRegistration = registrationsData.registrations.find(r =>
      r.sessionId === sessionId && r.studentId === studentId && r.status === 'JOINED'
    );
    
    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_REGISTERED', message: 'Bạn đã đăng ký buổi này rồi' }
      });
    }
    
    // Check capacity
    if (session.currentCount >= session.capacity) {
      return res.status(400).json({
        success: false,
        error: { code: 'SESSION_FULL', message: 'Buổi tư vấn đã đầy' }
      });
    }
    
    // Check schedule conflict for student
    const studentRegistrations = registrationsData.registrations.filter(r =>
      r.studentId === studentId && r.status === 'JOINED'
    );
    
    for (const reg of studentRegistrations) {
      const registeredSession = sessionsData.sessions.find(s => s.id === reg.sessionId);
      if (registeredSession && registeredSession.status !== 'CANCELLED') {
        // Check overlap
        if (new Date(registeredSession.startAt) < new Date(session.endAt) &&
            new Date(registeredSession.endAt) > new Date(session.startAt)) {
          return res.status(409).json({
            success: false,
            error: { 
              code: 'SCHEDULE_CONFLICT', 
              message: 'Bạn đã có buổi tư vấn khác vào thời gian này',
              details: registeredSession
            }
          });
        }
      }
    }
    
    // Create registration
    const newRegistration = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sessionId,
      studentId,
      status: 'JOINED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    registrationsData.registrations.push(newRegistration);
    
    // Update session count
    sessionsData.sessions[sessionIndex].currentCount += 1;
    if (sessionsData.sessions[sessionIndex].currentCount >= session.capacity) {
      sessionsData.sessions[sessionIndex].status = 'FULL';
    }
    
    await writeJSON('registrations.json', registrationsData);
    await writeJSON('sessions.json', sessionsData);
    
    res.status(201).json({
      success: true,
      data: newRegistration,
      message: 'Đăng ký thành công'
    });
  } catch (error) {
    console.error('Register session error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi đăng ký buổi tư vấn' }
    });
  }
});

// DELETE /api/sessions/:id/register (Student only)
app.delete('/api/sessions/:id/register', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const sessionId = req.params.id;
    const studentId = req.user.userId;
    
    const sessionsData = await readJSON('sessions.json');
    const registrationsData = await readJSON('registrations.json');
    
    // Find registration
    const registrationIndex = registrationsData.registrations.findIndex(r =>
      r.sessionId === sessionId && r.studentId === studentId && r.status === 'JOINED'
    );
    
    if (registrationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Không tìm thấy đăng ký' }
      });
    }
    
    // Update registration status
    registrationsData.registrations[registrationIndex].status = 'CANCELLED';
    registrationsData.registrations[registrationIndex].updatedAt = new Date().toISOString();
    
    // Update session count
    const sessionIndex = sessionsData.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
      sessionsData.sessions[sessionIndex].currentCount -= 1;
      if (sessionsData.sessions[sessionIndex].status === 'FULL') {
        sessionsData.sessions[sessionIndex].status = 'OPEN';
      }
    }
    
    await writeJSON('registrations.json', registrationsData);
    await writeJSON('sessions.json', sessionsData);
    
    res.json({
      success: true,
      message: 'Hủy đăng ký thành công'
    });
  } catch (error) {
    console.error('Cancel registration error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi hủy đăng ký' }
    });
  }
});

// GET /api/registrations/me (Student only)
app.get('/api/registrations/me', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const studentId = req.user.userId;
    
    const registrationsData = await readJSON('registrations.json');
    const sessionsData = await readJSON('sessions.json');
    const usersData = await readJSON('users.json');
    
    // Get student registrations
    const studentRegistrations = registrationsData.registrations.filter(r =>
      r.studentId === studentId && r.status === 'JOINED'
    );
    
    // Populate with session and tutor info
    const populatedRegistrations = studentRegistrations.map(reg => {
      const session = sessionsData.sessions.find(s => s.id === reg.sessionId);
      if (session) {
        const tutor = usersData.users.find(u => u.id === session.tutorId);
        return {
          ...reg,
          session: {
            ...session,
            tutor: tutor ? {
              id: tutor.id,
              name: tutor.name,
              expertise: tutor.tutorProfile?.expertise || []
            } : null
          }
        };
      }
      return reg;
    });
    
    res.json({ success: true, data: populatedRegistrations });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi lấy danh sách đăng ký' }
    });
  }
});

// POST /api/sessions/:id/feedback (Student only)
app.post('/api/sessions/:id/feedback', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const sessionId = req.params.id;
    const studentId = req.user.userId;
    const { rating, comment, question, state } = req.body;
    
    // Validation
    if (state === 'SAVED' && !rating) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Vui lòng chọn mức độ hài lòng' }
      });
    }
    
    const feedbackData = await readJSON('feedback.json');
    const registrationsData = await readJSON('registrations.json');
    
    // Check if student registered for this session
    const registration = registrationsData.registrations.find(r =>
      r.sessionId === sessionId && r.studentId === studentId && r.status === 'JOINED'
    );
    
    if (!registration) {
      return res.status(403).json({
        success: false,
        error: { code: 'NOT_REGISTERED', message: 'Bạn chưa đăng ký buổi tư vấn này' }
      });
    }
    
    // Check if feedback already exists
    const existingFeedbackIndex = feedbackData.feedback.findIndex(f =>
      f.sessionId === sessionId && f.studentId === studentId
    );
    
    if (existingFeedbackIndex !== -1) {
      // Update existing feedback
      feedbackData.feedback[existingFeedbackIndex] = {
        ...feedbackData.feedback[existingFeedbackIndex],
        rating: rating !== undefined ? rating : feedbackData.feedback[existingFeedbackIndex].rating,
        comment: comment !== undefined ? comment : feedbackData.feedback[existingFeedbackIndex].comment,
        question: question !== undefined ? question : feedbackData.feedback[existingFeedbackIndex].question,
        state: state || feedbackData.feedback[existingFeedbackIndex].state,
        updatedAt: new Date().toISOString()
      };
    } else {
      // Create new feedback
      const newFeedback = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sessionId,
        studentId,
        rating: rating || 0,
        comment: comment || '',
        question: question || '',
        state: state || 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      feedbackData.feedback.push(newFeedback);
    }
    
    await writeJSON('feedback.json', feedbackData);
    
    res.status(201).json({
      success: true,
      message: state === 'SAVED' ? 'Đã gửi phản hồi' : 'Đã lưu bản nháp'
    });
  } catch (error) {
    console.error('Submit feedback error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi gửi phản hồi' }
    });
  }
});

// GET /api/sessions/:id/feedback/me (Student only)
app.get('/api/sessions/:id/feedback/me', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const sessionId = req.params.id;
    const studentId = req.user.userId;
    
    const feedbackData = await readJSON('feedback.json');
    
    // Find student's feedback for this session
    const feedback = feedbackData.feedback.find(f =>
      f.sessionId === sessionId && f.studentId === studentId
    );
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Chưa có phản hồi nào' }
      });
    }
    
    res.json({ success: true, data: feedback });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi lấy phản hồi' }
    });
  }
});

// DELETE /api/sessions/:id/feedback/me (Student only)
app.delete('/api/sessions/:id/feedback/me', authenticate, authorize('STUDENT'), async (req, res) => {
  try {
    const sessionId = req.params.id;
    const studentId = req.user.userId;
    
    const feedbackData = await readJSON('feedback.json');
    
    // Find feedback index
    const feedbackIndex = feedbackData.feedback.findIndex(f =>
      f.sessionId === sessionId && f.studentId === studentId
    );
    
    if (feedbackIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Không tìm thấy phản hồi' }
      });
    }
    
    // Remove feedback
    feedbackData.feedback.splice(feedbackIndex, 1);
    await writeJSON('feedback.json', feedbackData);
    
    res.json({
      success: true,
      message: 'Đã xóa phản hồi'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'SERVER_ERROR', message: 'Lỗi xóa phản hồi' }
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route không tồn tại' }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Đã có lỗi xảy ra' }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API docs: http://localhost:${PORT}/health`);
});


