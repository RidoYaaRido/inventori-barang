import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthProvider } from '../context/AuthContext.jsx'
import AuthLayout from '../layouts/AuthLayout'
import AdminLayout from '../layouts/AdminLayout'
import StaffLayout from '../layouts/StaffLayout'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import HomePage from '../pages/homepage/HomePage'
import Dashboard from '../pages/Dashboard'
import Homepage from '../pages/homepage/index.jsx'

// import admin components
import AdminDashboard from '../pages/admin/dashboard-admin/AdminDashboard.jsx'
import KelolaBarang from '../pages/admin/kelola-barang/ManageItems.jsx'
import KelolaKategori from '../pages/admin/kelola-kategori/ManageCategories.jsx'
import KelolaStaff from '../pages/admin/kelola-staff/ManageStaff.jsx'
import ValidasiTransaksi from '../pages/admin/validasi-transaksi/ValidateTransactions.jsx'
import Laporan from '../pages/admin/Laporan/Reports.jsx'
import LogAktivitas from '../pages/admin/log-aktivitas/ActivityLogs.jsx'

// import staff components
import StaffDashboard from '../pages/staff/StaffDashboard'
import ItemDetail from '../pages/staff/ItemDetail'
import ItemList from '../pages/staff/ItemList'
import ComingSoon from '../pages/ComingSoon'
// transaction pages
import TransactionLayout from '../pages/transaction/TransactionLayout'
import BarangMasuk from '../pages/transaction/BarangMasuk'
import BarangKeluar from '../pages/transaction/BarangKeluar'
import History from '../pages/transaction/History'
import UploadBukti from '../pages/transaction/UploadBukti'
import DetailTransaksi from '../pages/transaction/DetailTransaksi'

const adminComingSoonRoutes = [
  '/admin/bantuan',
]

const staffComingSoonRoutes = ['/staff/profile']

function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ── Homepage Route (Public) ──────────── */}
          <Route path="/" element={<Homepage />} />

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
              <Route path="/admin/items" element={<KelolaBarang />} />
              <Route path="/admin/categories" element={<KelolaKategori />} />
              <Route path="/admin/users" element={<KelolaStaff />} />
              <Route path="/admin/reports" element={<Laporan />} />
              <Route path="/admin/logs" element={<LogAktivitas />} />
              <Route path="/admin/activity-log" element={<LogAktivitas />} />
              <Route path="/admin/kelola-barang" element={<KelolaBarang />} />
              <Route path="/admin/kelola-kategori" element={<KelolaKategori />} />
              <Route path="/admin/kelola-staff" element={<KelolaStaff />} />
              <Route path="/admin/validasi-transaksi" element={<ValidasiTransaksi />} />
              <Route path="/admin/laporan" element={<Laporan />} />
              <Route path="/admin/log-aktivitas" element={<LogAktivitas />} />
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
              <Route path="/staff/items" element={<ItemList />} />
              <Route path="/staff/items/:id" element={<ItemDetail />} />
              <Route path="/staff/stock-in" element={<BarangMasuk />} />
              <Route path="/staff/stock-out" element={<BarangKeluar />} />
              <Route path="/staff/transactions" element={<History />} />
              <Route path="/staff/transactions/:type/:id" element={<DetailTransaksi />} />
              <Route path="/staff/barang" element={<ItemList />} />
              <Route path="/staff/data-barang" element={<ItemList />} />
              <Route path="/staff/barang/:id" element={<ItemDetail />} />
              <Route path="/staff/barang-masuk" element={<BarangMasuk />} />
              <Route path="/staff/barang-keluar" element={<BarangKeluar />} />
              {/* Transaction routes for staff */}
              <Route path="/transactions" element={<TransactionLayout />}>
                <Route path="masuk" element={<BarangMasuk />} />
                <Route path="keluar" element={<BarangKeluar />} />
                <Route path="history" element={<History />} />
                <Route path="upload/:type/:id" element={<UploadBukti />} />
                <Route path="detail/:type/:id" element={<DetailTransaksi />} />
                <Route path="" element={<Navigate to="/transactions/history" replace />} />
              </Route>
              {staffComingSoonRoutes.map((path) => (
                <Route element={<ComingSoon />} key={path} path={path} />
              ))}
              <Route path="/staff/*" element={<Navigate to="/staff/dashboard" replace />} />
            </Route>
          </Route>

          {/* ── Fallback Routes ───────────────────── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default AppRouter
