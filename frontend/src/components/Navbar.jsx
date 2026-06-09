import { useAuth } from '../context/useAuth'

function Navbar({
  isDarkMode,
  isSidebarCollapsed,
  onOpenSidebar,
  onToggleSidebar,
  onToggleTheme,
}) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || (isAdmin ? 'A' : 'BS')

  return (
    <nav className="app-navbar">
      <button
        aria-label="Buka menu"
        className="top-icon-button mobile-menu-button"
        type="button"
        onClick={onOpenSidebar}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      <button
        aria-label={isSidebarCollapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
        className="top-icon-button desktop-sidebar-button"
        type="button"
        onClick={onToggleSidebar}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d={isSidebarCollapsed ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6'} />
        </svg>
      </button>
      <div className="top-search">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8 7.5 7.5 0 0 1-5.3 12.8Zm5.3-2.2L21 21" />
        </svg>
        <input
          aria-label="Cari data inventaris"
          placeholder={isAdmin ? 'Cari data inventaris...' : 'Cari barang, transaksi...'}
          type="search"
        />
      </div>
      <div className="top-actions">
        <button
          aria-label={isDarkMode ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
          aria-pressed={isDarkMode}
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-thumb">
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d={isDarkMode ? 'M21 13a8 8 0 1 1-10-10 7 7 0 0 0 10 10Z' : 'M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66 1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14-1.41-1.41M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z'} />
              </svg>
            </span>
          </span>
          <span className="theme-toggle-label">{isDarkMode ? 'Gelap' : 'Terang'}</span>
        </button>
        <div className="top-profile">
          <span className="top-avatar">{initials}</span>
          {!isAdmin && (
            <>
              <span className="top-profile-name">{user?.name || 'Budi Santoso'}</span>
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
