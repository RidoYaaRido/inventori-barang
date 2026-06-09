<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ActivityLogController;
use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ItemController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\StockInController;
use App\Http\Controllers\Api\V1\StockOutController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Health check endpoint (public)
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'Inventory API is running',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// API v1 routes
Route::prefix('v1')->name('api.v1.')->group(function () {
    // Public routes
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);

    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

        Route::get('/items/low-stock', [ItemController::class, 'lowStock']);
        Route::post('/stock-ins/{id}/upload', [StockInController::class, 'uploadProof']);
        Route::post('/stock-outs/{id}/upload', [StockOutController::class, 'uploadProof']);

        Route::get('/admin/reports/export', [ReportController::class, 'export']);

        Route::middleware('role:admin')->group(function () {
            Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/admin/users', [AdminController::class, 'users']);
            Route::post('/admin/users', [AdminController::class, 'storeUser']);
            Route::get('/admin/users/{id}', [AdminController::class, 'showUser']);
            Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
            Route::delete('/admin/users/{id}', [AdminController::class, 'destroyUser']);
            Route::get('/admin/reports', [ReportController::class, 'index']);
            Route::get('/activity-logs', [ActivityLogController::class, 'index']);
            Route::get('/activity-logs/{id}', [ActivityLogController::class, 'show']);
        });

        // Resource routes
        Route::apiResources([
            'categories' => CategoryController::class,
            'items' => ItemController::class,
            'stock-ins' => StockInController::class,
            'stock-outs' => StockOutController::class,
        ]);
    });
});

// Fallback for undefined API routes
Route::fallback(function () {
    return response()->json([
        'message' => 'Endpoint not found',
        'status' => 'error'
    ], 404);
});
