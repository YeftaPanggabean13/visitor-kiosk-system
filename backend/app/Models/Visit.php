<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable = [
        'visitor_id',
        'host_id',
        'purpose',
        'check_in_at',
        'check_out_at',
        'status',
    ];

    public function visitor()
    {
        return $this->belongsTo(Visitor::class);
    }

    public function host()
    {
        return $this->belongsTo(Host::class);
    }

    public function photo()
    {
        return $this->hasOne(Photo::class);
    }
}