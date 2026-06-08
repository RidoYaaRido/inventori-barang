// src/pages/staff/ItemList.jsx
import { useState, useMemo } from "react";
import ItemDetail from "./ItemDetail";

const MOCK_ITEMS = [
  {
    id: "SKU-NW-CIS24",
    name: "Cisco Catalyst Switch 24-Port",
    category: "Perangkat Jaringan",
    categoryKey: "jaringan",
    price: 12500000,
    stock: 8,
    minStock: 3,
    status: "TERSEDIA",
    supplier: "PT Global Network Solus...",
    lastUpdate: "2026-06-04 09:45",
    notes: "Gigabit network switch dengan manajemen cerdas, PoE+ support, dan tingkat security enterprise.",
    image: null,
  },
  {
    id: "SKU-OF-HVS80",
    name: "Kertas Sinar Dunia HVS A4 80g",
    category: "Alat Tulis Kantor (ATK)",
    categoryKey: "atk",
    price: 55000,
    stock: 120,
    minStock: 20,
    status: "TERSEDIA",
    supplier: "CV Mitra Kertas",
    lastUpdate: "2026-06-03 11:00",
    notes: "Kertas HVS berkualitas tinggi untuk keperluan cetak dan fotokopi.",
    image: null,
  },
  {
    id: "SKU-FN-AEROX",
    name: "Kursi Kantor Ergonomis Aero-X",
    category: "Furnitur & Meja Kerja",
    categoryKey: "furnitur",
    price: 3850000,
    stock: 3,
    minStock: 5,
    status: "STOK KRITIS",
    supplier: "PT Furniture Prima",
    lastUpdate: "2026-05-30 08:20",
    notes: "Kursi ergonomis dengan lumbar support adjustable dan material mesh premium.",
    image: null,
  },
  {
    id: "SKU-EL-MXM53",
    name: "Logitech MX Master 3S Mouse",
    category: "Elektronik & Gadget",
    categoryKey: "elektronik",
    price: 1699000,
    stock: 25,
    minStock: 8,
    status: "TERSEDIA",
    supplier: "PT Logitech Indonesia",
    lastUpdate: "2026-06-01 14:30",
    notes: "Mouse nirkabel premium dengan sensor 8K DPI dan scroll MagSpeed.",
    image: null,
  },
  {
    id: "SKU-EL-MX316",
    name: "MacBook Pro M3 Max 16\"",
    category: "Elektronik & Gadget",
    categoryKey: "elektronik",
    price: 45999000,
    stock: 12,
    minStock: 4,
    status: "TERSEDIA",
    supplier: "Apple Authorized Reseller",
    lastUpdate: "2026-06-05 14:32",
    notes: "Laptop flagship Apple dengan chip M3 Max, layar Liquid Retina XDR 16 inci.",
    image: null,
  },
  {
    id: "SKU-FN-SDESK",
    name: "Meja Standing Elektrik SmartDesk",
    category: "Furnitur & Meja Kerja",
    categoryKey: "furnitur",
    price: 5200000,
    stock: 0,
    minStock: 2,
    status: "HABIS",
    supplier: "PT Autonomous ID",
    lastUpdate: "2026-06-04 15:48",
    notes: "Meja berdiri elektrik height-adjustable dengan memory preset dan anti-collision.",
    image: null,
  },
];

const CATEGORIES = [
  { key: "all", label: "Semua Kategori", count: 6 },
  { key: "elektronik", label: "Elektronik & Gadget", count: 2 },
  { key: "furnitur", label: "Furnitur & Meja Kerja", count: 2 },
  { key: "atk", label: "Alat Tulis Kantor (ATK)", count: 1 },
  { key: "jaringan", label: "Perangkat Jaringan", count: 1 },
];

const STATUS_CONFIG = {
  TERSEDIA: { label: "TERSEDIA", color: "#00d4a0", bg: "rgba(0,212,160,0.12)" },
  "STOK KRITIS": { label: "STOK KRITIS", color: "#f5a623", bg: "rgba(245,166,35,0.14)" },
  HABIS: { label: "HABIS", color: "#e05c5c", bg: "rgba(224,92,92,0.12)" },
};

const SORT_OPTIONS = [
  { value: "name-asc", label: "Nama A-Z" },
  { value: "name-desc", label: "Nama Z-A" },
  { value: "stock-asc", label: "Stok Terendah" },
  { value: "stock-desc", label: "Stok Tertinggi" },
  { value: "price-asc", label: "Harga Terendah" },
  { value: "price-desc", label: "Harga Tertinggi" },
];

const FILTER_STATUS = ["Semua", "Tersedia", "Kritis", "Habis"];

function formatRupiah(n) {
  return "Rp " + n.toLocaleString("id-ID");
}

function StockBar({ stock, minStock, status }) {
  const pct = minStock === 0 ? 100 : Math.min(100, (stock / (minStock * 4)) * 100);
  const color =
    status === "HABIS" ? "#e05c5c"
    : status === "STOK KRITIS" ? "#f5a623"
    : "#00d4a0";
  return (
    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 4, height: 4, overflow: "hidden", marginTop: 8 }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4, transition: "width 0.5s" }} />
    </div>
  );
}

function ItemCard({ item, onClick, selected }) {
  const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG.TERSEDIA;
  return (
    <div
      onClick={() => onClick(item)}
      style={{
        ...styles.card,
        border: selected
          ? "1.5px solid #6c63ff"
          : "1px solid rgba(255,255,255,0.06)",
        cursor: "pointer",
        transition: "border 0.2s, box-shadow 0.2s",
        boxShadow: selected ? "0 0 0 3px rgba(108,99,255,0.18)" : "none",
      }}
    >
      <div style={styles.cardTop}>
        <span style={{ ...styles.statusChip, background: sc.bg, color: sc.color }}>
          {sc.label}
        </span>
        <div style={styles.cardActions}>
          <button style={styles.iconBtn} title="Edit" onClick={(e) => e.stopPropagation()}>
            <EditIcon />
          </button>
          <button style={styles.iconBtn} title="Hapus" onClick={(e) => e.stopPropagation()}>
            <TrashIcon />
          </button>
        </div>
      </div>
      <div style={styles.cardBody}>
        <div style={styles.itemImgBox}>
          {item.image ? (
            <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
          ) : (
            <ItemPlaceholder category={item.categoryKey} />
          )}
        </div>
        <div style={styles.itemMeta}>
          <p style={styles.itemName}>{item.name}</p>
          <p style={styles.itemCategory}>
            <span style={styles.categoryDot} /> {item.category}
          </p>
          <p style={styles.itemSku}>{item.id}</p>
        </div>
      </div>
      <div style={styles.cardFooter}>
        <div style={styles.priceRow}>
          <span style={styles.priceLabel}>Harga Satuan</span>
          <span style={styles.priceValue}>{formatRupiah(item.price)}</span>
        </div>
        <div style={styles.stockRow}>
          <span style={styles.stockInfo}>
            Stok: <strong style={{ color: sc.color }}>{item.stock} units</strong>
          </span>
          <span style={styles.minInfo}>Min: {item.minStock}</span>
        </div>
        <StockBar stock={item.stock} minStock={item.minStock} status={item.status} />
      </div>
    </div>
  );
}

function ItemPlaceholder({ category }) {
  const icons = {
    elektronik: "💻",
    jaringan: "🌐",
    furnitur: "🪑",
    atk: "📄",
  };
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, background: "rgba(108,99,255,0.08)", borderRadius: 8 }}>
      {icons[category] || "📦"}
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

export default function ItemList() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [sort, setSort] = useState("name-asc");
  const [selectedItem, setSelectedItem] = useState(null);

  const filtered = useMemo(() => {
    let items = [...MOCK_ITEMS];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((i) =>
        i.name.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q) ||
        i.supplier?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "all") {
      items = items.filter((i) => i.categoryKey === selectedCategory);
    }
    if (filterStatus !== "Semua") {
      const map = { Tersedia: "TERSEDIA", Kritis: "STOK KRITIS", Habis: "HABIS" };
      items = items.filter((i) => i.status === map[filterStatus]);
    }
    items.sort((a, b) => {
      switch (sort) {
        case "name-asc": return a.name.localeCompare(b.name, "id");
        case "name-desc": return b.name.localeCompare(a.name, "id");
        case "stock-asc": return a.stock - b.stock;
        case "stock-desc": return b.stock - a.stock;
        case "price-asc": return a.price - b.price;
        case "price-desc": return b.price - a.price;
        default: return 0;
      }
    });
    return items;
  }, [search, selectedCategory, filterStatus, sort]);

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Kelola Barang &amp; Inventaris</h1>
          <p style={styles.pageSubtitle}>Tambahkan, ubah rincian, atau hapus SKU barang di dalam inventaris.</p>
        </div>
        <button style={styles.addBtn}>+ Tambah SKU Baru</button>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.searchWrap}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            style={styles.searchInput}
            placeholder="Cari berdasarkan nama, SKU, supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={styles.filterGroup}>
          {FILTER_STATUS.map((f) => (
            <button
              key={f}
              style={{ ...styles.filterBtn, ...(filterStatus === f ? styles.filterBtnActive : {}) }}
              onClick={() => setFilterStatus(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={styles.sortWrap}>
          <span style={{ fontSize: 12, color: "#6a7492", whiteSpace: "nowrap" }}>Urut:</span>
          <select
            style={styles.sortSelect}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={styles.categoryTabs}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            style={{
              ...styles.catTab,
              ...(selectedCategory === c.key ? styles.catTabActive : {}),
            }}
            onClick={() => setSelectedCategory(c.key)}
          >
            {c.label} ({c.count})
          </button>
        ))}
      </div>

      {/* Grid + Detail */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Item Grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <div style={styles.empty}>
              <span style={{ fontSize: 40 }}>📭</span>
              <p>Tidak ada barang yang cocok.</p>
            </div>
          ) : (
            <div style={{ ...styles.grid, gridTemplateColumns: selectedItem ? "repeat(3, 1fr)" : "repeat(3, 1fr)" }}>
              {filtered.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  onClick={setSelectedItem}
                  selected={selectedItem?.id === item.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedItem && (
          <ItemDetail item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "32px 36px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    background: "#0f1117",
    minHeight: "100%",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#e2e6f0",
    boxSizing: "border-box",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
  },
  pageTitle: { margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: "-0.4px" },
  pageSubtitle: { margin: "4px 0 0", fontSize: 14, color: "#8892aa" },
  addBtn: {
    padding: "11px 22px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(135deg,#6c63ff,#00d4a0)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 14,
    cursor: "pointer",
    letterSpacing: "0.2px",
    flexShrink: 0,
  },
  toolbar: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchWrap: {
    flex: 1,
    minWidth: 200,
    background: "#1a1d2e",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0 14px",
    height: 42,
  },
  searchIcon: { fontSize: 15, opacity: 0.5 },
  searchInput: {
    background: "none",
    border: "none",
    outline: "none",
    color: "#e2e6f0",
    fontSize: 14,
    width: "100%",
    fontFamily: "inherit",
  },
  filterGroup: { display: "flex", gap: 6 },
  filterBtn: {
    padding: "7px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "#1a1d2e",
    color: "#8892aa",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  filterBtnActive: {
    background: "rgba(108,99,255,0.15)",
    borderColor: "#6c63ff",
    color: "#a99eff",
  },
  sortWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#1a1d2e",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8,
    padding: "0 12px",
    height: 42,
  },
  sortSelect: {
    background: "none",
    border: "none",
    outline: "none",
    color: "#e2e6f0",
    fontSize: 13,
    fontFamily: "inherit",
    cursor: "pointer",
  },
  categoryTabs: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  catTab: {
    padding: "7px 14px",
    borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.07)",
    background: "#1a1d2e",
    color: "#8892aa",
    fontWeight: 600,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.15s",
  },
  catTabActive: {
    background: "rgba(108,99,255,0.2)",
    borderColor: "rgba(108,99,255,0.5)",
    color: "#c0b8ff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 16,
  },
  card: {
    background: "#1a1d2e",
    borderRadius: 14,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusChip: {
    fontSize: 11,
    fontWeight: 800,
    padding: "3px 9px",
    borderRadius: 6,
    letterSpacing: "0.6px",
  },
  cardActions: { display: "flex", gap: 4 },
  iconBtn: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 6,
    width: 28, height: 28,
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
    color: "#6a7492",
    transition: "background 0.15s, color 0.15s",
  },
  cardBody: { display: "flex", gap: 12, alignItems: "flex-start" },
  itemImgBox: {
    width: 56, height: 56,
    borderRadius: 8,
    flexShrink: 0,
    overflow: "hidden",
    background: "rgba(108,99,255,0.08)",
  },
  itemMeta: { flex: 1, minWidth: 0 },
  itemName: { margin: 0, fontWeight: 700, fontSize: 14, lineHeight: 1.3, wordBreak: "break-word" },
  itemCategory: {
    margin: "5px 0 2px",
    fontSize: 12,
    color: "#6c63ff",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  categoryDot: {
    width: 6, height: 6,
    borderRadius: "50%",
    background: "#6c63ff",
    flexShrink: 0,
    display: "inline-block",
  },
  itemSku: { margin: 0, fontSize: 11, color: "#555e78", fontFamily: "monospace" },
  cardFooter: {},
  priceRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  priceLabel: { fontSize: 12, color: "#6a7492" },
  priceValue: { fontSize: 14, fontWeight: 700, color: "#e2e6f0" },
  stockRow: { display: "flex", justifyContent: "space-between" },
  stockInfo: { fontSize: 12, color: "#8892aa" },
  minInfo: { fontSize: 12, color: "#555e78" },
  empty: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#555e78",
    fontSize: 16,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
};
