import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { itemApi } from '../../api/itemApi'
import { asArray, getApiData, getApiMessage } from '../../api/response'

function itemStatus(item) {
  if (item.is_active === false || item.is_active === 0) return 'Tidak Aktif'
  const stock = Number(item.stock_quantity ?? item.stock ?? 0)
  if (stock <= 0) return 'Habis'
  const minStock = Number(item.minimum_stock ?? item.min_stock ?? 5)
  return stock <= minStock ? 'Stok Rendah' : 'Aktif'
}

export default function ItemList() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      setError('')

      try {
        const response = await itemApi.list(search ? { search } : {})
        setItems(asArray(getApiData(response)))
      } catch (err) {
        setError(getApiMessage(err, 'Gagal memuat daftar barang.'))
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  return (
    <section className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
        <div>
          <h2>Daftar Barang</h2>
          <p className="text-muted mb-0">Data barang</p>
        </div>
        <input
          className="form-control"
          style={{ maxWidth: 360 }}
          placeholder="Cari nama barang atau SKU"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="spinner-border" role="status" aria-label="Memuat data" />
          ) : items.length === 0 ? (
            <p className="text-muted mb-0">Data belum tersedia</p>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Nama Barang</th>
                    <th>SKU</th>
                    <th>Kategori</th>
                    <th>Stok</th>
                    <th>Satuan</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.sku || '-'}</td>
                      <td>{item.category?.name || item.category_name || '-'}</td>
                      <td>{item.stock_quantity ?? item.stock ?? 0}</td>
                      <td>{item.unit || '-'}</td>
                      <td>{itemStatus(item)}</td>
                      <td>
                        <Link className="btn btn-sm btn-outline-primary" to={`/staff/items/${item.id}`}>
                          Detail
                        </Link>
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
