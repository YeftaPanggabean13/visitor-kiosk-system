<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Host;
use App\Traits\ApiResponse;

class HostController extends Controller
{
    use ApiResponse;

    /**
     * Get all hosts.
     *
     * GET /api/hosts
     */
    public function index()
    {
        $hosts = Host::all();

        $data = $hosts->map(function ($host) {
            return [
                'id' => $host->id,
                'name' => $host->full_name,
                'department' => $host->department,
                'email' => $host->email,
            ];
        });

        return $this->success($data, 'Hosts retrieved successfully');
    }
}
