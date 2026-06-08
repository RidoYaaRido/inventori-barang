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
        Schema::table('stock_ins', function (Blueprint $table) {
            $table->string('attachment_path')->nullable()->after('notes');
        });

        Schema::table('stock_outs', function (Blueprint $table) {
            $table->string('attachment_path')->nullable()->after('notes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_ins', function (Blueprint $table) {
            $table->dropColumn('attachment_path');
        });

        Schema::table('stock_outs', function (Blueprint $table) {
            $table->dropColumn('attachment_path');
        });
    }
};
