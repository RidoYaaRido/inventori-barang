<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\BarangMasuk;
use App\Models\BarangKeluar;
use Illuminate\Http\Request;

class ActivityLogController extends Controller
{
    public function index()
    {
        $masuk = BarangMasuk::with(['barang', 'user'])
            ->latest()->take(10)->get()
            ->map(fn($item) => [
                'jenis'   => 'Masuk',
                'barang'  => $item->barang->nama_barang,
                'jumlah'  => $item->jumlah,
                'user'    => $item->user->name,
                'tanggal' => $item->tanggal_masuk,
                'status'  => $item->status,
            ]);

        $keluar = BarangKeluar::with(['barang', 'user'])
            ->latest()->take(10)->get()
            ->map(fn($item) => [
                'jenis'   => 'Keluar',
                'barang'  => $item->barang->nama_barang,
                'jumlah'  => $item->jumlah,
                'user'    => $item->user->name,
                'tanggal' => $item->tanggal,
                'status'  => $item->status,
            ]);

        $logs = $masuk->merge($keluar)
            ->sortByDesc('tanggal')
            ->take(20)
            ->values();

        return response()->json([
            'success' => true,
            'data'    => $logs,
        ]);
    }

    public function show($id)
    {
        $masuk = BarangMasuk::with(['barang', 'user'])->find($id);

        if ($masuk) {
            return response()->json([
                'success' => true,
                'data'    => $masuk,
            ]);
        }

        $keluar = BarangKeluar::with(['barang', 'user'])->find($id);

        if ($keluar) {
            return response()->json([
                'success' => true,
                'data'    => $keluar,
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Log tidak ditemukan.',
        ], 404);
    }
}