import { useEffect, useState } from 'react'
import { categoryApi } from '../../../api/categoryApi'
import { asArray, getApiData, getApiMessage } from '../../../api/response'

const initialForm = { name: '', description: '', is_active: true }

export default function KelolaKategori() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadCategories() {
    setLoading(true)
    setError('')

    try {
      const response = await categoryApi.list()
      setCategories(asArray(getApiData(response)))
    } catch (err) {
      setError(getApiMessage(err, 'Gagal memuat kategori.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  function startEdit(category) {
    setEditingId(category.id)
    setForm({
      name: category.name || '',
      description: category.description || '',
      is_active: category.is_active !== false && category.is_active !== 0,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (editingId) {
        await categoryApi.update(editingId, form)
        setSuccess('Kategori berhasil diperbarui.')
      } else {
        await categoryApi.create(form)
        setSuccess('Kategori berhasil ditambahkan.')
      }
      setForm(initialForm)
      setEditingId(null)
      await loadCategories()
    } catch (err) {
      setError(getApiMessage(err, 'Gagal menyimpan kategori.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Hapus/nonaktifkan kategori ini?')) return

    try {
      await categoryApi.remove(id)
      setSuccess('Kategori berhasil dihapus/nonaktifkan.')
      await loadCategories()
    } catch (err) {
      setError(getApiMessage(err, 'Gagal menghapus kategori.'))
    }
  }

  return (
    <section className="container-fluid py-4">
      <h2>Kelola Kategori</h2>
      <p className="text-muted">Tambah, edit, dan hapus kategori barang.</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>{editingId ? 'Edit Kategori' : 'Tambah Kategori'}</h5>
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-4">
              <label className="form-label">Nama</label>
              <input className="form-control" name="name" value={form.name} onChange={updateField} required />
            </div>
            <div className="col-md-8">
              <label className="form-label">Deskripsi</label>
              <input className="form-control" name="description" value={form.description} onChange={updateField} />
            </div>
            <div className="col-12 form-check ms-2">
              <input className="form-check-input" id="category-active" name="is_active" type="checkbox" checked={form.is_active} onChange={updateField} />
              <label className="form-check-label" htmlFor="category-active">Aktif</label>
            </div>
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" disabled={saving} type="submit">{saving ? 'Menyimpan...' : 'Simpan'}</button>
              {editingId && <button className="btn btn-outline-secondary" type="button" onClick={() => { setEditingId(null); setForm(initialForm) }}>Batal</button>}
            </div>
          </form>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? <div className="spinner-border" role="status" aria-label="Memuat data" /> : categories.length === 0 ? <p className="text-muted mb-0">Data belum tersedia</p> : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead><tr><th>Nama</th><th>Deskripsi</th><th>Status</th><th>Aksi</th></tr></thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description || '-'}</td>
                      <td>{category.is_active === false || category.is_active === 0 ? 'Tidak Aktif' : 'Aktif'}</td>
                      <td className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => startEdit(category)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(category.id)}>Hapus</button>
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
