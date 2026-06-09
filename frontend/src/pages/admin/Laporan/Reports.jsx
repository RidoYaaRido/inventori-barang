import { useEffect, useMemo, useState } from 'react'
import { adminApi } from '../../../api/adminApi'
import { formatDate, getApiMessage, getItemName, getUserName } from '../../../api/response'
import './utils/style.css'

function parseReportData(response) {
  const payload = response?.data
  // Backend: { success, data: { total_items, ..., latest_transactions: { stock_ins, stock_outs } } }
  const data = payload?.data ?? {}
  return {
    totalItems: data.total_items ?? 0,
    totalStockIns: data.total_stock_ins ?? 0,
    totalStockOuts: data.total_stock_outs ?? 0,
    currentStock: data.current_stock_quantity ?? 0,
    stockIns: Array.isArray(data.latest_transactions?.stock_ins) ? data.latest_transactions.stock_ins : [],
    stockOuts: Array.isArray(data.latest_transactions?.stock_outs) ? data.latest_transactions.stock_outs : [],
  }
}

export default function LaporanMutasi() {
  const [summary, setSummary] = useState({ totalItems: 0, totalStockIns: 0, totalStockOuts: 0, currentStock: 0 })
  const [stockIns, setStockIns] = useState([])
  const [stockOuts, setStockOuts] = useState([])
  const [filters, setFilters] = useState({ start_date: '', end_date: '' })
  const [activeType, setActiveType] = useState('SEMUA')
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  async function loadReports() {
    setLoading(true)
    setError('')
    try {
      const response = await adminApi.reports(filters)
      const parsed = parseReportData(response)
      setSummary({
        totalItems: parsed.totalItems,
        totalStockIns: parsed.totalStockIns,
        totalStockOuts: parsed.totalStockOuts,
        currentStock: parsed.currentStock,
      })
      setStockIns(parsed.stockIns)
      setStockOuts(parsed.stockOuts)
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

  // Gabungkan transaksi masuk & keluar menjadi satu list dengan tipe
  const allTransactions = useMemo(() => {
    const ins = stockIns.map((row) => ({ ...row, _type: 'MASUK' }))
    const outs = stockOuts.map((row) => ({ ...row, _type: 'KELUAR' }))
    const merged = [...ins, ...outs].sort((a, b) => {
      const dateA = new Date(a.created_at || 0)
      const dateB = new Date(b.created_at || 0)
      return dateB - dateA
    })
    return merged
  }, [stockIns, stockOuts])

  const filteredRows = useMemo(() => {
    if (activeType === 'SEMUA') return allTransactions
    return allTransactions.filter((row) => row._type === activeType)
  }, [allTransactions, activeType])

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
      setError(getApiMessage(err, 'Gagal export laporan.'))
    } finally {
      setExporting(false)
    }
  }

  const statCards = [
    { label: 'Total Barang', value: summary.totalItems, icon: '📦' },
    { label: 'Total Barang Masuk', value: summary.totalStockIns, icon: '⬇️' },
    { label: 'Total Barang Keluar', value: summary.totalStockOuts, icon: '⬆️' },
    { label: 'Stok Saat Ini', value: summary.currentStock, icon: '🏷️' },
  ]

  return (
    <section className="laporan-container">
      {/* Header */}
      <div className="laporan-header">
        <div>
          <h2 className="laporan-title font-sora">Laporan Mutasi</h2>
          <p className="laporan-subtitle">Laporan mutasi inventaris barang masuk & keluar.</p>
        </div>
        <div className="header-actions">
          <button className="btn-export csv" type="button" disabled={exporting} onClick={handleExport}>
            📥 {exporting ? 'Mengunduh...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-danger mb-3">{error}</div>}

      {/* Filter tanggal */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Dari Tanggal</label>
              <input className="form-control" name="start_date" type="date" value={filters.start_date} onChange={updateFilter} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Sampai Tanggal</label>
              <input className="form-control" name="end_date" type="date" value={filters.end_date} onChange={updateFilter} />
            </div>
            <div className="col-md-4">
              <button className="btn btn-primary w-100" type="button" onClick={loadReports} disabled={loading}>
                {loading ? 'Memuat...' : 'Terapkan Filter'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Statistik ringkasan */}
      {!loading && (
        <div className="stats-grid mb-4">
          {statCards.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <div className="stat-icon-box" style={{ fontSize: 22 }}>{stat.icon}</div>
              <div className="stat-info">
                <span className="stat-label">{stat.label}</span>
                <span className="stat-value">{stat.value.toLocaleString('id-ID')}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tabel transaksi */}
      <div className="table-controls-card">
        <span className="fw-bold" style={{ color: '#0f172a', fontSize: 14 }}>
          Riwayat Transaksi
          {!loading && (
            <span style={{ color: '#64748b', fontWeight: 400, marginLeft: 8 }}>
              ({filteredRows.length} data)
            </span>
          )}
        </span>
        <div className="flow-filter-group">
          {['SEMUA', 'MASUK', 'KELUAR'].map((type) => (
            <button
              key={type}
              className={`btn-flow-filter${activeType === type ? ' active' : ''}`}
              type="button"
              onClick={() => setActiveType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="table-card-wrapper">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <span className="ms-3 text-muted">Memuat data laporan...</span>
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="d-flex flex-column align-items-center py-5 text-muted">
            <span style={{ fontSize: 40 }}>📋</span>
            <p className="mt-3 mb-0">Tidak ada data transaksi untuk ditampilkan.</p>
            {(filters.start_date || filters.end_date) && (
              <p className="small mt-1">Coba ubah rentang tanggal atau hapus filter.</p>
            )}
          </div>
        ) : (
          <table className="laporan-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tipe</th>
                <th>Barang</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Operator</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={`${row._type}-${row.id}`}>
                  <td className="td-kode-id font-mono">#{row.id}</td>
                  <td>
                    <span className={`badge-aliran ${row._type === 'MASUK' ? 'masuk' : 'keluar'}`}>
                      {row._type}
                    </span>
                  </td>
                  <td>
                    <div className="item-info-cell">
                      <span className="item-name">{getItemName(row)}</span>
                      {row.item?.sku && <span className="item-sub-id">SKU: {row.item.sku}</span>}
                    </div>
                  </td>
                  <td><strong>{row.quantity ?? '-'}</strong></td>
                  <td>
                    {row.status ? (
                      <span className={`badge-status ${row.status.toLowerCase()}`}>
                        {row.status.charAt(0).toUpperCase() + row.status.slice(1).toLowerCase()}
                      </span>
                    ) : '-'}
                  </td>
                  <td>{getUserName(row)}</td>
                  <td style={{ color: '#64748b', fontSize: 12 }}>
                    {formatDate(row.created_at || row.received_at || row.released_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
