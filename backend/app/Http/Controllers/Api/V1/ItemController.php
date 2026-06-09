<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::query()
            ->with('category')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($itemQuery) use ($search) {
                $itemQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%");
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->query('stock') === 'low') {
            $query->where('stock_quantity', '<', 5);
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);
        $items = $query->paginate($perPage);

        return $this->successResponse('Data berhasil diambil', $items);
    }

    public function lowStock(Request $request)
    {
        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);

        $items = Item::with('category')
            ->where('stock_quantity', '<', 5)
            ->latest()
            ->paginate($perPage);

        return $this->successResponse('Data berhasil diambil', $items);
    }

    public function store(Request $request)
    {
        if ($response = $this->ensureAdmin($request)) {
            return $response;
        }

        $validator = Validator::make($request->all(), [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'sku' => ['required', 'string', 'max:255', 'unique:items,sku'],
            'description' => ['nullable', 'string'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator);
        }

        $item = Item::create($validator->validated());
        $item->load('category');

        $this->writeActivityLog($request, 'create', $item, null, $item->toArray());

        return $this->successResponse(
            'Barang berhasil dibuat',
            $item,
            Response::HTTP_CREATED
        );
    }

    public function show($id)
    {
        $item = Item::with('category')->find($id);

        if (!$item) {
            return $this->notFoundResponse();
        }

        return $this->successResponse('Data berhasil diambil', $item);
    }

    public function update(Request $request, $id)
    {
        if ($response = $this->ensureAdmin($request)) {
            return $response;
        }

        $item = Item::find($id);

        if (!$item) {
            return $this->notFoundResponse();
        }

        $validator = Validator::make($request->all(), [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'sku' => [
                'required',
                'string',
                'max:255',
                Rule::unique('items', 'sku')->ignore($item->id),
            ],
            'description' => ['nullable', 'string'],
            'unit_price' => ['required', 'numeric', 'min:0'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator);
        }

        $oldValues = $item->toArray();

        $item->update($validator->validated());
        $item->load('category');

        $this->writeActivityLog($request, 'update', $item, $oldValues, $item->toArray());

        return $this->successResponse('Barang berhasil diperbarui', $item);
    }

    public function destroy(Request $request, $id)
    {
        if ($response = $this->ensureAdmin($request)) {
            return $response;
        }

        $item = Item::find($id);

        if (!$item) {
            return $this->notFoundResponse();
        }

        $oldValues = $item->toArray();

        $item->update(['is_active' => false]);

        $this->writeActivityLog($request, 'delete', $item, $oldValues, $item->fresh()->toArray());

        return $this->successResponse('Barang berhasil dinonaktifkan', $item->fresh('category'));
    }

    private function ensureAdmin(Request $request)
    {
        if ($request->user()?->role === 'admin') {
            return null;
        }

        return response()->json([
            'success' => false,
            'message' => 'Akses ditolak. Hanya admin yang dapat melakukan aksi ini.',
        ], Response::HTTP_FORBIDDEN);
    }

    private function writeActivityLog(Request $request, string $action, Item $item, ?array $oldValues, ?array $newValues): void
    {
        if (!Schema::hasTable('activity_logs')) {
            return;
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => $action,
            'model_type' => Item::class,
            'model_id' => $item->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request->ip(),
            'description' => "Inventory item {$action}: {$item->name}",
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

    private function notFoundResponse()
    {
        return response()->json([
            'success' => false,
            'message' => 'Data tidak ditemukan',
        ], Response::HTTP_NOT_FOUND);
    }
}
