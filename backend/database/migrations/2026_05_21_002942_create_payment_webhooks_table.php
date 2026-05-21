<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_webhooks', function (Blueprint $table) {
            $table->id();
            $table->string('event', 100)->nullable()->comment('transaction.updated, etc');
            $table->string('wompi_transaction_id', 100)->nullable();
            $table->string('reference', 100)->nullable();
            $table->string('status', 30)->nullable();
            $table->json('payload')->comment('Payload completo del webhook');
            $table->boolean('signature_valid')->default(false);
            $table->boolean('processed')->default(false);
            $table->text('error_message')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['reference', 'event']);
            $table->index('processed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_webhooks');
    }
};
