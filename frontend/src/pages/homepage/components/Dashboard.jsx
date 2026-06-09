import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  Bell, 
  RefreshCw, 
  Download, 
  LogOut, 
  Sliders, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  SlidersHorizontal,
  ChevronDown,
  Lock,
  User,
  ExternalLink,
  Tag,
  Warehouse,
  Play,
  Pause,
  MapPin,
  CircleDot,
  X
} from 'lucide-react'

// Pre-seeded initial data sets
const INITIAL_ITEMS = [
  { id: '1', name: 'iPhone 15 Pro Max', sku: 'IP15-PM-256', category: 'Eksternal / Elektronik', stock: 45, minStock: 10, price: 1099, location: 'Rak A-5', lastUpdated: '2026-06-09 05:40' },
  { id: '2', name: 'Mac Studio M2 Max', sku: 'MAC-ST-M2X', category: 'Eksternal / Elektronik', stock: 8, minStock: 5, price: 1999, location: 'Rak A-12', lastUpdated: '2026-06-09 05:42' },
  { id: '3', name: 'Ergo Office Chair Pro', sku: 'CH-ERGO-01', category: 'Fasilitas / Furnitur', stock: 32, minStock: 5, price: 299, location: 'Sektor B-2', lastUpdated: '2026-06-09 03:15' },
  { id: '4', name: 'USB-C Hub 8-in-1', sku: 'HUB-USBC-08', category: 'Aksesoris', stock: 120, minStock: 15, price: 49, location: 'Rak C-4', lastUpdated: '2026-06-09 04:55' },
  { id: '5', name: '4K IPS LED Monitor 27"', sku: 'MON-IPS-27', category: 'Eksternal / Elektronik', stock: 14, minStock: 4, price: 349, location: 'Rak A-9', lastUpdated: '2026-06-08 18:20' },
  { id: '6', name: 'Wireless Mechanical Keyboard', sku: 'KEY-MECH-W', category: 'Aksesoris', stock: 3, minStock: 8, price: 129, location: 'Rak C-1', lastUpdated: '2026-06-09 02:00' },
  { id: '7', name: 'Noise Cancelling Headphones', sku: 'HD-NOISE-C', category: 'Audio hifi', stock: 0, minStock: 6, price: 199, location: 'Rak D-3', lastUpdated: '2026-06-09 01:10' },
  { id: '8', name: 'Dynamic XLR Microphone', sku: 'MIC-DYN-XLR', category: 'Audio hifi', stock: 24, minStock: 4, price: 159, location: 'Rak D-12', lastUpdated: '2026-06-09 05:10' },
  { id: '9', name: 'Electric Standing Desk Frame', sku: 'DSK-STAND-A', category: 'Fasilitas / Furnitur', stock: 2, minStock: 3, price: 449, location: 'Sektor B-5', lastUpdated: '2026-06-08 14:02' }
]

const INITIAL_LOGS = [
  { id: 'l1', timestamp: '05:42', user: 'Admin Ryan', role: 'Admin', action: 'Update Stok', details: 'Mac Studio M2 Max diupdate (+2 unit)', type: 'success' },
  { id: 'l2', timestamp: '05:10', user: 'Staff Ani', role: 'Staff', action: 'Restock Barang', details: 'Dynamic XLR Microphone dimasukkan (+10 unit)', type: 'info' },
  { id: 'l3', timestamp: '03:15', user: 'Admin Ryan', role: 'Admin', action: 'Pengurangan Stok', details: 'Ergo Office Chair Pro checkout (-1 unit)', type: 'warning' },
  { id: 'l4', timestamp: '01:10', user: 'Sistem', role: 'Staff', action: 'Alarm Stok', details: 'Noise Cancelling Headphones mencapai 0 (Habis)', type: 'error' }
]

export default function Dashboard({ onBackToLanding }) {
  // Load data from localStorage or fallback
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('inventarispro_items')
    return saved ? JSON.parse(saved) : INITIAL_ITEMS
  })

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('inventarispro_logs')
    return saved ? JSON.parse(saved) : INITIAL_LOGS
  })

  const [currentUser, setCurrentUser] = useState('Ryan Hidayat')
  const [currentRole, setCurrentRole] = useState('Admin')
  
  // Search, Categories, Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [selectedStatus, setSelectedStatus] = useState('Semua')
  
  // Edit & Add modals state
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(null)

  // Form states
  const [formName, setFormName] = useState('')
  const [formSku, setFormSku] = useState('')
  const [formCategory, setFormCategory] = useState('Eksternal / Elektronik')
  const [formStock, setFormStock] = useState(0)
  const [formMinStock, setFormMinStock] = useState(5)
  const [formPrice, setFormPrice] = useState(10)
  const [formLocation, setFormLocation] = useState('Rak A-1')

  // Interactive Live simulation state
  const [isAutoSimulate, setIsAutoSimulate] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('inventarispro_items', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem('inventarispro_logs', JSON.stringify(logs))
  }, [logs])

  // Helper Toast Alert function
  const triggerToast = (text, type = 'info') => {
    setToastMessage({ text, type })
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Real-time live simulator (random orders / restocking)
  useEffect(() => {
    if (!isAutoSimulate) return

    const interval = setInterval(() => {
      if (items.length === 0) return
      
      // Select random item
      const randomIndex = Math.floor(Math.random() * items.length)
      const randomItem = items[randomIndex]
      const isDecrease = Math.random() > 0.4 // 60% chance of sold/decrease, 40% restock
      
      let change = 0
      let actionStr = ''
      let logType = 'info'

      if (isDecrease) {
        if (randomItem.stock > 0) {
          change = -1
          actionStr = 'Pengurangan Stok'
          logType = 'warning'
        } else {
          // Can't decrease below zero, trigger a restock instead
          change = Math.floor(Math.random() * 8) + 3
          actionStr = 'Restock Otomatis'
          logType = 'success'
        }
      } else {
        change = Math.floor(Math.random() * 5) + 1
        actionStr = 'Restock Suppliier'
        logType = 'success'
      }

      setItems(prevItems => {
        return prevItems.map((itm, idx) => {
          if (idx === randomIndex) {
            const newStock = Math.max(0, itm.stock + change)
            
            // Generate standard friendly logs
            const now = new Date()
            const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
            
            const detailStr = change < 0 
              ? `${itm.name} terjual via Order (#${Math.floor(10000 + Math.random() * 90000)}) [Stok: ${itm.stock} ➔ ${newStock}]`
              : `${itm.name} restock otomatis dari Supplier [Stok: ${itm.stock} ➔ ${newStock}]`

            const newLogBySim = {
              id: 'log_' + Date.now(),
              timestamp: timeStr,
              user: 'Sistem Robot',
              role: 'Staff',
              action: actionStr,
              details: detailStr,
              type: change < 0 ? 'warning' : 'success'
            }

            setLogs(l => [newLogBySim, ...l.slice(0, 49)])
            triggerToast(detailStr, change < 0 ? 'warn' : 'success')

            return {
              ...itm,
              stock: newStock,
              lastUpdated: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${timeStr}`
            }
          }
          return itm
        })
      })

    }, 8000) // Trigger every 8 seconds

    return () => clearInterval(interval)
  }, [isAutoSimulate, items])

  // Compute calculated statistics
  const stats = React.useMemo(() => {
    let totalItems = 0
    let lowStockCount = 0
    let outOfStockCount = 0
    let totalValue = 0

    items.forEach(itm => {
      totalItems += itm.stock
      totalValue += itm.stock * itm.price
      if (itm.stock === 0) {
        outOfStockCount++
      } else if (itm.stock <= itm.minStock) {
        lowStockCount++
      }
    })

    return {
      totalItems,
      totalProducts: items.length,
      lowStockCount,
      outOfStockCount,
      totalValue
    }
  }, [items])

  // Categories helper
  const categories = React.useMemo(() => {
    const list = new Set()
    items.forEach(i => list.add(i.category))
    return ['Semua', ...Array.from(list)]
  }, [items])

  // Filtering Logic
  const filteredItems = React.useMemo(() => {
    return items.filter(itm => {
      const matchSearch = 
        itm.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        itm.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        itm.location.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchCat = selectedCategory === 'Semua' || itm.category === selectedCategory
      
      let matchStat = true
      if (selectedStatus === 'Tersedia') {
        matchStat = itm.stock > itm.minStock
      } else if (selectedStatus === 'Stok Rendah') {
        matchStat = itm.stock > 0 && itm.stock <= itm.minStock
      } else if (selectedStatus === 'Habis') {
        matchStat = itm.stock === 0
      }

      return matchSearch && matchCat && matchStat
    })
  }, [items, searchQuery, selectedCategory, selectedStatus])

  // Handle Add Item Submit
  const handleAddItem = (e) => {
    e.preventDefault()
    if (!formName || !formSku) {
      triggerToast('Nama barang dan SKU wajib diisi!', 'error')
      return
    }

    // Check SKU duplication
    if (items.some(i => i.sku.toUpperCase() === formSku.toUpperCase())) {
      triggerToast('SKU sudah digunakan barang lain!', 'error')
      return
    }

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    const newItem = {
      id: 'item_' + Date.now(),
      name: formName,
      sku: formSku.toUpperCase(),
      category: formCategory,
      stock: Number(formStock),
      minStock: Number(formMinStock),
      price: Number(formPrice),
      location: formLocation,
      lastUpdated: `${dateStr} ${timeStr}`
    }

    setItems([newItem, ...items])
    
    // Add to audit trail log
    const newLog = {
      id: 'log_' + Date.now(),
      timestamp: timeStr,
      user: currentUser,
      role: currentRole,
      action: 'Tambah Barang',
      details: `Barang baru "${newItem.name}" dimasukkan ke ${newItem.location}`,
      type: 'info'
    }
    setLogs([newLog, ...logs])

    // reset fields
    setFormName('')
    setFormSku('')
    setFormStock(0)
    setFormMinStock(5)
    setFormPrice(10)
    setFormLocation('Rak A-1')
    setIsAddOpen(false)

    triggerToast(`"${newItem.name}" berhasil ditambahkan ke inventaris.`, 'success')
  }

  // Open Edit Dialog
  const openEditDialog = (item) => {
    setActiveItem(item)
    setFormName(item.name)
    setFormSku(item.sku)
    setFormCategory(item.category)
    setFormStock(item.stock)
    setFormMinStock(item.minStock)
    setFormPrice(item.price)
    setFormLocation(item.location)
    setIsEditOpen(true)
  }

  // Save Edits
  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!activeItem) return

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    setItems(items.map(i => {
      if (i.id === activeItem.id) {
        return {
          ...i,
          name: formName,
          category: formCategory,
          stock: Number(formStock),
          minStock: Number(formMinStock),
          price: Number(formPrice),
          location: formLocation,
          lastUpdated: `${dateStr} ${timeStr}`
        }
      }
      return i
    }))

    // Add search audit log
    const newLog = {
      id: 'log_' + Date.now(),
      timestamp: timeStr,
      user: currentUser,
      role: currentRole,
      action: 'Edit Detail',
      details: `Detail "${formName}" telah dimodifikasi oleh ${currentUser}`,
      type: 'info'
    }
    setLogs([newLog, ...logs])

    setIsEditOpen(false)
    setActiveItem(null)
    triggerToast(`Update sukses untuk "${formName}".`, 'success')
  }

  // Delete Item
  const handleDeleteItem = (id, name) => {
    if (currentRole !== 'Admin') {
      triggerToast('Akses ditolak: role Staff dilarang menghapus barang!', 'error')
      return
    }

    if (window.confirm(`Apakah Anda yakin ingin menghapus "${name}" sepenuhnya?`)) {
      setItems(items.filter(i => i.id !== id))

      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      const newLog = {
        id: 'log_' + Date.now(),
        timestamp: timeStr,
        user: currentUser,
        role: currentRole,
        action: 'Hapus Barang',
        details: `Barang "${name}" dihapus permanen oleh ${currentUser}`,
        type: 'error'
      }
      setLogs([newLog, ...logs])
      triggerToast(`"${name}" berhasil didelete.`, 'success')
    }
  }

  // Adjust stock instant with buttons
  const adjustStockFast = (item, delta) => {
    const newStock = Math.max(0, item.stock + delta)
    if (newStock === item.stock) return

    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

    setItems(items.map(i => {
      if (i.id === item.id) {
        return {
          ...i,
          stock: newStock,
          lastUpdated: `${dateStr} ${timeStr}`
        }
      }
      return i
    }))

    const detailStr = `${item.name} stok disesuaikan (${delta > 0 ? '+' : ''}${delta}) [Stok: ${item.stock} ➔ ${newStock}]`

    const newLog = {
      id: 'log_' + Date.now(),
      timestamp: timeStr,
      user: currentUser,
      role: currentRole,
      action: 'Sua Stok',
      details: detailStr,
      type: delta > 0 ? 'success' : 'warning'
    }
    setLogs([newLog, ...logs])
    triggerToast(detailStr, delta > 0 ? 'success' : 'warn')
  }

  // Full CSV Metadata exporter simulation
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,"
    csvContent += "ID,Nama Barang,SKU,Kategori,Stok Terkini,Stok Minimum,Harga Unit ($),Lokasi Penyimpanan,Terakhir Update\n"
    
    items.forEach(itm => {
      const row = `"${itm.id}","${itm.name}","${itm.sku}","${itm.category}",${itm.stock},${itm.minStock},${itm.price},"${itm.location}","${itm.lastUpdated}"`
      csvContent += row + "\n"
    })

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Laporan_InventarisPro_${new Date().toISOString().slice(0,10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    triggerToast('Laporan stok detail (.csv) berhasil diunduh!', 'success')
  }

  // Generate randomized SKUs helper
  const triggerAutoSKU = () => {
    if (!formName) {
      triggerToast('Masukkan nama barang terlebih dahulu untuk referensi SKU!', 'info')
      return
    }
    const cleanWord = formName.slice(0, 3).toUpperCase().replace(/\s/g, 'X')
    const randomNum = Math.floor(100 + Math.random() * 900)
    setFormSku(`${cleanWord}-${randomNum}`)
    triggerToast('SKU otomatis dibuat!', 'info')
  }

  // Count distribution of item counts by category for custom visuals
  const categoryChartData = React.useMemo(() => {
    const counts = {}
    items.forEach(i => {
      counts[i.category] = (counts[i.category] || 0) + i.stock
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [items])

  // Toggle standard role
  const toggleRole = () => {
    const nextRole = currentRole === 'Admin' ? 'Staff' : 'Admin'
    const nextUser = nextRole === 'Admin' ? 'Ryan Hidayat' : 'Ana Marlina'
    setCurrentRole(nextRole)
    setCurrentUser(nextUser)
    
    // Log role changes
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const newLog = {
      id: 'log_' + Date.now(),
      timestamp: timeStr,
      user: 'Sistem',
      role: 'Admin',
      action: 'Ubah Sesi',
      details: `Sesi login beralih ke role ${nextRole} (${nextUser})`,
      type: 'info'
    }
    setLogs([newLog, ...logs])
    triggerToast(`Beralih sesi: Login sebagai ${nextUser} (${nextRole})`, 'success')
  }

  return (
    <div className="min-h-screen bg-[#f3f6fc] text-[#121c2a] flex flex-col md:flex-row relative font-sans overflow-x-hidden">
      
      {/* Background Blurs for Glassmorphism alignment */}
      <div className="absolute top-[5%] right-[5%] w-[450px] h-[450px] bg-[#a1efff] opacity-20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[500px] h-[500px] bg-[#91f78e] opacity-10 rounded-full blur-[120px] pointer-events-none" />

      {/* FIXED SIDEBAR - Width 250px with Frosted Glass effect */}
      <aside className="w-full md:w-[250px] shrink-0 bg-white/45 backdrop-blur-xl border-b md:border-b-0 md:border-r border-white/50 flex flex-col justify-between py-6 px-4 md:fixed md:top-0 md:bottom-0 z-30 shadow-[4px_0_24px_rgba(0,104,118,0.02)]">
        
        {/* Upper Brand Section */}
        <div className="space-y-8">
          <div className="flex items-center space-x-2.5 px-2">
            <div className="w-9 h-9 rounded-xl bg-[#006876] flex items-center justify-center text-white font-black text-lg">
              I
            </div>
            <div>
              <h1 className="font-extrabold text-base text-[#121c2a] leading-none">
                Inventaris<span className="text-[#00bcd4]">Pro</span>
              </h1>
              <span className="text-[10px] font-bold text-[#006876]/80 tracking-widest uppercase">
                GLASS SYSTEM
              </span>
            </div>
          </div>

          {/* Navigational Links */}
          <nav className="space-y-1.5">
            <div className="text-[9px] font-bold uppercase tracking-widest text-[#3c494c]/60 px-3 pb-2">
              Beranda Logistik
            </div>
            
            <button className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border-l-4 border-[#00bcd4] bg-[#006876]/5 text-[#006876] font-bold text-sm transition-all">
              <span className="flex items-center space-x-2.5">
                <Warehouse className="w-4 h-4 text-[#00bcd4]" />
                <span>Gudang Utama</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </button>

            <button 
              onClick={() => triggerToast('Fitur Multi-gudang tersedia pada paket Premium Enterprise!', 'info')}
              className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border-l-4 border-transparent text-gray-500 hover:text-[#006876] hover:bg-white/40 font-medium text-sm transition-all"
            >
              <span className="flex items-center space-x-2.5">
                <Sliders className="w-4 h-4 text-gray-400" />
                <span>Supplier Mitra</span>
              </span>
              <Lock className="w-3 h-3 text-gray-400" />
            </button>

            <button 
              onClick={() => triggerToast('Laporan Terjadwal otomatis dikirim setiap hari senin!', 'info')}
              className="w-full flex items-center justify-between text-left px-3 py-2.5 rounded-xl border-l-4 border-transparent text-gray-500 hover:text-[#006876] hover:bg-white/40 font-medium text-sm transition-all"
            >
              <span className="flex items-center space-x-2.5">
                <Activity className="w-4 h-4 text-gray-400" />
                <span>Arus Stok</span>
              </span>
              <Lock className="w-3 h-3 text-gray-400" />
            </button>
          </nav>

          {/* Simulation controller toggle */}
          <div className="bg-white/60 rounded-2xl border border-white p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-[#0c1c2e] tracking-wider">
                Simulasi Arus
              </span>
              <span className={`w-2 h-2 rounded-full ${isAutoSimulate ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} />
            </div>
            
            <p className="text-[10px] text-gray-500 leading-normal">
              Mensimulasikan input pesanan otomatis untuk menguji stok minimum secara real-time.
            </p>

            <button
              onClick={() => {
                setIsAutoSimulate(!isAutoSimulate)
                triggerToast(isAutoSimulate ? 'Simulasi dinonaktifkan.' : 'Simulasi real-time diaktifkan! Pantau log di kanan bawah.', 'info')
              }}
              className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-sm ${
                isAutoSimulate 
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-200' 
                  : 'bg-[#00bcd4] hover:bg-[#00a8be] text-white'
              }`}
            >
              {isAutoSimulate ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Matikan Simulasi</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulasi Real-time</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Lower Auth/Session Area */}
        <div className="space-y-4 pt-4 border-t border-white/40">
          <div className="flex items-center space-x-3 bg-white/50 border border-white rounded-2xl p-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-700 text-white flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate leading-tight">{currentUser}</p>
              <div className="flex items-center space-x-1">
                <span className={`w-1.5 h-1.5 rounded-full ${currentRole === 'Admin' ? 'bg-cyan-500' : 'bg-orange-500'}`} />
                <span className="text-[9px] font-semibold text-gray-500 tracking-wider uppercase">{currentRole}</span>
              </div>
            </div>
            <button 
              onClick={toggleRole}
              title="Ganti Role (Admin/Staff)"
              className="p-1 text-[#006876] hover:bg-[#00bcd4]/10 rounded-lg transition-colors shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={onBackToLanding}
            className="w-full py-2.5 px-3 bg-white/30 hover:bg-red-50 text-red-600 hover:text-red-700 border border-white/50 hover:border-red-100 rounded-xl text-center font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kembali ke Landing</span>
          </button>
        </div>
      </aside>

      {/* MAIN LAYOUT SPACE */}
      <main className="flex-1 md:pl-[250px] min-h-screen pb-14 flex flex-col space-y-6">
        
        {/* Dynamic Warning Notification bar */}
        {stats.outOfStockCount > 0 && (
          <div className="bg-red-50 border-b border-red-200 px-4 sm:px-8 py-2.5 text-red-800 text-xs sm:text-sm flex items-center justify-between font-medium">
            <span className="flex items-center space-x-2">
              <AlertTriangle className="w-4.5 h-4.5 text-red-600 animate-bounce" />
              <span>Peringatan: Ada <strong>{stats.outOfStockCount} barang</strong> dengan stok habis! Harap lakukan pengisian unit segera.</span>
            </span>
            <button 
              onClick={() => {
                setSelectedStatus('Habis')
                triggerToast('Mendefilter barang habis', 'info')
              }}
              className="underline font-bold hover:text-red-900 shrink-0 text-xs ml-4"
            >
              Tampilkan Barang Habis
            </button>
          </div>
        )}

        {/* Dashboard Top Header Bar */}
        <header className="px-4 sm:px-8 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#121c2a] tracking-tight">Main Dashboard</h2>
            <p className="text-xs text-gray-500">Sistem Glassmorphism Inventaris Gudang Utama</p>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button 
              onClick={exportToCSV}
              className="py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition-all active:translate-y-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>

            <button 
              onClick={() => {
                setItems(INITIAL_ITEMS)
                setLogs(INITIAL_LOGS)
                triggerToast('Database disetel ulang ke benih awal.', 'info')
              }}
              className="p-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-gray-700 rounded-xl shadow-sm transition-all"
              title="Set Ulang Basis Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button 
              onClick={() => setIsAddOpen(true)}
              className="py-2.5 px-4 bg-[#00bcd4] hover:bg-[#00a8be] text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Barang</span>
            </button>
          </div>
        </header>

        {/* STATS BENTO GRID */}
        <section className="px-4 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-[0_4px_12px_rgba(0,104,118,0.01)] hover:shadow-md transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Total Produk</span>
              <span className="text-lg sm:text-2xl font-black text-[#121c2a]">{stats.totalProducts}</span>
              <span className="text-[9px] text-[#006e1c] font-medium block">Katalog item aktif</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center text-[#006876] shrink-0">
              <Package className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-[0_4px_12px_rgba(0,104,118,0.01)] hover:shadow-md transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Stok Fisik</span>
              <span className="text-lg sm:text-2xl font-black text-[#121c2a]">{stats.totalItems.toLocaleString()} <span className="text-xs font-normal text-gray-500">pcs</span></span>
              <span className="text-[9px] text-gray-500 font-medium block">Total unit tersimpan</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <Warehouse className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-[0_4px_12px_rgba(0,104,118,0.01)] hover:shadow-md transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Stok Rendah</span>
              <span className="text-lg sm:text-2xl font-black text-amber-600">{stats.lowStockCount} <span className="text-xs font-normal text-gray-400">barang</span></span>
              <span className="text-[9px] text-amber-600 font-bold block">Di bawah stok minimum!</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-[0_4px_12px_rgba(0,104,118,0.01)] hover:shadow-md transition-all">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block">Estimasi Nilai</span>
              <span className="text-lg sm:text-2xl font-black text-[#006e1c]">${stats.totalValue.toLocaleString()}</span>
              <span className="text-[9px] text-[#006e1c] font-semibold block">Valuasi inventori fisik</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#006e1c] shrink-0">
              <span className="font-extrabold text-[#006e1c]">$</span>
            </div>
          </div>

        </section>

        {/* ANALYTICS SECTION */}
        <section className="px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Custom SVG Bar Chart */}
          <div className="lg:col-span-8 glass-panel rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,104,118,0.02)] border-white/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-gray-800 flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#00bcd4]" />
                <span>Analisis Volume Stok Per Kategori</span>
              </span>
              <span className="text-[10px] font-semibold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">Unit Terkini</span>
            </div>

            {/* Custom chart visualization */}
            <div className="pt-2">
              <div className="space-y-3.5">
                {categoryChartData.map((data, index) => {
                  const maxVal = Math.max(...categoryChartData.map(d => d.value), 1)
                  const pct = Math.min(100, Math.round((data.value / maxVal) * 100))
                  
                  return (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-gray-700 flex items-center space-x-1.5">
                          <CircleDot className="w-3 h-3 text-[#006876]" />
                          <span>{data.name}</span>
                        </span>
                        <span className="font-bold text-[#121c2a]">{data.value} pcs</span>
                      </div>
                      
                      {/* Animated ProgressBar */}
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden relative border border-gray-200/50">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#00bcd4] to-[#006876] rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="text-[10px] text-gray-400 mt-2 text-right">
              * Diupdate otomatis seiring mutasi stok barang gudang.
            </div>
          </div>

          {/* Quick Alert list */}
          <div className="lg:col-span-4 glass-panel rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,104,118,0.02)] border-white/80 flex flex-col justify-between">
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#121c2a] flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-[#00bcd4]" />
                    <span>Aktivitas & Log Sistem</span>
                  </span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                </div>

                {/* Audit log scroll area */}
                <div className="space-y-2 max-h-[160px] overflow-y-auto pt-3 pr-1 text-[11px]">
                  {logs.slice(0, 5).map(lg => (
                    <div key={lg.id} className="bg-white/60 p-2 rounded-xl border border-white/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#006876]">{lg.action}</span>
                        <span className="text-gray-400 text-[9px]">{lg.timestamp}</span>
                      </div>
                      <p className="text-gray-600 leading-normal">{lg.details}</p>
                      
                      <div className="flex items-center justify-between text-[8px] text-gray-400">
                        <span>User: {lg.user} ({lg.role})</span>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          lg.type === 'error' ? 'bg-red-500' :
                          lg.type === 'warning' ? 'bg-amber-500' :
                          lg.type === 'success' ? 'bg-[#00bcd4]' : 'bg-gray-400'
                        }`} />
                      </div>
                    </div>
                  ))}

                  {logs.length === 0 && (
                    <p className="text-center text-gray-400 py-4">Belum ada log mutasi stok.</p>
                  )}
                </div>
              </div>

              {/* Fast Status statistics */}
              <div className="bg-slate-900 text-slate-100 rounded-xl p-3 space-y-2 text-[10px] border border-slate-800">
                <span className="block font-bold text-cyan-400 uppercase tracking-widest text-[9px]">Sistem Telemetri</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block">DB Server</span>
                    <span className="font-bold text-slate-200">Koneksi Aktif</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Uji Sesi</span>
                    <span className="font-bold text-slate-200">{currentUser}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* INVENTORY DATABASE CONTROL (Table) */}
        <section className="px-4 sm:px-8">
          <div className="glass-panel rounded-2xl shadow-[0_8px_32px_rgba(0,104,118,0.03)] border-white/80 overflow-hidden">
            
            {/* Filter and Search Bar Section */}
            <div className="p-4 sm:p-5 bg-white/50 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
              
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Cari nama barang, SKU, atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/60 border border-gray-200 focus:border-[#00bcd4] rounded-xl text-xs sm:text-sm font-medium outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Filters list */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Category select dropdown */}
                <div className="flex items-center space-x-1.5 bg-white/60 border border-gray-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-700">
                  <Filter className="w-3.5 h-3.5 text-[#006876]" />
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-transparent focus:outline-none cursor-pointer"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Status selector pills */}
                <div className="flex items-center bg-white/60 border border-gray-200 p-1 rounded-xl text-xs font-semibold">
                  {['Semua', 'Tersedia', 'Stok Rendah', 'Habis'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        selectedStatus === status 
                          ? 'bg-[#00bcd4] text-white' 
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Structured Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                
                {/* Table Header */}
                <thead className="bg-[#006876]/10 text-gray-800 font-bold uppercase tracking-wider text-[10px] sm:text-xs">
                  <tr>
                    <th className="py-4.5 px-4 sm:px-6">Nama Barang / SKU</th>
                    <th className="py-4.5 px-4">Kategori</th>
                    <th className="py-4.5 px-4 text-center">Stok Fisik</th>
                    <th className="py-4.5 px-4">Harga Unit</th>
                    <th className="py-4.5 px-4">Lokasi Rak</th>
                    <th className="py-4.5 px-4">Status</th>
                    <th className="py-4.5 px-4 text-right">Aksi Kontrol</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((itm, index) => {
                    let badgeClass = 'bg-green-100 text-green-800 border-green-200'
                    let badgeLabel = 'Stok Tersedia'

                    if (itm.stock === 0) {
                      badgeClass = 'bg-red-100 text-red-800 border-red-200 animate-pulse'
                      badgeLabel = 'Habis'
                    } else if (itm.stock <= itm.minStock) {
                      badgeClass = 'bg-amber-100 text-amber-800 border-amber-200'
                      badgeLabel = 'Stok Rendah'
                    }

                    const rowBgStyle = index % 2 === 0 
                      ? 'rgba(255, 255, 255, 0.4)' 
                      : 'rgba(240, 244, 255, 0.45)'

                    return (
                      <tr 
                        key={itm.id} 
                        style={{ backgroundColor: rowBgStyle }}
                        className="hover:bg-[#006876]/5 transition-colors"
                      >
                        <td className="py-4 px-4 sm:px-6">
                          <div className="font-bold text-gray-900">{itm.name}</div>
                          <div className="font-mono text-[9px] text-[#006876] bg-[#006876]/5 w-fit px-1.5 py-0.5 rounded mt-0.5 tracking-wide">
                            SKU • {itm.sku}
                          </div>
                        </td>

                        <td className="py-4 px-4 text-gray-600 font-medium font-sans">
                          {itm.category}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center space-x-2">
                            <button 
                              onClick={() => adjustStockFast(itm, -1)}
                              className="w-6 h-6 rounded-md bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold flex items-center justify-center transition-transform hover:scale-105"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-sm w-12 text-center">
                              {itm.stock}
                            </span>
                            <button 
                              onClick={() => adjustStockFast(itm, 1)}
                              className="w-6 h-6 rounded-md bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold flex items-center justify-center transition-transform hover:scale-105"
                            >
                              +
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono font-bold text-gray-800">
                          ${itm.price}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-1.5 text-gray-600 font-semibold text-xs">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span>{itm.location}</span>
                          </div>
                        </td>

                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                            {badgeLabel}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button 
                              onClick={() => openEditDialog(itm)}
                              className="p-1.5 text-gray-500 hover:text-[#00bcd4] hover:bg-slate-100 rounded-lg transition-colors"
                              title="Edit Detail Barang"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(itm.id, itm.name)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                currentRole === 'Admin' 
                                  ? 'text-gray-500 hover:text-red-600 hover:bg-red-50' 
                                  : 'text-gray-300 cursor-not-allowed'
                              }`}
                              title={currentRole === 'Admin' ? 'Hapus Barang' : 'Admin Only'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}

                  {filteredItems.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                        Tidak ada barang ditemukan yang cocok dengan kriteria filter.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>

            {/* Total display indicator bar */}
            <div className="bg-white/40 p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500 font-bold">
              <span>Menampilkan {filteredItems.length} dari {items.length} Barang Terdaftar</span>
              <span>Total Nilai Sektor Filtered: ${filteredItems.reduce((acc, c) => acc + (c.stock * c.price), 0).toLocaleString()}</span>
            </div>

          </div>
        </section>

      </main>

      {/* NOTIFICATION ALERT CHIPS */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            className="fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl flex items-center space-x-3 text-xs font-bold glass-panel-dark max-w-sm border border-white/20"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
            {toastMessage.type === 'warn' && <TrendingUp className="w-5 h-5 text-cyan-400 shrink-0 animate-bounce" />}
            {toastMessage.type === 'info' && <Bell className="w-5 h-5 text-amber-400 shrink-0" />}
            {toastMessage.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />}
            
            <div className="flex-1 text-slate-100 font-sans tracking-wide">
              {toastMessage.text}
            </div>
            
            <button 
              onClick={() => setToastMessage(null)} 
              className="text-slate-400 hover:text-white font-bold ml-2 shrink-0"
            >
              OK
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ADD ITEM MODAL */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-sm">
            <motion.div 
              className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl relative border-white"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="font-extrabold text-[#121c2a] flex items-center space-x-2">
                  <Package className="w-5 h-5 text-[#00bcd4]" />
                  <span>Tambah Barang Baru</span>
                </span>
                <button 
                  onClick={() => setIsAddOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-[#121c2a] rounded-lg bg-gray-50 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddItem} className="space-y-4 pt-4 text-xs font-semibold">
                
                <div className="space-y-1">
                  <label className="block text-gray-700">Nama Barang *</label>
                  <input 
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Asus ROG Ally X"
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700 flex justify-between items-center">
                    <span>Kode SKU Global *</span>
                    <button 
                      type="button" 
                      onClick={triggerAutoSKU}
                      className="text-[10px] text-[#00bcd4] hover:underline"
                    >
                      Buat SKU Otomatis
                    </button>
                  </label>
                  <input 
                    type="text"
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    placeholder="Contoh: ROG-ALLY-512"
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-gray-700">Kategori</label>
                    <select 
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none cursor-pointer"
                    >
                      <option value="Eksternal / Elektronik">Eksternal / Elektronik</option>
                      <option value="Fasilitas / Furnitur">Fasilitas / Furnitur</option>
                      <option value="Aksesoris">Aksesoris</option>
                      <option value="Audio hifi">Audio hifi</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700">Harga Per Unit ($) *</label>
                    <input 
                      type="number"
                      required
                      min={1}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-gray-700">Jumlah Stok *</label>
                    <input 
                      type="number"
                      required
                      min={0}
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700">Stok Minimum (Alarm) *</label>
                    <input 
                      type="number"
                      required
                      min={1}
                      value={formMinStock}
                      onChange={(e) => setFormMinStock(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700">Lokasi Penyimpanan Rak *</label>
                  <input 
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Contoh: Rak C-2 atau Sektor B-4"
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end space-x-2">
                  <button 
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-medium text-gray-600 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-[#00bcd4] hover:bg-[#00a8be] text-white rounded-xl transition-all font-bold shadow-md cursor-pointer"
                  >
                    Tambah Sekarang
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT ITEM MODAL */}
      <AnimatePresence>
        {isEditOpen && activeItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-sm">
            <motion.div 
              className="w-full max-w-md glass-panel rounded-3xl p-6 shadow-2xl relative border-white"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="font-extrabold text-[#121c2a] flex items-center space-x-2">
                  <Edit3 className="w-5 h-5 text-[#00bcd4]" />
                  <span>Modifikasi Detail Barang</span>
                </span>
                <button 
                  onClick={() => setIsEditOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-[#121c2a] rounded-lg bg-gray-50 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 pt-4 text-xs font-semibold">
                
                <div className="space-y-1">
                  <label className="block text-gray-400">Kode SKU Global (Permanen)</label>
                  <input 
                    type="text"
                    disabled
                    value={activeItem.sku}
                    className="w-full p-2.5 bg-gray-100/80 text-gray-400 border border-gray-200 rounded-xl cursor-not-allowed outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700">Nama Barang *</label>
                  <input 
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-gray-700">Kategori</label>
                    <select 
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none cursor-pointer"
                    >
                      <option value="Eksternal / Elektronik">Eksternal / Elektronik</option>
                      <option value="Fasilitas / Furnitur">Fasilitas / Furnitur</option>
                      <option value="Aksesoris">Aksesoris</option>
                      <option value="Audio hifi">Audio hifi</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700">Harga Per Unit ($) *</label>
                    <input 
                      type="number"
                      required
                      min={1}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-gray-700">Jumlah Stok Fisik *</label>
                    <input 
                      type="number"
                      required
                      min={0}
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-gray-700">Stok Minimum (Alarm) *</label>
                    <input 
                      type="number"
                      required
                      min={1}
                      value={formMinStock}
                      onChange={(e) => setFormMinStock(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-gray-700">Lokasi Penyimpanan Rak *</label>
                  <input 
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full p-2.5 bg-white border border-gray-200 focus:border-[#00bcd4] rounded-xl outline-none"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end space-x-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsEditOpen(false)
                      setActiveItem(null)
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all font-medium text-gray-600 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2 bg-[#00bcd4] hover:bg-[#00a8be] text-white rounded-xl transition-all font-bold shadow-md cursor-pointer"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}