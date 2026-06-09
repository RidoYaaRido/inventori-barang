<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
            ], 401);
        }

        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun tidak aktif.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        $this->writeActivityLogSafely($request, $user, 'login', 'User login');

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'data'    => [
                'user'  => $user,
                'token' => $token,
            ],
        ]);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'role'     => 'nullable|in:admin,staff',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role ?? 'staff',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Register berhasil.',
            'data'    => [
                'user'  => $user,
                'token' => $token,
            ],
        ], 201);
    }

    public function logout(Request $request)
    {
        $this->writeActivityLog($request, $request->user(), 'logout', 'User logout');
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'success' => true,
            'data'    => $request->user(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update($request->only('name', 'email', 'phone'));

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui.',
            'data'    => $user,
        ]);
    }

    private function writeActivityLog(Request $request, User $user, string $action, string $description): void
    {
        if (!Schema::hasTable('activity_logs')) {
            return;
        }

        ActivityLog::create([
            'user_id' => $user->id,
            'action' => $action,
            'model_type' => User::class,
            'model_id' => $user->id,
            'old_values' => null,
            'new_values' => null,
            'ip_address' => $request->ip(),
            'description' => $description,
        ]);
    }

    private function writeActivityLogSafely(Request $request, User $user, string $action, string $description): void
    {
        try {
            $this->writeActivityLog($request, $user, $action, $description);
        } catch (\Throwable $exception) {
            Log::warning('Activity log gagal ditulis saat auth.', [
                'user_id' => $user->id,
                'action' => $action,
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
