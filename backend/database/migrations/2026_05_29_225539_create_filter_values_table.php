<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('filter_values', function (Blueprint $table) {
            $table->id();
            $table->foreignId('filter_group_id')->constrained()->cascadeOnDelete();
            $table->string('value', 100);
            $table->string('slug', 100);
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['filter_group_id', 'slug']);
            $table->index('filter_group_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('filter_values');
    }
};
