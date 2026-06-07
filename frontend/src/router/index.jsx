import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthProvider } from '../context/AuthContext.jsx'
import AuthLayout from '../layouts/AuthLayout'
import AdminLayout from '../layouts/AdminLayout'
import StaffLayout from '../layouts/StaffLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Dashboard from '../pages/Dashboard'

// import admin components
import AdminDashboard from '../pages/admin/dashboard-admin/AdminDashboard.jsx'
import KelolaBarang from '../pages/admin/kelola-barang/ManageItems.jsx'

// import staff componentsstaff
import StaffDashboard from '../pages/staff/StaffDashboard'
import ComingSoon from '../pages/ComingSoon'

const adminComingSoonRoutes = [
  '/admin/kelola-kategori',
  '/admin/kelola-staff',
  '/admin/validasi-transaksi',
  '/admin/laporan',
  '/admin/log-aktivitas',
  '/admin/bantuan',
]

const staffComingSoonRoutes = [
  '/staff/barang',
  '/staff/barang-masuk',
  '/staff/barang-keluar',
  '/staff/profile',
]

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Auth Routes (Public) ──────────────── */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ── Dashboard Redirect ────────────────── */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* ── Admin Routes (Protected) ──────────── */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/kelola-barang" element={<KelolaBarang />} />
              {adminComingSoonRoutes.map((path) => (
                <Route element={<ComingSoon />} key={path} path={path} />
              ))}
              <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>

          {/* ── Staff Routes (Protected) ──────────── */}
          <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
            <Route element={<StaffLayout />}>
              <Route path="/staff/dashboard" element={<StaffDashboard />} />
              {staffComingSoonRoutes.map((path) => (
                <Route element={<ComingSoon />} key={path} path={path} />
              ))}
              <Route path="/staff/*" element={<Navigate to="/staff/dashboard" replace />} />
            </Route>
          </Route>

          {/* ── Fallback Routes ───────────────────── */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRouter
