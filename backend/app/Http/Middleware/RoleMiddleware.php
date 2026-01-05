<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Traits\ApiResponse;

class RoleMiddleware
{
    use ApiResponse;

    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return $this->error('Forbidden', 403);
        }

        if (empty($roles)) {
            return $this->error('Forbidden', 403);
        }

        if (! in_array($user->role, $roles, true)) {
            return $this->error('Forbidden', 403);
        }

        return $next($request);
    }
}
