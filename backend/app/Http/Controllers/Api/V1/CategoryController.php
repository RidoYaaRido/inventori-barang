<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Category::class);

        $query = Category::query()
            ->withCount('items')
            ->latest();

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return $this->successResponse(
            'Data berhasil diambil',
            $query->get()
        );
    }

    public function store(Request $request)
    {
        Gate::authorize('create', Category::class);

        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255', 'unique:categories,name'],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator);
        }

        $category = Category::create($validator->validated());

        return $this->successResponse(
            'Kategori berhasil dibuat',
            $category,
            Response::HTTP_CREATED
        );
    }

    public function show($id)
    {
        $category = Category::with('items')->find($id);

        if (!$category) {
            return $this->notFoundResponse();
        }

        Gate::authorize('view', $category);

        return $this->successResponse('Data berhasil diambil', $category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);

        if (!$category) {
            return $this->notFoundResponse();
        }

        Gate::authorize('update', $category);

        $validator = Validator::make($request->all(), [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories', 'name')->ignore($category->id),
            ],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator);
        }

        $category->update($validator->validated());

        return $this->successResponse('Kategori berhasil diperbarui', $category);
    }

    public function destroy(Request $request, $id)
    {
        $category = Category::withCount('items')->find($id);

        if (!$category) {
            return $this->notFoundResponse();
        }

        Gate::authorize('delete', $category);

        $category->update(['is_active' => false]);

        return $this->successResponse('Kategori berhasil dinonaktifkan', $category);
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
