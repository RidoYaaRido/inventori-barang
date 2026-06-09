<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Item;
use App\Models\StockIn;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class StockInController extends Controller
{
    /**
     * Helper: apakah user yang login adalah admin?
     */
    private function isAdmin(): bool
    {
        return auth()->user()->role === 'admin';
    }

    /**
     * Helper: terapkan scope kepemilikan jika bukan admin.
     * Admin → semua data. Staff → hanya miliknya sendiri.
     */
    private function ownedQuery()
    {
        $query = StockIn::query();

        if (! $this->isAdmin()) {
            $query->where('user_id', auth()->id());
        }

        return $query;
    }

    // ─────────────────────────────────────────────────────────────
    // INDEX  –  GET /api/v1/stock-ins
    // ─────────────────────────────────────────────────────────────
    public function index()
    {
        $stockIns = $this->ownedQuery()
            ->with(['item', 'user'])
            ->latest()
            ->paginate(15);

        return $this->successResponse('Data berhasil diambil', $stockIns);
    }

    // ─────────────────────────────────────────────────────────────
    // STORE  –  POST /api/v1/stock-ins
    // ─────────────────────────────────────────────────────────────
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'item_id'          => ['required', 'exists:items,id'],
            'quantity'         => ['required', 'integer', 'min:1'],
            'reference_number' => ['required', 'string', 'unique:stock_ins,reference_number'],
            'notes'            => ['nullable', 'string'],
            'received_at'      => ['nullable', 'date'],
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator);
        }

        $validated             = $validator->validated();
        $validated['user_id']  = $request->user()->id;
        $validated['status']   = 'completed';

        $stockIn = StockIn::create($validated);

        $item = Item::find($validated['item_id']);
        $item->increment('stock_quantity', $validated['quantity']);
        $this->writeActivityLog($request, 'create stock in', $stockIn, null, $stockIn->toArray());

        return $this->successResponse(
            'Barang masuk berhasil dicatat',
            $stockIn->load(['item', 'user']),
            Response::HTTP_CREATED
        );
    }

    // ─────────────────────────────────────────────────────────────
    // SHOW  –  GET /api/v1/stock-ins/{id}
    // Staff hanya bisa melihat miliknya; admin bisa semua.
    // ─────────────────────────────────────────────────────────────
    public function show($id)
    {
        $stockIn = $this->ownedQuery()
            ->with(['item', 'user'])
            ->find($id);

        if (! $stockIn) {
            return $this->notFoundResponse();
        }

        return $this->successResponse('Data berhasil diambil', $stockIn);
    }

    // ─────────────────────────────────────────────────────────────
    // UPDATE  –  PUT /api/v1/stock-ins/{id}
    // Staff hanya bisa mengubah miliknya sendiri.
    // ─────────────────────────────────────────────────────────────
    public function update(Request $request, $id)
    {
        $stockIn = $this->ownedQuery()->with('item')->find($id);

        if (! $stockIn) {
            return $this->notFoundResponse();
        }

        $validator = Validator::make($request->all(), [
            'quantity'         => ['sometimes', 'integer', 'min:1'],
            'reference_number' => [
                'sometimes',
                'string',
                Rule::unique('stock_ins', 'reference_number')->ignore($stockIn->id),
            ],
            'notes'            => ['nullable', 'string'],
            'status'           => ['sometimes', 'in:pending,completed,cancelled'],
            'received_at'      => ['nullable', 'date'],
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator);
        }

        $validated = $validator->validated();

        if (array_key_exists('quantity', $validated) && $validated['quantity'] !== $stockIn->quantity) {
            $difference = $validated['quantity'] - $stockIn->quantity;
            $newStock   = $stockIn->item->stock_quantity + $difference;

            if ($newStock < 0) {
                return $this->stockErrorResponse(
                    'Stok barang tidak boleh menjadi negatif',
                    [
                        'available'  => $stockIn->item->stock_quantity,
                        'difference' => $difference,
                    ]
                );
            }

            if ($difference > 0) {
                $stockIn->item->increment('stock_quantity', $difference);
            } else {
                $stockIn->item->decrement('stock_quantity', abs($difference));
            }
        }

        $oldValues = $stockIn->toArray();
        $stockIn->update($validated);
        $this->writeActivityLog($request, 'update stock in', $stockIn, $oldValues, $stockIn->fresh()->toArray());

        return $this->successResponse(
            'Barang masuk berhasil diperbarui',
            $stockIn->fresh(['item', 'user'])
        );
    }

    // ─────────────────────────────────────────────────────────────
    // DESTROY  –  DELETE /api/v1/stock-ins/{id}
    // Staff hanya bisa menghapus miliknya sendiri.
    // ─────────────────────────────────────────────────────────────
    public function destroy($id)
    {
        $stockIn = $this->ownedQuery()->with('item')->find($id);

        if (! $stockIn) {
            return $this->notFoundResponse();
        }

        if ($stockIn->item->stock_quantity < $stockIn->quantity) {
            return $this->stockErrorResponse(
                'Barang masuk tidak dapat dihapus karena stok akan menjadi negatif',
                [
                    'available' => $stockIn->item->stock_quantity,
                    'required'  => $stockIn->quantity,
                ]
            );
        }

        $stockIn->item->decrement('stock_quantity', $stockIn->quantity);
        $oldValues = $stockIn->toArray();
        $stockIn->delete();
        $this->writeActivityLog(request(), 'delete stock in', $stockIn, $oldValues, null);

        return $this->successResponse('Barang masuk berhasil dihapus');
    }

    // ─────────────────────────────────────────────────────────────
    // UPLOAD PROOF  –  POST /api/v1/stock-ins/{id}/upload
    // Staff hanya bisa upload bukti miliknya sendiri.
    // ─────────────────────────────────────────────────────────────
    public function uploadProof(Request $request, $id)
    {
        $stockIn = $this->ownedQuery()->find($id);

        if (! $stockIn) {
            return $this->notFoundResponse();
        }

        $validator = Validator::make($request->all(), [
            'attachment' => ['required', 'file', 'max:2048'],
        ]);

        if ($validator->fails()) {
            return $this->uploadErrorResponse($validator->errors());
        }

        $file               = $request->file('attachment');
        $allowedExtensions  = ['pdf', 'jpg', 'jpeg', 'png'];
        $extension          = strtolower($file->getClientOriginalExtension());

        if (! in_array($extension, $allowedExtensions, true)) {
            return $this->uploadErrorResponse([
                'attachment' => ['File harus berekstensi pdf, jpg, jpeg, atau png.'],
            ]);
        }

        $path       = $file->store('transactions', 'public');
        $publicPath = 'storage/' . $path;

        $stockIn->update(['attachment_path' => $publicPath]);

        return $this->successResponse('Bukti transaksi berhasil diupload', [
            'id'              => $stockIn->id,
            'attachment_path' => $stockIn->attachment_path,
        ]);
    }

    // ─────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────

    private function successResponse(string $message, $data = null, int $status = Response::HTTP_OK)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $status);
    }

    private function writeActivityLog(Request $request, string $action, StockIn $stockIn, ?array $oldValues, ?array $newValues): void
    {
        if (! Schema::hasTable('activity_logs')) {
            return;
        }

        ActivityLog::create([
            'user_id'    => $request->user()->id,
            'action'     => $action,
            'model_type' => StockIn::class,
            'model_id'   => $stockIn->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request->ip(),
            'description' => "{$action}: {$stockIn->reference_number}",
        ]);
    }

    private function validationErrorResponse($validator)
    {
        return response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors'  => $validator->errors(),
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    private function uploadErrorResponse($errors)
    {
        return response()->json([
            'success' => false,
            'message' => 'Upload gagal',
            'errors'  => $errors,
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    private function stockErrorResponse(string $message, array $errors)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    private function notFoundResponse()
    {
        return response()->json([
            'success' => false,
            'message' => 'Data tidak ditemukan',
        ], Response::HTTP_NOT_FOUND);
    }
}
