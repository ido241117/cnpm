import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import MainLayout from '../../components/Layout/MainLayout'
import ErrorBoundary from '../../components/common/ErrorBoundary'
import { useAuth } from '../../contexts/AuthContext'
import sessionService from '../../services/sessionService'
import notificationService from '../../services/notificationService'
import toast from 'react-hot-toast'

const SessionList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [allSessions, setAllSessions] = useState([])
  const [joinedSessionIds, setJoinedSessionIds] = useState(new Set())
  const [tutorQuery, setTutorQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  // viewState: 1 = default (show Chọn tutor button),
  // 2 = tutor search + Gợi ý tutor / Thoát buttons,
  // 3 = subject + date inputs side-by-side + Thoát
  const [viewState, setViewState] = useState(1)
  const [selectedSession, setSelectedSession] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [notifLoading, setNotifLoading] = useState(false)

  useEffect(() => { fetchSessions() }, [])

  // load student's registrations
  const loadMyRegistrations = async () => {
    try {
      const res = await sessionService.getMyRegistrations()
      const regs = res.data || []
      const ids = new Set(regs.map(r => r.sessionId || (r.session && r.session.id) || r.sessionId))
      setJoinedSessionIds(ids)
    } catch (err) {
      console.error('Error loading my registrations', err)
    }
  }

  async function fetchSessions() {
    setLoading(true)
    try {
      const res = await sessionService.getSessions()
      const data = res.data || []
      setAllSessions(data)
      setSessions(data)
      // also load my registrations to mark joined sessions
      await loadMyRegistrations()
    } catch (err) {
      console.error(err)
      toast.error('Không thể tải danh sách buổi tư vấn')
    } finally { setLoading(false) }
  }

  // Notifications
  const loadNotifications = async () => {
    setNotifLoading(true)
    try {
      const res = await notificationService.getNotifications()
      setNotifications(res.data || [])
    } catch (err) {
      console.error('Error loading notifications', err)
    } finally {
      setNotifLoading(false)
    }
  }

  useEffect(() => { loadNotifications() }, [])

  const handleSessionClick = (session) => { setSelectedSession(session); setShowDetail(true) }
  const [actionLoading, setActionLoading] = useState(false)

  const handleRegister = async () => {
    if (!selectedSession) return
    setActionLoading(true)
    try {
      await sessionService.registerSession(selectedSession.id)
      // update local registration set
      setJoinedSessionIds(prev => new Set(prev).add(selectedSession.id))
      // update session counts locally
      setAllSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, currentCount: (s.currentCount || 0) + 1, status: ((s.currentCount || 0) + 1) >= s.capacity ? 'FULL' : s.status } : s))
      setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, currentCount: (s.currentCount || 0) + 1, status: ((s.currentCount || 0) + 1) >= s.capacity ? 'FULL' : s.status } : s))
      setSelectedSession(prev => prev ? { ...prev, currentCount: (prev.currentCount || 0) + 1, status: ((prev.currentCount || 0) + 1) >= prev.capacity ? 'FULL' : prev.status } : prev)
      setShowSuccessModal(true)
      toast.success('Đăng ký thành công')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error?.message || 'Đăng ký không thành công')
    } finally { setActionLoading(false) }
  }

  const handleUnregister = async () => {
    if (!selectedSession) return
    setActionLoading(true)
    try {
      await sessionService.unregisterSession(selectedSession.id)
      // remove from joined set
      setJoinedSessionIds(prev => {
        const n = new Set(prev)
        n.delete(selectedSession.id)
        return n
      })
      // update session counts locally
      setAllSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, currentCount: Math.max((s.currentCount || 1) - 1, 0), status: (s.status === 'FULL' ? 'OPEN' : s.status) } : s))
      setSessions(prev => prev.map(s => s.id === selectedSession.id ? { ...s, currentCount: Math.max((s.currentCount || 1) - 1, 0), status: (s.status === 'FULL' ? 'OPEN' : s.status) } : s))
      setSelectedSession(prev => prev ? { ...prev, currentCount: Math.max((prev.currentCount || 1) - 1, 0), status: (prev.status === 'FULL' ? 'OPEN' : prev.status) } : prev)
      toast.success('Hủy đăng ký thành công')
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.error?.message || 'Hủy đăng ký không thành công')
    } finally { setActionLoading(false) }
  }

  const getCurrentDate = () => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const d = new Date(); return `${days[d.getDay()]}, ${d.getDate().toString().padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`
  }

  const formatSessionDate = (ds='') => ds ? new Date(ds).toLocaleDateString('vi-VN',{ weekday:'short', year:'numeric', month:'short', day:'numeric' }) : ''

  const subjectsList = React.useMemo(() => {
    try {
      const subjects = new Set()
      ;(allSessions || []).forEach(s => (s.subjects || []).forEach(sub => subjects.add(sub)))
      return Array.from(subjects)
    } catch (err) {
      console.error('Error computing subjects list', err)
      return []
    }
  }, [allSessions])

  const applyFilters = (tutor = tutorQuery, subject = subjectFilter, date = dateFilter) => {
    let filtered = allSessions || []
    if (tutor && tutor.trim()) {
      const q = tutor.toLowerCase()
      filtered = filtered.filter(s => (s.tutor?.name || '').toLowerCase().includes(q))
    }
    if (subject) {
      filtered = filtered.filter(s => (s.subjects || []).includes(subject))
    }
    if (date) {
      // compare only date part (YYYY-MM-DD)
      filtered = filtered.filter(s => {
        if (!s.startAt) return false
        const sDate = new Date(s.startAt)
        const yyyy = sDate.getFullYear()
        const mm = String(sDate.getMonth() + 1).padStart(2, '0')
        const dd = String(sDate.getDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}` === date
      })
    }
    setSessions(filtered)
  }

  if (showDetail && selectedSession) {
    return (
      <MainLayout>
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-6 flex justify-end">
            <button onClick={() => setShowDetail(false)} className="px-6 py-2 bg-blue-500 text-white rounded">Thoát</button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded p-6">
              <h2 className="text-xl font-semibold mb-4">{selectedSession.title}</h2>
              <p className="text-sm text-gray-600">{formatSessionDate(selectedSession.startAt)}</p>
              <p className="mt-4">{selectedSession.description}</p>
              <div className="mt-6 flex gap-4">
                {joinedSessionIds.has(selectedSession.id) ? (
                  <button onClick={handleUnregister} disabled={actionLoading} className="px-6 py-2 bg-red-500 text-white rounded">Hủy đăng ký</button>
                ) : (
                  <button onClick={handleRegister} disabled={actionLoading} className="px-6 py-2 bg-blue-500 text-white rounded">{actionLoading ? 'Đang...' : 'Đăng ký'}</button>
                )}
                <button onClick={() => setShowDetail(false)} className="px-6 py-2 bg-gray-200 rounded">Trở lại</button>
              </div>
            </div>
            <div className="bg-white rounded p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Thông báo</h3>
                <button
                  onClick={async () => {
                    try {
                      await notificationService.markAllRead()
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
                      toast.success('Đã đánh dấu tất cả là đã đọc')
                    } catch (err) {
                      console.error(err)
                      toast.error('Không thể đánh dấu tất cả')
                    }
                  }}
                  className="text-sm text-blue-500 hover:underline"
                >
                  Đánh dấu tất cả
                </button>
              </div>

              {notifLoading ? (
                <p className="text-sm text-gray-500">Đang tải...</p>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-gray-500">Chưa có thông báo</p>
              ) : (
                <ul className="space-y-3 max-h-60 overflow-auto">
                  {notifications.slice(0,5).map(n => (
                    <li key={n.id} className="p-3 border rounded hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{n.message}</div>
                          <div className="text-xs text-gray-400 mt-1">{n.payload?.sessionTitle || new Date(n.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="ml-3 flex-shrink-0">
                          {!n.read && (
                            <button
                              onClick={async () => {
                                try {
                                  await notificationService.markRead(n.id)
                                  setNotifications(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
                                } catch (err) {
                                  console.error(err)
                                  toast.error('Không thể cập nhật thông báo')
                                }
                              }}
                              className="text-sm text-blue-500 hover:underline"
                            >
                              Đánh dấu
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 text-center">
                <button onClick={() => navigate('/notifications')} className="text-sm text-blue-600 hover:underline">Xem tất cả</button>
              </div>
            </div>
          </div>
        </main>
      </MainLayout>
    )
  }

  return (
    <ErrorBoundary>
    <MainLayout>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-100 via-white to-yellow-100 p-4 rounded-lg">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
              {/* Left area: big button / search / subject+date */}
              <div className="flex-1 w-full">
                {viewState === 1 && (
                  <div className="flex items-center">
                    <button
                      onClick={() => setViewState(2)}
                      className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md text-lg"
                    >
                      Chọn tutor
                    </button>
                  </div>
                )}

                {viewState === 2 && (
                  <div>
                    <input
                      type="text"
                      placeholder="Nhập tên hoặc mã số tutor"
                      value={tutorQuery}
                      onChange={(e) => { setTutorQuery(e.target.value); applyFilters(e.target.value, subjectFilter, dateFilter) }}
                      className="px-4 py-3 border rounded w-full"
                    />
                  </div>
                )}

                {viewState === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <select
                      value={subjectFilter}
                      onChange={(e) => { setSubjectFilter(e.target.value); applyFilters(tutorQuery, e.target.value, dateFilter) }}
                      className="px-4 py-3 border rounded w-full"
                    >
                      <option value="">Tất cả chuyên ngành</option>
                      {subjectsList.map((sub) => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>

                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => { setDateFilter(e.target.value); applyFilters(tutorQuery, subjectFilter, e.target.value) }}
                      className="px-4 py-3 border rounded w-full"
                    />
                  </div>
                )}
              </div>

              {/* Right area: action buttons depending on state */}
              <div className="flex items-center gap-3">
                {viewState === 2 && (
                  <>
                    <button onClick={() => setViewState(3)} className="px-4 py-2 bg-blue-500 text-white rounded">Gợi ý tutor</button>
                    <button onClick={() => { setViewState(1); setTutorQuery(''); setSubjectFilter(''); setDateFilter(''); applyFilters('', '', '') }} className="px-4 py-2 bg-white border rounded">Thoát</button>
                  </>
                )}

                {viewState === 3 && (
                  <>
                    <button onClick={() => { setViewState(1); setTutorQuery(''); setSubjectFilter(''); setDateFilter(''); applyFilters('', '', '') }} className="px-4 py-2 bg-white border rounded">Thoát</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded p-6">
            {loading ? <p>Đang tải...</p> : (
              sessions.length === 0 ? <p>Không có buổi tư vấn nào</p> : (
                <div className="space-y-3">{sessions.map(s => (
                  <div key={s.id} onClick={()=>handleSessionClick(s)} className="p-4 border rounded cursor-pointer">
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm text-gray-600">{formatSessionDate(s.startAt)}, {s.tutor?.name}</div>
                  </div>
                ))}</div>
              )
            )}
          </div>
          <div className="bg-white rounded p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Thông báo</h3>
            </div>
            {notifLoading ? (
              <p className="text-sm text-gray-500">Đang tải...</p>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-gray-500">Chưa có thông báo</p>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-auto">
                {notifications.slice(0,5).map(n => (
                  <li key={n.id} className="p-3 border rounded hover:bg-gray-50">
                    <div className={`text-sm ${n.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>{n.message}</div>
                    <div className="text-xs text-gray-400 mt-1">{n.payload?.sessionTitle || new Date(n.createdAt).toLocaleString()}</div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 text-center">
              <button onClick={() => navigate('/notifications')} className="text-sm text-blue-600 hover:underline">Xem tất cả</button>
            </div>
          </div>
        </div>
      </main>
    </MainLayout>
    </ErrorBoundary>
  )
}

export default SessionList
