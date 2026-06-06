import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
  LayoutDashboard, Package, Tags, Users, ClipboardCheck,
  FileText, Activity, LogOut, ArrowDownToLine, ArrowUpFromLine
} from 'lucide-react'

const adminMenus = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/barang', icon: Package, label: 'Kelola Barang' },
  { to: '/admin/kategori', icon: Tags, label: 'Kelola Kategori' },
  { to: '/admin/staff', icon: Users, label: 'Kelola Staff' },
  { to: '/admin/validasi', icon: ClipboardCheck, label: 'Validasi Transaksi' },
  { to: '/admin/laporan', icon: FileText, label: 'Laporan' },
  { to: '/admin/log', icon: Activity, label: 'Activity Log' },
]

const staffMenus = [
  { to: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/staff/barang', icon: Package, label: 'Data Barang' },
  { to: '/staff/masuk', icon: ArrowDownToLine, label: 'Barang Masuk' },
  { to: '/staff/keluar', icon: ArrowUpFromLine, label: 'Barang Keluar' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const menus = user?.role === 'admin' ? adminMenus : staffMenus

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-64 min-h-screen bg-indigo-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-indigo-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500 rounded-lg flex items-center justify-center">
            <Package size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">Inventory</p>
            <p className="text-indigo-300 text-xs">Management System</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-indigo-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-indigo-300 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menus.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-indigo-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-indigo-200 hover:bg-indigo-800 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </div>
  )
}