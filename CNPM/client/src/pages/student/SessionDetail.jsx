import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import MainLayout from '../../components/Layout/MainLayout'
import sessionService from '../../services/sessionService'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import Spinner from '../../components/common/Spinner'

const SessionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [joined, setJoined] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => { fetchData() }, [id])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await sessionService.getSession(id)
      setSession(res.data)

      // check if current user already registered
      const regsRes = await sessionService.getMyRegistrations()
      const regs = regsRes.data || []
      const isJoined = regs.some(r => (r.session && r.session.id) === id || r.sessionId === id)
      setJoined(isJoined)
    } catch (err) {
      console.error('Error loading session:', err)
      toast.error('Không thể tải thông tin buổi tư vấn')
      navigate('/student/sessions')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!session) return
    setActionLoading(true)
    try {
      await sessionService.registerSession(session.id)
      toast.success('Đăng ký thành công')
      setJoined(true)
      // optimistic update of counts
      setSession(prev => prev ? { ...prev, currentCount: (prev.currentCount || 0) + 1 } : prev)
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error?.message || 'Đăng ký không thành công')
    } finally { setActionLoading(false) }
  }

  const handleUnregister = async () => {
    if (!session) return
    setActionLoading(true)
    try {
      await sessionService.unregisterSession(session.id)
      toast.success('Hủy đăng ký thành công')
      setJoined(false)
      setSession(prev => prev ? { ...prev, currentCount: Math.max((prev.currentCount || 1) - 1, 0) } : prev)
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error?.message || 'Hủy đăng ký không thành công')
    } finally { setActionLoading(false) }
  }

  const formatDateTime = (ds) => {
    if (!ds) return ''
    const d = new Date(ds)
    return d.toLocaleString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
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

  if (!session) {
    return (
      <MainLayout>
        <div className="p-6">
          <p>Buổi tư vấn không tồn tại</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">{session.title}</h1>
              <p className="text-sm text-gray-600 mb-4">{formatDateTime(session.startAt)}</p>
              <div className="text-gray-700 mb-2">Giảng viên: <strong>{session.tutor?.name || 'N/A'}</strong></div>
              {session.mode === 'OFFLINE' ? (
                <div className="text-gray-700">Phòng: <strong>{session.room || 'Chưa có'}</strong></div>
              ) : (
                <div className="text-gray-700">Link: <a href={session.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mở đường dẫn</a></div>
              )}
            </div>

            <div className="text-right">
              <div className="mb-4 text-sm text-gray-600">Số lượng: <strong>{session.currentCount}/{session.capacity}</strong></div>
              {!joined ? (
                <button onClick={handleRegister} disabled={actionLoading || session.currentCount >= session.capacity} className="px-6 py-2 bg-blue-500 text-white rounded-lg">
                  {actionLoading ? 'Đang...' : (session.currentCount >= session.capacity ? 'Đã đầy' : 'Đăng ký')}
                </button>
              ) : (
                <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Đã đăng ký</span>
              )}
            </div>
          </div>

          {session.description && (
            <div className="mt-6 text-gray-700">
              <h3 className="font-medium mb-2">Mô tả</h3>
              <p className="whitespace-pre-line">{session.description}</p>
            </div>
          )}

          <div className="mt-6">
            <button onClick={() => navigate('/student/schedule')} className="px-4 py-2 bg-gray-100 rounded">Quay lại lịch</button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default SessionDetail



