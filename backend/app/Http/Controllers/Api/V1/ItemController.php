<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $items = Barang::with('category')
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_barang', 'like', "%{$search}%")
                      ->orWhere('kode_barang', 'like', "%{$search}%");
                });
            })
            ->when($request->category_id, function ($query, $categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->when($request->stok_kritis, function ($query) {
                $query->whereColumn('stok', '<=', 'stok_minimum');
            })
            ->paginate(10)
            ->withQueryString();

        return response()->json([
            'success' => true,
            'data'    => $items,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kode_barang'  => 'required|string|unique:barang,kode_barang',
            'nama_barang'  => 'required|string|max:255',
            'category_id'  => 'nullable|exists:categories,id',
            'stok'         => 'required|integer|min:0',
            'stok_minimum' => 'nullable|integer|min:0',
            'harga'        => 'nullable|numeric',
            'satuan'       => 'nullable|string',
            'deskripsi'    => 'nullable|string',
        ]);

        $item = Barang::create($request->only([
            'kode_barang', 'nama_barang', 'category_id',
            'stok', 'stok_minimum', 'harga', 'satuan', 'deskripsi',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil ditambahkan.',
            'data'    => $item->load('category'),
        ], 201);
    }

    public function show(Barang $barang)
    {
        return response()->json([
            'success' => true,
            'data'    => $barang->load('category'),
        ]);
    }

    public function update(Request $request, Barang $barang)
    {
        $request->validate([
            'kode_barang'  => 'required|string|unique:barang,kode_barang,' . $barang->id,
            'nama_barang'  => 'required|string|max:255',
            'category_id'  => 'nullable|exists:categories,id',
            'stok'         => 'required|integer|min:0',
            'stok_minimum' => 'nullable|integer|min:0',
            'harga'        => 'nullable|numeric',
            'satuan'       => 'nullable|string',
            'deskripsi'    => 'nullable|string',
        ]);

        $barang->update($request->only([
            'kode_barang', 'nama_barang', 'category_id',
            'stok', 'stok_minimum', 'harga', 'satuan', 'deskripsi',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil diperbarui.',
            'data'    => $barang->load('category'),
        ]);
    }

    public function destroy(Barang $barang)
    {
        $barang->delete();

        return response()->json([
            'success' => true,
            'message' => 'Barang berhasil dihapus.',
        ]);
    }
}