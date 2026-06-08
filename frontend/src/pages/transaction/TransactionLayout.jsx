import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function TransactionLayout() {
  return (
    <div style={{ padding: 20 }}>
      <header style={{ marginBottom: 16 }}>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/transactions/masuk">Barang Masuk</Link>
          <Link to="/transactions/keluar">Barang Keluar</Link>
          <Link to="/transactions/history">Riwayat Transaksi</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
