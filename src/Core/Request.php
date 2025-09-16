<?php
/**
 * Request Class
 * 
 * Handles HTTP request data and provides convenient access methods.
 */

class Request {
    private $method;
    private $path;
    private $headers;
    private $body;
    private $query;
    private $files;
    private $cookies;
    private $session;
    
    public function __construct() {
        $this->method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $this->path = $this->parsePath();
        $this->headers = $this->parseHeaders();
        $this->body = $this->parseBody();
        $this->query = $_GET ?? [];
        $this->files = $_FILES ?? [];
        $this->cookies = $_COOKIE ?? [];
        $this->session = $_SESSION ?? [];
    }
    
    private function parsePath() {
        $path = $_SERVER['REQUEST_URI'] ?? '/';
        
        // Remove query string
        if (($pos = strpos($path, '?')) !== false) {
            $path = substr($path, 0, $pos);
        }
        
        // Remove base path if running in subdirectory
        $scriptName = dirname($_SERVER['SCRIPT_NAME']);
        if ($scriptName !== '/' && strpos($path, $scriptName) === 0) {
            $path = substr($path, strlen($scriptName));
        }
        
        return $path;
    }
    
    private function parseHeaders() {
        $headers = [];
        
        if (function_exists('getallheaders')) {
            $headers = getallheaders();
        } else {
            foreach ($_SERVER as $key => $value) {
                if (strpos($key, 'HTTP_') === 0) {
                    $headerName = str_replace('_', '-', substr($key, 5));
                    $headerName = ucwords(strtolower($headerName), '-');
                    $headers[$headerName] = $value;
                }
            }
        }
        
        return $headers;
    }
    
    private function parseBody() {
        $contentType = $this->getHeader('Content-Type', '');
        
        if (strpos($contentType, 'application/json') !== false) {
            $body = file_get_contents('php://input');
            return json_decode($body, true) ?? [];
        }
        
        if (strpos($contentType, 'application/x-www-form-urlencoded') !== false) {
            return $_POST ?? [];
        }
        
        if (strpos($contentType, 'multipart/form-data') !== false) {
            return $_POST ?? [];
        }
        
        return [];
    }
    
    public function getMethod() {
        return $this->method;
    }
    
    public function getPath() {
        return $this->path;
    }
    
    public function getHeader($name, $default = null) {
        $name = ucwords(strtolower($name), '-');
        return $this->headers[$name] ?? $default;
    }
    
    public function getHeaders() {
        return $this->headers;
    }
    
    public function getBody() {
        return $this->body;
    }
    
    public function get($key, $default = null) {
        return $this->query[$key] ?? $default;
    }
    
    public function post($key, $default = null) {
        return $this->body[$key] ?? $default;
    }
    
    public function input($key, $default = null) {
        return $this->post($key, $this->get($key, $default));
    }
    
    public function all() {
        return array_merge($this->query, $this->body);
    }
    
    public function only($keys) {
        $data = $this->all();
        return array_intersect_key($data, array_flip($keys));
    }
    
    public function except($keys) {
        $data = $this->all();
        return array_diff_key($data, array_flip($keys));
    }
    
    public function has($key) {
        return isset($this->query[$key]) || isset($this->body[$key]);
    }
    
    public function file($key) {
        return $this->files[$key] ?? null;
    }
    
    public function files() {
        return $this->files;
    }
    
    public function cookie($key, $default = null) {
        return $this->cookies[$key] ?? $default;
    }
    
    public function session($key, $default = null) {
        return $this->session[$key] ?? $default;
    }
    
    public function set($key, $value) {
        $this->query[$key] = $value;
        return $this;
    }
    
    public function setSession($key, $value) {
        $_SESSION[$key] = $value;
        $this->session[$key] = $value;
    }
    
    public function removeSession($key) {
        unset($_SESSION[$key]);
        unset($this->session[$key]);
    }
    
    public function getRouteParam($key, $default = null) {
        return $_REQUEST['route_params'][$key] ?? $default;
    }
    
    public function getRouteParams() {
        return $_REQUEST['route_params'] ?? [];
    }
    
    public function isAjax() {
        return $this->getHeader('X-Requested-With') === 'XMLHttpRequest';
    }
    
    public function isJson() {
        $contentType = $this->getHeader('Content-Type', '');
        return strpos($contentType, 'application/json') !== false;
    }
    
    public function expectsJson() {
        $accept = $this->getHeader('Accept', '');
        return strpos($accept, 'application/json') !== false || $this->isAjax();
    }
    
    public function getClientIp() {
        $ipKeys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = $_SERVER[$key];
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
        }
        
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
    
    public function getUserAgent() {
        return $_SERVER['HTTP_USER_AGENT'] ?? '';
    }
    
    public function getReferer() {
        return $_SERVER['HTTP_REFERER'] ?? '';
    }
    
    public function isSecure() {
        return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || 
               $_SERVER['SERVER_PORT'] == 443;
    }
    
    public function getHost() {
        return $_SERVER['HTTP_HOST'] ?? 'localhost';
    }
    
    public function getUrl() {
        $protocol = $this->isSecure() ? 'https' : 'http';
        return $protocol . '://' . $this->getHost() . $this->getPath();
    }
    
    public function getFullUrl() {
        $protocol = $this->isSecure() ? 'https' : 'http';
        return $protocol . '://' . $this->getHost() . $_SERVER['REQUEST_URI'];
    }
    
    public function validate($rules) {
        $validator = new Validator();
        return $validator->validate($this->all(), $rules);
    }
    
    public function sanitize($key, $filter = FILTER_SANITIZE_STRING) {
        $value = $this->input($key);
        return filter_var($value, $filter);
    }
    
    public function sanitizeAll($filter = FILTER_SANITIZE_STRING) {
        $data = $this->all();
        foreach ($data as $key => $value) {
            $data[$key] = filter_var($value, $filter);
        }
        return $data;
    }
}
