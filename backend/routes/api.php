<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\EnsureJsonResponse;
use App\Http\Controllers\Api\CheckInController;
use App\Http\Controllers\Api\VisitController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HostController;
use App\Http\Controllers\Api\SecurityDashboardController;
use App\Http\Controllers\Api\AdminController;


Route::middleware([EnsureJsonResponse::class])->group(function () {
Route::post('/login', [AuthController::class, 'login']);
Route::post('/check-in', CheckInController::class);
Route::get('/hosts', [HostController::class, 'index']);
Route::post('/visits/{id}/photo', [VisitController::class, 'uploadPhoto']); 
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/security', [SecurityDashboardController::class, 'index']);
    Route::post('/visits/{id}/check-out', [VisitController::class, 'checkOut']);

});
Route::middleware(['auth:sanctum', 'role:admin,security'])->group(function () {
    Route::get('/visits/active', [VisitController::class, 'active']);
    Route::post('/visits/{id}/check-out', [VisitController::class, 'checkOut']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'dashboard']);
    Route::get('/admin/visits', [AdminController::class, 'visitsHistory']);
    Route::get('/admin/hosts', [AdminController::class, 'hosts']);
    Route::post('/admin/hosts', [AdminController::class, 'addHost']);
    Route::get('/admin/visits/export', [AdminController::class, 'exportVisits']);
});