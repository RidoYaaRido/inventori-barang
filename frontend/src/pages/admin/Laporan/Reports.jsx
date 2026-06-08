import { useState } from "react";
import "./utils/style.css";
import { 
  Download, 
  FileText, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Clock, 
  Inbox 
} from "lucide-react";
import { INITIAL_MUTASI } from "./utils/data";

export default function LaporanMutasi() {
  const [mutasiData] = useState(INITIAL_MUTASI);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFlowFilter, setActiveFlowFilter] = useState("Semua Aliran");

  // Filter logika gabungan (Search + Tab Filter Aliran)
  const filteredData = mutasiData.filter(item => {
    const matchesSearch = 
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.originDestination.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFlow = 
      activeFlowFilter === "Semua Aliran" || 
      item.type === activeFlowFilter.toUpperCase().replace("BARANG ", "");

    return matchesSearch && matchesFlow;
  });

  return (
    <div className="laporan-container">
      
      {/* ── Header Area ── */}
      <div className="laporan-header">
        <div>
          <h1 className="laporan-title font-sora">Laporan Mutasi & Transaksi</h1>
          <p className="laporan-subtitle">
            Analisis data mutasi historis, kuantitas volume logistik, dan laporan persediaan.
          </p>
        </div>
        <div className="header-actions">
          <button className="btn-export csv" onClick={() => alert("Export CSV berjalan...")}>
            <Download size={15} /> Format CSV
          </button>
          <button className="btn-export pdf" onClick={() => alert("Unduh PDF berjalan...")}>
            <FileText size={15} /> Unduh PDF
          </button>
        </div>
      </div>

      {/* ── Top Stats Cards Grid ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-box"><TrendingUp size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Mutasi Masuk Disetujui</span>
            <span className="stat-value font-mono">55 unit</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box"><TrendingDown size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Mutasi Keluar Disetujui</span>
            <span className="stat-value font-mono">4 unit</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box"><DollarSign size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Kas Aliran Otoritatif</span>
            <span className="stat-value font-mono">Rp 239.541.000</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-box"><Clock size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">Menunggu Diproses</span>
            <span className="stat-value font-mono">2 transaksi</span>
          </div>
        </div>
      </div>

      {/* ── Table Controls Bar ── */}
      <div className="table-controls-card">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Cari item, operator, divisi..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flow-filter-group">
          {["Semua Aliran", "Barang Masuk", "Barang Keluar"].map((flow) => (
            <button
              key={flow}
              className={`btn-flow-filter ${activeFlowFilter === flow ? "active" : ""}`}
              onClick={() => setActiveFlowFilter(flow)}
            >
              {flow}
            </button>
          ))}
        </div>
      </div>

      {/* ── Laporan Data Table ── */}
      <div className="table-card-wrapper">
        <table className="laporan-table">
          <thead>
            <tr>
              <th>Kode ID</th>
              <th>Barang</th>
              <th>Tipe Aliran</th>
              <th>Jumlah (QTY)</th>
              <th>Subjek Asal/Tujuan</th>
              <th>Operator</th>
              <th>Status Kerja</th>
              <th style={{ textAlign: "right" }}>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "48px 0", color: "#94a3b8" }}>
                  <Inbox size={32} style={{ display: "block", margin: "0 auto 8px", color: "#cbd5e1" }} />
                  Tidak ada transaksi mutasi yang cocok dengan filter saat ini.
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.id}>
                  <td className="td-kode-id font-mono">{row.id}</td>
                  <td>
                    <div className="item-info-cell">
                      <span className="item-name font-sora">{row.itemName}</span>
                      <span className="item-sub-id font-mono">ID: {row.itemId}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-aliran ${row.type.toLowerCase()}`}>
                      {row.type}
                    </span>
                  </td>
                  <td className="font-mono" style={{ fontWeight: 600 }}>{row.qty} pcs</td>
                  <td style={{ color: "#475569" }}>{row.originDestination}</td>
                  <td style={{ fontWeight: 500 }}>{row.operator}</td>
                  <td>
                    <span className={`badge-status ${row.status.toLowerCase()}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="font-mono" style={{ textAlign: "right", color: "#64748b" }}>
                    {row.date}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}