import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import MainLayout from '../../components/Layout/MainLayout'
import { useAuth } from '../../contexts/AuthContext'
import sessionService from '../../services/sessionService'
import toast from 'react-hot-toast'

const SessionList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => { fetchSessions() }, [])

  async function fetchSessions() {
    setLoading(true)
    try {
      const res = await sessionService.getSessions()
      setSessions(res.data || [])
    } catch (err) {
      console.error(err)
      toast.error('Không thể tải danh sách buổi tư vấn')
    } finally { setLoading(false) }
  }

  const handleSessionClick = (session) => { setSelectedSession(session); setShowDetail(true) }
  const handleRegister = async () => {
    if (!selectedSession) return
    try { await sessionService.registerSession(selectedSession.id); setShowSuccessModal(true) }
    catch (err) { console.error(err); toast.error(err?.response?.data?.error?.message || 'Đăng ký không thành công') }
  }

  const getCurrentDate = () => {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const d = new Date(); return `${days[d.getDay()]}, ${d.getDate().toString().padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`
  }

  const formatSessionDate = (ds='') => ds ? new Date(ds).toLocaleDateString('vi-VN',{ weekday:'short', year:'numeric', month:'short', day:'numeric' }) : ''

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
                <button onClick={handleRegister} className="px-6 py-2 bg-blue-500 text-white rounded">Đăng ký</button>
                <button onClick={() => setShowDetail(false)} className="px-6 py-2 bg-gray-200 rounded">Trở lại</button>
              </div>
            </div>
            <div className="bg-white rounded p-6">Thông báo</div>
          </div>
        </main>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <input type="text" placeholder="Tìm kiếm" className="px-4 py-2 border rounded" onChange={(e)=>{ const q=e.target.value.toLowerCase(); if(!q) return fetchSessions(); setSessions(prev=>prev.filter(s=> (s.title||'').toLowerCase().includes(q) || (s.tutor?.name||'').toLowerCase().includes(q) ))}} />
          <div className="flex items-center gap-4">
            <button onClick={()=>navigate('/notifications')}><Bell size={20} /></button>
            <div className="text-sm">Welcome, {user?.name?.split(' ').pop() || 'User'}</div>
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
          <div className="bg-white rounded p-6">Thông báo</div>
        </div>
      </main>
    </MainLayout>
  )
}

export default SessionList
