import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, BookOpen, Star } from 'lucide-react'
import MainLayout from '../../components/Layout/MainLayout'
import sessionService from '../../services/sessionService'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    students: 0,
    completed: 0
  })
  const [mySessions, setMySessions] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await sessionService.getSessions({ mine: 'true' })
      const sessions = response.data || []

      let totalStudents = 0
      sessions.forEach(s => {
        totalStudents += s.currentCount || 0
      })

      setStats({
        total: sessions.length,
        upcoming: sessions.filter(s => ['OPEN', 'PENDING'].includes(s.status)).length,
        students: totalStudents,
        completed: sessions.filter(s => s.status === 'COMPLETED').length
      })

      const upcoming = sessions
        .filter(s => ['OPEN', 'PENDING'].includes(s.status))
        .slice(0, 3)
      setMySessions(upcoming)

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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Giảng viên</h1>
          <p className="mt-2 text-gray-600">Quản lý buổi tư vấn của bạn</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng buổi tư vấn</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sắp diễn ra</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.upcoming}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sinh viên tham gia</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.students}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Users size={24} className="text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã hoàn thành</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{stats.completed}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Star size={24} className="text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* My upcoming sessions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Buổi tư vấn sắp tới</h2>
            <Link to="/tutor/sessions" className="text-sm text-blue-600 hover:text-blue-700">
              Xem tất cả →
            </Link>
          </div>

          {mySessions.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">Chưa có buổi tư vấn nào</p>
              <Link
                to="/tutor/sessions/create"
                className="inline-block mt-4 text-blue-600 hover:text-blue-700"
              >
                Tạo buổi tư vấn →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {mySessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{session.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {session.mode === 'OFFLINE' ? `📍 ${session.room}` : '🌐 Online'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(session.startAt).toLocaleDateString('vi-VN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {session.currentCount}/{session.capacity}
                      </p>
                      <p className="text-xs text-gray-500">Sinh viên</p>
                    </div>
                    <Link
                      to={`/tutor/sessions/${session.id}/registrations`}
                      className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      Chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/tutor/sessions/create"
            className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white hover:shadow-lg transition-shadow"
          >
            <BookOpen size={32} className="mb-3" />
            <h3 className="text-xl font-semibold mb-2">Tạo buổi tư vấn mới</h3>
            <p className="text-blue-100">
              Tạo buổi tư vấn mới cho sinh viên
            </p>
          </Link>

          <Link
            to="/tutor/sessions"
            className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-sm p-6 text-white hover:shadow-lg transition-shadow"
          >
            <Calendar size={32} className="mb-3" />
            <h3 className="text-xl font-semibold mb-2">Quản lý buổi tư vấn</h3>
            <p className="text-purple-100">
              Xem và chỉnh sửa các buổi tư vấn đã tạo
            </p>
          </Link>
        </div>
      </div>
    </MainLayout>
  )
}

export default Dashboard



