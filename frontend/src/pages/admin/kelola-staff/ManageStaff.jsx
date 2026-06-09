import { useEffect, useMemo, useState } from 'react'
import { userApi } from '../../../api/userApi'
import { asArray, formatDate, getApiData, getApiMessage } from '../../../api/response'

const initialForm = { name: '', email: '', password: '', role: 'staff', is_active: true }

export default function KelolaStaff() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadUsers() {
    setLoading(true)
    setError('')

    try {
      const response = await userApi.list()
      setUsers(asArray(getApiData(response)))
    } catch (err) {
      setError(getApiMessage(err, 'Gagal memuat staff.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const keyword = search.toLowerCase()
    return users.filter((user) => (
      user.name?.toLowerCase().includes(keyword) ||
      user.email?.toLowerCase().includes(keyword) ||
      user.role?.toLowerCase().includes(keyword)
    ))
  }, [search, users])

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  function startEdit(user) {
    setEditingId(user.id)
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'staff',
      is_active: user.is_active !== false && user.is_active !== 0,
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const payload = { ...form }
    if (editingId && !payload.password) delete payload.password

    try {
      if (editingId) {
        await userApi.update(editingId, payload)
        setSuccess('Staff berhasil diperbarui.')
      } else {
        await userApi.create(payload)
        setSuccess('Staff berhasil ditambahkan.')
      }
      setForm(initialForm)
      setEditingId(null)
      await loadUsers()
    } catch (err) {
      setError(getApiMessage(err, 'Gagal menyimpan staff.'))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Nonaktifkan/hapus staff ini?')) return

    try {
      await userApi.remove(id)
      setSuccess('Staff berhasil dinonaktifkan/dihapus.')
      await loadUsers()
    } catch (err) {
      setError(getApiMessage(err, 'Gagal menghapus staff.'))
    }
  }

  return (
    <section className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
        <div>
          <h2>Kelola Staff</h2>
          <p className="text-muted mb-0">Tambah, edit, dan nonaktifkan akun staff.</p>
        </div>
        <input className="form-control" style={{ maxWidth: 320 }} placeholder="Cari staff" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5>{editingId ? 'Edit Staff' : 'Tambah Staff'}</h5>
          <form className="row g-3" onSubmit={handleSubmit}>
            <Field name="name" label="Nama" value={form.name} onChange={updateField} required />
            <Field name="email" label="Email" type="email" value={form.email} onChange={updateField} required />
            <Field name="password" label={editingId ? 'Password Baru (opsional)' : 'Password'} type="password" value={form.password} onChange={updateField} required={!editingId} />
            <div className="col-md-4">
              <label className="form-label">Role</label>
              <select className="form-select" name="role" value={form.role} onChange={updateField}>
                <option value="staff">staff</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="col-12 form-check ms-2">
              <input className="form-check-input" id="user-active" name="is_active" type="checkbox" checked={form.is_active} onChange={updateField} />
              <label className="form-check-label" htmlFor="user-active">Aktif</label>
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
          {loading ? <div className="spinner-border" role="status" aria-label="Memuat data" /> : filteredUsers.length === 0 ? <p className="text-muted mb-0">Data belum tersedia</p> : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead><tr><th>Nama</th><th>Email</th><th>Role</th><th>Status</th><th>Dibuat</th><th>Aksi</th></tr></thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.is_active === false || user.is_active === 0 ? 'Tidak Aktif' : 'Aktif'}</td>
                      <td>{formatDate(user.created_at)}</td>
                      <td className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-primary" type="button" onClick={() => startEdit(user)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(user.id)}>Nonaktifkan</button>
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

function Field({ label, ...props }) {
  return (
    <div className="col-md-4">
      <label className="form-label">{label}</label>
      <input className="form-control" {...props} />
    </div>
  )
}
