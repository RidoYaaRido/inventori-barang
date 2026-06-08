import { useState } from "react";
import "./utils/style.css";
import {
  Clock,
  History,
  TrendingUp,
  TrendingDown,
  ShieldAlert,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { INITIAL_QUEUE } from "./utils/data";

export default function ValidasiTransaksi() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeTab, setActiveTab] = useState("antrean");

  const handleAction = (id, actionType, event) => {
    event.stopPropagation(); // Mencegah terpicunya trigger klik card row

    const message = actionType === "setujui" ? "menyetujui" : "menolak";
    if (window.confirm(`Apakah Anda yakin ingin ${message} transaksi ${id}?`)) {
      setQueue((prev) => prev.filter((item) => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  return (
    <div className="validasi-container">
      {/* ── Header Area ── */}
      <div className="validasi-header">
        <div>
          <h1 className="validasi-title font-sora">
            Otorisasi & Validasi Transaksi
          </h1>
          <p className="validasi-subtitle">
            Validasi dan verifikasi pengajuan stok masuk dan pengambilan barang
            keluar oleh staff.
          </p>
        </div>

        {/* Tab Switcher Atas */}
        <div className="tab-actions-group">
          <button
            className={`btn-tab ${activeTab === "antrean" ? "active" : ""}`}
            onClick={() => setActiveTab("antrean")}
          >
            <Clock size={15} /> Dalam Antrean{" "}
            <span className="tab-badge">{queue.length}</span>
          </button>
          <button
            className={`btn-tab ${activeTab === "riwayat" ? "active" : ""}`}
            onClick={() => setActiveTab("riwayat")}
          >
            <History size={15} /> Riwayat Otorisasi{" "}
            <span className="tab-badge">4</span>
          </button>
        </div>
      </div>

      {/* ── Main Split Layout Grid ── */}
      <div className="split-layout-grid">
        {/* KOLOM KIRI: Daftar Antrean Transaksi */}
        <div className="antrean-list-wrapper">
          {queue.length === 0 ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                padding: "40px",
                textAlign: "center",
                border: "1.5px solid #f1f5f9",
                color: "#94a3b8",
              }}
            >
              <CheckCircle
                size={32}
                style={{
                  display: "block",
                  margin: "0 auto 8px",
                  color: "#0d9488",
                }}
              />
              Semua antrean transaksi logistik telah selesai diproses.
            </div>
          ) : (
            queue.map((item) => (
              <div
                key={item.id}
                className={`antrean-card-row ${selectedItem?.id === item.id ? "selected" : ""}`}
                onClick={() => setSelectedItem(item)}
              >
                {/* Indikator Arah Aliran */}
                <div
                  className={`direction-icon-box ${item.type.toLowerCase()}`}
                >
                  {item.type === "MASUK" ? (
                    <TrendingUp size={18} />
                  ) : (
                    <TrendingDown size={18} />
                  )}
                </div>

                {/* Info Detail Transaksi */}
                <div className="item-meta-info">
                  <div className="item-title-line">
                    <span className="item-name-text font-sora">
                      {item.itemName}
                    </span>
                    <span className={`badge-flow ${item.type.toLowerCase()}`}>
                      {item.type}
                    </span>
                  </div>

                  <div className="item-sub-details">
                    <span
                      className="font-mono"
                      style={{ fontWeight: 700, color: "#7c3aed" }}
                    >
                      {item.id}
                    </span>
                    <span className="sub-divider">|</span>
                    <span>
                      Operator: <strong>{item.operator}</strong>
                    </span>
                    <span className="sub-divider">|</span>
                    <span>
                      Qty: <strong className="font-mono">{item.qty}</strong>
                    </span>
                  </div>
                </div>

                {/* Tanggal & Tombol Aksi */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className="row-date-text font-mono">{item.date}</span>
                  <div className="row-actions-container">
                    <button
                      className="btn-action-status reject"
                      onClick={(e) => handleAction(item.id, "tolak", e)}
                    >
                      TOLAK
                    </button>
                    <button
                      className="btn-action-status approve"
                      onClick={(e) => handleAction(item.id, "setujui", e)}
                    >
                      SETUJUI
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* KOLOM KANAN: Detail Review Panel */}
        <div>
          {selectedItem ? (
            <div className="detail-review-panel has-content">
              <h3 className="panel-header-title font-sora">
                Detail Peninjauan Dokumen
              </h3>
              <div className="detail-info-list">
                <div className="info-field-row">
                  <span className="info-field-label">Kode Mutasi:</span>
                  <span
                    className="info-field-value font-mono"
                    style={{ color: "#7c3aed" }}
                  >
                    {selectedItem.id}
                  </span>
                </div>
                <div className="info-field-row">
                  <span className="info-field-label">Nama Item Barang:</span>
                  <span className="info-field-value">
                    {selectedItem.itemName}
                  </span>
                </div>
                <div className="info-field-row">
                  <span className="info-field-label">Tipe Pergerakan:</span>
                  <span
                    className={`badge-flow ${selectedItem.type.toLowerCase()}`}
                    style={{ width: "fit-content" }}
                  >
                    {selectedItem.type}
                  </span>
                </div>
                <div className="info-field-row">
                  <span className="info-field-label">Kuantitas Logistik:</span>
                  <span className="info-field-value font-mono">
                    {selectedItem.qty} pcs
                  </span>
                </div>
                <div className="info-field-row">
                  <span className="info-field-label">Spesifikasi Unit:</span>
                  <span
                    className="info-field-value"
                    style={{ fontSize: 12, textAlign: "right" }}
                  >
                    {selectedItem.specification}
                  </span>
                </div>
                <div className="info-field-row">
                  <span className="info-field-label">Asal / Tujuan:</span>
                  <span
                    className="info-field-value"
                    style={{ fontSize: 12, textAlign: "right" }}
                  >
                    {selectedItem.destination}
                  </span>
                </div>
                <div className="info-field-row">
                  <span className="info-field-label">
                    Tanggal Masuk Sistem:
                  </span>
                  <span className="info-field-value font-mono">
                    {selectedItem.date}
                  </span>
                </div>
                <div className="info-field-row">
                  <span className="info-field-label">Penanggung Jawab:</span>
                  <span className="info-field-value">
                    {selectedItem.operator}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="detail-review-panel">
              <ShieldAlert size={36} style={{ color: "#94a3b8" }} />
              <h4 className="empty-state-title font-sora">
                Tinjau Detail Validasi
              </h4>
              <p className="empty-state-desc">
                Pilih salah satu item mutasi di daftar untuk menelisik isi
                dokumen dan mencatatkan ketetapan keputusan hukum logistik.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
