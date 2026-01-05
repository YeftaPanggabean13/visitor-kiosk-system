<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureJsonResponse;
use App\Http\Controllers\Api\CheckInController;
use App\Http\Controllers\Api\VisitController;
use App\Http\Controllers\Api\AuthController;

Route::middleware([EnsureJsonResponse::class])->group(function () {
    // Placeholder admin endpoints (no auth for now)
    Route::get('/admin/visitors', function () {
        return [];
    });
    
    // Check-in endpoint (minimal, no auth)
    Route::post('/check-in', CheckInController::class);

    Route::post('/login', [AuthController::class, 'login']);
    
    // Active visits for security dashboard (read-only, no auth)
    Route::get('/visits/active', [VisitController::class, 'active']);
    
    // Manual check-out endpoint (no auth)
    Route::post('/visits/{id}/check-out', [VisitController::class, 'checkOut']);
    Route::post('/visits/{id}/photo', [VisitController::class, 'uploadPhoto']);
});
