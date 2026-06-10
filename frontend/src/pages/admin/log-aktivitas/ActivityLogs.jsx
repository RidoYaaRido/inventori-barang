import { useEffect, useMemo, useState } from 'react'
import { adminApi } from '../../../api/adminApi'
import { asArray, formatDate, getApiMessage, getUserName } from '../../../api/response'

const ACTIONS = [
  'login',
  'logout',
  'failed_login',
  'tambah_barang',
  'edit_barang',
  'hapus_barang',
  'barang_masuk',
  'barang_keluar',
  'upload_bukti',
  'export_laporan',
]

const initialFilters = {
  action: '',
  user_id: '',
  date_from: '',
  date_to: '',
  search: '',
}

export default function LogAktivitas() {
  const [logs, setLogs] = useState([])
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState(initialFilters)
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const params = useMemo(() => {
    return Object.fromEntries(
      Object.entries({ ...filters, page: pagination.current_page, per_page: 15 })
        .filter(([, value]) => value !== '' && value !== null && value !== undefined),
    )
  }, [filters, pagination.current_page])

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await adminApi.users()
        setUsers(asArray(response?.data?.data))
      } catch {
        setUsers([])
      }
    }

    loadUsers()
  }, [])

  useEffect(() => {
    async function loadLogs() {
      setLoading(true)
      setError('')

      try {
        const response = await adminApi.activityLogs(params)
        const payload = response?.data?.data ?? {}
        setLogs(asArray(payload.data))
        setPagination({
          current_page: payload.current_page ?? 1,
          last_page: payload.last_page ?? 1,
          total: payload.total ?? 0,
        })
      } catch (err) {
        setError(getApiMessage(err, 'Gagal memuat activity log.'))
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [params])

  function updateFilter(name, value) {
    setPagination((current) => ({ ...current, current_page: 1 }))
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function resetFilters() {
    setPagination((current) => ({ ...current, current_page: 1 }))
    setFilters(initialFilters)
  }

  return (
    <section className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
        <div>
          <h2>Activity Log</h2>
          <p className="text-muted mb-0">Rekam aktivitas user, IP, perangkat, dan lokasi perkiraan.</p>
        </div>
        <button className="btn btn-outline-secondary" type="button" onClick={resetFilters}>
          Reset Filter
        </button>
      </div>

      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label">Action</label>
              <select className="form-select" value={filters.action} onChange={(event) => updateFilter('action', event.target.value)}>
                <option value="">Semua</option>
                {ACTIONS.map((action) => <option key={action} value={action}>{action}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">User</label>
              <select className="form-select" value={filters.user_id} onChange={(event) => updateFilter('user_id', event.target.value)}>
                <option value="">Semua user</option>
                {users.map((user) => <option key={user.id} value={user.id}>{user.name} ({user.role})</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Dari</label>
              <input className="form-control" type="date" value={filters.date_from} onChange={(event) => updateFilter('date_from', event.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Sampai</label>
              <input className="form-control" type="date" value={filters.date_to} onChange={(event) => updateFilter('date_to', event.target.value)} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Search</label>
              <input className="form-control" value={filters.search} placeholder="User, action, IP, browser..." onChange={(event) => updateFilter('search', event.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? <div className="spinner-border" role="status" aria-label="Memuat data" /> : logs.length === 0 ? <p className="text-muted mb-0">Data belum tersedia</p> : (
            <>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Action</th>
                      <th>Description</th>
                      <th>IP Address</th>
                      <th>Location</th>
                      <th>Browser</th>
                      <th>OS</th>
                      <th>Device</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td>{getUserName(log)}</td>
                        <td><span className="badge text-bg-light">{log.action || '-'}</span></td>
                        <td>{log.description || '-'}</td>
                        <td>{log.ip_address || '-'}</td>
                        <td>{[log.city, log.country].filter(Boolean).join(', ') || '-'}</td>
                        <td>{log.browser || '-'}</td>
                        <td>{log.operating_system || '-'}</td>
                        <td>{log.device_type || '-'}</td>
                        <td>{formatDate(log.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <small className="text-muted">Total {pagination.total} log</small>
                <div className="btn-group">
                  <button className="btn btn-outline-secondary btn-sm" disabled={pagination.current_page <= 1} onClick={() => setPagination((current) => ({ ...current, current_page: current.current_page - 1 }))}>Prev</button>
                  <button className="btn btn-outline-secondary btn-sm" disabled>{pagination.current_page} / {pagination.last_page}</button>
                  <button className="btn btn-outline-secondary btn-sm" disabled={pagination.current_page >= pagination.last_page} onClick={() => setPagination((current) => ({ ...current, current_page: current.current_page + 1 }))}>Next</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
