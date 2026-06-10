<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class SecurityMonitoringController extends Controller
{
    public function summary()
    {
        $today = now()->startOfDay();

        $latestActivity = $this->baseLogQuery()->latest()->take(10)->get();
        $suspiciousIps = $this->suspiciousIpQuery()->take(10)->get();
        $topUser = ActivityLog::query()
            ->with('user')
            ->whereDate('created_at', today())
            ->whereNotNull('user_id')
            ->selectRaw('user_id, COUNT(*) as total')
            ->groupBy('user_id')
            ->orderByDesc('total')
            ->first();

        return response()->json([
            'success' => true,
            'message' => 'Security monitoring summary berhasil diambil',
            'data' => [
                'total_login_today' => ActivityLog::where('action', 'login')->where('created_at', '>=', $today)->count(),
                'total_failed_login' => ActivityLog::where('action', 'failed_login')->where('created_at', '>=', $today)->count(),
                'total_activity_today' => ActivityLog::where('created_at', '>=', $today)->count(),
                'unique_ips_today' => ActivityLog::where('created_at', '>=', $today)->whereNotNull('ip_address')->distinct('ip_address')->count('ip_address'),
                'top_user' => $topUser ? [
                    'id' => $topUser->user?->id,
                    'name' => $topUser->user?->name,
                    'email' => $topUser->user?->email,
                    'total' => (int) $topUser->total,
                ] : null,
                'latest_activity' => $latestActivity,
                'suspicious_ips' => $suspiciousIps,
            ],
        ]);
    }

    public function recentLogins(Request $request)
    {
        $limit = min(max((int) $request->query('limit', 10), 1), 50);

        return response()->json([
            'success' => true,
            'message' => 'Recent login berhasil diambil',
            'data' => $this->baseLogQuery()->where('action', 'login')->latest()->take($limit)->get(),
        ]);
    }

    public function suspiciousIps(Request $request)
    {
        $limit = min(max((int) $request->query('limit', 10), 1), 50);

        return response()->json([
            'success' => true,
            'message' => 'Suspicious IP berhasil diambil',
            'data' => $this->suspiciousIpQuery()->take($limit)->get(),
        ]);
    }

    private function baseLogQuery()
    {
        return ActivityLog::with('user');
    }

    private function suspiciousIpQuery()
    {
        return ActivityLog::query()
            ->where('action', 'failed_login')
            ->where('created_at', '>=', now()->subDay())
            ->whereNotNull('ip_address')
            ->selectRaw('ip_address, COUNT(*) as failed_login_count, MAX(created_at) as last_attempt_at')
            ->groupBy('ip_address')
            ->havingRaw('COUNT(*) >= 5')
            ->orderByDesc('failed_login_count');
    }
}
