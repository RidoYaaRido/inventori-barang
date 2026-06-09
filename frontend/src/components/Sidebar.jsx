import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const staffMenus = [
  { icon: 'grid', label: 'Dashboard', path: '/staff/dashboard' },
  { icon: 'box', label: 'Daftar Barang', path: '/staff/items' },
  { icon: 'inbox', label: 'Barang Masuk', path: '/staff/stock-in' },
  { icon: 'outbox', label: 'Barang Keluar', path: '/staff/stock-out' },
  { icon: 'history', label: 'Riwayat Transaksi', path: '/staff/transactions' },
]

const adminMenus = [
  { icon: 'grid', label: 'Dashboard', path: '/admin/dashboard' },
  { icon: 'box', label: 'Kelola Barang', path: '/admin/items' },
  { icon: 'category', label: 'Kelola Kategori', path: '/admin/categories' },
  { icon: 'staff', label: 'Kelola Staff', path: '/admin/users' },
  { icon: 'report', label: 'Laporan', path: '/admin/reports' },
  { icon: 'history', label: 'Activity Log', path: '/admin/logs' },
]

const iconPaths = {
  grid: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
  box: 'M4 7.5 12 4l8 3.5v9L12 20l-8-3.5v-9Zm8 3.5 8-3.5M12 11 4 7.5M12 11v9',
  category: 'M5 5h6v6H5V5Zm8 0h6v6h-6V5ZM5 13h6v6H5v-6Zm8 3a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z',
  staff: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM3.5 19a4.5 4.5 0 0 1 9 0M13.5 18a3.5 3.5 0 0 1 7 0',
  check: 'M5 5h14v14H5V5Zm4 7 2 2 4-5',
  report: 'M6 4h12v16H6V4Zm3 5h6M9 13h6M9 17h4',
  history: 'M4 12a8 8 0 1 0 2.34-5.66L4 8.68M4 4v4.68h4.68M12 8v5l3 2',
  inbox: 'M4 5h16v14H4V5Zm4 8h2.5l1.5 2 1.5-2H16M4 13h4',
  outbox: 'M4 5h16v14H4V5Zm8 10V8m0 0-3 3m3-3 3 3',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
  help: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-6v.01M10.6 9.4A2 2 0 1 1 12 12v1',
  logout: 'M10 5H5v14h5M15 8l4 4-4 4M19 12H9',
}

function SidebarIcon({ name }) {
  return (
    <svg aria-hidden="true" className="sidebar-icon" viewBox="0 0 24 24">
      <path d={iconPaths[name]} />
    </svg>
  )
}

function Sidebar({ isCollapsed, isOpen, role, onClose, onToggleCollapse }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const menus = role === 'admin' ? adminMenus : staffMenus
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
      navigate('/login', { replace: true })
    } finally {
      setIsLoggingOut(false)
      setIsLogoutOpen(false)
    }
  }

  return (
    <>
      <aside className={`app-sidebar ${isOpen ? 'is-open' : ''} ${isCollapsed ? 'is-collapsed' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-logo">{role === 'admin' ? 'IP' : 'IP'}</div>
          <div className="sidebar-brand-copy">
            <h1>{role === 'admin' ? 'InventarisPro' : 'InventarisPro'}</h1>
            <small>{role === 'admin' ? 'Admin Portal' : 'Staff Portal'}</small>
          </div>
          <button
            aria-label="Tutup menu"
            className="sidebar-close"
            type="button"
            onClick={onClose}
          >
            <svg aria-hidden="true" className="sidebar-icon" viewBox="0 0 24 24">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
       
        <nav className="sidebar-nav">
          {menus.map((menu) => (
            <NavLink
              className={({ isActive }) =>
                `nav-link sidebar-link ${isActive ? 'active' : ''}`
              }
              key={menu.path}
              to={menu.path}
              onClick={onClose}
            >
              <SidebarIcon name={menu.icon} />
              <span>{menu.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          {role === 'admin' && (
            <NavLink className="nav-link sidebar-link sidebar-support" to="/admin/bantuan" onClick={onClose}>
              <SidebarIcon name="help" />
              <span>Bantuan</span>
            </NavLink>
          )}
          <button className="sidebar-logout" type="button" onClick={() => setIsLogoutOpen(true)}>
            <SidebarIcon name="logout" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {isLogoutOpen && (
        <div className="logout-modal-backdrop" role="presentation">
          <section
            aria-labelledby="logout-modal-title"
            aria-modal="true"
            className="logout-modal"
            role="dialog"
          >
            <span className="logout-modal-icon">
              <SidebarIcon name="logout" />
            </span>
            <h2 id="logout-modal-title">Keluar dari aplikasi?</h2>
            <p>Pastikan pekerjaan Anda sudah selesai sebelum meninggalkan sesi ini.</p>
            <div className="logout-modal-actions">
              <button
                className="btn btn-light"
                disabled={isLoggingOut}
                type="button"
                onClick={() => setIsLogoutOpen(false)}
              >
                Batal
              </button>
              <button
                className="btn btn-danger"
                disabled={isLoggingOut}
                type="button"
                onClick={handleLogout}
              >
                {isLoggingOut ? 'Memproses...' : 'Ya, Keluar'}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default Sidebar
