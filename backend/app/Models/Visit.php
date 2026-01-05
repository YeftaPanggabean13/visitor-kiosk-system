<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable = [
        'visitor_id',
        'host_id',
        'check_in_at',
        'check_out_at',
        'purpose',
    ];

    // ✅ RELASI KE VISITOR
    public function visitor()
    {
        return $this->belongsTo(Visitor::class, 'visitor_id');
    }

    // ✅ RELASI KE HOST (USER / HOST TABLE)
    public function host()
    {
        return $this->belongsTo(Host::class, 'host_id');
        // ⚠️ jika host adalah User → ganti Host::class jadi User::class
    }
}