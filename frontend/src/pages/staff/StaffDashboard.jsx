import { useEffect, useState } from 'react'
import { itemApi } from '../../api/itemApi'
import { stockInApi } from '../../api/stockInApi'
import { stockOutApi } from '../../api/stockOutApi'
import { asArray, getApiData, getApiMessage, getItemName, formatDate } from '../../api/response'

function StatCard({ label, value }) {
  return (
    <article className="stat-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  )
}

function StaffDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [stockIns, setStockIns] = useState([])
  const [stockOuts, setStockOuts] = useState([])

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      setError('')

      try {
        const [itemsRes, stockInsRes, stockOutsRes] = await Promise.all([
          itemApi.list(),
          stockInApi.list(),
          stockOutApi.list(),
        ])

        setItems(asArray(getApiData(itemsRes)))
        setStockIns(asArray(getApiData(stockInsRes)))
        setStockOuts(asArray(getApiData(stockOutsRes)))
      } catch (err) {
        setError(getApiMessage(err, 'Gagal memuat dashboard staff.'))
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const lowStockItems = items.filter((item) => {
    const stock = Number(item.stock_quantity ?? item.stock ?? 0)
    const minStock = Number(item.minimum_stock ?? item.min_stock ?? 5)
    return stock <= minStock
  })

  const recentTransactions = [
    ...stockIns.slice(0, 3).map((row) => ({ ...row, type: 'Masuk' })),
    ...stockOuts.slice(0, 3).map((row) => ({ ...row, type: 'Keluar' })),
  ].sort((a, b) => new Date(b.created_at || b.received_at || b.released_at) - new Date(a.created_at || a.received_at || a.released_at))

  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <h2>Dashboard Staff</h2>
        <p>Ringkasan inventaris berdasarkan data backend.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="spinner-border" role="status" aria-label="Memuat data" />
      ) : (
        <>
          <div className="stats-grid staff-stats">
            <StatCard label="Total Barang" value={items.length} />
            <StatCard label="Total Barang Masuk" value={stockIns.length} />
            <StatCard label="Total Barang Keluar" value={stockOuts.length} />
            <StatCard label="Barang Stok Rendah" value={lowStockItems.length} />
          </div>

          <div className="dashboard-list-grid staff-list-grid">
            <article className="dashboard-card">
              <div className="card-heading">
                <div>
                  <h3>Stok Rendah</h3>
                </div>
              </div>
                  {lowStockItems.length === 0 ? (
                    <p className="empty-text">Data belum tersedia</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table dashboard-table align-middle">
                        <tbody>
                          {lowStockItems.map((item) => (
                            <tr key={item.id}>
                              <td>{item.name}</td>
                              <td>{item.sku}</td>
                              <td className="text-end">{item.stock_quantity ?? item.stock ?? 0} {item.unit}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
            </article>
            <article className="dashboard-card">
              <div className="card-heading">
                <div>
                  <h3>Transaksi Terkini</h3>
                </div>
              </div>
                  {recentTransactions.length === 0 ? (
                    <p className="empty-text">Data belum tersedia</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table dashboard-table align-middle">
                        <tbody>
                          {recentTransactions.map((row) => (
                            <tr key={`${row.type}-${row.id}`}>
                              <td>{row.type}</td>
                              <td>{getItemName(row)}</td>
                              <td>{row.quantity}</td>
                              <td className="text-end">{formatDate(row.created_at || row.received_at || row.released_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
            </article>
          </div>
        </>
      )}
    </section>
  )
}

export default StaffDashboard
