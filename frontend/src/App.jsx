import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'

import Login from './pages/auth/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminBarang from './pages/admin/KelolBarang'
import AdminKategori from './pages/admin/KelolKategori'
import AdminStaff from './pages/admin/KelolStaff'
import AdminValidasi from './pages/admin/ValidasiTransaksi'
import AdminLaporan from './pages/admin/Laporan'
import AdminLog from './pages/admin/ActivityLog'

import StaffDashboard from './pages/staff/Dashboard'
import StaffBarang from './pages/staff/DataBarang'
import StaffMasuk from './pages/staff/BarangMasuk'
import StaffKeluar from './pages/staff/BarangKeluar'
import StaffProfil from './pages/staff/Profil'

function RequireAuth({ children, role }) {
  const { user, token } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<RequireAuth role="admin"><AdminDashboard /></RequireAuth>} />
        <Route path="/admin/barang" element={<RequireAuth role="admin"><AdminBarang /></RequireAuth>} />
        <Route path="/admin/kategori" element={<RequireAuth role="admin"><AdminKategori /></RequireAuth>} />
        <Route path="/admin/staff" element={<RequireAuth role="admin"><AdminStaff /></RequireAuth>} />
        <Route path="/admin/validasi" element={<RequireAuth role="admin"><AdminValidasi /></RequireAuth>} />
        <Route path="/admin/laporan" element={<RequireAuth role="admin"><AdminLaporan /></RequireAuth>} />
        <Route path="/admin/log" element={<RequireAuth role="admin"><AdminLog /></RequireAuth>} />

        {/* Staff Routes */}
        <Route path="/staff/dashboard" element={<RequireAuth role="staff"><StaffDashboard /></RequireAuth>} />
        <Route path="/staff/barang" element={<RequireAuth role="staff"><StaffBarang /></RequireAuth>} />
        <Route path="/staff/masuk" element={<RequireAuth role="staff"><StaffMasuk /></RequireAuth>} />
        <Route path="/staff/keluar" element={<RequireAuth role="staff"><StaffKeluar /></RequireAuth>} />
        <Route path="/staff/profil" element={<RequireAuth role="staff"><StaffProfil /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}