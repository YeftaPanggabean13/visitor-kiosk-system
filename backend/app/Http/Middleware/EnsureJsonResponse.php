<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EnsureJsonResponse
{
    /**
     * Handle an incoming request and ensure API responses follow the base JSON format.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only enforce for API routes or when client expects JSON
        if (! $request->is('api/*') && ! $request->wantsJson()) {
            return $response;
        }

        $status = method_exists($response, 'status') ? $response->status() : ($response->getStatusCode() ?? 200);

        // Extract content
        $content = null;
        if ($response instanceof JsonResponse) {
            $content = $response->getData(true);
        } elseif (method_exists($response, 'getContent')) {
            $raw = $response->getContent();
            $decoded = json_decode($raw, true);
            $content = $decoded === null ? $raw : $decoded;
        }

        // If already in standard format, return as-is
        if (is_array($content) && array_key_exists('success', $content) && array_key_exists('data', $content) && array_key_exists('message', $content)) {
            return response()->json($content, $status);
        }

        if ($status >= 400) {
            $payload = [
                'success' => false,
                'data' => $content,
                'message' => is_string($content) ? $content : ($content['message'] ?? ''),
            ];
            return response()->json($payload, $status);
        }

        $payload = [
            'success' => true,
            'data' => $content,
            'message' => '',
        ];

        return response()->json($payload, $status);
    }
}
