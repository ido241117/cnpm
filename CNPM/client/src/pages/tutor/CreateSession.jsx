import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import sessionService from '../../services/sessionService'
import MainLayout from '../../components/Layout/MainLayout'

const CreateSession = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    title: '',
    startTime: '07:00',
    endTime: '08:00',
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
    if (!formData.title || !formData.date || !formData.capacity || !formData.startTime || !formData.endTime ||!formData.location) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }
    
    if((formData.registrationDeadline > formData.date) || (formData.registrationDeadline == formData.date && formData.registrationDeadlineTime > formData.startTime)){
      toast.error('Hạn đăng ký phải là trước khi diễn ra buổi tư vấn!')
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
    <MainLayout>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-blue-500 text-center mb-8">
            Add Schedule
          </h2>

          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            {/* Mô tả */}
            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-900">
                Tên buổi tư vấn
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
                Giờ <span className="text-red-500">*</span>
              </label>
              <div className="flex-1 flex items-center gap-4">
                  <input
                    type='time'
                    name="startTime"
                    required
                    value={formData.startTime}
                    onChange={handleChange}
                    className="px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                  </input>
                <span className="text-gray-500">-</span>
                  <input
                  type = 'time'
                  name="endTime"
                  required
                  value={formData.endTime}
                  onChange={handleChange}
                  className="px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                </input>
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
                Địa điểm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
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
                <input
                    type='time'
                    name="registrationDeadlineTime"
                    value={formData.registrationDeadlineTime}
                    onChange={handleChange}
                    className="px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500"
                  ></input>
              </div>
            </div>

            {/* Số lượng sinh viên */}
            <div className="flex items-center gap-4">
              <label className="w-1/4 text-sm font-medium text-gray-900">
                Số lượng sinh viên <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                max="100"
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
    </MainLayout>
  )
}

export default CreateSession
