<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'avatar_path',
        'cep',
        'street',
        'neighborhood',
        'city',
        'state',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'avatar_url',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar_path ? Storage::url($this->avatar_path) : null;
    }

    public function blogPosts(): HasMany
    {
        return $this->hasMany(BlogPost::class);
    }

    public function ongApplications(): HasMany
    {
        return $this->hasMany(OngApplication::class);
    }

    public function savedBlogPosts(): BelongsToMany
    {
        return $this->belongsToMany(BlogPost::class, 'saved_blog_posts')->withTimestamps();
    }

    public function readBlogPosts(): BelongsToMany
    {
        return $this->belongsToMany(BlogPost::class, 'read_blog_posts')->withPivot('read_at');
    }

    public function savedJournalArticles(): BelongsToMany
    {
        return $this->belongsToMany(JournalArticle::class, 'saved_journal_articles')->withTimestamps();
    }
}
