import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-gray-900">
          Trang không tồn tại
        </h2>
        <p className="mt-2 text-gray-600">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home size={20} className="mr-2" />
          Về trang chủ
        </Link>
      </div>
    </div>
  )
}

export default NotFound



