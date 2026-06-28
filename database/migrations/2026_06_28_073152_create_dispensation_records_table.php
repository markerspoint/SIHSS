<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('dispensation_records', function (Blueprint $table) {
            $table->id();
            $table->string('patient_name');
            $table->string('generic_name');
            $table->string('dosage');
            $table->string('form');
            $table->integer('quantity_dispensed');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dispensation_records');
    }
};
