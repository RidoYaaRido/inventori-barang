import { useState } from "react";
import "./utils/style.css";
import { User, PlusCircle, RefreshCw, ShieldAlert, Trash2, ShieldCheck } from "lucide-react";
import { INITIAL_LOGS, FILTER_CATEGORIES } from "./utils/data";


export default function LogAktivitas() {
  const [logs] = useState(INITIAL_LOGS);
  const [activeFilter, setActiveFilter] = useState("Semua Log");

  // Filter logika data
  const filteredLogs = logs.filter(log => {
    if (activeFilter === "Semua Log") return true;
    return log.category === activeFilter;
  });

  // Fungsi pembantu untuk merender ikon dinamis dari Lucide
  const renderLogIcon = (type) => {
    switch (type) {
      case "create":
        return <PlusCircle size={18} />;
      case "delete":
        return <Trash2 size={18} />;
      case "update":
        return <RefreshCw size={18} />;
      case "validate":
        return <ShieldCheck size={18} />;
      case "profile":
      default:
        return <User size={18} />;
    }
  };

  return (
    <div className="log-page-container">
      
      {/* ── Header ── */}
      <div className="log-header">
        <h1 className="log-title font-sora">Log Audit & Aktivitas Jaringan</h1>
        <p className="log-subtitle">
          Rekam jejak transaksional sistem untuk pemantauan integritas data inventaris secara real-time.
        </p>
      </div>

      {/* ── Kategori Filter Audit (Sesuai Layout Gambar) ── */}
      <div className="filter-card">
        <span className="filter-label">Kategori Filter Audit:</span>
        <div className="filter-btn-group">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── List Box Log Aktivitas ── */}
      <div className="logs-card">
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
            <ShieldAlert size={32} style={{ marginBottom: 8, display: "block", margin: "0 auto" }} />
            Tidak ada log aktivitas untuk kategori ini.
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div key={log.id} className="log-item-row">
              
              {/* Ikon Box Kiri */}
              <div className={`log-icon-box ${log.iconType}`}>
                {renderLogIcon(log.iconType)}
              </div>

              {/* Konten Log Tengah */}
              <div className="log-content-area">
                <div className="log-meta-top">
                  <span className="log-actor-name font-sora">{log.actor}</span>
                  <span className="log-category-badge">{log.category}</span>
                </div>
                
                <h4 className="log-action-message">{log.action}</h4>
                
                <div className="log-target-wrapper">
                  <span className="log-target-label">Subjek target:</span>
                  <span className="log-target-badge font-mono">{log.target}</span>
                </div>
              </div>

              {/* Timestamp Kanan */}
              <div className="log-time-cell font-mono">
                {log.timestamp}
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}