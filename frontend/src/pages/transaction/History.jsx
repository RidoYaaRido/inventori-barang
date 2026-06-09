import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { stockInApi } from '../../api/stockInApi'
import { stockOutApi } from '../../api/stockOutApi'
import { asArray, formatDate, getApiData, getApiMessage, getItemName, getUserName } from '../../api/response'

export default function History() {
  const [stockIns, setStockIns] = useState([])
  const [stockOuts, setStockOuts] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadHistory() {
      setLoading(true)
      setError('')

      try {
        const [insRes, outsRes] = await Promise.all([stockInApi.list(), stockOutApi.list()])
        setStockIns(asArray(getApiData(insRes)).map((row) => ({ ...row, type: 'stock-in' })))
        setStockOuts(asArray(getApiData(outsRes)).map((row) => ({ ...row, type: 'stock-out' })))
      } catch (err) {
        setError(getApiMessage(err, 'Gagal memuat riwayat transaksi.'))
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  const rows = useMemo(() => {
    return [...stockIns, ...stockOuts]
      .filter((row) => filter === 'all' || row.type === filter)
      .sort((a, b) => new Date(b.created_at || b.received_at || b.released_at) - new Date(a.created_at || a.received_at || a.released_at))
  }, [filter, stockIns, stockOuts])

  return (
    <section className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
        <div>
          <h2>Riwayat Transaksi</h2>
          <p className="text-muted mb-0">Gabungan barang masuk dan barang keluar.</p>
        </div>
        <select className="form-select" style={{ maxWidth: 220 }} value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">Semua</option>
          <option value="stock-in">Barang Masuk</option>
          <option value="stock-out">Barang Keluar</option>
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="spinner-border" role="status" aria-label="Memuat data" />
          ) : rows.length === 0 ? (
            <p className="text-muted mb-0">Data belum tersedia</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Tipe Transaksi</th>
                    <th>Nama Barang</th>
                    <th>Quantity</th>
                    <th>Status</th>
                    <th>User</th>
                    <th>Tanggal</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={`${row.type}-${row.id}`}>
                      <td>{row.type === 'stock-in' ? 'Barang Masuk' : 'Barang Keluar'}</td>
                      <td>{getItemName(row)}</td>
                      <td>{row.quantity}</td>
                      <td>{row.status || '-'}</td>
                      <td>{getUserName(row)}</td>
                      <td>{formatDate(row.created_at || row.received_at || row.released_at)}</td>
                      <td>
                        <Link className="btn btn-sm btn-outline-primary" to={`/staff/transactions/${row.type}/${row.id}`}>Detail</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
