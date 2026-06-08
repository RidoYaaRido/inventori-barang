// src/pages/staff/ItemDetail.jsx

const STATUS_MAP = {
  TERSEDIA: { label: "Aman – Tersedia Efektif", color: "#00d4a0", icon: "✓" },
  "STOK KRITIS": { label: "Kritis – Perlu Restock", color: "#f5a623", icon: "⚠" },
  HABIS: { label: "Habis – Segera Restock", color: "#e05c5c", icon: "✕" },
};

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function DetailRow({ label, value, mono }) {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={{ ...styles.detailValue, ...(mono ? { fontFamily: "monospace", fontSize: 12 } : {}) }}>
        {value}
      </span>
    </div>
  );
}

function CategoryIcon({ categoryKey }) {
  const icons = {
    elektronik: "💻",
    jaringan: "🌐",
    furnitur: "🪑",
    atk: "📄",
  };
  return (
    <div style={styles.categoryIconBox}>
      <span style={{ fontSize: 48 }}>{icons[categoryKey] || "📦"}</span>
    </div>
  );
}

export default function ItemDetail({ item, onClose }) {
  if (!item) return null;
  const sc = STATUS_MAP[item.status] || STATUS_MAP["TERSEDIA"];

  return (
    <div style={styles.panel}>
      {/* Header */}
      <div style={styles.panelHeader}>
        <span style={styles.panelTitle}>RINCIAN BARANG</span>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      {/* Image */}
      <div style={styles.imgBox}>
        {item.image ? (
          <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10 }} />
        ) : (
          <CategoryIcon categoryKey={item.categoryKey} />
        )}
      </div>

      {/* Name & SKU */}
      <div style={styles.nameBlock}>
        <h2 style={styles.itemName}>{item.name}</h2>
        <p style={styles.itemSku}>{item.id}</p>
      </div>

      {/* Details */}
      <div style={styles.detailsBlock}>
        <DetailRow label="Penyedia (Supplier)" value={item.supplier || "—"} />
        <DetailRow label="Harga Terdaftar" value={formatRupiah(item.price)} />
        <DetailRow label="Terakhir Update" value={item.lastUpdate || "—"} />
        <DetailRow label="Keamanan Minimum" value={`${item.minStock} unit`} />
      </div>

      {/* Notes */}
      {item.notes && (
        <div style={styles.notesBlock}>
          <p style={styles.notesLabel}>Catatan Keterangan:</p>
          <p style={styles.notesText}>{item.notes}</p>
        </div>
      )}

      {/* Stock Status */}
      <div style={styles.statusBlock}>
        <span style={{ ...styles.statusIndicator, background: `${sc.color}22`, color: sc.color }}>
          {sc.icon}
        </span>
        <div>
          <p style={styles.statusTitle}>Tingkat Aman</p>
          <p style={{ ...styles.statusLabel, color: sc.color }}>{sc.label}</p>
        </div>
      </div>

      {/* Stock Visual */}
      <div style={styles.stockVisual}>
        <div style={styles.stockBarBg}>
          <div
            style={{
              ...styles.stockBarFill,
              width: `${Math.min(100, (item.stock / Math.max(item.minStock * 4, 1)) * 100)}%`,
              background: sc.color,
            }}
          />
        </div>
        <div style={styles.stockNumbers}>
          <span style={{ color: sc.color, fontWeight: 700 }}>{item.stock} units tersedia</span>
          <span style={{ color: "#555e78", fontSize: 12 }}>min. {item.minStock}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button style={styles.editBtn}>✏ Edit Barang</button>
        <button style={styles.deleteBtn}>🗑</button>
      </div>
    </div>
  );
}

const styles = {
  panel: {
    width: 280,
    flexShrink: 0,
    background: "#1a1d2e",
    border: "1px solid rgba(108,99,255,0.15)",
    borderRadius: 16,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#e2e6f0",
    alignSelf: "flex-start",
    position: "sticky",
    top: 24,
    maxHeight: "calc(100vh - 80px)",
    overflowY: "auto",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  panelTitle: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "1.4px",
    color: "#6a7492",
    textTransform: "uppercase",
  },
  closeBtn: {
    background: "rgba(255,255,255,0.06)",
    border: "none",
    borderRadius: 6,
    width: 26, height: 26,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
    color: "#8892aa",
    fontSize: 13,
    fontWeight: 700,
  },
  imgBox: {
    width: "100%",
    height: 160,
    background: "rgba(108,99,255,0.08)",
    borderRadius: 10,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryIconBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  nameBlock: {},
  itemName: { margin: 0, fontSize: 17, fontWeight: 800, lineHeight: 1.3, letterSpacing: "-0.2px" },
  itemSku: { margin: "5px 0 0", fontSize: 12, color: "#555e78", fontFamily: "monospace" },
  detailsBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "rgba(255,255,255,0.02)",
    borderRadius: 10,
    padding: "14px",
    border: "1px solid rgba(255,255,255,0.04)",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  detailLabel: { fontSize: 12, color: "#6a7492", flexShrink: 0 },
  detailValue: { fontSize: 13, fontWeight: 600, textAlign: "right", color: "#c8d0e0" },
  notesBlock: {
    background: "rgba(108,99,255,0.06)",
    border: "1px solid rgba(108,99,255,0.12)",
    borderRadius: 10,
    padding: "12px 14px",
  },
  notesLabel: { margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: "#6a7492", textTransform: "uppercase", letterSpacing: "0.8px" },
  notesText: { margin: 0, fontSize: 13, color: "#b0bacf", lineHeight: 1.6 },
  statusBlock: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  statusIndicator: {
    width: 34, height: 34,
    borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 16, flexShrink: 0,
  },
  statusTitle: { margin: 0, fontSize: 12, color: "#6a7492", fontWeight: 600 },
  statusLabel: { margin: "2px 0 0", fontSize: 13, fontWeight: 700 },
  stockVisual: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  stockBarBg: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 4, height: 6,
    overflow: "hidden",
  },
  stockBarFill: {
    height: "100%",
    borderRadius: 4,
    transition: "width 0.6s ease",
  },
  stockNumbers: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
  },
  actions: {
    display: "flex",
    gap: 8,
    marginTop: 4,
  },
  editBtn: {
    flex: 1,
    padding: "9px 0",
    borderRadius: 8,
    border: "none",
    background: "linear-gradient(135deg,#6c63ff,#00d4a0)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "9px 12px",
    borderRadius: 8,
    border: "1px solid rgba(224,92,92,0.3)",
    background: "rgba(224,92,92,0.08)",
    color: "#e05c5c",
    fontSize: 15,
    cursor: "pointer",
  },
};
