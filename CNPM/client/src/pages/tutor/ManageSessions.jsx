import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar as CalendarIcon, Plus } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import sessionService from '../../services/sessionService'
import MainLayout from '../../components/Layout/MainLayout'

const ManageSessions = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const [editFormData, setEditFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    date: '',
    location: '',
    description: '',
    capacity: ''
  })

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const response = await sessionService.getSessions({ mine: 'true' })
      setSessions(response.data || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
      toast.error('Không thể tải danh sách buổi tư vấn')
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

  const handleEditClick = (session) => {
    setSelectedSession(session)
    
    // Parse date and time
    const startDate = new Date(session.startAt)
    const endDate = new Date(session.endAt)
    
    setEditFormData({
      title: session.title || '',
      startTime: startDate.toTimeString().slice(0, 5),
      endTime: endDate.toTimeString().slice(0, 5),
      date: startDate.toISOString().split('T')[0],
      location: session.url || session.room || '',
      description: session.description || '',
      capacity: session.capacity || ''
    })
    
    setShowEditModal(true)
  }

  const handleEditChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    })
  }

  const handleSaveEdit = async () => {
    if (!selectedSession) return

    try {
      // Combine date and time
      const startAt = `${editFormData.date}T${editFormData.startTime}:00`
      const endAt = `${editFormData.date}T${editFormData.endTime}:00`
      
      const updateData = {
        title: editFormData.title,
        description: editFormData.description,
        mode: editFormData.location.toLowerCase().includes('http') ? 'ONLINE' : 'OFFLINE',
        room: editFormData.location.toLowerCase().includes('http') ? null : editFormData.location,
        url: editFormData.location.toLowerCase().includes('http') ? editFormData.location : null,
        startAt,
        endAt,
        capacity: parseInt(editFormData.capacity)
      }

      await sessionService.updateSession(selectedSession.id, updateData)
      
      setShowEditModal(false)
      setSuccessMessage('Lưu thành công')
      setShowSuccessModal(true)
      fetchSessions()
    } catch (error) {
      console.error('Error updating session:', error)
      const errorMessage = error?.response?.data?.error?.message || 'Không thể cập nhật buổi tư vấn'
      toast.error(errorMessage)
    }
  }

  const handleDeleteClick = (session) => {
    setSelectedSession(session)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedSession) return

    try {
      await sessionService.deleteSession(selectedSession.id)
      
      setShowDeleteModal(false)
      setSuccessMessage('Xóa lịch thành công')
      setShowSuccessModal(true)
      fetchSessions()
    } catch (error) {
      console.error('Error deleting session:', error)
      toast.error('Không thể xóa buổi tư vấn')
    }
  }

  const formatSessionDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatSessionTime = (dateString) => {
    const date = new Date(dateString)
    return date.toTimeString().slice(0, 5)
  }

  return (
    <MainLayout>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-yellow-50 rounded-t-2xl p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/tutor/dashboard')}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Thay đổi lịch
            </button>
            <button
              onClick={() => navigate('/tutor/sessions/create')}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Create Event
            </button>
          </div>
        </div>

        <div className="bg-white rounded-b-2xl shadow-sm p-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon size={64} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Chưa có buổi tư vấn nào</p>
              <button
                onClick={() => navigate('/tutor/sessions/create')}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Tạo buổi tư vấn
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {session.title}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📅</span>
                          <span>{formatSessionDate(session.startAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-base">🕐</span>
                          <span>{formatSessionTime(session.startAt)} - {formatSessionTime(session.endAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-base">📍</span>
                          <span>{session.mode === 'ONLINE' ? session.url : session.room}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-base">👥</span>
                          <span>{session.currentCount}/{session.capacity} sinh viên</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                          session.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                          session.status === 'FULL' ? 'bg-yellow-100 text-yellow-800' :
                          session.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 whitespace-nowrap">
                      <button
                        onClick={() => navigate(`/tutor/sessions/${session.id}/registrations`)}
                        className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                      >
                        Thông tin khác
                      </button>
                      <button
                        onClick={() => handleEditClick(session)}
                        className="px-4 py-2 text-sm font-medium bg-green-100 text-green-600 hover:bg-green-200 rounded-lg transition-colors"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteClick(session)}
                        className="px-4 py-2 text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold text-blue-500 text-center mb-6">
              Sửa lịch
            </h3>

            <div className="space-y-4">
              {/* Mô tả */}
              <div className="flex items-center gap-4">
                <label className="w-1/3 text-sm font-medium">Mô tả</label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  className="flex-1 px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Giờ */}
              <div className="flex items-center gap-4">
                <label className="w-1/3 text-sm font-medium">Giờ</label>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="time"
                    name="startTime"
                    value={editFormData.startTime}
                    onChange={handleEditChange}
                    className="px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <span>-</span>
                  <input
                    type="time"
                    name="endTime"
                    value={editFormData.endTime}
                    onChange={handleEditChange}
                    className="px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Ngày */}
              <div className="flex items-center gap-4">
                <label className="w-1/3 text-sm font-medium">Ngày *</label>
                <input
                  type="date"
                  name="date"
                  value={editFormData.date}
                  onChange={handleEditChange}
                  className="flex-1 px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Địa điểm */}
              <div className="flex items-center gap-4">
                <label className="w-1/3 text-sm font-medium">Địa điểm</label>
                <input
                  type="text"
                  name="location"
                  value={editFormData.location}
                  onChange={handleEditChange}
                  className="flex-1 px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Mô tả chi tiết */}
              <div className="flex items-start gap-4">
                <label className="w-1/3 text-sm font-medium pt-2">Mô tả</label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows={3}
                  className="flex-1 px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* Số lượng sinh viên */}
              <div className="flex items-center gap-4">
                <label className="w-1/3 text-sm font-medium">Số lượng sinh viên</label>
                <input
                  type="number"
                  name="capacity"
                  value={editFormData.capacity}
                  onChange={handleEditChange}
                  min="1"
                  className="flex-1 px-4 py-2 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-10 py-2.5 bg-white hover:bg-gray-50 text-blue-500 border-2 border-blue-500 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setShowDeleteModal(true)
                }}
                className="px-10 py-2.5 bg-white hover:bg-gray-50 text-blue-500 border-2 border-blue-500 font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              Bạn có muốn xóa buổi tư vấn?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-10 py-2.5 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              {successMessage}
            </h3>
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  )
}

export default ManageSessions
