<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Item;
use App\Models\StockOut;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class StockOutController
{
    public function index()
    {
        return response()->json([
            'stock_outs' => StockOut::with(['item', 'user'])
                ->latest()
                ->paginate(15),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'reference_number' => 'required|string|unique:stock_outs',
            'notes' => 'nullable|string',
            'released_at' => 'nullable|date',
        ]);

        $item = Item::find($validated['item_id']);

        // Check stock availability
        if ($item->stock_quantity < $validated['quantity']) {
            return response()->json([
                'message' => 'Insufficient stock',
                'available' => $item->stock_quantity,
                'requested' => $validated['quantity'],
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'completed';

        $stockOut = StockOut::create($validated);

        // Update item stock
        $item->decrement('stock_quantity', $validated['quantity']);

        return response()->json([
            'message' => 'Stock out recorded successfully',
            'stock_out' => $stockOut->load(['item', 'user']),
        ], Response::HTTP_CREATED);
    }

    public function show(StockOut $stockOut)
    {
        return response()->json([
            'stock_out' => $stockOut->load(['item', 'user']),
        ]);
    }

    public function update(Request $request, StockOut $stockOut)
    {
        $validated = $request->validate([
            'quantity' => 'sometimes|integer|min:1',
            'reference_number' => 'sometimes|string|unique:stock_outs,reference_number,' . $stockOut->id,
            'notes' => 'nullable|string',
            'status' => 'sometimes|in:pending,completed,cancelled',
            'released_at' => 'nullable|date',
        ]);

        // Handle quantity changes
        if (isset($validated['quantity']) && $validated['quantity'] != $stockOut->quantity) {
            $difference = $validated['quantity'] - $stockOut->quantity;
            $item = $stockOut->item;

            if ($difference > 0 && $item->stock_quantity < $difference) {
                return response()->json([
                    'message' => 'Insufficient stock',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            $item->decrement('stock_quantity', $difference);
        }

        $stockOut->update($validated);

        return response()->json([
            'message' => 'Stock out updated successfully',
            'stock_out' => $stockOut->load(['item', 'user']),
        ]);
    }

    public function destroy(StockOut $stockOut)
    {
        // Revert stock changes
        $item = $stockOut->item;
        $item->increment('stock_quantity', $stockOut->quantity);

        $stockOut->delete();

        return response()->json([
            'message' => 'Stock out deleted successfully',
        ]);
    }
}
