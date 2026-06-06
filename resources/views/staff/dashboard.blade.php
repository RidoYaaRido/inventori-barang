<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Dashboard Staff</title>
</head>
<body>

<h2>Dashboard Staff</h2>

<p>Selamat datang, {{ auth()->user()->name }}</p>

<ul>
    <li>Total Barang: {{ $totalBarang }}</li>
    <li>Barang Masuk Hari Ini: {{ $masukHariIni }}</li>
    <li>Barang Keluar Hari Ini: {{ $keluarHariIni }}</li>
</ul>

<h3>Riwayat Aktivitas</h3>
<table border="1">
    <tr>
        <th>Jenis</th>
        <th>Barang</th>
        <th>Jumlah</th>
        <th>Tanggal</th>
    </tr>
    @forelse ($riwayat as $item)
    <tr>
        <td>{{ $item['jenis'] }}</td>
        <td>{{ $item['barang'] }}</td>
        <td>{{ $item['jumlah'] }}</td>
        <td>{{ $item['tanggal'] }}</td>
    </tr>
    @empty
    <tr>
        <td colspan="4">Belum ada aktivitas</td>
    </tr>
    @endforelse
</table>

<br>
<form method="POST" action="{{ route('logout') }}">
    @csrf
    <button type="submit">Logout</button>
</form>

</body>
</html>