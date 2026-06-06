<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarangMasuk extends Model
{
    protected $table = 'barang_masuk';

    protected $fillable = [
        'barang_id', 'user_id', 'jumlah', 'tanggal', 'keterangan', 'bukti_transaksi'
    ];

    protected $casts = ['tanggal' => 'date'];

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}