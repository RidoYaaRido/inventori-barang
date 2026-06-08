// src/pages/staff/Dashboard.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MOCK_MUTATIONS = [
  {
    id: "TRX-001",
    name: "MacBook Pro M3 Max 16\"",
    type: "MASUK",
    qty: 5,
    date: "2026-06-05 14:32",
    status: "DISETUJUI",
  },
  {
    id: "TRX-003",
    name: "Meja Standing Elektrik SmartDesk",
    type: "MASUK",
    qty: 10,
    date: "2026-06-04 15:48",
    status: "PENDING",
  },
  {
    id: "TRX-006",
    name: "Kertas Sinar Dunia HVS A4 80g",
    type: "MASUK",
    qty: 50,
    date: "2026-06-02 14:00",
    status: "DISETUJUI",
  },
];

const STATUS_CONFIG = {
  DISETUJUI: {
    label: "DISETUJUI (Selesai)",
    color: "#00d4a0",
    bg: "rgba(0,212,160,0.12)",
  },
  PENDING: {
    label: "PENDING (Menunggu)",
    color: "#f5a623",
    bg: "rgba(245,166,35,0.12)",
  },
  DITOLAK: {
    label: "DITOLAK",
    color: "#e05c5c",
    bg: "rgba(224,92,92,0.12)",
  },
};

const TYPE_COLOR = {
  MASUK: "#6c63ff",
  KELUAR: "#ff6b6b",
};

export default function Dashboard({ user = { name: "Rian Hidayat", role: "Manajer Gudang Timur", avatar: null } }) {
  const navigate = useNavigate();
  const totalMutasi = 3;
  const pendingMutasi = 1;
  const approvedMutasi = 2;
  const criticalStock = 2;

  const stats = [
    {
      label: "Total Pengajuan",
      value: totalMutasi,
      unit: "mutasi",
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#a0a8c0" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      accent: "#6c63ff",
    },
    {
      label: "Menunggu Persetujuan",
      value: pendingMutasi,
      unit: "mutasi",
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#f5a623" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 7v5l3 3" />
        </svg>
      ),
      accent: "#f5a623",
    },
    {
      label: "Pengajuan Disetujui",
      value: approvedMutasi,
      unit: "mutasi",
      icon: (
        <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#00d4a0" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      accent: "#00d4a0",
    },
  ];

  return (
    <div style={styles.page}>
      {/* Welcome Banner */}
      <div style={styles.banner}>
        <div style={styles.bannerLeft}>
          <div style={styles.avatarRing}>
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" style={styles.avatar} />
            ) : (
              <div style={styles.avatarFallback}>
                {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
            )}
          </div>
          <div>
            <h1 style={styles.welcomeTitle}>Selamat Bekerja, {user.name}!</h1>
            <p style={styles.welcomeRole}>
              Role: <span style={{ color: "#6c63ff", fontWeight: 600 }}>{user.role}</span>
            </p>
          </div>
        </div>
        <div style={styles.bannerActions}>
          <button style={{ ...styles.actionBtn, background: "linear-gradient(135deg,#6c63ff,#00d4a0)" }}
            onClick={() => navigate("/staff/barang-masuk")}>
            <span style={styles.btnIcon}>+</span> Catat Barang Masuk
          </button>
          <button style={{ ...styles.actionBtn, background: "linear-gradient(135deg,#6c63ff,#b06cff)" }}
            onClick={() => navigate("/staff/barang-keluar")}>
            <span style={styles.btnIcon}>↑</span> Catat Barang Keluar
          </button>
        </div>
      </div>

      {/* Critical Stock Alert */}
      {criticalStock > 0 && (
        <div style={styles.alert}>
          <div style={styles.alertLeft}>
            <span style={styles.alertIcon}>⚠</span>
            <div>
              <p style={styles.alertTitle}>Perhatian: Ada stok barang kritis atau kosong!</p>
              <p style={styles.alertSub}>Total {criticalStock} barang berada di bawah batas minimum gudang.</p>
            </div>
          </div>
          <button style={styles.alertBtn} onClick={() => navigate("/staff/data-barang")}>
            Lihat Stok Barang
          </button>
        </div>
      )}

      {/* Main Content */}
      <div style={styles.mainGrid}>
        {/* Stats */}
        <div style={styles.statsCol}>
          <h2 style={styles.sectionTitle}>STATISTIK MUTASI SAYA</h2>
          <div style={styles.statsList}>
            {stats.map((s) => (
              <div key={s.label} style={styles.statCard}>
                <div style={styles.statInfo}>
                  <p style={styles.statLabel}>{s.label}</p>
                  <p style={{ ...styles.statValue, color: s.accent }}>
                    {s.value} <span style={styles.statUnit}>{s.unit}</span>
                  </p>
                </div>
                <div style={{ ...styles.statIcon, background: `${s.accent}18` }}>
                  {s.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mutation Status */}
        <div style={styles.mutationCol}>
          <div style={styles.mutationHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Status Mutasi Terakhir</h2>
              <p style={styles.mutationSub}>Pemantauan seketika status verifikasi barang masuk/keluar Anda oleh admin.</p>
            </div>
            <span style={styles.mutationBy}>Dibuat oleh: {user.name}</span>
          </div>
          <div style={styles.mutationList}>
            {MOCK_MUTATIONS.map((m) => {
              const sc = STATUS_CONFIG[m.status] || STATUS_CONFIG.PENDING;
              return (
                <div key={m.id} style={styles.mutationRow}>
                  <div style={{ ...styles.mutationTypeTag, background: `${TYPE_COLOR[m.type]}22`, color: TYPE_COLOR[m.type] }}>
                    {m.type === "MASUK" ? "↓" : "↑"}
                  </div>
                  <div style={styles.mutationInfo}>
                    <p style={styles.mutationName}>
                      {m.name}&nbsp;
                      <span style={{ ...styles.typeChip, background: `${TYPE_COLOR[m.type]}22`, color: TYPE_COLOR[m.type] }}>
                        {m.type}
                      </span>
                    </p>
                    <p style={styles.mutationMeta}>{m.id} • Qty: {m.qty} • {m.date}</p>
                  </div>
                  <span style={{ ...styles.statusChip, background: sc.bg, color: sc.color }}>
                    {sc.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={styles.mutationFooter}>
            <span style={styles.mutationFooterText}>Menampilkan hingga 4 pengajuan mutasi terbaru</span>
            <button style={styles.linkBtn} onClick={() => navigate("/staff/data-barang")}>
              Lihat Daftar Stok →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "32px 36px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    minHeight: "100%",
    background: "#0f1117",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#e2e6f0",
    boxSizing: "border-box",
  },
  banner: {
    background: "linear-gradient(135deg, #1a1d2e 0%, #16192b 100%)",
    border: "1px solid rgba(108,99,255,0.2)",
    borderRadius: "16px",
    padding: "28px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  bannerLeft: { display: "flex", alignItems: "center", gap: "20px" },
  avatarRing: {
    width: 64, height: 64, borderRadius: "50%",
    border: "2px solid #6c63ff",
    padding: 2,
    flexShrink: 0,
  },
  avatar: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" },
  avatarFallback: {
    width: "100%", height: "100%", borderRadius: "50%",
    background: "linear-gradient(135deg,#6c63ff,#00d4a0)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 22, fontWeight: 700, color: "#fff",
  },
  welcomeTitle: { margin: 0, fontSize: 26, fontWeight: 700, letterSpacing: "-0.3px" },
  welcomeRole: { margin: "4px 0 0", fontSize: 14, color: "#8892aa" },
  bannerActions: { display: "flex", gap: 12, flexShrink: 0 },
  actionBtn: {
    padding: "10px 20px",
    borderRadius: 10,
    border: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 8,
    letterSpacing: "0.2px",
    transition: "opacity 0.2s",
  },
  btnIcon: { fontSize: 16, fontWeight: 700 },
  alert: {
    background: "linear-gradient(90deg, rgba(180,30,30,0.18) 0%, rgba(30,14,14,0.5) 100%)",
    border: "1px solid rgba(224,92,92,0.3)",
    borderRadius: 12,
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  alertLeft: { display: "flex", alignItems: "center", gap: 14 },
  alertIcon: { fontSize: 22, color: "#e05c5c" },
  alertTitle: { margin: 0, fontWeight: 700, fontSize: 15, color: "#f5a0a0" },
  alertSub: { margin: "2px 0 0", fontSize: 13, color: "#c08080" },
  alertBtn: {
    padding: "8px 18px",
    borderRadius: 8,
    border: "none",
    background: "#c0392b",
    color: "#fff",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    flexShrink: 0,
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 20,
    alignItems: "start",
  },
  statsCol: { display: "flex", flexDirection: "column", gap: 14 },
  sectionTitle: {
    margin: "0 0 12px",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "1.4px",
    textTransform: "uppercase",
    color: "#6a7492",
  },
  statsList: { display: "flex", flexDirection: "column", gap: 12 },
  statCard: {
    background: "#1a1d2e",
    border: "1px solid rgba(108,99,255,0.12)",
    borderRadius: 12,
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statInfo: {},
  statLabel: { margin: "0 0 6px", fontSize: 13, color: "#8892aa" },
  statValue: { margin: 0, fontSize: 32, fontWeight: 800, lineHeight: 1 },
  statUnit: { fontSize: 14, fontWeight: 400, color: "#8892aa" },
  statIcon: {
    width: 44, height: 44, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  mutationCol: {
    background: "#1a1d2e",
    border: "1px solid rgba(108,99,255,0.12)",
    borderRadius: 14,
    padding: "24px 28px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  mutationHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  mutationSub: { margin: "4px 0 0", fontSize: 13, color: "#8892aa" },
  mutationBy: { fontSize: 12, color: "#555e78", flexShrink: 0 },
  mutationList: { display: "flex", flexDirection: "column", gap: 2 },
  mutationRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "12px 0",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  mutationTypeTag: {
    width: 34, height: 34, borderRadius: 8,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 700, fontSize: 16, flexShrink: 0,
  },
  mutationInfo: { flex: 1, minWidth: 0 },
  mutationName: { margin: 0, fontWeight: 600, fontSize: 14, display: "flex", alignItems: "center", gap: 6 },
  mutationMeta: { margin: "3px 0 0", fontSize: 12, color: "#6a7492" },
  typeChip: {
    fontSize: 11, fontWeight: 700,
    padding: "2px 7px", borderRadius: 5,
    letterSpacing: "0.5px",
  },
  statusChip: {
    fontSize: 11, fontWeight: 700,
    padding: "4px 10px", borderRadius: 6,
    letterSpacing: "0.3px", flexShrink: 0,
  },
  mutationFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  mutationFooterText: { fontSize: 12, color: "#555e78" },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#6c63ff",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    padding: 0,
  },
};
