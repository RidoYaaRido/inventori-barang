// ── Dummy Data Sesuai Gambar image_4a364f.png ───────────────────────────────
const INITIAL_LOGS = [
  {
    id: "LOG-01",
    actor: "Rian Hidayat (Admin)",
    action: "Ubah Profil",
    target: "Memperbarui detail profil pribadi",
    category: "PROFILE",
    iconType: "profile",
    timestamp: "2026-06-07 12:22"
  },
  {
    id: "LOG-02",
    actor: "Budi Santoso",
    action: "Ubah Profil",
    target: "Memperbarui detail profil pribadi",
    category: "PROFILE",
    iconType: "profile",
    timestamp: "2026-06-07 12:22"
  },
  {
    id: "LOG-03",
    actor: "Rian Hidayat (Admin)",
    action: "Ubah Profil",
    target: "Memperbarui detail profil pribadi",
    category: "PROFILE",
    iconType: "profile",
    timestamp: "2026-06-07 12:22"
  },
  {
    id: "LOG-04",
    actor: "Budi Santoso",
    action: "Tambah Barang Baru",
    target: "Menambahkan aset Router Cisco v4",
    category: "CREATE",
    iconType: "create",
    timestamp: "2026-06-07 11:45"
  },
  {
    id: "LOG-05",
    actor: "Siti Rahma",
    action: "Hapus Logistik Sisa",
    target: "Menghapus manifes kadaluarsa",
    category: "DELETE",
    iconType: "delete",
    timestamp: "2026-06-07 09:15"
  }
];

const FILTER_CATEGORIES = ["Semua Log", "CREATE", "UPDATE", "VALIDATE", "DELETE", "PROFILE"];

export { INITIAL_LOGS, FILTER_CATEGORIES };