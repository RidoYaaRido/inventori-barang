<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockOut extends Model
{
    use HasFactory;

    protected $fillable = [
        'item_id',
        'user_id',
        'quantity',
        'reference_number',
        'notes',
        'status',
        'released_at'
    ];

    protected $casts = [
        'released_at' => 'datetime',
        'quantity' => 'integer',
    ];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
