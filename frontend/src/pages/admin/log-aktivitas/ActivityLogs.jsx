import { useEffect, useMemo, useState } from 'react'
import { adminApi } from '../../../api/adminApi'
import { asArray, formatDate, getApiData, getApiMessage, getUserName } from '../../../api/response'

export default function LogAktivitas() {
  const [logs, setLogs] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadLogs() {
      setLoading(true)
      setError('')

      try {
        const response = await adminApi.activityLogs(filter ? { action: filter } : {})
        setLogs(asArray(getApiData(response)))
      } catch (err) {
        setError(getApiMessage(err, 'Gagal memuat activity log.'))
      } finally {
        setLoading(false)
      }
    }

    loadLogs()
  }, [filter])

  const actions = useMemo(() => {
    return [...new Set(logs.map((log) => log.action).filter(Boolean))]
  }, [logs])

  return (
    <section className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between gap-3 mb-3">
        <div>
          <h2>Activity Log</h2>
          <p className="text-muted mb-0">Rekam aktivitas pengguna dari backend.</p>
        </div>
        <select className="form-select" style={{ maxWidth: 240 }} value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="">Semua Action</option>
          {actions.map((action) => <option key={action} value={action}>{action}</option>)}
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? <div className="spinner-border" role="status" aria-label="Memuat data" /> : logs.length === 0 ? <p className="text-muted mb-0">Data belum tersedia</p> : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Model Type</th>
                    <th>Description</th>
                    <th>IP Address</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td>{getUserName(log)}</td>
                      <td>{log.action || '-'}</td>
                      <td>{log.model_type || log.subject_type || '-'}</td>
                      <td>{log.description || '-'}</td>
                      <td>{log.ip_address || '-'}</td>
                      <td>{formatDate(log.created_at)}</td>
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
