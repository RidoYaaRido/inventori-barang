<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\ActivityLog;
use Illuminate\Http\Request;

class ActivityLogController
{
    public function index(Request $request)
    {
        $query = ActivityLog::with('user');

        if ($request->has('action')) {
            $query->where('action', $request->get('action'));
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->get('user_id'));
        }

        return response()->json([
            'activity_logs' => $query->latest()->paginate(20),
        ]);
    }

    public function show(ActivityLog $activityLog)
    {
        return response()->json([
            'activity_log' => $activityLog->load('user'),
        ]);
    }
}
