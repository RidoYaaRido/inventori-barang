import { Link } from 'react-router-dom'
import '../../styles/homepage.css'

export default function HomePage() {
  return (
    <main className="home-page-shell">
      <div className="home-container">
        <section className="home-card">
          <header className="home-topbar">
            <Link to="/" className="home-brand" aria-label="Beranda Inventory Management System">
              <span className="home-brand-mark">IMS</span>
              <span className="home-brand-copy">
                <h1>Inventory Management System</h1>
                <p>Kelola stok, transaksi, dan tim dengan lebih rapi.</p>
              </span>
            </Link>

            <nav className="home-nav" aria-label="Navigasi utama">
              <a className="home-nav-link" href="#fitur">Fitur</a>
              <a className="home-nav-link" href="#keunggulan">Keunggulan</a>
              <Link className="home-ghost-btn" to="/login">Masuk</Link>
              <Link className="home-action-btn" to="/register">Daftar</Link>
            </nav>
          </header>

          <section className="home-hero">
            <article className="home-copy">
              <span className="home-eyebrow">Inventory • Tracking • Efficiency</span>
              <h2>Kelola inventaris Anda dengan dashboard yang lebih sederhana dan modern.</h2>
              <p>
                Aplikasi inventory ini membantu tim admin dan staff memantau barang, stok masuk/keluar,
                transaksi, hingga aktivitas operasional dalam satu tempat yang konsisten dan mudah dipahami.
              </p>

              <div className="home-cta-row">
                <Link className="home-action-btn" to="/register">Mulai Sekarang</Link>
                <Link className="home-ghost-btn" to="/login">Sudah punya akun?</Link>
              </div>

              <div className="home-highlights">
                <div className="home-highlight">
                  <strong>98%</strong>
                  <span>akurasi data stok</span>
                </div>
                <div className="home-highlight">
                  <strong>24/7</strong>
                  <span>akses dari mana saja</span>
                </div>
                <div className="home-highlight">
                  <strong>5 menit</strong>
                  <span>setup tim & pengguna</span>
                </div>
              </div>
            </article>

            <aside className="home-visual" aria-label="Ringkasan sistem">
              <article className="home-panel">
                <div className="home-panel-header">
                  <h3>Ringkasan stok</h3>
                  <span className="home-pill">Live</span>
                </div>
                <div className="home-metric-row">
                  <div className="home-metric-card">
                    <span>Barang aktif</span>
                    <strong>184 item</strong>
                  </div>
                  <div className="home-metric-card">
                    <span>Transaksi hari ini</span>
                    <strong>27</strong>
                  </div>
                  <div className="home-metric-card">
                    <span>Stok masuk</span>
                    <strong>+12</strong>
                  </div>
                  <div className="home-metric-card">
                    <span>Stok keluar</span>
                    <strong>-9</strong>
                  </div>
                </div>
              </article>

              <article className="home-panel">
                <div className="home-panel-header">
                  <h3>Yang bisa Anda lakukan</h3>
                </div>
                <div className="home-checklist">
                  <div className="home-check-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                    Pantau stok dan barang tanpa ribet.
                  </div>
                  <div className="home-check-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                    Lacak transaksi masuk/keluar secara real-time.
                  </div>
                  <div className="home-check-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                    Kolaborasi tim dengan akses role yang jelas.
                  </div>
                </div>
              </article>
            </aside>
          </section>
        </section>

        <section className="home-features" id="fitur">
          <article className="home-feature-card">
            <div className="home-feature-icon cyan">📦</div>
            <h3>Manajemen barang</h3>
            <p>Atur item, kategori, dan status barang dari satu tempat dengan tampilan yang senada dengan dashboard aplikasi.</p>
          </article>
          <article className="home-feature-card" id="keunggulan">
            <div className="home-feature-icon violet">📊</div>
            <h3>Transaksi & laporan</h3>
            <p>Monitor log barang masuk/keluar dan pantau aktivitas operasional untuk pengambilan keputusan yang lebih cepat.</p>
          </article>
          <article className="home-feature-card">
            <div className="home-feature-icon emerald">🔐</div>
            <h3>Login & register</h3>
            <p>Gunakan akun admin atau staff untuk akses yang sesuai peran, dengan alur pendaftaran dan masuk yang sederhana.</p>
          </article>
        </section>
      </div>
    </main>
  )
}