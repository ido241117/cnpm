import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Bell, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import sessionService from '../../services/sessionService'

const ViewRegistrations = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [registrations, setRegistrations] = useState([])

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [sessionRes, registrationsRes] = await Promise.all([
        sessionService.getSession(id),
        sessionService.getSessionRegistrations(id)
      ])
      
      setSession(sessionRes.data)
      setRegistrations(registrationsRes.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải thông tin buổi tư vấn')
      navigate('/tutor/sessions')
    } finally {
      setLoading(false)
    }
  }

  const getCurrentDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const date = new Date()
    return `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const formatSessionDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/tutor/dashboard')}
              className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/notifications')}
                className="p-2 hover:bg-gray-100 rounded-full relative"
              >
                <Bell size={24} className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center space-x-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=4F46E5&color=fff`}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-lg font-medium text-gray-900">Welcome, {user?.name?.split(' ').pop() || 'User'}</p>
                  <p className="text-sm text-gray-500">{getCurrentDate()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : (
            <>
              {/* Session Info */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => navigate('/tutor/sessions')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft size={20} />
                    <span>Quay lại</span>
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Danh sách tham gia
                  </h1>
                  <div></div>
                </div>

                {session && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      {session.title}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Ngày:</span>{' '}
                        <span className="font-medium">{formatSessionDate(session.startAt)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Số lượng:</span>{' '}
                        <span className="font-medium">{session.currentCount}/{session.capacity} sinh viên</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Registrations Table */}
              {registrations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Chưa có sinh viên nào đăng ký</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Mssv
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Họ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tên
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {registrations.map((registration, index) => {
                        const student = registration.student
                        const nameParts = student?.name?.split(' ') || []
                        const firstName = nameParts.slice(0, -1).join(' ')
                        const lastName = nameParts[nameParts.length - 1] || ''
                        
                        return (
                          <tr key={registration.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student?.id?.slice(-6) || `SV${index + 1}`}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {firstName || 'Nguyễn'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {lastName || 'Văn A'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {student?.email || 'student@email.com'}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Back Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => navigate('/tutor/sessions')}
                  className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  Back
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default ViewRegistrations
