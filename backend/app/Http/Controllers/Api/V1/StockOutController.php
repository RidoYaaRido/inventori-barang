<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Item;
use App\Models\StockOut;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class StockOutController extends Controller
{
    public function index()
    {
        $stockOuts = StockOut::with(['item', 'user'])
            ->latest()
            ->paginate(15);

        return $this->successResponse('Data berhasil diambil', $stockOuts);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'item_id' => ['required', 'exists:items,id'],
            'quantity' => ['required', 'integer', 'min:1'],
            'reference_number' => ['required', 'string', 'unique:stock_outs,reference_number'],
            'notes' => ['nullable', 'string'],
            'released_at' => ['nullable', 'date'],
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator);
        }

        $validated = $validator->validated();
        $item = Item::find($validated['item_id']);

        if ($item->stock_quantity < $validated['quantity']) {
            return $this->stockErrorResponse(
                'Stok barang tidak mencukupi',
                [
                    'available' => $item->stock_quantity,
                    'requested' => $validated['quantity'],
                ]
            );
        }

        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'completed';

        $stockOut = StockOut::create($validated);
        $item->decrement('stock_quantity', $validated['quantity']);
        $this->writeActivityLog($request, 'create stock out', $stockOut, null, $stockOut->toArray());

        return $this->successResponse(
            'Barang keluar berhasil dicatat',
            $stockOut->load(['item', 'user']),
            Response::HTTP_CREATED
        );
    }

    public function show($id)
    {
        $stockOut = StockOut::with(['item', 'user'])->find($id);

        if (!$stockOut) {
            return $this->notFoundResponse();
        }

        return $this->successResponse('Data berhasil diambil', $stockOut);
    }

    public function update(Request $request, $id)
    {
        $stockOut = StockOut::with('item')->find($id);

        if (!$stockOut) {
            return $this->notFoundResponse();
        }

        $validator = Validator::make($request->all(), [
            'quantity' => ['sometimes', 'integer', 'min:1'],
            'reference_number' => [
                'sometimes',
                'string',
                Rule::unique('stock_outs', 'reference_number')->ignore($stockOut->id),
            ],
            'notes' => ['nullable', 'string'],
            'status' => ['sometimes', 'in:pending,completed,cancelled'],
            'released_at' => ['nullable', 'date'],
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator);
        }

        $validated = $validator->validated();

        if (array_key_exists('quantity', $validated) && $validated['quantity'] !== $stockOut->quantity) {
            $difference = $validated['quantity'] - $stockOut->quantity;

            if ($difference > 0 && $stockOut->item->stock_quantity < $difference) {
                return $this->stockErrorResponse(
                    'Stok barang tidak mencukupi',
                    [
                        'available' => $stockOut->item->stock_quantity,
                        'requested_additional' => $difference,
                    ]
                );
            }

            if ($difference > 0) {
                $stockOut->item->decrement('stock_quantity', $difference);
            } else {
                $stockOut->item->increment('stock_quantity', abs($difference));
            }
        }

        $oldValues = $stockOut->toArray();
        $stockOut->update($validated);
        $this->writeActivityLog($request, 'update stock out', $stockOut, $oldValues, $stockOut->fresh()->toArray());

        return $this->successResponse(
            'Barang keluar berhasil diperbarui',
            $stockOut->fresh(['item', 'user'])
        );
    }

    public function destroy($id)
    {
        $stockOut = StockOut::with('item')->find($id);

        if (!$stockOut) {
            return $this->notFoundResponse();
        }

        $stockOut->item->increment('stock_quantity', $stockOut->quantity);
        $oldValues = $stockOut->toArray();
        $stockOut->delete();
        $this->writeActivityLog(request(), 'delete stock out', $stockOut, $oldValues, null);

        return $this->successResponse('Barang keluar berhasil dihapus');
    }

    public function uploadProof(Request $request, $id)
    {
        $stockOut = StockOut::find($id);

        if (!$stockOut) {
            return $this->notFoundResponse();
        }

        $validator = Validator::make($request->all(), [
            'attachment' => ['required', 'file', 'max:2048'],
        ]);

        if ($validator->fails()) {
            return $this->uploadErrorResponse($validator->errors());
        }

        $file = $request->file('attachment');
        $allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
        $extension = strtolower($file->getClientOriginalExtension());

        if (!in_array($extension, $allowedExtensions, true)) {
            return $this->uploadErrorResponse([
                'attachment' => ['File harus berekstensi pdf, jpg, jpeg, atau png.'],
            ]);
        }

        $path = $file->store('transactions', 'public');
        $publicPath = 'storage/' . $path;

        $stockOut->update(['attachment_path' => $publicPath]);

        return $this->successResponse('Bukti transaksi berhasil diupload', [
            'id' => $stockOut->id,
            'attachment_path' => $stockOut->attachment_path,
        ]);
    }

    private function writeActivityLog(Request $request, string $action, StockOut $stockOut, ?array $oldValues, ?array $newValues): void
    {
        if (!Schema::hasTable('activity_logs')) {
            return;
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => $action,
            'model_type' => StockOut::class,
            'model_id' => $stockOut->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request->ip(),
            'description' => "{$action}: {$stockOut->reference_number}",
        ]);
    }

    private function successResponse(string $message, $data = null, int $status = Response::HTTP_OK)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    private function validationErrorResponse($validator)
    {
        return response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors' => $validator->errors(),
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    private function uploadErrorResponse($errors)
    {
        return response()->json([
            'success' => false,
            'message' => 'Upload gagal',
            'errors' => $errors,
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    private function stockErrorResponse(string $message, array $errors)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
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
