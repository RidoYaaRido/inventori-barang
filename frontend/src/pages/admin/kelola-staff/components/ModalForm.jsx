import "../utils/style.css";
import { useState } from "react";
import { X } from "lucide-react";
import { ROLES } from "../utils/data";

export default function Modal({ staff, onClose, onSave }) {
  const isEdit = !!staff;
  const [form, setForm] = useState(
    staff || {
      name: "", email: "", phone: "", division: "",
      role: "Warehouse Staff", status: "aktif", joinDate: "",
      avatar: "", avatarBg: "#dbeafe", avatarColor: "#1d4ed8",
    }
  );

  const fields = [
    ["Nama Lengkap", "name", "text"],
    ["Email", "email", "email"],
    ["Nomor HP", "phone", "text"],
    ["Divisi Kerja", "division", "text"],
    ["Tanggal Gabung", "joinDate", "date"],
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content-box">
        <h2 className="modal-title font-sora">
          {isEdit ? "Edit Data Staff" : "Tambah Anggota Staff"}
        </h2>

        <div className="modal-grid-form">
          {fields.map(([label, key, type]) => (
            <div 
              key={key} 
              className={`form-group ${key === "division" || key === "name" ? "full-width" : ""}`}
            >
              <label className="form-label">{label}</label>
              <input
                type={type}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="form-input"
              />
            </div>
          ))}

          <div className="form-group">
            <label className="form-label">Peran (Role)</label>
            <select 
              value={form.role} 
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              className="form-select"
            >
              {ROLES.map(r => <option key={r}>{r}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">Status</label>
            <select 
              value={form.status} 
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              className="form-select"
            >
              <option value="aktif">Aktif</option>
              <option value="nonaktif">Nonaktif</option>
            </select>
          </div>
        </div>

        <div className="modal-actions-group">
          <button onClick={onClose} className="btn-modal-cancel">Batal</button>
          <button 
            onClick={() => { onSave(form); onClose(); }} 
            className="btn-modal-submit"
          >
            {isEdit ? "Simpan Perubahan" : "Tambah Staff"}
          </button>
        </div>

        <button onClick={onClose} className="btn-modal-close-icon">
          <X size={20} />
        </button>
      </div>
    </div>
  );
}