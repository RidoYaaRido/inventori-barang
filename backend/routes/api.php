<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ActivityLogController;
use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ItemController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Api\V1\SecurityMonitoringController;
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
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:5,1');

    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);

        Route::middleware('role:admin,staff')->group(function () {
            Route::get('/items', [ItemController::class, 'index']);
            Route::get('/items/low-stock', [ItemController::class, 'lowStock']);
            Route::get('/items/{item}', [ItemController::class, 'show']);

            Route::get('/categories', [CategoryController::class, 'index']);
            Route::get('/categories/{category}', [CategoryController::class, 'show']);

            Route::get('/stock-ins', [StockInController::class, 'index']);
            Route::post('/stock-ins', [StockInController::class, 'store']);
            Route::get('/stock-ins/{stockIn}', [StockInController::class, 'show']);
            Route::put('/stock-ins/{stockIn}', [StockInController::class, 'update']);
            Route::patch('/stock-ins/{stockIn}', [StockInController::class, 'update']);
            Route::post('/stock-ins/{stockIn}/upload', [StockInController::class, 'uploadProof']);

            Route::get('/stock-outs', [StockOutController::class, 'index']);
            Route::post('/stock-outs', [StockOutController::class, 'store']);
            Route::get('/stock-outs/{stockOut}', [StockOutController::class, 'show']);
            Route::put('/stock-outs/{stockOut}', [StockOutController::class, 'update']);
            Route::patch('/stock-outs/{stockOut}', [StockOutController::class, 'update']);
            Route::post('/stock-outs/{stockOut}/upload', [StockOutController::class, 'uploadProof']);
        });

        Route::middleware('role:admin')->group(function () {
            Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
            Route::get('/admin/users', [AdminController::class, 'users']);
            Route::post('/admin/users', [AdminController::class, 'storeUser']);
            Route::get('/admin/users/{id}', [AdminController::class, 'showUser']);
            Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
            Route::delete('/admin/users/{id}', [AdminController::class, 'destroyUser']);
            Route::get('/admin/reports', [ReportController::class, 'index']);
            Route::get('/admin/reports/export', [ReportController::class, 'export']);
            Route::get('/admin/activity-logs', [ActivityLogController::class, 'index']);
            Route::get('/admin/activity-logs/{id}', [ActivityLogController::class, 'show']);
            Route::get('/admin/security-monitoring/summary', [SecurityMonitoringController::class, 'summary']);
            Route::get('/admin/security-monitoring/recent-logins', [SecurityMonitoringController::class, 'recentLogins']);
            Route::get('/admin/security-monitoring/suspicious-ips', [SecurityMonitoringController::class, 'suspiciousIps']);

            Route::post('/items', [ItemController::class, 'store']);
            Route::put('/items/{item}', [ItemController::class, 'update']);
            Route::patch('/items/{item}', [ItemController::class, 'update']);
            Route::delete('/items/{item}', [ItemController::class, 'destroy']);

            Route::post('/categories', [CategoryController::class, 'store']);
            Route::put('/categories/{category}', [CategoryController::class, 'update']);
            Route::patch('/categories/{category}', [CategoryController::class, 'update']);
            Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

            Route::delete('/stock-ins/{stockIn}', [StockInController::class, 'destroy']);
            Route::delete('/stock-outs/{stockOut}', [StockOutController::class, 'destroy']);
        });
    });
});

// Fallback for undefined API routes
Route::fallback(function () {
    return response()->json([
        'message' => 'Endpoint not found',
        'status' => 'error'
    ], 404);
});
