import { useEffect, useState } from 'react'
import { itemApi } from '../../api/itemApi'
import { stockOutApi } from '../../api/stockOutApi'
import { asArray, getApiData, getApiMessage } from '../../api/response'

const initialForm = {
  item_id: '',
  quantity: 1,
  reference_number: '',
  notes: '',
  released_at: '',
}

export default function BarangKeluar() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function loadItems() {
      setLoading(true)
      try {
        const response = await itemApi.list()
        setItems(asArray(getApiData(response)))
      } catch (err) {
        setError(getApiMessage(err, 'Gagal memuat data barang.'))
      } finally {
        setLoading(false)
      }
    }

    loadItems()
  }, [])

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await stockOutApi.create(form)
      const created = getApiData(response, response.data)

      if (file && created?.id) {
        const formData = new FormData()
        formData.append('attachment', file)
        await stockOutApi.upload(created.id, formData)
      }

      setSuccess(file ? 'Barang keluar berhasil disimpan dan bukti berhasil diupload.' : 'Barang keluar berhasil disimpan.')
      setForm(initialForm)
      setFile(null)
    } catch (err) {
      setError(getApiMessage(err, 'Gagal menyimpan barang keluar. Pastikan stok mencukupi.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="container-fluid py-4">
      <h2>Barang Keluar</h2>
      <p className="text-muted">Input transaksi barang keluar dari data backend.</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          {loading ? (
            <div className="spinner-border" role="status" aria-label="Memuat data" />
          ) : (
            <form className="row g-3" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label className="form-label">Barang</label>
                <select className="form-select" name="item_id" value={form.item_id} onChange={updateField} required>
                  <option value="">Pilih barang</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>{item.name} - stok {item.stock_quantity ?? item.stock ?? 0}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Quantity</label>
                <input className="form-control" min="1" name="quantity" type="number" value={form.quantity} onChange={updateField} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Tanggal Keluar</label>
                <input className="form-control" name="released_at" type="datetime-local" value={form.released_at} onChange={updateField} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Reference Number</label>
                <input className="form-control" name="reference_number" value={form.reference_number} onChange={updateField} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Bukti Upload</label>
                <input className="form-control" type="file" onChange={(event) => setFile(event.target.files?.[0] || null)} />
                {file && <small className="text-muted">File dipilih: {file.name}</small>}
              </div>
              <div className="col-12">
                <label className="form-label">Notes</label>
                <textarea className="form-control" name="notes" rows="3" value={form.notes} onChange={updateField} />
              </div>
              <div className="col-12">
                <button className="btn btn-primary" disabled={submitting} type="submit">
                  {submitting ? 'Menyimpan...' : 'Simpan Barang Keluar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
