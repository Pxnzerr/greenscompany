<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ong extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'initials',
        'cause',
        'cause_label',
        'mission',
        'vision',
        'stats',
        'testimonial',
        'location',
        'distance',
        'website_url',
        'image_url',
        'image_alt',
        'featured',
    ];

    protected function casts(): array
    {
        return [
            'stats' => 'array',
            'testimonial' => 'array',
            'featured' => 'boolean',
        ];
    }

    public function applications(): HasMany
    {
        return $this->hasMany(OngApplication::class);
    }
}
