const stats = [
  { icon: 'box', label: 'Total Barang', meta: '+12%', value: '2.540', variant: 'teal' },
  { icon: 'category', label: 'Total Kategori', value: '12', variant: 'orange' },
  { icon: 'staff', label: 'Total Staff', value: '8', variant: 'green' },
  { icon: 'transaction', label: 'Total Transaksi', meta: '-3%', value: '145', variant: 'red' },
]

const months = [
  { label: 'Jan', value: 34 },
  { label: 'Feb', value: 52 },
  { label: 'Mar', value: 26 },
  { label: 'Apr', value: 70 },
  { label: 'Mei', value: 42 },
  { label: 'Jun', value: 62 },
  { label: 'Jul', value: 84, active: true },
  { label: 'Ags', value: 58 },
]

function DashboardIcon({ name }) {
  const paths = {
    box: 'M5 7h14v12H5V7Zm3-3h8l3 3H5l3-3Zm3 8h2',
    category: 'M7 4h10l4 8-9 8-9-8 4-8Zm5 4v5',
    staff: 'M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM4 19a4 4 0 0 1 8 0m2 0a3.5 3.5 0 0 1 6 0',
    transaction: 'M5 5h14v14H5V5Zm4 5h6m-6 4h4m3 1 2 2 3-4',
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d={paths[name]} />
    </svg>
  )
}

function AdminDashboard() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <h2>Selamat Datang, Administrator</h2>
        <p>Berikut adalah ringkasan sistem inventaris Anda hari ini.</p>
      </div>

      <div className="stats-grid admin-stats">
        {stats.map((stat) => (
          <article className={`stat-card stat-card-${stat.variant}`} key={stat.label}>
            <div className="stat-topline">
              <span className="stat-icon">
                <DashboardIcon name={stat.icon} />
              </span>
              {stat.meta && <span className="stat-meta">{stat.meta}</span>}
            </div>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="admin-dashboard-grid">
        <article className="dashboard-card category-card">
          <div className="card-heading">
            <h3>Distribusi Kategori</h3>
            <button aria-label="Menu distribusi kategori" type="button">
              ...
            </button>
          </div>
          <div className="donut-wrap">
            <div className="donut-chart">
              <span>65%</span>
              <small>Elektronik</small>
            </div>
          </div>
          <div className="legend-list">
            <div>
              <span className="legend-dot teal" />
              Elektronik
              <strong>65%</strong>
            </div>
            <div>
              <span className="legend-dot green" />
              Furnitur
              <strong>25%</strong>
            </div>
            <div>
              <span className="legend-dot soft" />
              Lainnya
              <strong>10%</strong>
            </div>
          </div>
        </article>

        <article className="dashboard-card trend-card">
          <div className="card-heading">
            <div>
              <h3>Trend Transaksi Bulanan</h3>
              <p>Pergerakan transaksi keluar/masuk tahun ini</p>
            </div>
            <button className="period-button" type="button">Tahun Ini</button>
          </div>
          <div className="bar-chart admin-chart">
            {months.map((month) => (
              <div className="bar-item" key={month.label}>
                <span
                  className={month.active ? 'active' : ''}
                  style={{ '--bar-height': `${month.value}%` }}
                />
                <small>{month.label}</small>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export default AdminDashboard
