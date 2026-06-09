import { useEffect, useState } from 'react'
import { categoryApi } from '../../../api/categoryApi'
import { itemApi } from '../../../api/itemApi'
import { asArray, getApiData, getApiMessage } from '../../../api/response'

const initialForm = {
  category_id: '',
  name: '',
  sku: '',
  description: '',
  unit_price: '',
  stock_quantity: 0,
  unit: '',
  is_active: true,
}

const getListData = (response) => {
  const data = getApiData(response)
  return asArray(data)
}

export default function KelolaBarang() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadData(keyword = search) {
    setLoading(true)
    setError('')

    try {
      const [itemsRes, categoriesRes] = await Promise.all([
        itemApi.list(keyword ? { search: keyword } : {}),
        categoryApi.list(),
      ])
      setItems(getListData(itemsRes))
      setCategories(getListData(categoriesRes))
    } catch (err) {
      setError(getApiMessage(err, 'Gagal memuat barang atau kategori.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => loadData(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  function startEdit(item) {
    setEditingId(item.id)
    setForm({
      category_id: item.category_id || item.category?.id || '',
      name: item.name || '',
      sku: item.sku || '',
      description: item.description || '',
      unit_price: item.unit_price || '',
      stock_quantity: item.stock_quantity ?? item.stock ?? 0,
      unit: item.unit || '',
      is_active: item.is_active !== false && item.is_active !== 0,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (editingId) {
        await itemApi.update(editingId, form)
        setSuccess('Barang berhasil diperbarui.')
      } else {
        await itemApi.create(form)
        setSuccess('Barang berhasil ditambahkan.')
      }
      setForm(initialForm)
      setEditingId(null)
      await loadData()
    } catch (err) {
      setError(getApiMessage(err, 'Gagal menyimpan barang.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus/nonaktifkan barang ini?')) return

    try {
      await itemApi.remove(id)
      setSuccess('Barang berhasil dihapus/nonaktifkan.')
      await loadData()
    } catch (err) {
      setError(getApiMessage(err, 'Gagal menghapus barang.'))
    }
  }

  return (
    <section className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
        <div>
          <h2>Kelola Barang</h2>
          <p className="text-muted mb-0">Tambah, edit, cari, dan hapus barang.</p>
        </div>
        <input className="form-control" style={{ maxWidth: 320 }} placeholder="Search barang" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>{editingId ? 'Edit Barang' : 'Tambah Barang'}</h5>
          <form className="row g-3" onSubmit={handleSubmit}>
            <Field name="name" label="Nama" value={form.name} onChange={updateField} required />
            <Field name="sku" label="SKU" value={form.sku} onChange={updateField} required />
            <div className="col-md-4">
              <label className="form-label">Kategori</label>
              <select className="form-select" name="category_id" value={form.category_id} onChange={updateField} required>
                <option value="">Pilih kategori</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>
            <Field name="unit_price" label="Harga Satuan" type="number" value={form.unit_price} onChange={updateField} />
            <Field name="stock_quantity" label="Stok" type="number" value={form.stock_quantity} onChange={updateField} />
            <Field name="unit" label="Satuan" value={form.unit} onChange={updateField} />
            <div className="col-12">
              <label className="form-label">Deskripsi</label>
              <textarea className="form-control" name="description" rows="2" value={form.description} onChange={updateField} />
            </div>
            <div className="col-12 form-check ms-2">
              <input className="form-check-input" id="item-active" name="is_active" type="checkbox" checked={form.is_active} onChange={updateField} />
              <label className="form-check-label" htmlFor="item-active">Aktif</label>
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" disabled={saving} type="submit">{saving ? 'Menyimpan...' : 'Simpan'}</button>
              {editingId && <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingId(null); setForm(initialForm) }}>Batal</button>}
            </div>
          </form>
        </div>
      </div>

      <DataTable items={items} loading={loading} onEdit={startEdit} onDelete={handleDelete} />
    </section>
  )
}

function Field({ label, ...props }) {
  return (
    <div className="col-md-4">
      <label className="form-label">{label}</label>
      <input className="form-control" {...props} />
    </div>
  )
}

function DataTable({ items, loading, onEdit, onDelete }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        {loading ? <div className="spinner-border" role="status" aria-label="Memuat data" /> : items.length === 0 ? <p className="text-muted mb-0">Data belum tersedia</p> : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead><tr><th>Nama</th><th>SKU</th><th>Kategori</th><th>Stok</th><th>Satuan</th><th>Status</th><th>Aksi</th></tr></thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.sku}</td>
                    <td>{item.category?.name || item.category_name || '-'}</td>
                    <td>{item.stock_quantity ?? item.stock ?? 0}</td>
                    <td>{item.unit}</td>
                    <td>{item.is_active === false || item.is_active === 0 ? 'Tidak Aktif' : 'Aktif'}</td>
                    <td className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => onEdit(item)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => onDelete(item.id)}>Hapus</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
