<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Host extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'email',
        'department',
    ];

    public function visits()
    {
        return $this->hasMany(Visit::class);
    }
}
