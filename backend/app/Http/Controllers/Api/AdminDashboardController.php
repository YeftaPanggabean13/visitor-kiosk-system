<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use Carbon\Carbon;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $visits = Visit::with(['visitor', 'host'])
            ->orderByDesc('check_in_at')
            ->limit(100)
            ->get();

        $visitors = $visits->map(function ($visit) {
            return [
                'id' => $visit->id,
                'name' => optional($visit->visitor)->full_name,
                'company' => optional($visit->visitor)->company,
                'host' => optional($visit->host)->full_name,
                'check_in_at' => $visit->check_in_at,
                'check_out_at' => $visit->check_out_at,
            ];
        });
        return response()->json([
            'success' => true,
            'data' => [
                'visitors' => $visitors,
                'stats' => [
                    'visitors_today' => Visit::whereDate('check_in_at', $today)->count(),
                    'active_visitors' => Visit::whereNull('check_out_at')->count(),
                    'avg_duration_seconds' => $this->averageDuration(),
                ]
            ]
        ]);
    }

    private function averageDuration()
    {
        $visits = Visit::whereNotNull('check_out_at')->get();

        if ($visits->isEmpty()) return 0;

        $totalSeconds = $visits->sum(function ($visit) {
            return Carbon::parse($visit->check_out_at)
                ->diffInSeconds(Carbon::parse($visit->check_in_at));
        });

        return round($totalSeconds / $visits->count());
    }
}
