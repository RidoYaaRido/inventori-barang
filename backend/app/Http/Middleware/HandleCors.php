<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\HandleCors as BaseHandleCors;

class HandleCors extends BaseHandleCors
{
    protected $methods = [
        'GET',
        'HEAD',
        'POST',
        'PUT',
        'DELETE',
        'PATCH',
        'OPTIONS',
    ];
}
