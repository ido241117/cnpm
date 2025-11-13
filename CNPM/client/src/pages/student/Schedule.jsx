import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, MapPin, Video, User } from 'lucide-react'
import MainLayout from '../../components/Layout/MainLayout'
import sessionService from '../../services/sessionService'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'

const Schedule = () => {
  const [loading, setLoading] = useState(true)
  const [registrations, setRegistrations] = useState([])
  const [activeFilter, setActiveFilter] = useState('all') // all, upcoming, completed

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    setLoading(true)
    try {
      const response = await sessionService.getMyRegistrations()
      setRegistrations(response.data || [])
    } catch (error) {
      console.error('Error fetching schedule:', error)
      toast.error('Không thể tải lịch trình')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelRegistration = async (sessionId) => {
    if (!window.confirm('Bạn có chắc muốn hủy đăng ký buổi này?')) return

    try {
      await sessionService.cancelRegistration(sessionId)
      toast.success('Đã hủy đăng ký')
      fetchSchedule()
    } catch (error) {
      console.error('Error canceling:', error)
      toast.error(error?.error?.message || 'Không thể hủy đăng ký')
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      OPEN: { text: 'Sắp diễn ra', color: 'bg-green-100 text-green-800' },
      PENDING: { text: 'Chờ diễn ra', color: 'bg-yellow-100 text-yellow-800' },
      ONGOING: { text: 'Đang diễn ra', color: 'bg-blue-100 text-blue-800' },
      COMPLETED: { text: 'Đã hoàn thành', color: 'bg-gray-100 text-gray-800' },
      CANCELLED: { text: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    }
    const config = statusConfig[status] || statusConfig.OPEN
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  const filteredRegistrations = registrations.filter((reg) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'upcoming') return ['OPEN', 'PENDING'].includes(reg.session?.status)
    if (activeFilter === 'completed') return reg.session?.status === 'COMPLETED'
    return true
  })

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Lịch của tôi</h1>
          <p className="mt-2 text-gray-600">Quản lý các buổi tư vấn đã đăng ký</p>
        </div>

        {/* Filters */}
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            Tất cả ({registrations.length})
          </button>
          <button
            onClick={() => setActiveFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'upcoming'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            Sắp tới ({registrations.filter(r => ['OPEN', 'PENDING'].includes(r.session?.status)).length})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border'
            }`}
          >
            Đã hoàn thành ({registrations.filter(r => r.session?.status === 'COMPLETED').length})
          </button>
        </div>

        {/* Schedule list */}
        {filteredRegistrations.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có buổi tư vấn nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bắt đầu khám phá và đăng ký các buổi tư vấn phù hợp với bạn
            </p>
            <Link
              to="/student/sessions"
              className="inline-block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Tìm buổi tư vấn
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRegistrations.map((registration) => (
              <div
                key={registration.id}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {registration.session?.title}
                      </h3>
                      {getStatusBadge(registration.session?.status)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <User size={18} className="mr-2" />
                        <span>Giảng viên: {registration.session?.tutor?.name}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock size={18} className="mr-2" />
                        <span>
                          {new Date(registration.session?.startAt).toLocaleString('vi-VN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {registration.session?.mode === 'OFFLINE' ? (
                        <div className="flex items-center text-gray-600">
                          <MapPin size={18} className="mr-2" />
                          <span>Phòng: {registration.session?.room}</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-600">
                          <Video size={18} className="mr-2" />
                          <a
                            href={registration.session?.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Link tham gia
                          </a>
                        </div>
                      )}
                    </div>

                    {registration.session?.description && (
                      <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                        {registration.session.description}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Link
                      to={`/student/sessions/${registration.session?.id}`}
                      className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg text-center border border-blue-600"
                    >
                      Chi tiết
                    </Link>

                        {registration.session?.status === 'COMPLETED' && (
                          <Link
                            to={`/student/feedback/${registration.session?.id}`}
                            className="px-4 py-2 text-sm bg-blue-100 text-blue-600 hover:bg-blue-200 rounded text-center transition-colors"
                          >
                            Đánh giá
                          </Link>
                        )}

                    {['OPEN', 'PENDING'].includes(registration.session?.status) && (
                      <button
                        onClick={() => handleCancelRegistration(registration.session?.id)}
                        className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-600"
                      >
                        Hủy đăng ký
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default Schedule


