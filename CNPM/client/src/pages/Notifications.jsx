import MainLayout from '../components/Layout/MainLayout'
import { useEffect, useState } from 'react'
import notificationService from '../services/notificationService'
import toast from 'react-hot-toast'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await notificationService.getNotifications()
      setNotifications(res.data || [])
    } catch (err) {
      console.error('Load notifications error', err)
      toast.error(err?.error?.message || 'Không thể tải thông báo')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    } catch (err) {
      console.error('Mark read error', err)
      toast.error('Không thể đánh dấu đã đọc')
    }
  }

  const handleMarkAll = async () => {
    try {
      await notificationService.markAllRead()
      setNotifications(prev => prev.map(n => ({ ...n, readAt: n.readAt || new Date().toISOString() })))
      toast.success('Đã đánh dấu tất cả là đã đọc')
    } catch (err) {
      console.error('Mark all read error', err)
      toast.error('Không thể đánh dấu tất cả')
    }
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Thông báo</h1>
          <div className="flex items-center gap-2">
            <button onClick={load} className="px-3 py-1 bg-white border rounded">Làm mới</button>
            <button onClick={handleMarkAll} className="px-3 py-1 bg-blue-500 text-white rounded">Đánh dấu đã đọc</button>
          </div>
        </div>

        <div className="bg-white rounded shadow p-4">
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-gray-600">Không có thông báo</div>
          ) : (
            <ul className="space-y-3">
              {notifications.map(n => (
                <li key={n.id} className={`p-3 rounded border ${n.readAt ? 'bg-gray-50' : 'bg-white shadow-sm'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-800 font-medium">{n.payload?.sessionTitle || n.type}</div>
                      <div className="text-sm text-gray-600 mt-1">{n.payload?.message || JSON.stringify(n.payload)}</div>
                      <div className="text-xs text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {!n.readAt && (
                        <button onClick={() => handleMarkRead(n.id)} className="px-3 py-1 bg-blue-500 text-white rounded text-sm">Đọc</button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default Notifications



