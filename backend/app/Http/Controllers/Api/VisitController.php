<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Visit;
use App\Models\Photo;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

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
            ->where('status', 'checked_in')
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

    public function checkOut($id)
    {
        $visit = Visit::find($id);

        if (!$visit) {
            return $this->error('Visit not found', 404);
        }

        if ($visit->check_out_at) {
            return $this->error('Visit already checked out', 400);
        }

        $visit->check_out_at = now();
        $visit->status = 'checked_out';
        $visit->save();

        $data = [
            'visit_id' => $visit->id,
            'visitor_name' => optional($visit->visitor)->full_name,
            'host_name' => optional($visit->host)->full_name,
            'purpose' => $visit->purpose,
            'check_in_at' => $visit->check_in_at,
            'check_out_at' => $visit->check_out_at,
            'photo_url' => $visit->photo ? url('storage/' . ltrim($visit->photo->file_path, '/')) : null,
        ];

        return $this->success($data, 'Checked out');
    }

    public function uploadPhoto($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'photo' => 'required|image|max:2048',
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422);
        }

        $visit = Visit::find($id);

        if (!$visit) {
            return $this->error('Visit not found', 404);
        }

        $file = $request->file('photo');
        $filename = 'visit_' . $visit->id . '.jpg';
        $directory = 'visitors'; // relative to storage/app/public

        if (!Storage::disk('public')->exists($directory)) {
            Storage::disk('public')->makeDirectory($directory);
        }

        Storage::disk('public')->putFileAs($directory, $file, $filename);

        $filePath = $directory . '/' . $filename;

        Photo::updateOrCreate(
            ['visit_id' => $visit->id],
            ['file_path' => $filePath]
        );

        return $this->success([
            'photo_url' => url('storage/' . $filePath),
        ], 'Photo uploaded');
    }
    public function showActive($id)
    {
        $visit = Visit::with('visitor', 'host')
            ->where('id', $id)
            ->where('status', 'checked_in')
            ->first();

        if (! $visit) {
            return response()->json([
                'message' => 'Active visit not found'
            ], 404);
        }

        return response()->json([
            'data' => $visit
        ]);
    }
    public function kioskCheckOut($id)
    {
        $visit = Visit::where('id', $id)
            ->where('status', 'checked_in')
            ->first();

        if (! $visit) {
            return $this->error('Active visit not found', 404);
        }

        $visit->update([
            'status' => 'checked_out',
            'check_out_at' => now(),
        ]);

        return $this->success([
            'visit_id' => $visit->id,
            'check_out_at' => $visit->check_out_at,
        ], 'Checked out successfully');
    }
}
