import React from 'react';
import { useParams, Link } from 'react-router-dom';

const mockDetail = id => ({
  id,
  type: id && id.endsWith('1') ? 'masuk' : 'keluar',
  item: 'Contoh Barang',
  qty: 10,
  date: '2026-06-06',
  supplier: 'PT. Contoh',
  divisi: 'IT',
  status: 'Selesai',
  proofUrl: null,
});

export default function DetailTransaksi() {
  const { id } = useParams();
  const data = mockDetail(id || 'T-000');

  return (
    <div>
      <h2>Detail Transaksi {data.id}</h2>
      <div style={{ display: 'grid', gap: 6, maxWidth: 640 }}>
        <div><strong>Tipe:</strong> {data.type}</div>
        <div><strong>Nama Barang:</strong> {data.item}</div>
        <div><strong>Jumlah:</strong> {data.qty}</div>
        <div><strong>Tanggal:</strong> {data.date}</div>
        {data.supplier && <div><strong>Supplier:</strong> {data.supplier}</div>}
        {data.divisi && <div><strong>Divisi:</strong> {data.divisi}</div>}
        <div><strong>Status:</strong> {data.status}</div>
        <div style={{ marginTop: 8 }}>
          <Link to={`/transactions/upload/${data.id}`}>Upload/Perbarui Bukti</Link>
        </div>
      </div>
    </div>
  );
}
