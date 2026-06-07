import { useState } from "react";
import "./utils/style.css";
import { 
  UserPlus, 
  Search, 
  Users, 
  CheckCircle, 
  XCircle, 
  X, 
  ChevronDown, 
  Pencil, 
  Trash2, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Modal from "./components/ModalForm";
import RoleSelect from "./components/RoleSelect";
import { INITIAL_STAFF } from "./utils/data";

// ── Main Page Component ──────────────────────────────────────────────────────
export default function KelolaStaff() {
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | "add" | staff-object
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = staffList.filter(s => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.division.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
  });

  const toggleStatus = (id) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, status: s.status === "aktif" ? "nonaktif" : "aktif" } : s));
  };

  const updateRole = (id, role) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, role } : s));
  };

  const handleSave = (form) => {
    if (form.id) {
      setStaffList(prev => prev.map(s => s.id === form.id ? { ...s, ...form } : s));
    } else {
      const newId = `STAFF-${staffList.length + 1}`;
      const initials = form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
      const colors = [
        ["#dbeafe","#1d4ed8"],["#fce7f3","#be185d"],["#d1fae5","#065f46"],
        ["#fef3c7","#92400e"],["#ede9fe","#6d28d9"]
      ];
      const [bg, color] = colors[staffList.length % colors.length];
      setStaffList(prev => [...prev, { ...form, id: newId, avatar: initials, avatarBg: bg, avatarColor: color }]);
    }
  };

  const aktifCount = staffList.filter(s => s.status === "aktif").length;
  const nonaktifCount = staffList.filter(s => s.status === "nonaktif").length;

  return (
    <div className="staff-page-container">
      
      {/* ── Header ── */}
      <div className="header-section">
        <div>
          <h1 className="header-title font-sora">
            Kelola Hak Akses Staff
          </h1>
          <p className="header-subtitle">
            Organisasikan kredensial pengguna, otorisasi penugasan gudang, dan peran sistem.
          </p>
        </div>
        <button onClick={() => setModal("add")} className="btn-primary">
          <UserPlus size={18} /> Tambah Anggota Staff
        </button>
      </div>

      {/* ── Stat pills ── */}
      {/* <div className="stats-container">
        {[
          { label: "Total Staff", value: staffList.length, bg: "#e0f2fe", color: "#0369a1", icon: <Users size={18} style={{ color: "#0369a1" }} /> },
          { label: "Staff_Aktif", value: aktifCount, bg: "#d1fae5", color: "#065f46", icon: <CheckCircle size={18} style={{ color: "#065f46" }} /> },
          { label: "Nonaktif", value: nonaktifCount, bg: "#fee2e2", color: "#991b1b", icon: <XCircle size={18} style={{ color: "#991b1b" }} /> },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon-wrapper" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div>
              <div className="stat-value font-sora">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div> */}

      {/* ── Table Card ── */}
      <div className="table-card">
        {/* Search bar */}
        <div className="table-filter-bar">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              placeholder="Cari anggota staff berdasarkan nama, divisi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <span className="table-summary-text">
            Total <strong style={{ color: "#0f172a" }}>{filtered.length}</strong> staff aktif/nonaktif
          </span>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="staff-table">
            <thead>
              <tr className="table-header-row">
                {["NAMA PROFIL", "DETAIL KONTAK", "DIVISI KERJA", "PERAN (ROLE)", "STATUS ANGGOTA", "TANGGAL GABUNG", "OPSI OTORITAS"].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8", fontSize: 14 }}>
                    Tidak ada staff yang cocok dengan pencarian ini.
                  </td>
                </tr>
              ) : filtered.map((s, idx) => (
                <tr
                  key={s.id}
                  className="staff-row"
                  style={{ borderBottom: idx < filtered.length - 1 ? "1px solid #f1f5f9" : "none" }}
                >
                  {/* Nama Profil */}
                  <td className="table-td">
                    <div className="profile-cell">
                      <div className="avatar-box font-sora" style={{ background: s.avatarBg, color: s.avatarColor }}>
                        {s.avatar}
                      </div>
                      <div>
                        <div className="profile-name font-sora">{s.name}</div>
                        <div className="profile-id font-mono">ID: {s.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Detail Kontak */}
                  <td className="table-td">
                    <div className="contact-email">{s.email}</div>
                    <div className="contact-phone">{s.phone}</div>
                  </td>

                  {/* Divisi */}
                  <td className="table-td division-text">
                    {s.division}
                  </td>

                  {/* Role */}
                  <td className="table-td">
                    <RoleSelect value={s.role} onChange={role => updateRole(s.id, role)} />
                  </td>

                  {/* Status */}
                  <td className="table-td">
                    <span className={`status-badge ${s.status === "aktif" ? "aktif" : "nonaktif"}`}>
                      {s.status === "aktif" ? "AKTIF" : "NONAKTIF"}
                    </span>
                  </td>

                  {/* Tanggal Gabung */}
                  <td className="table-td font-mono" style={{ fontSize: 13, color: "#64748b" }}>
                    {s.joinDate}
                  </td>

                  {/* Opsi Otoritas */}
                  <td className="table-td">
                    <div className="action-buttons-group">
                      {/* Toggle aktif/nonaktif */}
                      <button
                        onClick={() => toggleStatus(s.id)}
                        className={`btn-toggle-status ${s.status === "aktif" ? "aktif" : "nonaktif"}`}
                      >
                        {s.status === "aktif" ? "BEKUKAN ACCT" : "AKTIFKAN ACCT"}
                      </button>

                      {/* Edit */}
                      <button
                        className="row-actions btn-edit-row"
                        onClick={() => setModal(s)}
                      >
                        <Pencil size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        className="row-actions btn-delete-row"
                        onClick={() => setDeleteConfirm(s)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="table-footer">
          <span className="footer-summary">
            Menampilkan {filtered.length} dari {staffList.length} anggota
          </span>
          <div className="pagination-group">
            <button className="pagination-btn inactive"><ChevronLeft size={16} /></button>
            <button className="pagination-btn active">1</button>
            <button className="pagination-btn inactive"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {/* ── Modal Add/Edit ── */}
      {modal && (
        <Modal
          staff={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-confirm-box">
            <div className="confirm-icon-wrapper">
              <AlertTriangle size={48} />
            </div>
            <h3 className="confirm-title font-sora">Hapus Anggota?</h3>
            <p className="confirm-desc">
              Data <strong>{deleteConfirm.name}</strong> ({deleteConfirm.id}) akan dihapus permanen dari sistem.
            </p>
            <div className="modal-actions-group">
              <button onClick={() => setDeleteConfirm(null)} className="btn-modal-cancel">Batal</button>
              <button 
                onClick={() => {
                  setStaffList(prev => prev.filter(s => s.id !== deleteConfirm.id));
                  setDeleteConfirm(null);
                }} 
                className="btn-confirm-delete"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}