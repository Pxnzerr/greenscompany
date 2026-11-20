<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OngApplication extends Model
{
    protected $fillable = [
        'user_id',
        'ong_id',
        'status',
        'availability',
        'message',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ong(): BelongsTo
    {
        return $this->belongsTo(Ong::class);
    }
}
