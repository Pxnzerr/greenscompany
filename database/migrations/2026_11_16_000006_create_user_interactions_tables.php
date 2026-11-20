<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('saved_blog_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('blog_post_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'blog_post_id']);
        });

        Schema::create('read_blog_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('blog_post_id')->constrained()->cascadeOnDelete();
            $table->timestamp('read_at')->useCurrent();

            $table->unique(['user_id', 'blog_post_id']);
        });

        Schema::create('saved_journal_articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('journal_article_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'journal_article_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('saved_journal_articles');
        Schema::dropIfExists('read_blog_posts');
        Schema::dropIfExists('saved_blog_posts');
    }
};
