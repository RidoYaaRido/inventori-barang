import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, PieChart, Pie, Cell,
} from 'recharts'
import { adminApi } from '../../../api/adminApi'
import { asArray, formatDate, getApiData, getApiMessage, getItemName, getUserName } from '../../../api/response'

// ─── Warna palet ───────────────────────────────────────────────
const TEAL   = '#0d9488'
const BLUE   = '#0891b2'
const ORANGE = '#f59e0b'
const RED    = '#ef4444'
const GREEN  = '#22c55e'
const PURPLE = '#8b5cf6'

// ─── Stat Card ─────────────────────────────────────────────────
function StatCard({ label, value, icon, color = TEAL, sub }) {
  return (
    <article style={{
      background: '#fff',
      border: '1.5px solid #f1f5f9',
      borderRadius: 20,
      padding: '20px 22px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      boxShadow: '0 4px 14px rgba(15,23,42,0.05)',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: color + '20',
        display: 'grid', placeItems: 'center',
        fontSize: 22, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {label}
        </p>
        <strong style={{ display: 'block', fontSize: 28, fontWeight: 900, color: '#0f172a', lineHeight: 1.1, marginTop: 4 }}>
          {(value ?? 0).toLocaleString('id-ID')}
        </strong>
        {sub && <span style={{ fontSize: 11, color: '#64748b', marginTop: 2, display: 'block' }}>{sub}</span>}
      </div>
    </article>
  )
}

// ─── Chart Card wrapper ────────────────────────────────────────
function ChartCard({ title, subtitle, children, style }) {
  return (
    <div style={{
      background: '#fff',
      border: '1.5px solid #f1f5f9',
      borderRadius: 20,
      padding: '22px 24px',
      boxShadow: '0 4px 14px rgba(15,23,42,0.05)',
      ...style,
    }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{title}</h3>
        {subtitle && <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

// ─── Tooltip kustom ───────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0',
      borderRadius: 10, padding: '10px 14px',
      boxShadow: '0 8px 24px rgba(15,23,42,0.12)', fontSize: 12,
    }}>
      <p style={{ margin: '0 0 6px', fontWeight: 700, color: '#0f172a' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ margin: '2px 0', color: p.color, fontWeight: 600 }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

// ─── Tabel mini transaksi ─────────────────────────────────────
function TransactionTable({ rows, type }) {
  const color = type === 'in' ? TEAL : PURPLE
  const badge = type === 'in' ? { bg: '#e0f2fe', text: '#0369a1', label: 'MASUK' } : { bg: '#f3e8ff', text: '#6b21a8', label: 'KELUAR' }

  if (rows.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
        <div style={{ fontSize: 32 }}>{type === 'in' ? '📥' : '📤'}</div>
        <p style={{ margin: '8px 0 0', fontSize: 13 }}>Data belum tersedia</p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            {['Barang', 'Qty', 'Operator', 'Tanggal'].map((h) => (
              <th key={h} style={{
                padding: '8px 12px', textAlign: 'left',
                fontWeight: 700, fontSize: 10, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                borderBottom: '1.5px solid #f1f5f9', background: '#f8fafc',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 8).map((row) => (
            <tr key={row.id} style={{ transition: 'background 0.1s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = ''}
            >
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>{getItemName(row)}</div>
                {row.item?.sku && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>SKU: {row.item.sku}</div>}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontWeight: 800, color }}>
                {row.quantity ?? '-'}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', color: '#475569' }}>
                {getUserName(row)}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', color: '#94a3b8', fontSize: 11 }}>
                {formatDate(row.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ─── Low Stock Table ──────────────────────────────────────────
function LowStockTable({ rows }) {
  if (rows.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
        <div style={{ fontSize: 32 }}>✅</div>
        <p style={{ margin: '8px 0 0', fontSize: 13 }}>Semua stok dalam kondisi aman</p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr>
            {['Nama Barang', 'Kategori', 'Stok', 'Status'].map((h) => (
              <th key={h} style={{
                padding: '8px 12px', textAlign: 'left',
                fontWeight: 700, fontSize: 10, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.05em',
                borderBottom: '1.5px solid #f1f5f9', background: '#f8fafc',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = ''}
            >
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, color: '#0f172a' }}>
                {item.name}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9', color: '#64748b' }}>
                {item.category?.name ?? '-'}
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>
                <strong style={{ color: item.stock_quantity === 0 ? RED : ORANGE }}>
                  {item.stock_quantity}
                </strong>
              </td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 6,
                  background: item.stock_quantity === 0 ? '#fee2e2' : '#fef3c7',
                  color: item.stock_quantity === 0 ? '#991b1b' : '#92400e',
                }}>
                  {item.stock_quantity === 0 ? 'HABIS' : 'KRITIS'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SecurityTable({ title, rows, type }) {
  return (
    <ChartCard title={title}>
      {rows.length === 0 ? (
        <p style={{ margin: 0, color: '#94a3b8', fontSize: 13 }}>Data belum tersedia</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <tbody>
              {rows.slice(0, 6).map((row) => (
                <tr key={`${type}-${row.id ?? row.ip_address}`}>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #f1f5f9', color: '#0f172a', fontWeight: 700 }}>
                    {type === 'ip' ? row.ip_address : getUserName(row)}
                    <div style={{ color: '#94a3b8', fontSize: 10, marginTop: 2 }}>
                      {type === 'ip'
                        ? `${row.failed_login_count} failed login`
                        : type === 'login'
                          ? [row.ip_address, row.city, row.country].filter(Boolean).join(' - ') || 'login'
                          : row.action}
                    </div>
                  </td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #f1f5f9', color: '#64748b', textAlign: 'right' }}>
                    {formatDate(row.last_attempt_at ?? row.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ChartCard>
  )
}

// ─── Proses data untuk chart ───────────────────────────────────
function buildBarData(stockIns, stockOuts) {
  // Kelompokkan per tanggal (7 hari terakhir)
  const days = {}
  const now = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    days[key] = { tanggal: key, Masuk: 0, Keluar: 0 }
  }

  stockIns.forEach((row) => {
    const key = new Date(row.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    if (days[key]) days[key].Masuk += Number(row.quantity) || 0
  })
  stockOuts.forEach((row) => {
    const key = new Date(row.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    if (days[key]) days[key].Keluar += Number(row.quantity) || 0
  })

  return Object.values(days)
}

function buildTopItems(stockIns, stockOuts) {
  // Top 5 barang paling aktif
  const map = {}
  stockIns.forEach((row) => {
    const name = getItemName(row)
    map[name] = (map[name] ?? 0) + (Number(row.quantity) || 0)
  })
  stockOuts.forEach((row) => {
    const name = getItemName(row)
    map[name] = (map[name] ?? 0) + (Number(row.quantity) || 0)
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name: name.length > 14 ? name.slice(0, 14) + '…' : name, value }))
}

const PIE_COLORS = [TEAL, BLUE, GREEN, ORANGE, RED, PURPLE]

// ─── Main Component ───────────────────────────────────────────
function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [security, setSecurity] = useState(null)
  const [recentLogins, setRecentLogins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true)
      setError('')
      try {
        const [dashboardResponse, securityResponse, recentLoginsResponse] = await Promise.all([
          adminApi.dashboard(),
          adminApi.securitySummary(),
          adminApi.recentLogins({ limit: 10 }),
        ])
        setDashboard(getApiData(dashboardResponse, {}))
        setSecurity(getApiData(securityResponse, {}))
        setRecentLogins(asArray(getApiData(recentLoginsResponse, [])))
      } catch (err) {
        setError(getApiMessage(err, 'Gagal memuat dashboard admin.'))
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  const lowStockItems  = asArray(dashboard?.low_stock_items)
  const recentStockIn  = asArray(dashboard?.recent_stock_ins)
  const recentStockOut = asArray(dashboard?.recent_stock_outs)
  const latestActivity = asArray(security?.latest_activity)
  const suspiciousIps = asArray(security?.suspicious_ips)
  const barData        = buildBarData(recentStockIn, recentStockOut)
  const pieData        = buildTopItems(recentStockIn, recentStockOut)

  const stats = [
    { label: 'Total Barang',   value: dashboard?.total_items,      icon: '📦', color: TEAL   },
    { label: 'Total Kategori', value: dashboard?.total_categories,  icon: '🗂️', color: BLUE   },
    { label: 'Total Staff',    value: dashboard?.total_staff,       icon: '👥', color: GREEN  },
    { label: 'Stock In',       value: dashboard?.total_stock_ins,   icon: '⬇️', color: TEAL   },
    { label: 'Stock Out',      value: dashboard?.total_stock_outs,  icon: '⬆️', color: PURPLE },
    { label: 'Stok Kritis',    value: lowStockItems.length,         icon: '⚠️', color: RED    },
  ]

  const securityStats = [
    { label: 'Login Hari Ini', value: security?.total_login_today, icon: '🔐', color: BLUE },
    { label: 'Failed Login', value: security?.total_failed_login, icon: '⛔', color: RED },
    { label: 'Aktivitas Hari Ini', value: security?.total_activity_today, icon: '📋', color: TEAL },
    { label: 'IP Unik', value: security?.unique_ips_today, icon: '🌐', color: ORANGE },
  ]

  return (
    <section className="dashboard-page">
      <div className="dashboard-heading">
        <h2>Dashboard Admin</h2>
        <p>Ringkasan sistem inventaris secara real-time.</p>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <span className="ms-3 text-muted">Memuat dashboard...</span>
        </div>
      ) : (
        <>
          {/* ── Stat Cards ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: 18,
            marginBottom: 28,
          }}>
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          {/* ── Baris 1: Bar chart (mutasi 7 hari) + Pie chart (top barang) ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, marginBottom: 20 }}>
            <ChartCard
              title="Mutasi Stok 7 Hari Terakhir"
              subtitle="Jumlah unit barang masuk & keluar per hari"
            >
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="tanggal" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar dataKey="Masuk"  fill={TEAL}   radius={[6, 6, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="Keluar" fill={PURPLE}  radius={[6, 6, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard
              title="Distribusi Barang Aktif"
              subtitle="Top barang berdasarkan volume transaksi"
            >
              {pieData.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 240, color: '#94a3b8' }}>
                  <span style={{ fontSize: 36 }}>📊</span>
                  <p style={{ marginTop: 10, fontSize: 13 }}>Belum ada data transaksi</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={60} outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>

          {/* ── Baris 2: Line chart stok kumulatif ── */}
          <div style={{ marginBottom: 20 }}>
            <ChartCard
              title="Tren Volume Transaksi"
              subtitle="Perbandingan kumulatif barang masuk vs keluar (10 transaksi terakhir)"
            >
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="tanggal" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="Masuk"  stroke={TEAL}   strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Keluar" stroke={PURPLE} strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* ── Baris 3: Low Stock + Recent In + Recent Out ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <ChartCard
              title="⚠️ Stok Kritis"
              subtitle={`${lowStockItems.length} barang perlu perhatian`}
            >
              <LowStockTable rows={lowStockItems} />
            </ChartCard>

            <ChartCard
              title="📥 Barang Masuk Terbaru"
              subtitle="10 transaksi stock in terakhir"
            >
              <TransactionTable rows={recentStockIn} type="in" />
            </ChartCard>

            <ChartCard
              title="📤 Barang Keluar Terbaru"
              subtitle="10 transaksi stock out terakhir"
            >
              <TransactionTable rows={recentStockOut} type="out" />
            </ChartCard>
          </div>

          <div style={{ marginTop: 28, marginBottom: 18 }}>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Security Monitoring</h3>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>Ringkasan akses, IP, dan aktivitas terbaru.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: 18,
            marginBottom: 20,
          }}>
            {securityStats.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            <SecurityTable title="Aktivitas Terbaru" rows={latestActivity} type="activity" />
            <SecurityTable title="Recent Logins" rows={recentLogins} type="login" />
            <SecurityTable title="Suspicious IPs" rows={suspiciousIps} type="ip" />
          </div>
        </>
      )}
    </section>
  )
}

export default AdminDashboard
