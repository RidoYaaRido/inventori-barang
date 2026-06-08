import { useState } from "react";
import { CATEGORIES } from "../utils/data";
import "../utils/style.css";
import { X } from "lucide-react";

export default function Modal({ item, onClose }) {
  const isEdit = !!item;
  const [form, setForm] = useState(
    item || {
      name: "", sku: "", category: "elektronik",
      price: "", stock: "", minStock: "", status: "tersedia",
    }
  );
 
  const fields = [
    ["Nama Barang",          "name",     "text"  ],
    ["SKU",                  "sku",      "text"  ],
    ["Harga Satuan (Rp)",    "price",    "number"],
    ["Stok Saat Ini",        "stock",    "number"],
    ["Stok Minimum",         "minStock", "number"],
  ];
 
  return (
    <div className="kb-modal-overlay">
      <div className="kb-modal">
        <h2 className="kb-modal__title">
          {isEdit ? "Edit Barang" : "Tambah SKU Baru"}
        </h2>
 
        {fields.map(([label, key, type]) => (
          <div className="kb-modal__field" key={key}>
            <label className="kb-modal__label">{label}</label>
            <input
              type={type}
              className="kb-modal__input"
              value={form[key]}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </div>
        ))}
 
        <div className="kb-modal__field">
          <label className="kb-modal__label">Kategori</label>
          <select
            className="kb-modal__select"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          >
            {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>
 
        <div className="kb-modal__actions">
          <button className="kb-modal__btn-cancel" onClick={onClose}>
            Batal
          </button>
          <button className="kb-modal__btn-submit" onClick={onClose}>
            {isEdit ? "Simpan Perubahan" : "Tambah Barang"}
          </button>
        </div>
 
        <button className="kb-modal__close" onClick={onClose}>
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
