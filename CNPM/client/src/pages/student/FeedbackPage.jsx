import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import MainLayout from '../../components/Layout/MainLayout'
import toast from 'react-hot-toast'
import sessionService from '../../services/sessionService'

const FeedbackPage = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [feedbackData, setFeedbackData] = useState({
    rating: 0,
    comment: '',
    question: ''
  })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSavedModal, setShowSavedModal] = useState(false)
  const [showDraftModal, setShowDraftModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showCancelledModal, setShowCancelledModal] = useState(false)
  const [modalMessage, setModalMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [sessionId])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Get session info
      const sessionRes = await sessionService.getSession(sessionId)
      setSession(sessionRes.data)

      // Try to load existing feedback (draft or saved)
      try {
        const feedbackRes = await sessionService.getMyFeedback(sessionId)
        if (feedbackRes.data) {
          setFeedbackData({
            rating: feedbackRes.data.rating || 0,
            comment: feedbackRes.data.comment || '',
            question: feedbackRes.data.question || ''
          })
        }
      } catch (error) {
        // No existing feedback, that's ok
        console.log('No existing feedback found')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Không thể tải thông tin buổi tư vấn')
      navigate('/student/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleFeedbackChange = (field, value) => {
    setFeedbackData({ ...feedbackData, [field]: value })
  }

  const handleSaveFeedback = async () => {
    if (feedbackData.rating === 0) {
      toast.error('Vui lòng chọn mức độ hài lòng')
      return
    }
    
    try {
      await sessionService.submitFeedback(sessionId, {
        rating: feedbackData.rating,
        comment: feedbackData.comment,
        question: feedbackData.question,
        state: 'SAVED'
      })
      
      // Reset form về mặc định
      setFeedbackData({ rating: 0, comment: '', question: '' })
      
      // Hiển thị thông báo
      setModalMessage('Phản hồi đã được ghi nhận')
      setShowSavedModal(true)
    } catch (error) {
      console.error('Error saving feedback:', error)
      toast.error('Không thể lưu phản hồi')
    }
  }

  const handleDraftFeedback = async () => {
    try {
      await sessionService.submitFeedback(sessionId, {
        rating: feedbackData.rating || 0,
        comment: feedbackData.comment,
        question: feedbackData.question,
        state: 'DRAFT'
      })
      setModalMessage('Phản hồi đã được lưu trữ')
      setShowDraftModal(true)
    } catch (error) {
      console.error('Error drafting feedback:', error)
      toast.error('Không thể lưu trữ phản hồi')
    }
  }

  const handleCancelFeedback = () => {
    setShowCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    setShowCancelModal(false)
    
    try {
      // Delete feedback from database
      await sessionService.deleteFeedback(sessionId)
      
      // Reset form
      setFeedbackData({ rating: 0, comment: '', question: '' })
      
      // Show success message
      setModalMessage('Phản hồi đã được hủy')
      setShowCancelledModal(true)
    } catch (error) {
      console.error('Error deleting feedback:', error)
      // If no feedback exists, that's ok - just reset the form
      if (error?.response?.status === 404) {
        setFeedbackData({ rating: 0, comment: '', question: '' })
        setModalMessage('Phản hồi đã được hủy')
        setShowCancelledModal(true)
      } else {
        toast.error('Không thể xóa phản hồi')
      }
    }
  }

  const handleCloseCancelledModal = () => {
    setShowCancelledModal(false)
    navigate('/student/dashboard')
  }

  const handleCloseSavedModal = () => {
    setShowSavedModal(false)
    navigate('/student/dashboard')
  }

  const getCurrentDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const date = new Date()
    return `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-yellow-50 rounded-t-2xl p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Đánh giá buổi tư vấn</h1>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Thoát
            </button>
          </div>
          {session && (
            <p className="text-sm text-gray-600 mt-2">
              {session.title} - {session.tutor?.name}
            </p>
          )}
        </div>

        <div className="bg-white rounded-b-2xl shadow-sm p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Question 1 */}
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

            {/* Action Buttons */}
            <div className="flex justify-center space-x-3 mt-8 pt-6">
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
      </main>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              Chắc chắn hủy phản hồi?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Modal */}
      {showSavedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              {modalMessage}
            </h3>
            <div className="flex justify-center">
              <button
                onClick={handleCloseSavedModal}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Draft Modal */}
      {showDraftModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              {modalMessage}
            </h3>
            <div className="flex justify-center">
              <button
                onClick={() => setShowDraftModal(false)}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Oke
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancelled Modal */}
      {showCancelledModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              {modalMessage}
            </h3>
            <div className="flex justify-center">
              <button
                onClick={handleCloseCancelledModal}
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

export default FeedbackPage
