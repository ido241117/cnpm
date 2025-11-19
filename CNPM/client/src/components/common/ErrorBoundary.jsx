import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // You can log error to a monitoring service here
    // console.error(error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow text-center">
            <h3 className="text-xl font-semibold mb-2">Đã xảy ra lỗi</h3>
            <p className="text-sm text-gray-600 mb-4">Có lỗi khi hiển thị trang. Mở console để xem chi tiết.</p>
            <pre className="text-xs text-left max-h-40 overflow-auto text-red-600">{String(this.state.error)}</pre>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
