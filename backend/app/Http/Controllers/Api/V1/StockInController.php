<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Item;
use App\Models\StockIn;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StockInController
{
    public function index()
    {
        return response()->json([
            'stock_ins' => StockIn::with(['item', 'user'])
                ->latest()
                ->paginate(15),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'reference_number' => 'required|string|unique:stock_ins',
            'notes' => 'nullable|string',
            'received_at' => 'nullable|date',
        ]);

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'completed';

        $stockIn = StockIn::create($validated);

        $item = Item::find($validated['item_id']);
        $item->increment('stock_quantity', $validated['quantity']);

        return response()->json([
            'message' => 'Stock in recorded successfully',
            'stock_in' => $stockIn->load(['item', 'user']),
        ], Response::HTTP_CREATED);
    }

    public function show(StockIn $stockIn)
    {
        return response()->json([
            'stock_in' => $stockIn->load(['item', 'user']),
        ]);
    }

    public function update(Request $request, StockIn $stockIn)
    {
        $validated = $request->validate([
            'quantity' => 'sometimes|integer|min:1',
            'reference_number' => 'sometimes|string|unique:stock_ins,reference_number,' . $stockIn->id,
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:pending,completed,cancelled',
            'received_at' => 'nullable|date',
        ]);

        if (isset($validated['quantity']) && $validated['quantity'] != $stockIn->quantity) {
            $difference = $validated['quantity'] - $stockIn->quantity;
            $item = $stockIn->item;
            $item->increment('stock_quantity', $difference);
        }

        $stockIn->update($validated);

        return response()->json([
            'message' => 'Stock in updated successfully',
            'stock_in' => $stockIn->load(['item', 'user']),
        ]);
    }

    public function destroy(StockIn $stockIn)
    {
        $item = $stockIn->item;
        $item->decrement('stock_quantity', $stockIn->quantity);
        $stockIn->delete();

        return response()->json([
            'message' => 'Stock in deleted successfully',
        ]);
    }

    public function uploadBukti(Request $request, StockIn $stockIn)
    {
        $request->validate([
            'bukti' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        if ($stockIn->bukti_path && \Storage::disk('public')->exists($stockIn->bukti_path)) {
            \Storage::disk('public')->delete($stockIn->bukti_path);
        }

        $path = $request->file('bukti')->store('bukti/stock-in', 'public');
        $stockIn->update(['bukti_path' => $path]);

        return response()->json([
            'message' => 'Bukti uploaded successfully',
            'bukti_path' => $path,
            'bukti_url' => asset('storage/' . $path),
        ]);
    }
}