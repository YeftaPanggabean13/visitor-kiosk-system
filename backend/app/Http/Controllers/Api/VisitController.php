<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    use ApiResponse;

    /**
     * Return all active visits (check_out_at is NULL) for dashboard.
     *
     * GET /api/visits/active
     */
    public function active()
    {
        $visits = Visit::with(['visitor', 'host', 'photo'])
            ->whereNull('check_out_at')
            ->orderBy('check_in_at', 'desc')
            ->get();

        $data = $visits->map(function ($visit) {
            return [
                'visit_id' => $visit->id,
                'visitor_name' => optional($visit->visitor)->full_name,
                'company' => optional($visit->visitor)->company,
                'host_name' => optional($visit->host)->full_name,
                'purpose' => $visit->purpose,
                'check_in_at' => $visit->check_in_at,
                'photo_url' => $visit->photo ? url('storage/' . ltrim($visit->photo->file_path, '/')) : null,
            ];
        });

        return $this->success($data);
    }
}
