import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import MainLayout from '../../components/Layout/MainLayout'
import toast from 'react-hot-toast'
import userService from '../../services/userService'

const TutorProfile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('info')
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    staffId: '',
    gender: '',
    faculty: '',
    dob: '',
    expertise: '',
    email: '',
    phone: ''
  })

  const [originalData, setOriginalData] = useState({})

  useEffect(() => {
    if (user) {
      const data = {
        name: user.name || '',
        staffId: user.id?.slice(-6) || '',
        gender: user.gender || '',
        faculty: user.faculty || '',
        dob: user.dob || '',
        expertise: user.tutorProfile?.expertise?.join(', ') || '',
        email: user.email || '',
        phone: user.phone || ''
      }
      setFormData(data)
      setOriginalData(data)
    }
  }, [user])

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
      await userService.updateProfile({
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        faculty: formData.faculty,
        tutorProfile: {
          expertise: formData.expertise.split(',').map(e => e.trim()).filter(Boolean)
        }
      })
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

  return (
    <MainLayout>
      <div className="px-6 py-8">
        {/* Tabs */}
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-yellow-50 rounded-t-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/tutor/sessions/create')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Tạo buổi tư vấn
              </button>
              <button
                onClick={() => navigate('/tutor/sessions')}
                className="px-6 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Thay đổi lịch
              </button>
            </div>
            <button
              onClick={() => navigate('/tutor/dashboard')}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Thoát
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-2xl shadow-sm p-8">
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
                  Mã số
                </label>
                <input
                  type="text"
                  name="staffId"
                  value={formData.staffId}
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
                  Lĩnh vực chuyên môn
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={formData.expertise}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Nhập các lĩnh vực, phân cách bằng dấu phẩy"
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
        </div>
      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              Bạn có chắc muốn lưu những thay đổi?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-10 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm"
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
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-medium text-blue-500 text-center mb-8">
              Lưu thành công
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
      </div>
    </MainLayout>
  )
}

export default TutorProfile


