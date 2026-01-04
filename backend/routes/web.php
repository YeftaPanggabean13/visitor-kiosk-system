<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureJsonResponse;
use App\Http\Controllers\Api\CheckInController;

Route::middleware([EnsureJsonResponse::class])->group(function () {
    Route::get('/ping', function () {
        return response()->json([
            'status' => 'ok',
            'message' => 'API is working',
        ]);
    });

    // Placeholder admin endpoints (no auth for now)
    Route::get('/admin/visitors', function () {
        return [];
    });
    
    // Check-in endpoint (minimal, no auth)
    Route::post ('/check-in', [CheckInController::class, '__invoke']);
});
