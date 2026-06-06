import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Loading from './Loading'

const roleDashboard = {
  admin: '/admin/dashboard',
  staff: '/staff/dashboard',
}

function ProtectedRoute({ allowedRoles }) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleDashboard[user.role] || '/login'} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
