<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Storage;

class BlogPost extends Model
{
    protected $fillable = [
        'user_id',
        'author_name',
        'title',
        'slug',
        'category',
        'content',
        'cover_path',
        'cover_url',
        'cover_alt',
        'sources',
        'status',
        'published_at',
    ];

    protected $appends = [
        'resolved_cover_url',
    ];

    protected function casts(): array
    {
        return [
            'sources' => 'array',
            'published_at' => 'date:Y-m-d',
        ];
    }

    public function getResolvedCoverUrlAttribute(): ?string
    {
        if ($this->cover_path) {
            return Storage::url($this->cover_path);
        }

        return $this->cover_url;
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function savedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'saved_blog_posts')->withTimestamps();
    }
}
