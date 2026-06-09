import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { itemApi } from '../../api/itemApi'
import { getApiData, getApiMessage } from '../../api/response'

function formatRupiah(value) {
  if (value === null || value === undefined || value === '') return '-'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)
}

function DetailRow({ label, value }) {
  return (
    <tr>
      <th style={{ width: 220 }}>{label}</th>
      <td>{value || '-'}</td>
    </tr>
  )
}

export default function ItemDetail() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadItem() {
      setLoading(true)
      setError('')

      try {
        const response = await itemApi.detail(id)
        setItem(getApiData(response, null))
      } catch (err) {
        setError(getApiMessage(err, 'Gagal memuat detail barang.'))
      } finally {
        setLoading(false)
      }
    }

    loadItem()
  }, [id])

  return (
    <section className="container-fluid py-4">
      <Link to="/staff/items" className="btn btn-sm btn-outline-secondary mb-3">Kembali</Link>
      <h2>Detail Barang</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div className="spinner-border" role="status" aria-label="Memuat data" />
      ) : !item ? (
        <p className="text-muted">Data belum tersedia</p>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <h4>{item.name}</h4>
            <p className="text-muted">{item.description || 'Tidak ada deskripsi.'}</p>
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <DetailRow label="SKU" value={item.sku} />
                  <DetailRow label="Kategori" value={item.category?.name || item.category_name} />
                  <DetailRow label="Stok" value={item.stock_quantity ?? item.stock ?? 0} />
                  <DetailRow label="Satuan" value={item.unit} />
                  <DetailRow label="Harga Satuan" value={formatRupiah(item.unit_price)} />
                  <DetailRow label="Status" value={item.is_active === false || item.is_active === 0 ? 'Tidak Aktif' : 'Aktif'} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
