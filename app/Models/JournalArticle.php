<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class JournalArticle extends Model
{
    protected $fillable = [
        'title',
        'source_name',
        'summary',
        'external_url',
        'category',
        'image_url',
        'image_alt',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function savedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'saved_journal_articles')->withTimestamps();
    }
}
