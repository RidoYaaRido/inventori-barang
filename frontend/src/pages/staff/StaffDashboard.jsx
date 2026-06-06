const stats = [
  { icon: 'box', label: 'Total Barang', value: '1,250', variant: 'teal' },
  { icon: 'inbox', label: 'Barang Masuk Hari Ini', value: '45', variant: 'green' },
  { icon: 'outbox', label: 'Barang Keluar Hari Ini', value: '12', variant: 'orange' },
  { icon: 'alert', label: 'Stok Rendah', value: '8', variant: 'red' },
]

const week = [
  { label: 'Sen', value: 42 },
  { label: 'Sel', value: 70 },
  { label: 'Rab', value: 52 },
  { label: 'Kam', value: 88, active: true },
  { label: 'Jum', value: 62 },
  { label: 'Sab', value: 26 },
  { label: 'Min', value: 16 },
]

const activities = [
  { icon: 'check', title: 'Penerimaan Laptop Acer', meta: 'Staff Budi - 10:00', variant: 'green' },
  { icon: 'arrow', title: 'Pengeluaran Monitor LG', meta: 'Staff Budi - 14:30', variant: 'orange' },
  { icon: 'alert', title: 'Stok Tinta Printer Habis', meta: 'Sistem - Kemarin, 16:45', variant: 'red' },
  { icon: 'check', title: 'Penerimaan Kertas HV...', meta: 'Staff Ani - Kemarin, 09:15', variant: 'green' },
]

function DashboardIcon({ name }) {
  const paths = {
    box: 'M5 7h14v12H5V7Zm3-3h8l3 3H5l3-3Zm3 8h2',
    inbox: 'M5 5h14v14H5V5Zm4 8h2.5l1.5 2 1.5-2H17M12 5v7',
    outbox: 'M5 5h14v14H5V5Zm7 10V8m0 0-3 3m3-3 3 3',
    alert: 'M12 4 21 20H3L12 4Zm0 6v4m0 3v.01',
    check: 'M5 12l4 4 10-10',
    arrow: 'M7 17 17 7m0 0H9m8 0v8',
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d={paths[name]} />
    </svg>
  )
}

function StaffDashboard() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <h2>Selamat Datang, Budi Santoso</h2>
        <p>Berikut adalah ringkasan inventaris hari ini.</p>
      </div>

      <div className="stats-grid staff-stats">
        {stats.map((stat) => (
          <article className={`stat-card stat-card-${stat.variant}`} key={stat.label}>
            <div className="stat-topline">
              <span className="stat-icon">
                <DashboardIcon name={stat.icon} />
              </span>
            </div>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </div>

      <div className="staff-dashboard-grid">
        <article className="dashboard-card weekly-card">
          <div className="card-heading">
            <h3>Aktivitas Mingguan</h3>
            <button className="period-button" type="button">Minggu Ini</button>
          </div>
          <div className="bar-chart weekly-chart">
            {week.map((day) => (
              <div className="bar-item" key={day.label}>
                <span
                  className={day.active ? 'active' : ''}
                  style={{ '--bar-height': `${day.value}%` }}
                />
                <small className={day.active ? 'active-label' : ''}>{day.label}</small>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-card activity-card">
          <div className="card-heading">
            <h3>Aktivitas Terkini</h3>
            <button className="link-button" type="button">Lihat Semua</button>
          </div>
          <div className="activity-list">
            {activities.map((activity) => (
              <div className="activity-item" key={`${activity.title}-${activity.meta}`}>
                <span className={`activity-icon ${activity.variant}`}>
                  <DashboardIcon name={activity.icon} />
                </span>
                <div>
                  <strong>{activity.title}</strong>
                  <small>{activity.meta}</small>
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export default StaffDashboard
