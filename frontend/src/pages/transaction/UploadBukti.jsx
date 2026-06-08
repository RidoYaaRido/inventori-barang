import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function UploadBukti() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  function handleFile(e) {
    const f = e.target.files[0];
    setFile(f);
    if (!f) { setPreview(null); return; }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log('Upload bukti for', id, file);
    alert('Bukti diupload (mock).');
    navigate('/transactions/history');
  }

  return (
    <div>
      <h2>Upload Bukti {id ? `(ID: ${id})` : ''}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
        <label>
          Pilih file bukti (gambar/pdf)
          <input type="file" accept="image/*,application/pdf" onChange={handleFile} />
        </label>
        {preview && (
          <div>
            <strong>Preview:</strong>
            <div>
              <img src={preview} alt="preview" style={{ maxWidth: 240, marginTop: 8 }} />
            </div>
          </div>
        )}
        <div style={{ marginTop: 8 }}>
          <button type="submit">Upload</button>
        </div>
      </form>
    </div>
  );
}
