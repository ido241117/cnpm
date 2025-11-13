import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import sessionService from '../../services/sessionService'

const CreateSession = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    startTime: '02:30',
    endTime: '05:30',
    date: '',
    location: '',
    description: '',
    registrationDeadline: '',
    registrationDeadlineTime: '02:30',
    capacity: ''
  })

  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const getCurrentDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const date = new Date()
    return `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validation
    if (!formData.title || !formData.date || !formData.capacity) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    setLoading(true)

    try {
      // Combine date and time
      const startAt = `${formData.date}T${formData.startTime}:00`
      const endAt = `${formData.date}T${formData.endTime}:00`
      
      const sessionData = {
        title: formData.title,
        description: formData.description,
        mode: formData.location.toLowerCase().includes('http') ? 'ONLINE' : 'OFFLINE',
        room: formData.location.toLowerCase().includes('http') ? null : formData.location,
        url: formData.location.toLowerCase().includes('http') ? formData.location : null,
        startAt,
        endAt,
        capacity: parseInt(formData.capacity),
        subjects: []
      }

      await sessionService.createSession(sessionData)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error creating session:', error)
      const errorMessage = error?.response?.data?.error?.message || 'Không thể tạo buổi tư vấn'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setFormData({
      title: '',
      startTime: '02:30',
      endTime: '05:30',
      date: '',
      location: '',
      description: '',
      registrationDeadline: '',
      registrationDeadlineTime: '02:30',
      capacity: ''
    })
  }

  const handleSuccessOk = () => {
    setShowSuccessModal(false)
    navigate('/tutor/sessions')
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
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-yellow-50 rounded-t-2xl p-6">
          <button
            onClick={() => navigate('/tutor/dashboard')}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
          >
            Tạo buổi tư vấn
          </button>
        </div>

        <div className="bg-white rounded-b-2xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-blue-500 text-center mb-8">
            Add Schedule
          </h2>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            {/* Mô tả */}
            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-900">
                Mô tả
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Set a conference topic before it starts"
                className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Giờ */}
            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-900">
                Giờ
              </label>
              <div className="flex-1 flex items-center gap-4">
                <select
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="02:30">02:30</option>
                  <option value="05:30">05:30</option>
                  <option value="08:00">08:00</option>
                  <option value="10:00">10:00</option>
                  <option value="14:00">14:00</option>
                  <option value="16:00">16:00</option>
                </select>
                <span className="text-gray-500">-</span>
                <select
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="05:30">05:30</option>
                  <option value="08:00">08:00</option>
                  <option value="10:00">10:00</option>
                  <option value="12:00">12:00</option>
                  <option value="16:00">16:00</option>
                  <option value="18:00">18:00</option>
                </select>
              </div>
            </div>

            {/* Ngày */}
            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-900">
                Ngày <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Địa điểm */}
            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-900">
                Địa điểm
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Phòng H6-101 hoặc https://meet.google.com/..."
                className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Mô tả chi tiết */}
            <div className="flex items-start gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-900 pt-3">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            {/* Hạn đăng ký */}
            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-900">
                Hạn đăng ký
              </label>
              <div className="flex-1 flex items-center gap-4">
                <input
                  type="date"
                  name="registrationDeadline"
                  value={formData.registrationDeadline}
                  onChange={handleChange}
                  className="px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <select
                  name="registrationDeadlineTime"
                  value={formData.registrationDeadlineTime}
                  onChange={handleChange}
                  className="px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="02:30">02:30</option>
                  <option value="08:00">08:00</option>
                  <option value="12:00">12:00</option>
                  <option value="18:00">18:00</option>
                </select>
              </div>
            </div>

            {/* Số lượng sinh viên */}
            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-900">
                Số lượng sinh viên
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                max="50"
                required
                className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              <button
                type="button"
                onClick={handleReset}
                className="px-10 py-2.5 bg-white hover:bg-gray-50 text-blue-500 border-2 border-blue-500 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              Lưu thành công
            </h3>
            <div className="flex justify-center">
              <button
                onClick={handleSuccessOk}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateSession
