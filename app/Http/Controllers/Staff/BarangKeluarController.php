<?php
namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangKeluar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BarangKeluarController extends Controller
{
    public function index()
    {
        $riwayat = BarangKeluar::with(['barang', 'user'])
            ->latest()->paginate(10);
        return view('staff.barang-keluar.index', compact('riwayat'));
    }

    public function create()
    {
        $barang = Barang::where('stok', '>', 0)->get();
        return view('staff.barang-keluar.create', compact('barang'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'barang_id'       => 'required|exists:barang,id',
            'jumlah'          => 'required|integer|min:1',
            'tanggal'         => 'required|date',
            'keterangan'      => 'nullable|string',
            'bukti_transaksi' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $barang = Barang::findOrFail($request->barang_id);

        if ($barang->stok < $request->jumlah) {
            return back()->withErrors(['jumlah' => 'Stok tidak mencukupi.']);
        }

        DB::transaction(function () use ($request, $barang) {
            $buktiPath = null;
            if ($request->hasFile('bukti_transaksi')) {
                $buktiPath = $request->file('bukti_transaksi')
                    ->store('bukti', 'public');
            }

            BarangKeluar::create([
                'barang_id'       => $request->barang_id,
                'user_id'         => Auth::id(),
                'jumlah'          => $request->jumlah,
                'tanggal_keluar'         => $request->tanggal_keluar,
                'keterangan'      => $request->keterangan,
                'bukti_transaksi' => $buktiPath,
            ]);

            $barang->decrement('stok', $request->jumlah);
        });

        return redirect()->route('staff.barang-keluar.index')
            ->with('success', 'Barang keluar berhasil dicatat.');
    }
}