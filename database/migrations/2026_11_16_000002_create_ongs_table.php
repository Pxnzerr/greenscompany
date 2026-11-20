<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ongs', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->string('initials', 10);
            $table->string('cause');
            $table->string('cause_label');
            $table->text('mission');
            $table->text('vision');
            $table->json('stats')->nullable();
            $table->json('testimonial')->nullable();
            $table->string('location');
            $table->string('distance')->nullable();
            $table->string('website_url')->nullable();
            $table->string('image_url');
            $table->string('image_alt');
            $table->boolean('featured')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ongs');
    }
};
