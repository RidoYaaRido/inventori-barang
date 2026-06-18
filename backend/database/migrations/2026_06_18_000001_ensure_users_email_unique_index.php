<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('users') || $this->hasUniqueEmailIndex()) {
            return;
        }

        $hasDuplicateEmail = DB::table('users')
            ->select('email')
            ->whereNotNull('email')
            ->groupBy('email')
            ->havingRaw('COUNT(*) > 1')
            ->exists();

        if ($hasDuplicateEmail) {
            throw new RuntimeException('Tidak dapat menambahkan UNIQUE INDEX users.email karena masih ada email duplikat.');
        }

        Schema::table('users', function (Blueprint $table) {
            $table->unique('email', 'users_email_unique');
        });
    }

    public function down(): void
    {
        //
    }

    private function hasUniqueEmailIndex(): bool
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            $indexes = DB::select(
                "SHOW INDEX FROM users WHERE Column_name = 'email' AND Non_unique = 0"
            );

            return count($indexes) > 0;
        }

        if ($driver === 'sqlite') {
            $indexes = DB::select("PRAGMA index_list('users')");

            foreach ($indexes as $index) {
                if ((int) ($index->unique ?? 0) !== 1) {
                    continue;
                }

                $columns = DB::select("PRAGMA index_info('{$index->name}')");
                $columnNames = array_map(fn ($column) => $column->name, $columns);

                if ($columnNames === ['email']) {
                    return true;
                }
            }
        }

        return false;
    }
};
