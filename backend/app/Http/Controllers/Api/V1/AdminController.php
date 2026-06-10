<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockOut;
use App\Models\User;
use App\Support\ActivityLogger;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    public function dashboard()
    {
        $data = [
            'total_items'        => Item::count(),
            'total_categories'   => Category::count(),
            'total_staff'        => User::where('role', 'staff')->where('is_active', true)->count(),
            'total_stock_ins'    => StockIn::count(),
            'total_stock_outs'   => StockOut::count(),
            'low_stock_items'    => Item::with('category')->where('stock_quantity', '<', 5)->latest()->get(),
            'recent_stock_ins'   => StockIn::with(['item', 'user'])->latest()->take(10)->get(),
            'recent_stock_outs'  => StockOut::with(['item', 'user'])->latest()->take(10)->get(),
        ];

        return $this->successResponse('Dashboard admin berhasil diambil', $data);
    }

    public function users(Request $request)
    {
        $query = User::query()->latest();

        if ($request->filled('role')) {
            $query->where('role', $request->query('role'));
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($userQuery) use ($search) {
                $userQuery->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = min(max((int) $request->query('per_page', 15), 1), 100);

        return $this->successResponse('Data user berhasil diambil', $query->paginate($perPage));
    }

    public function storeUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['sometimes', 'in:admin,staff'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator);
        }

        $validated = $validator->validated();
        $validated['password'] = Hash::make($validated['password']);
        $validated['role'] = $validated['role'] ?? 'staff';
        $validated['is_active'] = $validated['is_active'] ?? true;

        $user = User::create($validated);
        ActivityLogger::log('create_user', $user, "Create user: {$user->email}", $request, null, $user->toArray());

        return $this->successResponse('User staff berhasil dibuat', $user, Response::HTTP_CREATED);
    }

    public function showUser($id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->notFoundResponse('User tidak ditemukan');
        }

        return $this->successResponse('Detail user berhasil diambil', $user);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->notFoundResponse('User tidak ditemukan');
        }

        $validator = Validator::make($request->all(), [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => [
                'sometimes',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'password' => ['sometimes', 'string', 'min:8'],
            'role' => ['sometimes', 'in:admin,staff'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator);
        }

        $validated = $validator->validated();
        if (array_key_exists('password', $validated)) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $oldValues = $user->toArray();
        $user->update($validated);
        ActivityLogger::log('update_user', $user, "Update user: {$user->email}", $request, $oldValues, $user->fresh()->toArray());

        return $this->successResponse('User berhasil diperbarui', $user->fresh());
    }

    public function destroyUser(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->notFoundResponse('User tidak ditemukan');
        }

        $oldValues = $user->toArray();
        $user->update(['is_active' => false]);
        ActivityLogger::log('deactivate_user', $user, "Deactivate user: {$user->email}", $request, $oldValues, $user->fresh()->toArray());

        return $this->successResponse('User berhasil dinonaktifkan', $user->fresh());
    }

    private function writeActivityLog(Request $request, string $action, User $user, ?array $oldValues, ?array $newValues): void
    {
        if (!Schema::hasTable('activity_logs')) {
            return;
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => $action,
            'model_type' => User::class,
            'model_id' => $user->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request->ip(),
            'description' => "{$action}: {$user->email}",
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

    private function notFoundResponse(string $message)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], Response::HTTP_NOT_FOUND);
    }
}
