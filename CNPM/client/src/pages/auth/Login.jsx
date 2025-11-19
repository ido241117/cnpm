import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const Login = () => {
  const [showRoleSelection, setShowRoleSelection] = useState(true)
  const [selectedRole, setSelectedRole] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const { login, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      const redirectPath = user.role === 'STUDENT' 
        ? '/student/dashboard' 
        : '/tutor/dashboard'
      navigate(redirectPath)
    }
  }, [user, navigate])

  const handleRoleSelect = (role) => {
    setSelectedRole(role)
    setShowRoleSelection(false)
    // Pre-fill demo accounts
    if (role === 'STUDENT') {
      setEmail('student1@hcmut.edu.vn')
      setPassword('student123')
    } else {
      setEmail('tutor1@hcmut.edu.vn')
      setPassword('tutor123')
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!email) newErrors.email = 'Email là bắt buộc'
    if (!password) newErrors.password = 'Mật khẩu là bắt buộc'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      await login(email, password)
      toast.success('Đăng nhập thành công!')
    } catch (error) {
      toast.error(error?.error?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-6xl flex items-center justify-between px-8">
        {/* Left side - Branding */}
        <div className="flex-1 pr-16">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">HCMUT</h1>
          <p className="text-lg text-gray-600">
            Khai phóng - Tiên phong - Sáng tạo
          </p>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md">
          <div className="border-2 border-blue-400 rounded-3xl p-8 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold text-center mb-8 text-gray-900">
              Đăng nhập
            </h2>

            {showRoleSelection ? (
              /* Role Selection View */
              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect('STUDENT')}
                  className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Sinh viên
                </button>
                <button
                  onClick={() => handleRoleSelect('TUTOR')}
                  className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Giảng viên
                </button>
              </div>
            ) : (
              /* Login Form View */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    autoComplete="current-password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                  <div className="text-right mt-2">
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang đăng nhập...' : 'Log in'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowRoleSelection(true)
                    setEmail('')
                    setPassword('')
                    setErrors({})
                  }}
                  className="w-full py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Quay lại chọn vai trò
                </button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500">
                <Link to="/terms" className="hover:text-gray-700">Terms of user</Link>
                {' | '}
                <Link to="/privacy" className="hover:text-gray-700">Privacy policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login


