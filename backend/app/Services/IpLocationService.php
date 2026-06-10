<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class IpLocationService
{
    public function lookup(?string $ip): array
    {
        if (! $this->isPublicIp($ip)) {
            return ['country' => null, 'city' => null, 'isp' => null];
        }

        try {
            $response = Http::timeout(2)->get("http://ip-api.com/json/{$ip}", [
                'fields' => 'status,country,city,isp',
            ]);

            if (! $response->ok() || $response->json('status') !== 'success') {
                return ['country' => null, 'city' => null, 'isp' => null];
            }

            return [
                'country' => $response->json('country'),
                'city' => $response->json('city'),
                'isp' => $response->json('isp'),
            ];
        } catch (\Throwable $exception) {
            Log::info('IP location lookup failed.', [
                'ip' => $ip,
                'error' => $exception->getMessage(),
            ]);

            return ['country' => null, 'city' => null, 'isp' => null];
        }
    }

    private function isPublicIp(?string $ip): bool
    {
        return is_string($ip) && filter_var(
            $ip,
            FILTER_VALIDATE_IP,
            FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE
        ) !== false;
    }
}
