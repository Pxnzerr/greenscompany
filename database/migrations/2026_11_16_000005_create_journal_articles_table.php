<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('journal_articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('source_name');
            $table->text('summary');
            $table->string('external_url');
            $table->string('category');
            $table->string('image_url');
            $table->string('image_alt');
            $table->timestamp('published_at');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('journal_articles');
    }
};
