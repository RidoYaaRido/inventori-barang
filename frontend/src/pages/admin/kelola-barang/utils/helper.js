// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
 
const STATUS_LABELS = {
  tersedia: "TERSEDIA",
  kritis:   "STOK KRITIS",
  habis:    "HABIS",
};

export { fmt, STATUS_LABELS }