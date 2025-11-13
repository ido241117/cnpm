import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Bell, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import sessionService from '../../services/sessionService'

const SessionList = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const majorDropdownRef = useRef(null)
  const calendarDropdownRef = useRef(null)
  const [activeTab, setActiveTab] = useState('major')
  const [showMajorDropdown, setShowMajorDropdown] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedMajor, setSelectedMajor] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState('11:38')
  const [timePeriod, setTimePeriod] = useState('AM')
  const [sessions, setSessions] = useState([])
  const [allSessions, setAllSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showSearchTutor, setShowSearchTutor] = useState(false)
  const [tutorSearchQuery, setTutorSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState('filter') // 'filter' or 'registered'

  const majors = [
    'Lập trình web',
    'Cơ sở dữ liệu',
    'Machine Learning',
    'Deep Learning',
    'Mobile Development',
    'DevOps'
  ]

  useEffect(() => {
    fetchSessions()
  }, [])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (majorDropdownRef.current && !majorDropdownRef.current.contains(event.target)) {
        setShowMajorDropdown(false)
      }
      if (calendarDropdownRef.current && !calendarDropdownRef.current.contains(event.target)) {
        setShowCalendar(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchSessions = async () => {
    setLoading(true)
    try {
      const response = await sessionService.getSessions({ status: 'OPEN' })
      const sessionData = response.data || []
      setAllSessions(sessionData)
      setSessions(sessionData)
    } catch (error) {
      console.error('Error fetching sessions:', error)
      toast.error('Không thể tải danh sách buổi tư vấn')
    } finally {
      setLoading(false)
    }
  }

  const filterSessionsByMajor = (major) => {
    if (!major) {
      setSessions(allSessions)
    } else {
      const filtered = allSessions.filter(session => 
        session.subjects?.some(subject => 
          subject.toLowerCase().includes(major.toLowerCase())
        )
      )
      setSessions(filtered)
    }
  }

  const filterSessionsByDate = (date) => {
    const selectedDateStr = date.toDateString()
    const filtered = allSessions.filter(session => {
      const sessionDate = new Date(session.startAt).toDateString()
      return sessionDate === selectedDateStr
    })
    setSessions(filtered)
    setShowCalendar(false)
  }

  const handleSessionClick = (session) => {
    setSelectedSession(session)
    setShowDetail(true)
  }

  const handleRegister = async () => {
    if (!selectedSession) return
    
    try {
      await sessionService.registerSession(selectedSession.id)
      toast.success('Đăng ký thành công!')
      setShowDetail(false)
      setShowSuccessModal(true)
      setViewMode('registered') // Chuyển sang chế độ xem sau khi đăng ký
      fetchSessions()
    } catch (error) {
      console.error('Error registering:', error)
      const errorMessage = error?.response?.data?.error?.message || error?.error?.message || 'Không thể đăng ký'
      toast.error(errorMessage)
    }
  }

  const filterSessionsByTutorName = (query) => {
    setTutorSearchQuery(query)
    if (!query.trim()) {
      setSessions(allSessions)
    } else {
      const filtered = allSessions.filter(session => 
        session.tutor?.name?.toLowerCase().includes(query.toLowerCase())
      )
      setSessions(filtered)
    }
  }

  const getCurrentDate = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const date = new Date()
    return `${days[date.getDay()]}, ${date.getDate().toString().padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const formatSessionDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const renderCalendar = () => {
    const year = selectedDate.getFullYear()
    const month = selectedDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const days = []
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i)
      const isSelected = i === selectedDate.getDate() && 
                        month === selectedDate.getMonth() && 
                        year === selectedDate.getFullYear()
      days.push(
        <button
          key={i}
          onClick={() => {
            setSelectedDate(currentDate)
            filterSessionsByDate(currentDate)
          }}
          className={`p-2 text-center rounded hover:bg-blue-50 transition-colors ${
            isSelected ? 'bg-blue-500 text-white' : 'text-gray-700'
          }`}
        >
          {i}
        </button>
      )
    }
    
    return days
  }

  const changeMonth = (delta) => {
    const newDate = new Date(selectedDate)
    newDate.setMonth(newDate.getMonth() + delta)
    setSelectedDate(newDate)
  }

  if (showSearchTutor) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/student/dashboard')}
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

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-yellow-50 rounded-2xl p-6 mb-6">
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Nhập tên giảng viên (ví dụ: Diệu)"
                value={tutorSearchQuery}
                onChange={(e) => filterSessionsByTutorName(e.target.value)}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button 
                onClick={() => filterSessionsByTutorName(tutorSearchQuery)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Tìm kiếm
              </button>
              <button
                onClick={() => {
                  setShowSearchTutor(false)
                  setTutorSearchQuery('')
                  setSessions(allSessions)
                }}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Thoát
              </button>
            </div>
            {tutorSearchQuery && (
              <p className="text-sm text-gray-600 mt-3">
                Tìm kiếm: <span className="font-medium text-blue-600">{tutorSearchQuery}</span>
                {` - Tìm thấy ${sessions.length} kết quả`}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-2xl shadow-sm p-6">
              {sessions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    {tutorSearchQuery 
                      ? `Không tìm thấy giảng viên nào với từ khóa "${tutorSearchQuery}"`
                      : 'Không có buổi tư vấn nào'
                    }
                  </p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSessionClick(session)}
                    className="p-4 border border-gray-200 rounded-lg mb-3 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <p className="font-medium text-gray-900">{session.title}</p>
                    <p className="text-sm text-gray-600">
                      {formatSessionDate(session.startAt)}, <span className="font-medium text-blue-600">{session.tutor?.name}</span>
                    </p>
                    {session.subjects && session.subjects.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {session.subjects.map((subject, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {subject}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Thông báo</h3>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Lớp.....</p>
                  <p className="text-xs text-gray-600">Ngày tháng</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (showDetail && selectedSession) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => navigate('/student/dashboard')}
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

        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-yellow-50 rounded-2xl p-6 mb-6 flex justify-end">
            <button
              onClick={() => setShowDetail(false)}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Thoát
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-center mb-6">Lớp</h2>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Thời gian:</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedSession.startAt).toLocaleString('vi-VN')} - {new Date(selectedSession.endAt).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hình thức:</p>
                  <p className="font-medium text-gray-900">{selectedSession.mode === 'ONLINE' ? 'Online' : 'Offline'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Link:</p>
                  <p className="font-medium text-gray-900">{selectedSession.url || selectedSession.room || 'Chưa có thông tin'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nội dung yêu cầu cần khác...:</p>
                  <p className="font-medium text-gray-900">{selectedSession.description}</p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRegister}
                  className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Tham gia
                </button>
                <button
                  onClick={() => setShowDetail(false)}
                  className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  Trở lại
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Thông báo</h3>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Lớp.....</p>
                  <p className="text-xs text-gray-600">Ngày tháng</p>
                </div>
              ))}
            </div>
          </div>
        </main>

        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 border-2 border-blue-400">
              <h3 className="text-xl font-semibold text-blue-600 text-center mb-6">
                Lưu thành công
              </h3>
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setShowSuccessModal(false)
                    setShowDetail(false)
                  }}
                  className="px-8 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/student/dashboard')}
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

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-yellow-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            {viewMode === 'filter' ? (
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setActiveTab('major')
                    setShowCalendar(false)
                    setShowMajorDropdown(!showMajorDropdown)
                  }}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === 'major'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Chuyên ngành
                </button>
              <button
                onClick={() => {
                  setActiveTab('time')
                  setShowCalendar(!showCalendar)
                  setShowMajorDropdown(false)
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'time'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Thời gian
              </button>
                <button
                  onClick={() => setShowSearchTutor(true)}
                  className="px-6 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
                >
                  Chọn tutor
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowSearchTutor(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Chọn tutor
                </button>
              </div>
            )}
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
            >
              Thoát
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-2xl shadow-sm p-6 relative">
            {viewMode === 'filter' && activeTab === 'major' && showMajorDropdown && (
              <div 
                ref={majorDropdownRef}
                className="absolute top-4 left-4 z-10 w-64 bg-white border-2 border-black rounded-lg shadow-lg p-4"
              >
                <h3 className="font-semibold mb-3">Chuyên ngành</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedMajor('')
                      filterSessionsByMajor('')
                      setShowMajorDropdown(false)
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm font-medium text-blue-600"
                  >
                    Tất cả
                  </button>
                  {majors.map((major, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedMajor(major)
                        filterSessionsByMajor(major)
                        setShowMajorDropdown(false)
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm ${
                        selectedMajor === major ? 'bg-blue-50 font-medium' : ''
                      }`}
                    >
                      {major}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'filter' && showCalendar && (
              <div 
                ref={calendarDropdownRef}
                className="absolute top-4 left-4 z-10 bg-white border-2 border-black rounded-lg shadow-lg p-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="font-semibold">
                    {selectedDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded">
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                    <div key={day} className="text-xs text-center text-gray-600 p-2">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {renderCalendar()}
                </div>

                <div className="flex items-center justify-between border-t pt-4">
                  <span className="font-medium">Time</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-20 px-2 py-1 border rounded text-center"
                    />
                    <button
                      onClick={() => setTimePeriod('AM')}
                      className={`px-3 py-1 rounded ${timePeriod === 'AM' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    >
                      AM
                    </button>
                    <button
                      onClick={() => setTimePeriod('PM')}
                      className={`px-3 py-1 rounded ${timePeriod === 'PM' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                    >
                      PM
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4">
              <h2 className="text-xl font-semibold text-center">
                {viewMode === 'registered' ? 'Danh sách các khóa học' : 'Lớp'}
              </h2>
              {viewMode === 'filter' && selectedMajor && (
                <p className="text-sm text-gray-600 text-center mt-2">
                  Lọc theo chuyên ngành: <span className="font-medium text-blue-600">{selectedMajor}</span>
                  <button
                    onClick={() => {
                      setSelectedMajor('')
                      filterSessionsByMajor('')
                    }}
                    className="ml-2 text-red-600 hover:underline"
                  >
                    Xóa bộ lọc
                  </button>
                </p>
              )}
              {viewMode === 'filter' && activeTab === 'time' && !showCalendar && sessions.length < allSessions.length && (
                <p className="text-sm text-gray-600 text-center mt-2">
                  Lọc theo ngày: <span className="font-medium text-blue-600">{selectedDate.toLocaleDateString('vi-VN')}</span>
                  <button
                    onClick={() => {
                      setSessions(allSessions)
                    }}
                    className="ml-2 text-red-600 hover:underline"
                  >
                    Xóa bộ lọc
                  </button>
                </p>
              )}
            </div>
            
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Đang tải...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">
                  {selectedMajor ? `Không có buổi tư vấn nào về ${selectedMajor}` : 'Không có buổi tư vấn nào'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSessionClick(session)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                  >
                    <p className="font-medium text-gray-900">{session.title}</p>
                    <p className="text-sm text-gray-600">
                      {formatSessionDate(session.startAt)}, {session.tutor?.name}
                    </p>
                    {session.subjects && session.subjects.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {session.subjects.map((subject, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {subject}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Thông báo</h3>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="mb-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900">Lớp.....</p>
                <p className="text-xs text-gray-600">Ngày tháng</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Link truy cập hotline</p>
        </div>
      </main>
    </div>
  )
}

export default SessionList


