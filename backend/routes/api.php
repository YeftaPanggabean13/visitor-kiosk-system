<?php

use Illuminate\Support\Facades\Route;

Route::get('/ping', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'API is working',
    ]);
Route::middleware('auth:sanctum')->group(function () {
Route::get('/admin/visitors', fn () => []);
});
});
