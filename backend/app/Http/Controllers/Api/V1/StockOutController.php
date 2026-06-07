<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangKeluar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockOutController extends Controller
{
    public function index()
    {
        $stockOuts = BarangKeluar::with(['barang', 'user'])
            ->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => $stockOuts,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'barang_id'      => 'required|exists:barang,id',
            'jumlah'         => 'required|integer|min:1',
            'tanggal'        => 'required|date',
            'keterangan'     => 'nullable|string',
            'divisi'         => 'nullable|string|max:255',
            'bukti_transaksi'=> 'nullable|string',
        ]);

        $barang = Barang::findOrFail($request->barang_id);

        if ($barang->stok < $request->jumlah) {
            return response()->json([
                'success' => false,
                'message' => 'Stok tidak mencukupi.',
            ], 422);
        }

        DB::transaction(function () use ($request, $barang) {
            BarangKeluar::create([
                'barang_id'       => $request->barang_id,
                'user_id'         => Auth::id(),
                'jumlah'          => $request->jumlah,
                'tanggal'         => $request->tanggal,
                'keterangan'      => $request->keterangan,
                'divisi'          => $request->divisi,
                'bukti_transaksi' => $request->bukti_transaksi,
                'status'          => 'pending',
            ]);

            $barang->decrement('stok', $request->jumlah);
        });

        return response()->json([
            'success' => true,
            'message' => 'Barang keluar berhasil dicatat.',
        ], 201);
    }

    public function show(BarangKeluar $stockOut)
    {
        return response()->json([
            'success' => true,
            'data'    => $stockOut->load(['barang', 'user']),
        ]);
    }
}