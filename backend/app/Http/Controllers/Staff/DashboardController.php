<?php
namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangMasuk;
use App\Models\BarangKeluar;

class DashboardController extends Controller
{
    public function index()
    {
        $totalBarang   = Barang::count();
        $masukHariIni  = BarangMasuk::whereDate('tanggal_masuk', today())->sum('jumlah');  // ← fix
        $keluarHariIni = BarangKeluar::whereDate('tanggal_keluar', today())->sum('jumlah'); // ← fix

        $riwayatMasuk = BarangMasuk::with('barang')
            ->latest()->take(5)->get()
            ->map(fn($item) => [
                'jenis'   => 'Masuk',
                'barang'  => $item->barang->nama_barang,
                'jumlah'  => $item->jumlah,
                'tanggal' => $item->tanggal_masuk, // ← fix
            ]);

        $riwayatKeluar = BarangKeluar::with('barang')
            ->latest()->take(5)->get()
            ->map(fn($item) => [
                'jenis'   => 'Keluar',
                'barang'  => $item->barang->nama_barang,
                'jumlah'  => $item->jumlah,
                'tanggal' => $item->tanggal_keluar, // ← fix
            ]);

        $riwayat = $riwayatMasuk->merge($riwayatKeluar)
            ->sortByDesc('tanggal')->take(10)->values();

        return view('staff.dashboard', compact(
            'totalBarang', 'masukHariIni', 'keluarHariIni', 'riwayat'
        ));
    }
}