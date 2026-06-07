<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('barang')->get();

        return response()->json([
            'success' => true,
            'data'    => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:categories,nama_kategori',
            'deskripsi'     => 'nullable|string',
        ]);

        $category = Category::create($request->only('nama_kategori', 'deskripsi'));

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil ditambahkan.',
            'data'    => $category,
        ], 201);
    }

    public function show(Category $category)
    {
        return response()->json([
            'success' => true,
            'data'    => $category->load('barang'),
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:255|unique:categories,nama_kategori,' . $category->id,
            'deskripsi'     => 'nullable|string',
        ]);

        $category->update($request->only('nama_kategori', 'deskripsi'));

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil diperbarui.',
            'data'    => $category,
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus.',
        ]);
    }
}