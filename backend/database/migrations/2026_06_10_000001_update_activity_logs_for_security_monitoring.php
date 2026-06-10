<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->change();
            $table->text('user_agent')->nullable()->after('ip_address');
            $table->string('browser')->nullable()->after('user_agent');
            $table->string('operating_system')->nullable()->after('browser');
            $table->string('device_type')->nullable()->after('operating_system');
            $table->string('country')->nullable()->after('device_type');
            $table->string('city')->nullable()->after('country');
            $table->string('isp')->nullable()->after('city');
            $table->index('ip_address');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex(['ip_address']);
            $table->dropIndex(['created_at']);
            $table->dropColumn([
                'user_agent',
                'browser',
                'operating_system',
                'device_type',
                'country',
                'city',
                'isp',
            ]);
            $table->foreignId('user_id')->nullable(false)->change();
        });
    }
};
