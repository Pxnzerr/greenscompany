<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('username')->unique()->after('name');
            $table->string('avatar_path')->nullable()->after('password');
            $table->string('cep', 9)->nullable()->after('avatar_path');
            $table->string('street')->nullable()->after('cep');
            $table->string('neighborhood')->nullable()->after('street');
            $table->string('city')->nullable()->after('neighborhood');
            $table->string('state', 2)->nullable()->after('city');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'username',
                'avatar_path',
                'cep',
                'street',
                'neighborhood',
                'city',
                'state',
            ]);
        });
    }
};
