<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'nama_kategori',
        'deskripsi',
    ];

    public function barang()
    {
        return $this->hasMany(Barang::class, 'category_id');
    }
}