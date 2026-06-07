import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import Loading from '../components/Loading'

/**
 * Dashboard — halaman redirect otomatis berdasarkan role user.
 *
 * Tidak menampilkan konten sendiri, hanya mengarahkan:
 * - admin → /admin/dashboard
 * - staff → /staff/dashboard
 * - belum login → /login
 */
const roleDashboard = {
  admin: '/admin/dashboard',
  staff: '/staff/dashboard',
}

function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading message="Mengalihkan ke dashboard..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const target = roleDashboard[user.role] || '/login'
  return <Navigate to={target} replace />
}

export default Dashboard
