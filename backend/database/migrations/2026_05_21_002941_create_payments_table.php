<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('wompi_transaction_id', 100)->nullable()->unique();
            $table->string('reference', 100)->unique()->comment('order_number como referencia');
            $table->string('status', 30)->default('pending')->comment('pending, approved, rejected, expired, error');
            $table->string('payment_method', 30)->nullable()->comment('wompi, contraentrega');
            $table->string('payment_method_type', 50)->nullable()->comment('CARD, PSE, NEQUI, DAVIPLATA, etc');
            $table->decimal('amount', 12, 2);
            $table->decimal('amount_in_cents', 12, 2)->comment('Monto original en centavos para validación Wompi');
            $table->string('currency', 3)->default('COP');
            $table->string('customer_email', 255)->nullable();
            $table->string('installments', 10)->nullable();
            $table->json('wompi_response')->nullable()->comment('Respuesta completa de Wompi');
            $table->integer('retry_count')->default(0);
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['order_id', 'status']);
            $table->index('reference');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
