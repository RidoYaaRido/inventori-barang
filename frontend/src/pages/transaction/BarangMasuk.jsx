import React, { useState } from 'react';

export default function BarangMasuk() {
  const [item, setItem] = useState('');
  const [qty, setQty] = useState(1);
  const [supplier, setSupplier] = useState('');
  const [date, setDate] = useState('');
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
    const payload = { item, qty, supplier, date, file };
    console.log('Submit Barang Masuk:', payload);
    alert('Data disimpan (mock). Periksa console.');
  }

  return (
    <div>
      <h2>Barang Masuk</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
        <label>
          Nama Barang
          <input value={item} onChange={e => setItem(e.target.value)} required />
        </label>
        <label>
          Jumlah
          <input type="number" value={qty} onChange={e => setQty(Number(e.target.value))} min={1} required />
        </label>
        <label>
          Supplier
          <input value={supplier} onChange={e => setSupplier(e.target.value)} />
        </label>
        <label>
          Tanggal
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <label>
          Bukti (opsional)
          <input type="file" accept="image/*,application/pdf" onChange={handleFile} />
        </label>
        {preview && (
          <div style={{ marginTop: 8 }}>
            <strong>Preview:</strong>
            <div>
              <img src={preview} alt="preview" style={{ maxWidth: 240, marginTop: 8 }} />
            </div>
          </div>
        )}
        <div style={{ marginTop: 8 }}>
          <button type="submit">Simpan Barang Masuk</button>
        </div>
      </form>
    </div>
  );
}
