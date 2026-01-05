<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureJsonResponse;
use App\Http\Controllers\Api\CheckInController;
use App\Http\Controllers\Api\VisitController;

Route::middleware([EnsureJsonResponse::class])->group(function () {
    // Placeholder admin endpoints (no auth for now)
    Route::get('/admin/visitors', function () {
        return [];
    });
    
    // Check-in endpoint (minimal, no auth)
    Route::post('/check-in', CheckInController::class);
    
    // Active visits for security dashboard (read-only, no auth)
    Route::get('/visits/active', [VisitController::class, 'active']);
});
