import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { stockInApi } from '../../api/stockInApi'
import { stockOutApi } from '../../api/stockOutApi'
import { getApiMessage } from '../../api/response'

export default function UploadBukti() {
  const { type = 'stock-in', id } = useParams()
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleFile(event) {
    const selectedFile = event.target.files?.[0] || null
    setFile(selectedFile)
    setPreview(null)

    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result)
      reader.readAsDataURL(selectedFile)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!file) {
      setError('Pilih file bukti terlebih dahulu.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formData = new FormData()
      formData.append('attachment', file)
      const api = type === 'stock-out' ? stockOutApi : stockInApi
      await api.upload(id, formData)
      setSuccess('Bukti berhasil diupload.')
      setTimeout(() => navigate('/staff/transactions'), 700)
    } catch (err) {
      setError(getApiMessage(err, 'Gagal upload bukti transaksi.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container-fluid py-4">
      <h2>Upload Bukti</h2>
      <p className="text-muted">File dipilih: {file?.name || '-'}</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card shadow-sm">
        <div className="card-body">
          <form className="row g-3" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label">Pilih file bukti</label>
              <input className="form-control" type="file" accept="image/*,application/pdf" onChange={handleFile} />
            </div>
            {preview && (
              <div className="col-12">
                <img alt="Preview bukti" src={preview} style={{ maxWidth: 240 }} />
              </div>
            )}
            <div className="col-12">
              <button className="btn btn-primary" disabled={loading} type="submit">
                {loading ? 'Mengupload...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
