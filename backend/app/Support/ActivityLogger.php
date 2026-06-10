<?php

namespace App\Support;

use App\Models\ActivityLog;
use App\Services\IpLocationService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class ActivityLogger
{
    public static function log(
        string $action,
        ?Model $model = null,
        ?string $description = null,
        ?Request $request = null,
        ?array $oldValues = null,
        ?array $newValues = null,
        $user = null
    ): void {
        $request ??= request();
        $user ??= $request?->user() ?? Auth::user();

        if (! Schema::hasTable('activity_logs')) {
            return;
        }

        try {
            $ipAddress = self::ipAddress($request);
            $agent = self::parseUserAgent((string) $request?->userAgent());
            $location = app(IpLocationService::class)->lookup($ipAddress);

            ActivityLog::create([
                'user_id' => $user?->id,
                'action' => $action,
                'model_type' => $model ? $model::class : null,
                'model_id' => $model?->getKey(),
                'old_values' => $oldValues,
                'new_values' => $newValues,
                'description' => $description,
                'ip_address' => $ipAddress,
                'user_agent' => $request?->userAgent(),
                'browser' => $agent['browser'],
                'operating_system' => $agent['operating_system'],
                'device_type' => $agent['device_type'],
                'country' => $location['country'],
                'city' => $location['city'],
                'isp' => $location['isp'],
            ]);
        } catch (\Throwable $exception) {
            Log::warning('Activity log failed.', [
                'action' => $action,
                'error' => $exception->getMessage(),
            ]);
        }
    }

    public static function ipAddress(?Request $request = null): ?string
    {
        $request ??= request();

        $ip = $request->headers->get('CF-Connecting-IP')
            ?: $request->headers->get('X-Forwarded-For')
            ?: $request->headers->get('X-Real-IP')
            ?: $request->ip();

        if (! is_string($ip) || trim($ip) === '') {
            return null;
        }

        return trim(explode(',', $ip)[0]);
    }

    public static function parseUserAgent(string $userAgent): array
    {
        $browser = 'Unknown';
        $operatingSystem = 'Unknown';
        $deviceType = 'desktop';

        if (preg_match('/Edg/i', $userAgent)) {
            $browser = 'Microsoft Edge';
        } elseif (preg_match('/Chrome|CriOS/i', $userAgent)) {
            $browser = 'Chrome';
        } elseif (preg_match('/Firefox|FxiOS/i', $userAgent)) {
            $browser = 'Firefox';
        } elseif (preg_match('/Safari/i', $userAgent)) {
            $browser = 'Safari';
        } elseif (preg_match('/MSIE|Trident/i', $userAgent)) {
            $browser = 'Internet Explorer';
        }

        if (preg_match('/Windows NT/i', $userAgent)) {
            $operatingSystem = 'Windows';
        } elseif (preg_match('/Android/i', $userAgent)) {
            $operatingSystem = 'Android';
        } elseif (preg_match('/iPhone|iPad|iPod/i', $userAgent)) {
            $operatingSystem = 'iOS';
        } elseif (preg_match('/Mac OS X|Macintosh/i', $userAgent)) {
            $operatingSystem = 'macOS';
        } elseif (preg_match('/Linux/i', $userAgent)) {
            $operatingSystem = 'Linux';
        }

        if (preg_match('/iPad|Tablet/i', $userAgent)) {
            $deviceType = 'tablet';
        } elseif (preg_match('/Mobile|Android|iPhone|iPod/i', $userAgent)) {
            $deviceType = 'mobile';
        }

        return [
            'browser' => $browser,
            'operating_system' => $operatingSystem,
            'device_type' => $deviceType,
        ];
    }
}
