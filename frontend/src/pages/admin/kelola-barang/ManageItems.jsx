import { useState } from "react";
import { CATEGORIES, ITEMS } from "./utils/data";
import ItemCard from "./components/ItemCard";
import Modal from "./components/Modal";
import "./utils/style.css";
import {
  Search,
  Plus,
  PackageOpen,
  Layers,
  Wifi,
  Monitor,
  Armchair,
  FileText,
  Tag,
  X,
} from "lucide-react";


export default function KelolaBarang() {
  const [items, setItems]           = useState(ITEMS);
  const [activeCat, setActiveCat]   = useState("all");
  const [activeFilter, setFilter]   = useState("semua");
  const [sortBy, setSortBy]         = useState("nama-az");
  const [search, setSearch]         = useState("");
  const [modal, setModal]           = useState(null); // null | "add" | item
 
  const handleDelete = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
 
  const filtered = items
    .filter((i) => activeCat === "all" || i.category === activeCat)
    .filter((i) => activeFilter === "semua" || i.status === activeFilter)
    .filter((i) => {
      const q = search.toLowerCase();
      return (
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "nama-az")    return a.name.localeCompare(b.name);
      if (sortBy === "nama-za")    return b.name.localeCompare(a.name);
      if (sortBy === "harga-asc")  return a.price - b.price;
      if (sortBy === "harga-desc") return b.price - a.price;
      if (sortBy === "stok-asc")   return a.stock - b.stock;
      return 0;
    });
 
  const STATUS_FILTERS = [
    { key: "semua",    label: "Semua"    },
    { key: "tersedia", label: "Tersedia" },
    { key: "kritis",   label: "Kritis"   },
    { key: "habis",    label: "Habis"    },
  ];
 
  return (
    <div className="kb-page">
 
      {/* ── Header ── */}
      <div className="kb-header">
        <div>
          <h1 className="kb-header__title">Kelola Barang &amp; Inventaris</h1>
          <p className="kb-header__sub">
            Tambahkan, ubah rincian, atau hapus SKU barang di dalam inventaris.
          </p>
        </div>
        <button className="kb-btn-primary" onClick={() => setModal("add")}>
          <Plus size={16} />
          Tambah SKU Baru
        </button>
      </div>
 
      {/* ── Filter Panel ── */}
      <div className="kb-filter-panel">
 
        {/* Row 1: search + status + sort */}
        <div className="kb-filter-row">
 
          {/* Search */}
          <div className="kb-search-wrap">
            <span className="kb-search-icon">
              <Search size={15} />
            </span>
            <input
              className="kb-search-input"
              placeholder="Cari berdasarkan nama, SKU, supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
 
          {/* Status filters */}
          <div className="kb-status-filters">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                className={`kb-filter-btn${activeFilter === f.key ? " kb-filter-btn--active" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
 
          {/* Sort */}
          <div className="kb-sort-wrap">
            <span className="kb-sort-label">Urut:</span>
            <select
              className="kb-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="nama-az">Nama A–Z</option>
              <option value="nama-za">Nama Z–A</option>
              <option value="harga-asc">Harga Terendah</option>
              <option value="harga-desc">Harga Tertinggi</option>
              <option value="stok-asc">Stok Terendah</option>
            </select>
          </div>
        </div>
 
        {/* Row 2: category pills */}
        <div className="kb-cat-pills">
          {CATEGORIES.map(({ id, label, count, Icon }) => (
            <button
              key={id}
              className={`kb-cat-pill${activeCat === id ? " kb-cat-pill--active" : ""}`}
              onClick={() => setActiveCat(id)}
            >
              <Icon size={13} />
              {label} ({count})
            </button>
          ))}
        </div>
      </div>
 
      {/* ── Result count ── */}
      <p className="kb-result-count">
        Menampilkan <strong>{filtered.length}</strong> dari {items.length} barang
      </p>
 
      {/* ── Grid / Empty ── */}
      {filtered.length === 0 ? (
        <div className="kb-empty">
          <PackageOpen size={52} className="kb-empty__icon" />
          Tidak ada barang yang cocok dengan filter ini.
        </div>
      ) : (
        <div className="kb-grid">
          {filtered.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={setModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
 
      {/* ── Modal ── */}
      {modal && (
        <Modal
          item={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}