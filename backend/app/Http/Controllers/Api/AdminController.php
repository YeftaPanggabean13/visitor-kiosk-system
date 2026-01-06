<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Host;
use App\Models\Visit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminController extends Controller
{
    public function dashboard()
    {
        $today = Carbon::today();
        $visitorsToday = Visit::whereDate('check_in_at', $today)->count();
        $avgDuration = Visit::whereNotNull('check_out_at')
            ->get()
            ->avg(function ($v) {
                return Carbon::parse($v->check_out_at)->diffInSeconds(Carbon::parse($v->check_in_at));
            });

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'visitors_today' => $visitorsToday,
                    'avg_duration' => round($avgDuration),
                ]
            ]
        ]);
    }

 public function hosts() {
    $hosts = Host::all(['id', 'full_name', 'email', 'department']); 
    return response()->json(['success' => true, 'data' => $hosts]);
}

public function addHost(Request $request) {
    $request->validate([
        'full_name'  => 'required|string|max:255',
        'email'      => 'required|email|unique:hosts,email',
        'department' => 'required|string|max:255', 
    ]);

    $host = Host::create([
        'full_name'  => $request->full_name,
        'email'      => $request->email,
        'department' => $request->department, 
    ]);

    return response()->json(['success' => true, 'data' => $host]);
}

    // Export visitor logs to CSV
    public function exportVisits(): StreamedResponse
    {
        $visits = Visit::with(['visitor', 'host'])->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="visitor_logs.csv"',
        ];

        $callback = function () use ($visits) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Visitor', 'Company', 'Host', 'Check-in', 'Check-out']);

            foreach ($visits as $v) {
                fputcsv($file, [
                    optional($v->visitor)->full_name,
                    optional($v->visitor)->company,
                    optional($v->host)->name,
                    $v->check_in_at,
                    $v->check_out_at,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
    public function visitsHistory()
    {
        $visits = Visit::with([
                'visitor:id,full_name,company',
                'host:id,full_name,department'
            ])
            ->orderByDesc('check_in_at')
            ->get()
            ->map(function ($visit) {

                $duration = null;
                if ($visit->check_in_at && $visit->check_out_at) {
                    $duration = Carbon::parse($visit->check_in_at)
                        ->diffInSeconds(Carbon::parse($visit->check_out_at));
                }

                return [
                    'id' => $visit->id,
                    'visitor' => [
                        'name' => optional($visit->visitor)->full_name,
                        'company' => optional($visit->visitor)->company,
                    ],
                    'host' => $visit->host ? [
                        'id' => $visit->host->id,
                        'name' => $visit->host->full_name,
                        'department' => $visit->host->department,
                    ] : null,
                    'check_in_at' => $visit->check_in_at,
                    'check_out_at' => $visit->check_out_at,
                    'duration' => $duration,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $visits
        ]);
    }

}
