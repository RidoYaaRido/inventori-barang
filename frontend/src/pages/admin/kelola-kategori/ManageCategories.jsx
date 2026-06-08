import { useState } from "react";
import "./utils/style.css";
import { 
  Plus, 
  Trash2, 
  Cpu, 
  Sofa, 
  PenTool, 
  Wifi, 
  FolderOpen 
} from "lucide-react";
import { INITIAL_CATEGORIES, ICON_MAP } from "./utils/data";
import ModalTambahKategori from "./components/ModalForm";

export default function KelolaKategori() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kategori ini?")) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  const handleSaveCategory = (newCat) => {
    const freshId = `CAT-${categories.length + 1}`;
    const preparedData = {
      id: freshId,
      name: newCat.name,
      description: newCat.description,
      skuCount: 0, // Kategori baru otomatis memiliki 0 SKU terdaftar
      iconStyle: newCat.iconStyle
    };
    setCategories(prev => [...prev, preparedData]);
  };

  return (
    <div className="kategori-page-container">
      
      {/* ── Header ── */}
      <div className="kategori-header">
        <div>
          <h1 className="kategori-title font-sora">Kelola Kategori Barang</h1>
          <p className="kategori-subtitle">
            Kelompokkan SKU barang dalam kategori logistik yang bermakna.
          </p>
        </div>
        <button className="btn-kategori-add" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Buat Kategori Baru
        </button>
      </div>

      {/* ── Grid Items Kategori ── */}
      <div className="kategori-grid">
        {categories.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
            <FolderOpen size={40} style={{ display: "block", margin: "0 auto 12px", color: "#cbd5e1" }} />
            Belum ada kategori barang terdaftar.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="kategori-card">
              
              {/* Baris Atas: Ikon & Aksi Hapus */}
              <div className="card-top-bar">
                <div className={`kategori-icon-wrapper ${cat.iconStyle}`}>
                  {ICON_MAP[cat.iconStyle] || <FolderOpen size={20} />}
                </div>
                <button 
                  className="btn-delete-card"
                  onClick={() => handleDelete(cat.id)}
                  title="Hapus Kategori"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Baris Tengah: Detail Kategori */}
              <div className="card-body">
                <h3 className="card-title font-sora">{cat.name}</h3>
                <p className="card-desc">{cat.description}</p>
              </div>

              {/* Baris Bawah: Footer Link & Jumlah SKU */}
              <div className="card-footer-bar">
                <span className="footer-link-text">Tautan Barang</span>
                <span className="sku-badge font-mono">
                  {cat.skuCount} SKUs Terdaftar
                </span>
              </div>

            </div>
          ))
        )}
      </div>

      {/* ── Render Modal Form secara Kondisional ── */}
      {isModalOpen && (
        <ModalTambahKategori 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveCategory}
        />
      )}

    </div>
  );
}