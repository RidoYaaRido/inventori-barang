import { useState } from "react";
import { X, Cpu, Sofa, PenTool, Wifi } from "lucide-react";
import "../utils/style.css";

export default function ModalTambahKategori({ onClose, onSave }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconStyle, setIconStyle] = useState("elektronik"); // default selected icon style

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !description) {
      alert("Mohon isi semua field terlebih dahulu!");
      return;
    }
    onSave({ name, description, iconStyle });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-box">
        <h2 className="modal-title font-sora">Buat Kategori Baru</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Kategori</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Alat Pelindung Diri (APD)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Deskripsi Logistik</label>
            <textarea
              className="form-textarea"
              placeholder="Jelaskan cakupan klasifikasi barang dalam kategori ini..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ marginBottom: 28 }}>
            <label className="form-label">Pilih Representasi Ikon</label>
            <div className="icon-grid-selector">
              <button
                type="button"
                className={`icon-option-btn elektronik ${iconStyle === "elektronik" ? "active" : ""}`}
                onClick={() => setIconStyle("elektronik")}
              >
                <Cpu size={18} />
              </button>
              <button
                type="button"
                className={`icon-option-btn furnitur ${iconStyle === "furnitur" ? "active" : ""}`}
                onClick={() => setIconStyle("furnitur")}
              >
                <Sofa size={18} />
              </button>
              <button
                type="button"
                className={`icon-option-btn atk ${iconStyle === "atk" ? "active" : ""}`}
                onClick={() => setIconStyle("atk")}
              >
                <PenTool size={18} />
              </button>
              <button
                type="button"
                className={`icon-option-btn jaringan ${iconStyle === "jaringan" ? "active" : ""}`}
                onClick={() => setIconStyle("jaringan")}
              >
                <Wifi size={18} />
              </button>
            </div>
          </div>

          <div className="modal-actions-group">
            <button
              type="button"
              onClick={onClose}
              className="btn-modal-cancel"
            >
              Batal
            </button>
            <button type="submit" className="btn-modal-submit">
              Simpan Kategori
            </button>
          </div>
        </form>

        <button onClick={onClose} className="btn-modal-close-icon">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
