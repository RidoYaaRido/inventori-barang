<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Item;
use App\Models\StockIn;
use App\Models\StockOut;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
        ]);

        if ($validator->fails()) {
            return $this->validationErrorResponse($validator);
        }

        [$stockIns, $stockOuts] = $this->filteredTransactions($request);

        $data = [
            'total_items' => Item::count(),
            'total_stock_ins' => (clone $stockIns)->sum('quantity'),
            'total_stock_outs' => (clone $stockOuts)->sum('quantity'),
            'current_stock_quantity' => Item::sum('stock_quantity'),
            'low_stock_items' => Item::with('category')->where('stock_quantity', '<', 5)->latest()->get(),
            'latest_transactions' => [
                'stock_ins' => (clone $stockIns)->with(['item', 'user'])->latest()->take(10)->get(),
                'stock_outs' => (clone $stockOuts)->with(['item', 'user'])->latest()->take(10)->get(),
            ],
            'filters' => [
                'start_date' => $request->query('start_date'),
                'end_date' => $request->query('end_date'),
            ],
        ];

        return $this->successResponse('Laporan inventory berhasil diambil', $data);
    }

    public function export(Request $request)
    {
        $filename = 'inventory-report-' . now()->format('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $this->writeActivityLog($request, 'export report', 'Export laporan inventory CSV');

        return response()->streamDownload(function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'item_name',
                'sku',
                'category',
                'stock_quantity',
                'total_stock_in',
                'total_stock_out',
                'unit',
                'generated_at',
            ]);

            Item::with('category')
                ->withSum('stockIns as total_stock_in', 'quantity')
                ->withSum('stockOuts as total_stock_out', 'quantity')
                ->orderBy('name')
                ->chunk(100, function ($items) use ($handle) {
                    foreach ($items as $item) {
                        fputcsv($handle, [
                            $item->name,
                            $item->sku,
                            $item->category?->name,
                            $item->stock_quantity,
                            $item->total_stock_in ?? 0,
                            $item->total_stock_out ?? 0,
                            $item->unit,
                            now()->toDateTimeString(),
                        ]);
                    }
                });

            fclose($handle);
        }, $filename, $headers);
    }

    private function filteredTransactions(Request $request): array
    {
        $stockIns = StockIn::query();
        $stockOuts = StockOut::query();

        if ($request->filled('start_date')) {
            $stockIns->whereDate('created_at', '>=', $request->date('start_date'));
            $stockOuts->whereDate('created_at', '>=', $request->date('start_date'));
        }

        if ($request->filled('end_date')) {
            $stockIns->whereDate('created_at', '<=', $request->date('end_date'));
            $stockOuts->whereDate('created_at', '<=', $request->date('end_date'));
        }

        return [$stockIns, $stockOuts];
    }

    private function writeActivityLog(Request $request, string $action, string $description): void
    {
        if (!Schema::hasTable('activity_logs')) {
            return;
        }

        ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => $action,
            'model_type' => Item::class,
            'model_id' => null,
            'old_values' => null,
            'new_values' => null,
            'ip_address' => $request->ip(),
            'description' => $description,
        ]);
    }

    private function successResponse(string $message, $data = null, int $status = Response::HTTP_OK)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    private function validationErrorResponse($validator)
    {
        return response()->json([
            'success' => false,
            'message' => 'Validasi gagal',
            'errors' => $validator->errors(),
        ], Response::HTTP_UNPROCESSABLE_ENTITY);
    }
}
