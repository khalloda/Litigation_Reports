<?php
/**
 * Response Class
 * 
 * Handles HTTP response formatting and sending.
 */

class Response {
    private $data;
    private $statusCode;
    private $headers;
    
    public function __construct($data = null, $statusCode = 200, $headers = []) {
        $this->data = $data;
        $this->statusCode = $statusCode;
        $this->headers = array_merge([
            'Content-Type' => 'application/json; charset=utf-8',
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'DENY',
            'X-XSS-Protection' => '1; mode=block'
        ], $headers);
    }
    
    public function setData($data) {
        $this->data = $data;
        return $this;
    }
    
    public function setStatusCode($statusCode) {
        $this->statusCode = $statusCode;
        return $this;
    }
    
    public function setHeader($name, $value) {
        $this->headers[$name] = $value;
        return $this;
    }
    
    public function setHeaders($headers) {
        $this->headers = array_merge($this->headers, $headers);
        return $this;
    }
    
    public function getData() {
        return $this->data;
    }
    
    public function getStatusCode() {
        return $this->statusCode;
    }
    
    public function getHeaders() {
        return $this->headers;
    }
    
    public function send() {
        // Set status code
        http_response_code($this->statusCode);
        
        // Set headers
        foreach ($this->headers as $name => $value) {
            header("{$name}: {$value}");
        }
        
        // Send response body
        if ($this->data !== null) {
            if (is_array($this->data) || is_object($this->data)) {
                echo json_encode($this->data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
            } else {
                echo $this->data;
            }
        }
        
        exit();
    }
    
    public static function success($data = null, $message = null, $statusCode = 200) {
        $response = [
            'success' => true,
            'data' => $data
        ];
        
        if ($message !== null) {
            $response['message'] = $message;
        }
        
        return new self($response, $statusCode);
    }
    
    public static function error($message, $statusCode = 400, $errors = null) {
        $response = [
            'success' => false,
            'error' => true,
            'message' => $message
        ];
        
        if ($errors !== null) {
            $response['errors'] = $errors;
        }
        
        return new self($response, $statusCode);
    }
    
    public static function validationError($errors, $message = 'Validation failed') {
        return self::error($message, 422, $errors);
    }
    
    public static function unauthorized($message = 'Unauthorized') {
        return self::error($message, 401);
    }
    
    public static function forbidden($message = 'Forbidden') {
        return self::error($message, 403);
    }
    
    public static function notFound($message = 'Not found') {
        return self::error($message, 404);
    }
    
    public static function methodNotAllowed($message = 'Method not allowed') {
        return self::error($message, 405);
    }
    
    public static function serverError($message = 'Internal server error') {
        return self::error($message, 500);
    }
    
    public static function created($data = null, $message = 'Created successfully') {
        return self::success($data, $message, 201);
    }
    
    public static function updated($data = null, $message = 'Updated successfully') {
        return self::success($data, $message, 200);
    }
    
    public static function deleted($message = 'Deleted successfully') {
        return self::success(null, $message, 200);
    }
    
    public static function paginated($data, $pagination, $message = null) {
        $response = [
            'success' => true,
            'data' => $data,
            'pagination' => $pagination
        ];
        
        if ($message !== null) {
            $response['message'] = $message;
        }
        
        return new self($response, 200);
    }
    
    public static function file($filePath, $filename = null, $contentType = null) {
        if (!file_exists($filePath)) {
            return self::notFound('File not found');
        }
        
        if ($filename === null) {
            $filename = basename($filePath);
        }
        
        if ($contentType === null) {
            $contentType = mime_content_type($filePath);
        }
        
        $headers = [
            'Content-Type' => $contentType,
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Content-Length' => filesize($filePath)
        ];
        
        return new FileResponse($filePath, $headers);
    }
    
    public static function redirect($url, $statusCode = 302) {
        $headers = [
            'Location' => $url
        ];
        
        return new self(null, $statusCode, $headers);
    }
    
    public static function json($data, $statusCode = 200) {
        return new self($data, $statusCode, [
            'Content-Type' => 'application/json; charset=utf-8'
        ]);
    }
    
    public static function html($html, $statusCode = 200) {
        return new self($html, $statusCode, [
            'Content-Type' => 'text/html; charset=utf-8'
        ]);
    }
    
    public static function xml($xml, $statusCode = 200) {
        return new self($xml, $statusCode, [
            'Content-Type' => 'application/xml; charset=utf-8'
        ]);
    }
    
    public static function csv($data, $filename = 'export.csv', $statusCode = 200) {
        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"'
        ];
        
        return new self($data, $statusCode, $headers);
    }
    
    public static function pdf($pdfData, $filename = 'document.pdf', $statusCode = 200) {
        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Content-Length' => strlen($pdfData)
        ];
        
        return new self($pdfData, $statusCode, $headers);
    }
    
    // Helper method to add CORS headers
    public function withCors($origin = '*', $methods = 'GET, POST, PUT, DELETE, OPTIONS', $headers = 'Content-Type, Authorization, X-Requested-With') {
        $this->headers['Access-Control-Allow-Origin'] = $origin;
        $this->headers['Access-Control-Allow-Methods'] = $methods;
        $this->headers['Access-Control-Allow-Headers'] = $headers;
        $this->headers['Access-Control-Max-Age'] = '86400';
        
        return $this;
    }
    
    // Helper method to add cache headers
    public function withCache($maxAge = 3600, $public = true) {
        $cacheControl = $public ? 'public' : 'private';
        $cacheControl .= ', max-age=' . $maxAge;
        
        $this->headers['Cache-Control'] = $cacheControl;
        $this->headers['Expires'] = gmdate('D, d M Y H:i:s', time() + $maxAge) . ' GMT';
        
        return $this;
    }
    
    // Helper method to add security headers
    public function withSecurity() {
        $this->headers['X-Content-Type-Options'] = 'nosniff';
        $this->headers['X-Frame-Options'] = 'DENY';
        $this->headers['X-XSS-Protection'] = '1; mode=block';
        $this->headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
        $this->headers['Content-Security-Policy'] = "default-src 'self'";
        
        return $this;
    }
}

/**
 * FileResponse Class
 * 
 * Specialized response class for file downloads.
 */
class FileResponse extends Response {
    private $filePath;
    
    public function __construct($filePath, $headers = []) {
        parent::__construct(null, 200, $headers);
        $this->filePath = $filePath;
    }
    
    public function send() {
        // Set status code
        http_response_code($this->getStatusCode());
        
        // Set headers
        foreach ($this->getHeaders() as $name => $value) {
            header("{$name}: {$value}");
        }
        
        // Send file content
        readfile($this->filePath);
        exit();
    }
}
