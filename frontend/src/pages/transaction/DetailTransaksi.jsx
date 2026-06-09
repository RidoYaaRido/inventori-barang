import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { stockInApi } from '../../api/stockInApi'
import { stockOutApi } from '../../api/stockOutApi'
import { formatDate, getApiData, getApiMessage, getItemName, getUserName } from '../../api/response'

function Row({ label, value }) {
  return (
    <tr>
      <th style={{ width: 220 }}>{label}</th>
      <td>{value || '-'}</td>
    </tr>
  )
}

export default function DetailTransaksi() {
  const { type, id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDetail() {
      setLoading(true)
      setError('')

      try {
        const api = type === 'stock-out' ? stockOutApi : stockInApi
        const response = await api.detail(id)
        setData(getApiData(response, null))
      } catch (err) {
        setError(getApiMessage(err, 'Gagal memuat detail transaksi.'))
      } finally {
        setLoading(false)
      }
    }

    loadDetail()
  }, [id, type])

  return (
    <section className="container-fluid py-4">
      <Link className="btn btn-sm btn-outline-secondary mb-3" to="/staff/transactions">Kembali</Link>
      <h2>Detail Transaksi</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="spinner-border" role="status" aria-label="Memuat data" />
      ) : !data ? (
        <p className="text-muted">Data belum tersedia</p>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <Row label="Tipe Transaksi" value={type === 'stock-out' ? 'Barang Keluar' : 'Barang Masuk'} />
                  <Row label="Nama Barang" value={getItemName(data)} />
                  <Row label="Quantity" value={data.quantity} />
                  <Row label="User" value={getUserName(data)} />
                  <Row label="Reference Number" value={data.reference_number} />
                  <Row label="Notes" value={data.notes} />
                  <Row label="Status" value={data.status} />
                  <Row label="Tanggal" value={formatDate(data.created_at || data.received_at || data.released_at)} />
                  <Row label="Bukti Upload" value={data.attachment_url || data.attachment_path ? <a href={data.attachment_url || data.attachment_path} target="_blank" rel="noreferrer">Lihat bukti</a> : '-'} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
