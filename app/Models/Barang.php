<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang'; // ← tambahkan ini

    protected $fillable = [
        'kode_barang', 'nama_barang', 'kategori', 'stok', 'satuan', 'deskripsi'
    ];

    public function barangMasuk()
    {
        return $this->hasMany(BarangMasuk::class);
    }

    public function barangKeluar()
    {
        return $this->hasMany(BarangKeluar::class);
    }
}