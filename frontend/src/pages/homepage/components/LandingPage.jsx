import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowUpRight, 
  Package, 
  BarChart3, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Menu, 
  X,
  Sparkles,
  Layers,
  Database,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function LandingPage({ onEnterDemo }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Staggered layout helper
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <div id="landing-page-root" className="min-h-screen bg-[#f8f9ff] text-[#121c2a] font-sans overflow-x-hidden relative">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#a1efff] opacity-30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-[#e6eeff] opacity-40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-[#91f78e] opacity-10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Sticky Bar */}
      <header className="sticky top-0 z-40 bg-[rgba(248,249,255,0.7)] backdrop-blur-md border-b border-[rgba(0,104,118,0.06)] px-4 sm:px-8 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-full bg-[#006876] flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_12px_rgba(0,104,118,0.2)]">
              I
            </div>
            <span className="font-bold text-xl tracking-tight text-[#006876]">
              Inventaris<span className="text-[#00bcd4]">Pro</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <a href="#landing-page-root" className="text-[#006876] hover:text-[#00a2b8] transition-colors">Home</a>
            <a href="#fitur" className="text-[#3c494c] hover:text-[#006876] transition-colors">Fitur</a>
            <a href="#statistik" className="text-[#3c494c] hover:text-[#006876] transition-colors">Statistik</a>
            <a href="#fitur" className="text-[#3c494c] hover:text-[#006876] transition-colors font-semibold">About</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-semibold text-[#006876] hover:text-[#004e59] transition-all"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 bg-[#00bcd4] hover:bg-[#00a8be] text-white text-sm font-bold rounded-xl shadow-[0_4px_14px_rgba(0,188,212,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center space-x-1"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <button 
            className="md:hidden p-2 text-[#006876]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white/95 backdrop-blur-lg flex flex-col justify-center px-8 space-y-6 md:hidden">
          <button 
            className="absolute top-6 right-6 p-2 text-[#006876]"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#006876] flex items-center justify-center text-white font-bold text-xl">
              I
            </div>
            <span className="font-bold text-2xl text-[#006876]">
              Inventaris<span className="text-[#00bcd4]">Pro</span>
            </span>
          </div>
          <a 
            href="#fitur" 
            onClick={() => setMobileMenuOpen(false)} 
            className="text-xl font-semibold text-[#121c2a]"
          >
            Fitur Unggulan
          </a>
          <a 
            href="#statistik" 
            onClick={() => setMobileMenuOpen(false)} 
            className="text-xl font-semibold text-[#121c2a]"
          >
            Analisis Statistik
          </a>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              onEnterDemo();
            }} 
            className="text-xl font-semibold text-[#121c2a] text-left"
          >
            Mulai Demo Interaktif
          </button>
          
          <div className="pt-8 border-t border-gray-100 flex flex-col space-y-4">
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="py-3 px-6 text-center font-bold text-[#006876] rounded-xl border border-[#006876]/20 bg-[#006876]/5"
            >
              Login
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/login');
              }}
              className="py-3 px-6 text-center font-bold text-white bg-[#00bcd4] rounded-xl shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-20 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Content */}
        <motion.div 
          className="lg:col-span-6 space-y-8 text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center space-x-2 bg-white/80 border border-white px-3.5 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,104,118,0.04)] text-xs font-semibold text-[#006876] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#00bcd4] animate-pulse" />
            <span>Sistem Manajemen Inventaris Generasi Baru</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#121c2a] leading-[1.15]">
            Kelola Inventaris Lebih Cerdas dengan{' '}
            <span className="text-[#00bcd4] relative inline-block">
              InventarisPro
              <span className="absolute bottom-1.5 left-0 w-full h-1 bg-[#00bcd4]/20 rounded-full" />
            </span>
          </h1>

          <p className="text-gray-600 sm:text-lg max-w-xl leading-relaxed">
            Sistem manajemen stok modern dengan teknologi glassmorphism yang memudahkan kontrol barang secara real-time. Efisiensi operasional dimulai dari transparansi data.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-[#00bcd4] hover:bg-[#00a8be] text-white font-bold rounded-2xl shadow-[0_8px_20px_rgba(0,188,212,0.35)] hover:shadow-[0_12px_24px_rgba(0,188,212,0.45)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 text-base"
            >
              <span>Mulai Gratis</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={onEnterDemo}
              className="px-8 py-4 bg-[#f8f9ff]/40 border border-[#00bcd4]/35 hover:bg-[#006876]/5 text-[#006876] font-bold rounded-2xl backdrop-blur-md shadow-sm transition-all flex items-center justify-center space-x-2 hover:border-[#00bcd4] text-base"
            >
              <span>Lihat Demo</span>
            </button>
          </div>
        </motion.div>

        {/* Right Column Visual Workspace Image */}
        <motion.div 
          className="lg:col-span-6 relative flex justify-center"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Monitor Display Glow and Glass Box Card */}
          <div className="relative w-full max-w-[540px] aspect-[4/3] rounded-[32px] overflow-hidden p-3 bg-gradient-to-tr from-white/70 via-white/50 to-cyan-50/40 border border-white/60 shadow-[0_20px_50px_rgba(0,104,118,0.12)] backdrop-blur-md">
            
            {/* Embedded mockup preview of the real user dashboard layout */}
            <div className="w-full h-full rounded-[24px] overflow-hidden bg-slate-900 border border-slate-800 flex relative text-[10px] text-slate-300 pointer-events-none select-none">
              
              {/* Minimalist Dashboard Sidebar */}
              <div className="w-[45px] sm:w-[65px] bg-[#0c1322]/80 border-r border-slate-800 p-2 flex flex-col items-center space-y-4">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold mb-2">I</div>
                <div className="w-full flex justify-center p-1.5 rounded bg-cyan-500/10 text-cyan-400"><Layers className="w-3.5 h-3.5" /></div>
                <div className="w-full flex justify-center p-1.5 rounded text-slate-500"><Database className="w-3.5 h-3.5" /></div>
                <div className="w-full flex justify-center p-1.5 rounded text-slate-500"><BarChart3 className="w-3.5 h-3.5" /></div>
                <div className="w-full flex justify-center p-1.5 rounded text-slate-500"><Users className="w-3.5 h-3.5" /></div>
              </div>

              {/* Minimalist Dashboard Grid */}
              <div className="flex-1 bg-[#10192e]/90 p-4 flex flex-col space-y-4 overflow-hidden relative">
                
                {/* Background glow node */}
                <div className="absolute top-1/2 left-1/2 w-48 h-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[40px]" />
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 relative z-10">
                  <span className="font-bold text-slate-200">Main Warehouse Summary</span>
                  <div className="flex items-center space-x-1.5 bg-slate-800/40 px-2 py-0.5 rounded-full text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span>Real-time</span>
                  </div>
                </div>

                {/* Micro Widgets */}
                <div className="grid grid-cols-3 gap-2 relative z-10">
                  <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-2 flex flex-col">
                    <span className="text-slate-500">In Stock</span>
                    <span className="font-bold text-slate-200 text-sm">4,812 pcs</span>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-800 rounded-lg p-2 flex flex-col">
                    <span className="text-slate-500">Alerts</span>
                    <span className="font-bold text-amber-400 text-sm">3 Items</span>
                  </div>
                  <div className="bg-cyan-950/20 border border-cyan-800/30 rounded-lg p-2 flex flex-col">
                    <span className="text-cyan-500">Value</span>
                    <span className="font-bold text-cyan-400 text-sm">$1.2M</span>
                  </div>
                </div>

                {/* Circular widgets */}
                <div className="flex-1 grid grid-cols-2 gap-4 items-center relative z-10 pt-2">
                  <div className="bg-slate-800/20 border border-slate-800/40 rounded-xl p-3 h-full flex flex-col items-center justify-center space-y-2">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-cyan-400 border-r-cyan-500 flex items-center justify-center text-cyan-400 font-bold relative">
                      84%
                    </div>
                    <span className="text-[9px] text-slate-400">Warehouse Capacity</span>
                  </div>
                  <div className="bg-slate-800/20 border border-slate-800/40 rounded-xl p-3 h-full flex flex-col justify-between">
                    <span className="text-slate-400">Stock Turn Rate</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="font-bold text-lg text-slate-100">+12%</span>
                      <span className="text-[8px] text-green-400">this month</span>
                    </div>
                    {/* Tiny visual bar graph */}
                    <div className="h-5 flex items-end space-x-1 w-full pt-1">
                      <div className="w-full bg-slate-800 rounded-t h-2" />
                      <div className="w-full bg-slate-800 rounded-t h-3" />
                      <div className="w-full bg-slate-800 rounded-t h-1.5" />
                      <div className="w-full bg-cyan-500 rounded-t h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Glassmorphism Alert Info Card (Exact recreation of "+24% Stok") */}
            <motion.div 
              className="absolute bottom-6 left-6 right-6 sm:left-4 sm:right-auto sm:w-[280px] bg-white/70 backdrop-blur-lg border border-white shadow-[0_12px_24px_rgba(0,104,118,0.08)] rounded-2xl p-4 flex items-start space-x-3 text-left"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-1">
                  <span className="font-extrabold text-[#121c2a] text-sm sm:text-base">+24% Stok</span>
                </div>
                <p className="text-xs text-gray-500 leading-normal">
                  Update stok otomatis berhasil dilakukan hari ini.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stat Bar Section */}
      <section id="statistik" className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 md:py-16 shadow-[0_8px_32px_rgba(0,104,118,0.03)] border-white/80 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-50/20 via-white/50 to-green-50/10 pointer-events-none" />
          
          <div className="text-center md:border-r border-[#006876]/10 px-4 space-y-2 relative z-10">
            <span className="block text-4xl sm:text-5xl font-extrabold text-[#006876] tracking-tight">
              10k+
            </span>
            <span className="block text-xs sm:text-sm font-bold text-[#3c494c] tracking-widest uppercase">
              PENGGUNA AKTIF
            </span>
          </div>

          <div className="text-center md:border-r border-[#006876]/10 px-4 space-y-2 relative z-10">
            <span className="block text-4xl sm:text-5xl font-extrabold text-[#006876] tracking-tight">
              5M+
            </span>
            <span className="block text-xs sm:text-sm font-bold text-[#3c494c] tracking-widest uppercase">
              BARANG TERKELOLA
            </span>
          </div>

          <div className="text-center px-4 space-y-2 relative z-10">
            <span className="block text-4xl sm:text-5xl font-extrabold text-[#00bcd4] tracking-tight">
              99.9%
            </span>
            <span className="block text-xs sm:text-sm font-bold text-[#3c494c] tracking-widest uppercase">
              UPTIME SERVER
            </span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center space-y-16">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#121c2a]">
            Fitur Unggulan Kami
          </h2>
          <div className="w-16 h-1.5 bg-[#00bcd4] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Real-time tracking */}
          <div className="bg-white hover:bg-[#eaf5ff]/40 border border-[#e6eeff] hover:border-[#00bcd4]/30 rounded-3xl p-8 text-left space-y-6 transition-all shadow-[0_10px_30px_rgba(0,104,118,0.02)] hover:shadow-[0_12px_40px_rgba(0,104,118,0.06)] hover:-translate-y-1 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#121c2a]">
                Pelacakan Real-time
              </h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Pantau pergerakan barang kapan saja dengan sistem pembaruan data yang instan dan akurat.
              </p>
            </div>
            <button onClick={onEnterDemo} className="pt-4 group flex items-center space-x-1.5 font-bold text-sm text-[#006876] hover:text-[#00bcd4] transition-colors">
              <span>Mulai Melacak</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 2: Laporan Detail */}
          <div className="bg-white hover:bg-[#ebfbf3]/40 border border-[#e6eeff] hover:border-[#91f78e]/30 rounded-3xl p-8 text-left space-y-6 transition-all shadow-[0_10px_30px_rgba(0,104,118,0.02)] hover:shadow-[0_12px_40px_rgba(0,104,118,0.06)] hover:-translate-y-1 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#121c2a]">
                Laporan Detail
              </h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Analisis data stok dengan grafik interaktif dan ekspor data dalam berbagai format populer.
              </p>
            </div>
            <button onClick={onEnterDemo} className="pt-4 group flex items-center space-x-1.5 font-bold text-sm text-[#006876] hover:text-[#00bcd4] transition-colors">
              <span>Buka Laporan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Card 3: Kolaborasi Tim */}
          <div className="bg-white hover:bg-[#fff9f3]/40 border border-[#e6eeff] hover:border-[#f79300]/30 rounded-3xl p-8 text-left space-y-6 transition-all shadow-[0_10px_30px_rgba(0,104,118,0.02)] hover:shadow-[0_12px_40px_rgba(0,104,118,0.06)] hover:-translate-y-1 flex flex-col justify-between">
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#121c2a]">
                Kolaborasi Tim
              </h3>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Kelola role Admin dan Staff dengan mudah untuk menjaga keamanan dan akurasi akses data.
              </p>
            </div>
            <button onClick={onEnterDemo} className="pt-4 group flex items-center space-x-1.5 font-bold text-sm text-[#006876] hover:text-[#00bcd4] transition-colors">
              <span>Undang Anggota</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Box Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="glass-panel w-full max-w-4xl mx-auto rounded-3xl p-8 sm:p-16 border-white/70 shadow-[0_15px_40px_rgba(0,104,118,0.05)] text-center space-y-8 relative overflow-hidden">
          {/* Accent mesh bg */}
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 via-transparent to-green-500/5 pointer-events-none" />
          
          <div className="space-y-4 max-w-2xl mx-auto relative z-10">
            <h2 className="text-2xl sm:text-3.5xl font-extrabold text-[#121c2a] tracking-tight leading-snug">
              Siap Mengoptimalkan Gudang Anda?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Bergabunglah dengan ribuan perusahaan yang telah beralih ke manajemen inventaris modern. Mulai uji coba gratis 14 hari Anda sekarang.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 max-w-sm mx-auto">
            <button 
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#00bcd4] hover:bg-[#00a8be] text-white font-bold rounded-xl shadow-md tracking-wide transition-all"
            >
              Daftar Sekarang
            </button>
            <button 
              onClick={onEnterDemo}
              className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#006876]/20 hover:border-[#00bcd4] hover:bg-slate-50 text-[#121c2a] font-bold rounded-xl tracking-wide transition-all"
            >
              Hubungi Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer minimal info matching screenshot */}
      <footer className="w-full bg-[#f8f9ff] py-10 text-center border-t border-[rgba(0,104,118,0.06)]">
        <p className="text-xs text-gray-400 font-medium">
          © 2026 InventarisPro. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
