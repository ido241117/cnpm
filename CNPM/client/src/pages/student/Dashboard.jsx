import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, BookOpen, Clock, TrendingUp } from 'lucide-react'
import MainLayout from '../../components/Layout/MainLayout'
import sessionService from '../../services/sessionService'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    upcoming: 0,
    total: 0,
    completed: 0
  })
  const [upcomingSessions, setUpcomingSessions] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [sessionsRes, myRegistrationsRes] = await Promise.all([
        sessionService.getSessions({ status: 'OPEN' }),
        sessionService.getMyRegistrations()
      ])

      const registrations = myRegistrationsRes.data || []
      
      setStats({
        upcoming: registrations.filter(r => r.session.status === 'OPEN').length,
        total: registrations.length,
        completed: registrations.filter(r => r.session.status === 'COMPLETED').length
      })

      // Get upcoming sessions (registered ones)
      const upcoming = registrations
        .filter(r => ['OPEN', 'PENDING'].includes(r.session?.status))
        .slice(0, 3)
      setUpcomingSessions(upcoming)

    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

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
        {/* Welcome */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Chào mừng bạn đến với hệ thống tư vấn</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Buổi sắp tới</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.upcoming}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng đã đăng ký</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.completed}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming sessions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Buổi tư vấn sắp tới</h2>
            <Link to="/student/schedule" className="text-sm text-blue-600 hover:text-blue-700">
              Xem tất cả →
            </Link>
          </div>

          {upcomingSessions.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">Bạn chưa đăng ký buổi nào</p>
              <Link
                to="/student/sessions"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700"
              >
                Tìm buổi tư vấn →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSessions.map((registration) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {registration.session?.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {registration.session?.tutor?.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(registration.session?.startAt).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Link
                    to={`/student/sessions/${registration.session?.id}`}
                    className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    Chi tiết
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/student/sessions"
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white hover:shadow-lg transition-shadow"
          >
            <BookOpen size={32} className="mb-3" />
            <h3 className="text-xl font-semibold mb-2">Tìm buổi tư vấn</h3>
            <p className="text-blue-100">
              Khám phá các buổi tư vấn có sẵn và đăng ký ngay
            </p>
          </Link>

          <Link
            to="/student/schedule"
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white hover:shadow-lg transition-shadow"
          >
            <Calendar size={32} className="mb-3" />
            <h3 className="text-xl font-semibold mb-2">Lịch của tôi</h3>
            <p className="text-purple-100">
              Xem và quản lý các buổi tư vấn đã đăng ký
            </p>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard



