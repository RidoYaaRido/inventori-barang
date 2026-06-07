<?php
namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use Illuminate\Http\Request;

class BarangController extends Controller
{
    public function index(Request $request)
    {
        $barang = Barang::when($request->search, function ($query, $search) {
                $query->where('nama_barang', 'like', "%{$search}%")
                      ->orWhere('kode_barang', 'like', "%{$search}%");
            })->paginate(10)->withQueryString();

        return view('staff.barang.index', compact('barang'));
    }

    public function show(Barang $barang)
    {
        return view('staff.barang.show', compact('barang'));
    }
}