import { useEffect, useState } from 'react'
import { adminApi } from '../../../api/adminApi'
import { asArray, formatDate, getApiData, getApiMessage, getItemName } from '../../../api/response'

function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <strong>{value ?? 0}</strong>
    </article>
  )
}

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const response = await adminApi.dashboard()
        setDashboard(getApiData(response, {}))
      } catch (err) {
        setError(getApiMessage(err, 'Gagal memuat dashboard admin.'))
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const lowStockItems = asArray(dashboard?.low_stock_items)
  const recentStockIn = asArray(dashboard?.recent_stock_in)
  const recentStockOut = asArray(dashboard?.recent_stock_out)

  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <h2>Dashboard Admin</h2>
        <p>Ringkasan sistem inventaris dari backend.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="spinner-border" role="status" aria-label="Memuat data" />
      ) : (
        <>
          <div className="stats-grid admin-stats">
            <StatCard label="Total Barang" value={dashboard?.total_items} />
            <StatCard label="Total Kategori" value={dashboard?.total_categories} />
            <StatCard label="Total Staff" value={dashboard?.total_staff} />
            <StatCard label="Total Stock In" value={dashboard?.total_stock_in} />
            <StatCard label="Total Stock Out" value={dashboard?.total_stock_out} />
            <StatCard label="Low Stock" value={lowStockItems.length} />
          </div>

          <div className="dashboard-list-grid admin-list-grid">
            <DataList title="Low Stock Items" rows={lowStockItems} />
            <DataList title="Recent Stock In" rows={recentStockIn} />
            <DataList title="Recent Stock Out" rows={recentStockOut} />
          </div>
        </>
      )}
    </section>
  )
}

function DataList({ title, rows }) {
  return (
    <article className="dashboard-card">
      <div className="card-heading">
        <div>
          <h3>{title}</h3>
        </div>
      </div>
        {rows.length === 0 ? (
          <p className="empty-text">Data belum tersedia</p>
        ) : (
          <div className="table-responsive">
            <table className="table dashboard-table align-middle">
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td>{getItemName(row)}</td>
                    <td>{row.quantity ?? row.stock_quantity ?? row.stock ?? '-'}</td>
                    <td className="text-end">{formatDate(row.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </article>
  )
}

export default AdminDashboard
