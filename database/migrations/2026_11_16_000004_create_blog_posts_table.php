<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('author_name');
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('category')->default('Dicas práticas');
            $table->longText('content');
            $table->string('cover_path')->nullable();
            $table->string('cover_url')->nullable();
            $table->string('cover_alt')->nullable();
            $table->json('sources')->nullable();
            $table->string('status')->default('published');
            $table->date('published_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
