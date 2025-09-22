<?php
/**
 * CORS Middleware
 * 
 * Handles Cross-Origin Resource Sharing headers.
 */

class CorsMiddleware {
    private $allowedOrigins;
    private $allowedMethods;
    private $allowedHeaders;
    private $maxAge;
    
    public function __construct($options = []) {
        $this->allowedOrigins = $options['origins'] ?? ['*'];
        $this->allowedMethods = $options['methods'] ?? ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
        $this->allowedHeaders = $options['headers'] ?? ['Content-Type', 'Authorization', 'X-Requested-With'];
        $this->maxAge = $options['maxAge'] ?? 86400;
    }
    
    public function handle(Request $request) {
        $origin = $request->getHeader('Origin');
        
        // Check if origin is allowed
        if ($this->isOriginAllowed($origin)) {
            header("Access-Control-Allow-Origin: {$origin}");
        }
        
        // Set CORS headers
        header('Access-Control-Allow-Methods: ' . implode(', ', $this->allowedMethods));
        header('Access-Control-Allow-Headers: ' . implode(', ', $this->allowedHeaders));
        header('Access-Control-Max-Age: ' . $this->maxAge);
        header('Access-Control-Allow-Credentials: true');
        
        // Handle preflight requests
        if ($request->getMethod() === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
        
        return null; // Continue to next middleware/controller
    }
    
    private function isOriginAllowed($origin) {
        if (in_array('*', $this->allowedOrigins)) {
            return true;
        }
        
        return in_array($origin, $this->allowedOrigins);
    }
}
