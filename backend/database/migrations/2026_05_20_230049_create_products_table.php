<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('brand_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();

            $table->string('name', 255);
            $table->string('slug', 255)->unique();
            $table->text('description')->nullable();
            $table->string('short_description', 500)->nullable();

            $table->decimal('price', 12, 2);
            $table->decimal('original_price', 12, 2)->nullable();

            $table->string('sku', 100)->unique();
            $table->integer('stock')->default(0);
            $table->integer('min_stock')->default(5);

            $table->string('gender', 20)->nullable()->comment('male, female, unisex');
            $table->string('movement', 100)->nullable()->comment('cuarzo, automatico, mecanico, etc.');

            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);

            $table->json('specs')->nullable()->comment('Especificaciones técnicas en JSON');

            $table->string('meta_title', 255)->nullable();
            $table->text('meta_description')->nullable();

            $table->timestamp('published_at')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['is_active', 'is_featured', 'published_at']);
            $table->index('gender');
            $table->index('movement');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
