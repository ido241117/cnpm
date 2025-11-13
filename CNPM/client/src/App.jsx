import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Student pages
import StudentDashboard from './pages/student/Dashboard'
import SessionList from './pages/student/SessionList'
import StudentSchedule from './pages/student/Schedule'
import SessionDetail from './pages/student/SessionDetail'
import FeedbackPage from './pages/student/FeedbackPage'

// Tutor pages
import TutorDashboard from './pages/tutor/Dashboard'
import TutorProfile from './pages/tutor/TutorProfile'
import CreateSession from './pages/tutor/CreateSession'
import ManageSessions from './pages/tutor/ManageSessions'
import EditSession from './pages/tutor/EditSession'
import ViewRegistrations from './pages/tutor/ViewRegistrations'

// Common pages
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import NotFound from './pages/NotFound'

// Components
import PrivateRoute from './components/auth/PrivateRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute role="STUDENT">
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/sessions"
            element={
              <PrivateRoute role="STUDENT">
                <SessionList />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/sessions/:id"
            element={
              <PrivateRoute role="STUDENT">
                <SessionDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/schedule"
            element={
              <PrivateRoute role="STUDENT">
                <StudentSchedule />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/feedback/:sessionId"
            element={
              <PrivateRoute role="STUDENT">
                <FeedbackPage />
              </PrivateRoute>
            }
          />

          {/* Tutor routes */}
          <Route
            path="/tutor/dashboard"
            element={
              <PrivateRoute role="TUTOR">
                <TutorDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/tutor/profile"
            element={
              <PrivateRoute role="TUTOR">
                <TutorProfile />
              </PrivateRoute>
            }
          />
          <Route
            path="/tutor/sessions"
            element={
              <PrivateRoute role="TUTOR">
                <ManageSessions />
              </PrivateRoute>
            }
          />
          <Route
            path="/tutor/sessions/create"
            element={
              <PrivateRoute role="TUTOR">
                <CreateSession />
              </PrivateRoute>
            }
          />
          <Route
            path="/tutor/sessions/:id/edit"
            element={
              <PrivateRoute role="TUTOR">
                <EditSession />
              </PrivateRoute>
            }
          />
          <Route
            path="/tutor/sessions/:id/registrations"
            element={
              <PrivateRoute role="TUTOR">
                <ViewRegistrations />
              </PrivateRoute>
            }
          />

          {/* Common routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            }
          />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App


