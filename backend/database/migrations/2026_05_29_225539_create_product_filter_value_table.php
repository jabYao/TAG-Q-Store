<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_filter_value', function (Blueprint $table) {
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('filter_value_id')->constrained()->cascadeOnDelete();
            $table->primary(['product_id', 'filter_value_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_filter_value');
    }
};
