<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ItemController
{
    public function index()
    {
        return response()->json([
            'items' => Item::where('is_active', true)
                ->with('category')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:items',
            'description' => 'nullable|string',
            'unit_price' => 'required|numeric|min:0',
            'unit' => 'nullable|string|max:50',
        ]);

        $item = Item::create($validated);

        return response()->json([
            'message' => 'Item created successfully',
            'item' => $item->load('category'),
        ], Response::HTTP_CREATED);
    }

    public function show(Item $item)
    {
        return response()->json([
            'item' => $item->load('category'),
        ]);
    }

    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'sku' => 'sometimes|string|unique:items,sku,' . $item->id,
            'description' => 'nullable|string',
            'unit_price' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'unit' => 'nullable|string|max:50',
            'is_active' => 'sometimes|boolean',
        ]);

        $item->update($validated);

        return response()->json([
            'message' => 'Item updated successfully',
            'item' => $item->load('category'),
        ]);
    }

    public function destroy(Item $item)
    {
        $item->delete();

        return response()->json([
            'message' => 'Item deleted successfully',
        ]);
    }
}
