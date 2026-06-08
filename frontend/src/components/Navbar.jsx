import { useAuth } from '../context/useAuth'

function Navbar() {
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
        <button aria-label="Notifikasi" className="top-icon-button" type="button">
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M18 16v-5a6 6 0 0 0-12 0v5l-2 2h20l-2-2Zm-6 5a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 21Z" />
          </svg>
          <span />
        </button>
        {isAdmin && (
          <button aria-label="Pengaturan" className="top-icon-button" type="button">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0-13v3m0 13v3m8-11h3M1 12h3m13.66-6.66 2.12-2.12M4.22 19.78l2.12-2.12m0-11.32L4.22 4.22m15.56 15.56-2.12-2.12" />
            </svg>
          </button>
        )}
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
