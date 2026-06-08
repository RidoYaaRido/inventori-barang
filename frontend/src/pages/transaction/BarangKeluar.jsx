import React, { useState } from 'react';

export default function BarangKeluar() {
  const [item, setItem] = useState('');
  const [qty, setQty] = useState(1);
  const [divisi, setDivisi] = useState('');
  const [date, setDate] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { item, qty, divisi, date };
    console.log('Submit Barang Keluar:', payload);
    alert('Data keluar disimpan (mock). Periksa console.');
  }

  return (
    <div>
      <h2>Barang Keluar</h2>
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
          Divisi
          <input value={divisi} onChange={e => setDivisi(e.target.value)} />
        </label>
        <label>
          Tanggal
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        </label>
        <div style={{ marginTop: 8 }}>
          <button type="submit">Simpan Barang Keluar</button>
        </div>
      </form>
    </div>
  );
}
