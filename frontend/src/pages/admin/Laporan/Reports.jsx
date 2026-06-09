import { useEffect, useState } from 'react'
import { adminApi } from '../../../api/adminApi'
import { asArray, formatDate, getApiData, getApiMessage, getItemName, getUserName } from '../../../api/response'

export default function LaporanMutasi() {
  const [reports, setReports] = useState([])
  const [filters, setFilters] = useState({ start_date: '', end_date: '' })
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  async function loadReports() {
    setLoading(true)
    setError('')

    try {
      const response = await adminApi.reports(filters)
      setReports(asArray(getApiData(response)))
    } catch (err) {
      setError(getApiMessage(err, 'Gagal memuat laporan.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  function updateFilter(event) {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleExport() {
    setExporting(true)
    setError('')

    try {
      const response = await adminApi.exportReports(filters)
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'laporan-inventaris.csv'
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      setError(getApiMessage(err, 'Gagal export laporan. Pastikan endpoint /admin/reports/export tersedia.'))
    } finally {
      setExporting(false)
    }
  }

  return (
    <section className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
        <div>
          <h2>Laporan</h2>
          <p className="text-muted mb-0">Laporan mutasi inventaris dari backend.</p>
        </div>
        <button className="btn btn-success" disabled={exporting} type="button" onClick={handleExport}>
          {exporting ? 'Mengunduh...' : 'Export CSV'}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <input className="form-control" name="start_date" type="date" value={filters.start_date} onChange={updateFilter} />
            </div>
            <div className="col-md-4">
              <label className="form-label">End Date</label>
              <input className="form-control" name="end_date" type="date" value={filters.end_date} onChange={updateFilter} />
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary" type="button" onClick={loadReports}>Terapkan Filter</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? <div className="spinner-border" role="status" aria-label="Memuat data" /> : reports.length === 0 ? <p className="text-muted mb-0">Data belum tersedia</p> : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead><tr><th>Tipe</th><th>Barang</th><th>Quantity</th><th>Status</th><th>User</th><th>Tanggal</th></tr></thead>
                <tbody>
                  {reports.map((row) => (
                    <tr key={`${row.type || row.transaction_type}-${row.id}`}>
                      <td>{row.type || row.transaction_type || '-'}</td>
                      <td>{getItemName(row)}</td>
                      <td>{row.quantity}</td>
                      <td>{row.status || '-'}</td>
                      <td>{getUserName(row)}</td>
                      <td>{formatDate(row.created_at || row.received_at || row.released_at)}</td>
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
