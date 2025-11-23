import { useState, useEffect } from 'react'
import { Menu, X, Bell, User, LogOut, Calendar, Home, BookOpen, ClipboardList } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import notificationService from '../../services/notificationService'

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [hasUnread, setHasUnread] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Load notifications to determine unread badge visibility
  useEffect(() => {
    let mounted = true
    const load = async () => {
      if (!user) {
        if (mounted) setHasUnread(false)
        return
      }
      try {
        const res = await notificationService.getNotifications()
        const list = res.data || []
        const unread = list.some(n => !(n.read || n.readAt))
        if (mounted) setHasUnread(Boolean(unread))
      } catch (err) {
        console.error('Error loading notifications for badge:', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [user, location.pathname])

  const studentMenu = [
    { name: 'Trang chủ', path: '/student/dashboard', icon: Home },
    { name: 'Tìm buổi tư vấn', path: '/student/sessions', icon: BookOpen },
    { name: 'Lịch của tôi', path: '/student/schedule', icon: Calendar },
  ]

  const tutorMenu = [
    { name: 'Trang chủ', path: '/tutor/dashboard', icon: Home },
    { name: 'Quản lý buổi tư vấn', path: '/tutor/sessions', icon: ClipboardList },
    { name: 'Tạo buổi tư vấn', path: '/tutor/sessions/create', icon: BookOpen },
  ]

  const menu = user?.role === 'STUDENT' ? studentMenu : tutorMenu

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Menu button */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="ml-2 text-xl font-bold text-blue-600">
                Hệ thống Tư vấn
              </h1>
            </div>

            {/* Right menu */}
            <div className="flex items-center space-x-4">
              <Link
                to="/notifications"
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <Bell size={20} className="text-gray-600" />
                {hasUnread && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </Link>

              <div className="relative">
                <button
                  onClick={() => setProfileOpen((s) => !s)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                >
                  <User size={20} className="text-gray-600" />
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.name}
                  </span>
                </button>

                {/* Dropdown - controlled by state to avoid disappearing while moving cursor */}
                <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 ${profileOpen ? 'block' : 'hidden'}`}>
                  <Link
                    to={user?.role === 'STUDENT' ? '/profile' : '/tutor/profile'}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User size={16} className="mr-2" />
                    Thông tin cá nhân
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)]
            w-64 bg-white shadow-lg transform transition-transform duration-300
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}
        >
          <nav className="p-4 space-y-2">
            {menu.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default MainLayout



