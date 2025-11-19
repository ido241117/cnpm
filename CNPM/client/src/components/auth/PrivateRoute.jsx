import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Spinner from '../common/Spinner'

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    const redirectPath = user.role === 'STUDENT' 
      ? '/student/dashboard' 
      : '/tutor/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return children
}

export default PrivateRoute


