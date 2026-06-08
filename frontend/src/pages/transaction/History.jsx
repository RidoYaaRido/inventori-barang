import React from 'react';
import { Link } from 'react-router-dom';

const mock = [
  { id: 'T-001', type: 'masuk', item: 'Kabel USB', qty: 20, date: '2026-06-01', status: 'Selesai' },
  { id: 'T-002', type: 'keluar', item: 'Adaptor', qty: 5, date: '2026-06-03', status: 'Pending' },
];

export default function History() {
  return (
    <div>
      <h2>Riwayat Transaksi</h2>
      <table border="1" cellPadding={6} style={{ borderCollapse: 'collapse', width: '100%', maxWidth: 900 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tipe</th>
            <th>Nama Barang</th>
            <th>Jumlah</th>
            <th>Tanggal</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {mock.map(tx => (
            <tr key={tx.id}>
              <td>{tx.id}</td>
              <td>{tx.type}</td>
              <td>{tx.item}</td>
              <td>{tx.qty}</td>
              <td>{tx.date}</td>
              <td>{tx.status}</td>
              <td style={{ display: 'flex', gap: 8 }}>
                <Link to={`/transactions/detail/${tx.id}`}>Detail</Link>
                <Link to={`/transactions/upload/${tx.id}`}>Upload Bukti</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
