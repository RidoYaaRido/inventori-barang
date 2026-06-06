<?php
namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangMasuk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BarangMasukController extends Controller
{
    public function index()
    {
        $riwayat = BarangMasuk::with(['barang', 'user'])
            ->latest()->paginate(10);
        return view('staff.barang-masuk.index', compact('riwayat'));
    }

    public function create()
    {
        $barang = Barang::all();
        return view('staff.barang-masuk.create', compact('barang'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'barang_id'        => 'required|exists:barang,id',
            'jumlah'           => 'required|integer|min:1',
            'tanggal'          => 'required|date',
            'keterangan'       => 'nullable|string',
            'bukti_transaksi'  => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        DB::transaction(function () use ($request) {
            $buktiPath = null;
            if ($request->hasFile('bukti_transaksi')) {
                $buktiPath = $request->file('bukti_transaksi')
                    ->store('bukti', 'public');
            }

            BarangMasuk::create([
                'barang_id'       => $request->barang_id,
                'user_id'         => Auth::id(),
                'jumlah'          => $request->jumlah,
                'tanggal'         => $request->tanggal,
                'keterangan'      => $request->keterangan,
                'bukti_transaksi' => $buktiPath,
            ]);

            Barang::find($request->barang_id)
                ->increment('stok', $request->jumlah);
        });

        return redirect()->route('staff.barang-masuk.index')
            ->with('success', 'Barang masuk berhasil dicatat.');
    }
}