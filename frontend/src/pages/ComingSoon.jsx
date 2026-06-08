import { useLocation } from 'react-router-dom'

const pageTitles = {
  '/admin/barang': 'Kelola Barang',
  '/admin/kategori': 'Kelola Kategori',
  '/admin/staff': 'Kelola Staff',
  '/admin/validasi-transaksi': 'Validasi Transaksi',
  '/admin/laporan': 'Laporan',
  '/admin/activity-log': 'Activity Log',
  '/admin/bantuan': 'Bantuan',
  '/staff/barang': 'Data Barang',
  '/staff/barang-masuk': 'Barang Masuk',
  '/staff/barang-keluar': 'Barang Keluar',
  '/staff/profile': 'Profil',
}

function ComingSoon() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] || 'Halaman'

  return (
    <section className="coming-soon-page">
      <div className="coming-soon-card">
        <span className="coming-soon-badge">Coming Soon</span>
        <h2>{title}</h2>
        <p>
          Fitur ini sedang dalam tahap development. Halaman akan tersedia setelah proses
          pengembangan dan validasi selesai.
        </p>
        <div className="coming-soon-progress" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  )
}

export default ComingSoon
