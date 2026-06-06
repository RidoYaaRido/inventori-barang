<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Inventory Management API',
        'version' => 'v1',
    ]);
});