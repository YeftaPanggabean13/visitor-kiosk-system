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
use Illuminate\Support\Facades\Mail;
use App\Mail\HostNotificationMail;

class CheckInController extends Controller
{
    use ApiResponse;

    public function __invoke(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'full_name' => ['required','string','max:255'],
            'company' => ['nullable','string','max:255'],
            'phone' => ['required','string','max:50'],
            'host_id' => ['required','integer','exists:hosts,id'],
            'purpose' => ['nullable','string'],
            'photo' => ['nullable','image','max:2048'],
        ]);

        if ($validator->fails()) {
            return $this->error('Validation failed', 422, $validator->errors());
        }

        $data = $validator->validated();

        // Buat atau ambil visitor
        $visitor = Visitor::firstOrCreate(
            ['phone' => $data['phone']],
            ['full_name' => $data['full_name'], 'company' => $data['company'] ?? null]
        );

        // Upload foto jika ada
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('visitors','public');
            $visitor->photo_path = $photoPath;
            $visitor->save();
        }

        // Pastikan host ada
        $host = Host::find($data['host_id']);
        if (!$host) return $this->error('Host not found',404);

        // Buat visit
        $visit = Visit::create([
            'visitor_id' => $visitor->id,
            'host_id' => $host->id,
            'purpose' => $data['purpose'] ?? null,
            'check_in_at' => Carbon::now(),
            'status' => 'checked_in',
        ]);

        $visit = Visit::with('visitor','host','photo')->find($visit->id);

        // Kirim email ke host
        try {
            Mail::to($host->email)->send(new HostNotificationMail($visit));
        } catch (\Exception $e) {
            \Log::error('Failed to send host notification email: ' . $e->getMessage());
        }

        return $this->success($visit,'Checked in successfully',201);
    }
}
