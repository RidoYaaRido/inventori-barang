import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Loading from './Loading'

/**
 * Mapping role → default dashboard path
 */
const roleDashboard = {
  admin: '/admin/dashboard',
  staff: '/staff/dashboard',
}

/**
 * ProtectedRoute — guard untuk halaman yang membutuhkan autentikasi.
 *
 * Props:
 * - allowedRoles: Array<string> — role yang diizinkan mengakses route
 *
 * Behavior:
 * 1. Loading → tampilkan spinner
 * 2. Belum login → redirect ke /login
 * 3. Role tidak sesuai → redirect ke dashboard sesuai role
 * 4. Valid → render child routes
 */
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
