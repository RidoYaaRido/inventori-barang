<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';

    protected $fillable = [
        'kode_barang',
        'nama_barang',
        'category_id',
        'stok',
        'stok_minimum',
        'harga',
        'satuan',
        'deskripsi',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function barangMasuk()
    {
        return $this->hasMany(BarangMasuk::class);
    }

    public function barangKeluar()
    {
        return $this->hasMany(BarangKeluar::class);
    }
}