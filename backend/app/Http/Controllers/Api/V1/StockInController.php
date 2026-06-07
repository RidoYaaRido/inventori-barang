<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangMasuk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class StockInController extends Controller
{
    public function index()
    {
        $stockIns = BarangMasuk::with(['barang', 'user'])
            ->latest()->paginate(10);

        return response()->json([
            'success' => true,
            'data'    => $stockIns,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'barang_id'      => 'required|exists:barang,id',
            'jumlah'         => 'required|integer|min:1',
            'tanggal_masuk'  => 'required|date',
            'keterangan'     => 'nullable|string',
            'supplier'       => 'nullable|string|max:255',
            'bukti_transaksi'=> 'nullable|string',
        ]);

        DB::transaction(function () use ($request) {
            BarangMasuk::create([
                'barang_id'       => $request->barang_id,
                'user_id'         => Auth::id(),
                'jumlah'          => $request->jumlah,
                'tanggal_masuk'   => $request->tanggal_masuk,
                'keterangan'      => $request->keterangan,
                'supplier'        => $request->supplier,
                'bukti_transaksi' => $request->bukti_transaksi,
                'status'          => 'pending',
            ]);

            Barang::find($request->barang_id)
                ->increment('stok', $request->jumlah);
        });

        return response()->json([
            'success' => true,
            'message' => 'Barang masuk berhasil dicatat.',
        ], 201);
    }

    public function show(BarangMasuk $stockIn)
    {
        return response()->json([
            'success' => true,
            'data'    => $stockIn->load(['barang', 'user']),
        ]);
    }
}