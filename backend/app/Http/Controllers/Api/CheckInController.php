<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Traits\ApiResponse;
use App\Models\Visitor;
use App\Models\Visit;
use App\Models\Host;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class CheckInController extends Controller
{
    use ApiResponse;

    // Handle a visitor check-in.
    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => ['required', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'host_id' => ['required', 'integer', 'exists:hosts,id'],
            'purpose' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $data = $validator->validated();

        // Create or reuse visitor by phone
        $visitor = Visitor::firstOrCreate(
            ['phone' => $data['phone']],
            ['full_name' => $data['full_name'], 'company' => $data['company'] ?? null]
        );

        // Ensure host exists (validator enforces exists, but double-check)
        $host = Host::find($data['host_id']);

        if (! $host) {
            return $this->error('Host not found', 404);
        }

        // Create visit
        $visit = Visit::create([
            'visitor_id' => $visitor->id,
            'host_id' => $host->id,
            'purpose' => $data['purpose'] ?? null,
            'check_in_at' => Carbon::now(),
        ]);

        // Load relations for response
        $visit->load('visitor', 'host');

        return $this->success($visit, 'Checked in successfully', 201);
    }
}
