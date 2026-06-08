<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/auth/login', \App\Http\Controllers\Api\V1\AuthController::class . '@login');
    Route::post('/auth/register', \App\Http\Controllers\Api\V1\AuthController::class . '@register');

    // Protected routes (require authentication)
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', \App\Http\Controllers\Api\V1\AuthController::class . '@logout');
        Route::get('/auth/me', \App\Http\Controllers\Api\V1\AuthController::class . '@me');
        Route::put('/auth/profile', \App\Http\Controllers\Api\V1\AuthController::class . '@updateProfile');

        Route::get('/items/low-stock', \App\Http\Controllers\Api\V1\ItemController::class . '@lowStock');
        Route::post('/stock-ins/{id}/upload', \App\Http\Controllers\Api\V1\StockInController::class . '@uploadProof');
        Route::post('/stock-outs/{id}/upload', \App\Http\Controllers\Api\V1\StockOutController::class . '@uploadProof');

        // Resource routes
        Route::apiResources([
            'categories' => \App\Http\Controllers\Api\V1\CategoryController::class,
            'items' => \App\Http\Controllers\Api\V1\ItemController::class,
            'stock-ins' => \App\Http\Controllers\Api\V1\StockInController::class,
            'stock-outs' => \App\Http\Controllers\Api\V1\StockOutController::class,
        ]);

        // Activity logs (read-only for users, admin only for deletion)
        Route::get('/activity-logs', \App\Http\Controllers\Api\V1\ActivityLogController::class . '@index');
        Route::get('/activity-logs/{id}', \App\Http\Controllers\Api\V1\ActivityLogController::class . '@show');
    });
});

// Fallback for undefined API routes
Route::fallback(function () {
    return response()->json([
        'message' => 'Endpoint not found',
        'status' => 'error'
    ], 404);
});
