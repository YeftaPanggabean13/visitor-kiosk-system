<?php

namespace App\Mail;

use App\Models\Visit;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class HostNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $visit;
    public $photoData;

    public function __construct(Visit $visit)
    {
        $this->visit = $visit;
        $this->photoData = $this->getEmbeddedPhoto();
    }

    public function build()
    {
        return $this->subject('New Visitor Check-In')
                    ->view('emails.host-notification')
                    ->with(['visit' => $this->visit, 'photoData' => $this->photoData]);
    }

    private function getEmbeddedPhoto()
    {
        $photoPath = $this->visit->visitor->photo_path ?? $this->visit->photo?->file_path;

        if (!$photoPath) {
            return null;
        }

        $fullPath = storage_path('app/public/' . ltrim($photoPath, '/'));
        if (!file_exists($fullPath)) {
            \Log::error('Visitor photo not found: ' . $fullPath);
            return null;
        }

        $imageData = file_get_contents($fullPath);
        $mimeType = mime_content_type($fullPath) ?: 'image/jpeg';
        $base64 = base64_encode($imageData);

        return "data:{$mimeType};base64,{$base64}";
    }
}
