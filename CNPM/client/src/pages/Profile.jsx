import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../components/Layout/MainLayout'
import toast from 'react-hot-toast'
import userService from '../services/userService'
import sessionService from '../services/sessionService'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('register')
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [registrations, setRegistrations] = useState([])
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    comment: '',
    question: ''
  })
  const [showFeedbackSavedModal, setShowFeedbackSavedModal] = useState(false)
  const [showFeedbackDraftModal, setShowFeedbackDraftModal] = useState(false)
  const [showCancelFeedbackModal, setShowCancelFeedbackModal] = useState(false)
  const [showFeedbackCancelledModal, setShowFeedbackCancelledModal] = useState(false)
  const [feedbackModalMessage, setFeedbackModalMessage] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    gender: '',
    class: '',
    dob: '',
    support: '',
    email: '',
    expertise: '',
    phone: '',
    faculty: ''
  })

  const [originalData, setOriginalData] = useState({})

  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || '',
        studentId: user.id?.slice(-6) || '',
        gender: user.gender || '',
        class: '',
        dob: user.dob || '',
        support: '',
        email: user.email || '',
        expertise: user.tutorProfile?.expertise?.join(', ') || '',
        phone: user.phone || '',
        faculty: user.faculty || ''
      }
      setFormData(data)
      setOriginalData(data)
    }
    fetchRegistrations()
  }, [user])

  const fetchRegistrations = async () => {
    try {
      const response = await sessionService.getMyRegistrations()
      setRegistrations(response.data || [])
    } catch (error) {
      console.error('Error fetching registrations:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setShowConfirmModal(true)
  }

  const handleConfirmSave = async () => {
    setShowConfirmModal(false)
    try {
      const res = await userService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        faculty: formData.faculty
      })
      // If server returned updated user, update context + localStorage so UI reflects changes immediately
      if (res && res.data) {
        updateUser(res.data)
      }
      setOriginalData(formData)
      setIsEditing(false)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error saving profile:', error)
      toast.error('Không thể lưu thông tin. Vui lòng thử lại.')
    }
  }

  const handleCancel = () => {
    setFormData(originalData)
    setIsEditing(false)
  }

  const getCurrentDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const date = new Date()
    return `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const handleOpenFeedback = async (session) => {
    setSelectedSession(session)
    
    // Try to load existing feedback (draft or saved)
    try {
      const feedbackRes = await sessionService.getMyFeedback(session.id)
      if (feedbackRes.data) {
        setFeedbackData({
          rating: feedbackRes.data.rating || 0,
          comment: feedbackRes.data.comment || '',
          question: feedbackRes.data.question || ''
        })
      } else {
        // No existing feedback, start fresh
        setFeedbackData({ rating: 0, comment: '', question: '' })
      }
    } catch (error) {
      // No existing feedback found, start fresh
      console.log('No existing feedback found')
      setFeedbackData({ rating: 0, comment: '', question: '' })
    }
    
    setShowFeedbackModal(true)
  }

  const handleFeedbackChange = (field, value) => {
    setFeedbackData({ ...feedbackData, [field]: value })
  }

  const handleSaveFeedback = async () => {
    if (!selectedSession || feedbackData.rating === 0) {
      toast.error('Vui lòng chọn mức độ hài lòng')
      return
    }
    
    try {
      await sessionService.submitFeedback(selectedSession.id, {
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        question: feedbackData.question,
        state: 'SAVED'
      })
      
      // Reset form về mặc định
      setFeedbackData({ rating: 0, comment: '', question: '' })
      
      // Đóng modal và hiển thị thông báo
      setShowFeedbackModal(false)
      setFeedbackModalMessage('Phản hồi đã được ghi nhận')
      setShowFeedbackSavedModal(true)
      fetchRegistrations()
    } catch (error) {
      console.error('Error saving feedback:', error)
      toast.error('Không thể lưu phản hồi')
    }
  }

  const handleDraftFeedback = async () => {
    if (!selectedSession) return
    
    try {
      await sessionService.submitFeedback(selectedSession.id, {
        rating: feedbackData.rating || 0,
        comment: feedbackData.comment,
        question: feedbackData.question,
        state: 'DRAFT'
      })
      setShowFeedbackModal(false)
      setFeedbackModalMessage('Phản hồi đã được lưu trữ')
      setShowFeedbackDraftModal(true)
    } catch (error) {
      console.error('Error drafting feedback:', error)
      toast.error('Không thể lưu trữ phản hồi')
    }
  }

  const handleCancelFeedback = () => {
    setShowCancelFeedbackModal(true)
  }

  const handleConfirmCancelFeedback = async () => {
    if (!selectedSession) return
    
    setShowCancelFeedbackModal(false)
    
    try {
      // Delete feedback from database
      await sessionService.deleteFeedback(selectedSession.id)
      
      // Reset form
      setFeedbackData({ rating: 0, comment: '', question: '' })
      
      // Close modal and show success message
      setShowFeedbackModal(false)
      setFeedbackModalMessage('Phản hồi đã được hủy')
      setShowFeedbackCancelledModal(true)
    } catch (error) {
      console.error('Error deleting feedback:', error)
      // If no feedback exists, that's ok - just reset the form
      if (error?.response?.status === 404) {
        setFeedbackData({ rating: 0, comment: '', question: '' })
        setShowFeedbackModal(false)
        setFeedbackModalMessage('Phản hồi đã được hủy')
        setShowFeedbackCancelledModal(true)
      } else {
        toast.error('Không thể xóa phản hồi')
        setShowCancelFeedbackModal(false)
      }
    }
  }

  const formatSessionTime = (session) => {
    if (!session) return { date: '', day: '', checkin: '', checkout: '', duration: '' }
    
    const start = new Date(session.startAt)
    const end = new Date(session.endAt)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    
    const duration = Math.floor((end - start) / (1000 * 60 * 60))
    const minutes = Math.floor(((end - start) % (1000 * 60 * 60)) / (1000 * 60))
    
    return {
      date: start.toLocaleDateString('en-GB'),
      day: days[start.getDay()],
      checkin: start.toTimeString().slice(0, 5),
      checkout: end.toTimeString().slice(0, 5),
      duration: `${duration}h ${minutes}m`
    }
  }

  return (
    <MainLayout>
      <div className="px-6 py-8">
        {/* Tabs */}
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-yellow-50 rounded-t-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/student/sessions')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Đăng ký tư vấn
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'schedule'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Lịch trình
              </button>
            </div>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Thoát
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-2xl shadow-sm p-8">
          {activeTab === 'register' ? (
            <form className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã số sinh viên
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lớp
                </label>
                <input
                  type="text"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày tháng năm sinh
                </label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhu cầu hỗ trợ
                </label>
                <input
                  type="text"
                  name="support"
                  value={formData.support}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lĩnh vực chuyên môn
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Khoa
                </label>
                <select
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
                >
                  <option value="">Chọn khoa</option>
                  <option value="Công nghệ thông tin">Công nghệ thông tin</option>
                  <option value="Kỹ thuật máy tính">Kỹ thuật máy tính</option>
                  <option value="Kinh tế">Kinh tế</option>
                  <option value="Quản trị">Quản trị</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
          ) : (
            <div className="space-y-6">
              {/* Schedule Table */}
              {registrations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">Chưa có buổi tư vấn nào</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Day
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-in
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ----
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Check-out
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Work hours
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {registrations.map((registration) => {
                        const timeInfo = formatSessionTime(registration.session)
                        const isCompleted = registration.session?.status === 'COMPLETED'
                        
                        return (
                          <tr key={registration.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {timeInfo.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {timeInfo.day}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              {timeInfo.checkin}
                            </td>
                            <td className="px-6 py-4 text-center text-gray-400">
                              ----
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              {timeInfo.checkout}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {timeInfo.duration}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              {isCompleted ? (
                                <button
                                  onClick={() => handleOpenFeedback(registration.session)}
                                  className="px-4 py-1.5 bg-blue-100 text-blue-600 rounded text-sm hover:bg-blue-200 transition-colors"
                                >
                                  Đánh giá
                                </button>
                              ) : (
                                <span className="text-gray-400 text-sm">-</span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-blue-400">
            <h3 className="text-xl font-semibold text-blue-600 text-center mb-6">
              Bạn có chắc muốn lưu những thay đổi?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-blue-400">
            <h3 className="text-xl font-semibold text-blue-600 text-center mb-6">
              Lưu thành công
            </h3>
            <div className="flex justify-center">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4">
            <div className="space-y-6">
              {/* Question 1 - với border đặc biệt khi focus */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  1. Nội dung đánh giá
                </label>
                <textarea
                  value={feedbackData.comment}
                  onChange={(e) => handleFeedbackChange('comment', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  placeholder=""
                />
              </div>

              {/* Question 2 */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  2. Câu hỏi khảo sát ...
                </label>
                <textarea
                  value={feedbackData.question}
                  onChange={(e) => handleFeedbackChange('question', e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 transition-colors resize-none"
                  placeholder=""
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  3. Mức độ hài lòng
                </label>
                <div className="flex justify-center space-x-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleFeedbackChange('rating', num)}
                      className={`w-20 h-12 rounded-lg border-2 font-semibold text-lg transition-all ${
                        feedbackData.rating === num
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3 mt-8">
              <button
                onClick={handleSaveFeedback}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Lưu
              </button>
              <button
                onClick={handleDraftFeedback}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Lưu Trữ
              </button>
              <button
                onClick={handleCancelFeedback}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Saved Modal */}
      {showFeedbackSavedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              {feedbackModalMessage}
            </h3>
            <div className="flex justify-center">
              <button
                onClick={() => setShowFeedbackSavedModal(false)}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Draft Modal */}
      {showFeedbackDraftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              {feedbackModalMessage}
            </h3>
            <div className="flex justify-center">
              <button
                onClick={() => setShowFeedbackDraftModal(false)}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Feedback Confirmation Modal */}
      {showCancelFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              Chắc chắn hủy phản hồi?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowCancelFeedbackModal(false)}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCancelFeedback}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Cancelled Modal */}
      {showFeedbackCancelledModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              {feedbackModalMessage}
            </h3>
            <div className="flex justify-center">
              <button
                onClick={() => setShowFeedbackCancelledModal(false)}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </MainLayout>
  )
}

export default Profile


