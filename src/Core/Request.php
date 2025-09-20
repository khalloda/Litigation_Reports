<?php

/**
 * Request Class
 * 
 * Handles HTTP request data and provides convenient access methods.
 */

class Request
{
    private $method;
    private $path;
    private $headers;
    private $body;
    private $query;
    private $files;
    private $cookies;
    private $session;
    private $routeParams = [];

    public function __construct()
    {
        $this->method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $this->path = $this->parsePath();
        $this->headers = $this->parseHeaders();
        $this->body = $this->parseBody();
        $this->query = $_GET ?? [];
        $this->files = $this->parseFiles();
        $this->cookies = $_COOKIE ?? [];
        $this->session = $_SESSION ?? [];
    }

    private function parsePath()
    {
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

        // Special case: if we're in the /api/ directory, keep the /api prefix
        if ($scriptName === '/api' && strpos($path, '/api') !== 0) {
            $path = '/api' . $path;
        }

        return $path;
    }

    private function parseHeaders()
    {
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

    private function parseBody()
    {
        $contentType = $this->getHeader('Content-Type', '');
        $method = $this->getMethod();

        if (strpos($contentType, 'application/json') !== false) {
            $body = file_get_contents('php://input');
            return json_decode($body, true) ?? [];
        }

        if (strpos($contentType, 'application/x-www-form-urlencoded') !== false) {
            // For PUT requests, $_POST is not populated, so we need to parse the raw input
            if ($method === 'PUT') {
                $body = file_get_contents('php://input');
                parse_str($body, $parsed);
                return $parsed ?? [];
            }
            return $_POST ?? [];
        }

        if (strpos($contentType, 'multipart/form-data') !== false) {
            // For PUT requests with multipart/form-data, $_POST is not populated
            // We need to handle this differently
            if ($method === 'PUT') {
                // For multipart/form-data PUT requests, we need to parse the raw input
                // This is complex, so we'll use a different approach
                return $this->parseMultipartPutData();
            }
            return $_POST ?? [];
        }

        return [];
    }

    private function parseMultipartPutData()
    {
        // For multipart/form-data PUT requests, $_POST and $_FILES might still be populated
        // depending on the server configuration

        // Try to get data from $_POST first
        $postData = $_POST ?? [];

        // Log debug information
        error_log("PUT request multipart data - POST: " . json_encode($postData));
        error_log("PUT request multipart data - FILES: " . json_encode($_FILES ?? []));
        error_log("PUT request content type: " . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));

        // If we have POST data, use it
        if (!empty($postData)) {
            return $postData;
        }

        // If no POST data but we have FILES, try to get form data from the raw input
        $input = file_get_contents('php://input');
        error_log("PUT request raw input length: " . strlen($input));

        // Try to parse the raw multipart data (simplified approach)
        // This is a basic implementation - in production you might want a more robust parser
        $boundary = $this->getBoundaryFromContentType();
        if ($boundary) {
            $parsed = $this->parseMultipartData($input, $boundary);
            error_log("Parsed multipart data: " . json_encode($parsed));
            return $parsed;
        }

        return [];
    }

    private function getBoundaryFromContentType()
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (preg_match('/boundary=(.+)$/', $contentType, $matches)) {
            return '--' . $matches[1];
        }
        return null;
    }

    private function parseMultipartData($input, $boundary)
    {
        $data = [];
        $parts = explode($boundary, $input);

        foreach ($parts as $part) {
            if (trim($part) === '' || trim($part) === '--') {
                continue;
            }

            $sections = explode("\r\n\r\n", $part, 2);
            if (count($sections) !== 2) {
                continue;
            }

            $headers = $sections[0];
            $content = trim($sections[1], "\r\n");

            // Parse the Content-Disposition header to get the field name
            if (preg_match('/name="([^"]+)"/', $headers, $matches)) {
                $fieldName = $matches[1];

                // Check if this is a file field
                if (strpos($headers, 'filename=') !== false) {
                    // This is a file field - we'll handle it in the files array
                    continue;
                } else {
                    // This is a regular form field
                    $data[$fieldName] = $content;
                }
            }
        }

        return $data;
    }

    private function parseFiles()
    {
        $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        // For GET requests or non-multipart requests, return $_FILES
        if ($method !== 'PUT' || strpos($contentType, 'multipart/form-data') === false) {
            return $_FILES ?? [];
        }

        // For PUT requests with multipart data, $_FILES might still be populated
        // Log the files information for debugging
        error_log("PUT request FILES data: " . json_encode($_FILES ?? []));

        return $_FILES ?? [];
    }

    public function getMethod()
    {
        return $this->method;
    }

    public function getPath()
    {
        return $this->path;
    }

    public function getHeader($name, $default = null)
    {
        $name = ucwords(strtolower($name), '-');
        return $this->headers[$name] ?? $default;
    }

    public function getHeaders()
    {
        return $this->headers;
    }

    public function getBody()
    {
        return $this->body;
    }

    public function get($key, $default = null)
    {
        return $this->query[$key] ?? $default;
    }

    public function post($key, $default = null)
    {
        return $this->body[$key] ?? $default;
    }

    public function input($key, $default = null)
    {
        return $this->post($key, $this->get($key, $default));
    }

    public function all()
    {
        return array_merge($this->query, $this->body);
    }

    public function only($keys)
    {
        $data = $this->all();
        return array_intersect_key($data, array_flip($keys));
    }

    public function except($keys)
    {
        $data = $this->all();
        return array_diff_key($data, array_flip($keys));
    }

    public function has($key)
    {
        return isset($this->query[$key]) || isset($this->body[$key]);
    }

    public function file($key)
    {
        return $this->files[$key] ?? null;
    }

    public function files()
    {
        return $this->files;
    }

    public function cookie($key, $default = null)
    {
        return $this->cookies[$key] ?? $default;
    }

    public function session($key, $default = null)
    {
        return $this->session[$key] ?? $default;
    }

    public function set($key, $value)
    {
        $this->query[$key] = $value;
        return $this;
    }

    public function setSession($key, $value)
    {
        $_SESSION[$key] = $value;
        $this->session[$key] = $value;
    }

    public function removeSession($key)
    {
        unset($_SESSION[$key]);
        unset($this->session[$key]);
    }

    public function setRouteParams($params)
    {
        $this->routeParams = $params;
    }

    public function getRouteParam($key, $default = null)
    {
        return $this->routeParams[$key] ?? $default;
    }

    public function getRouteParams()
    {
        return $this->routeParams;
    }

    public function isAjax()
    {
        return $this->getHeader('X-Requested-With') === 'XMLHttpRequest';
    }

    public function isJson()
    {
        $contentType = $this->getHeader('Content-Type', '');
        return strpos($contentType, 'application/json') !== false;
    }

    public function expectsJson()
    {
        $accept = $this->getHeader('Accept', '');
        return strpos($accept, 'application/json') !== false || $this->isAjax();
    }

    public function getClientIp()
    {
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

    public function getUserAgent()
    {
        return $_SERVER['HTTP_USER_AGENT'] ?? '';
    }

    public function getReferer()
    {
        return $_SERVER['HTTP_REFERER'] ?? '';
    }

    public function isSecure()
    {
        return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ||
            $_SERVER['SERVER_PORT'] == 443;
    }

    public function getHost()
    {
        return $_SERVER['HTTP_HOST'] ?? 'localhost';
    }

    public function getUrl()
    {
        $protocol = $this->isSecure() ? 'https' : 'http';
        return $protocol . '://' . $this->getHost() . $this->getPath();
    }

    public function getFullUrl()
    {
        $protocol = $this->isSecure() ? 'https' : 'http';
        return $protocol . '://' . $this->getHost() . $_SERVER['REQUEST_URI'];
    }

    public function validate($rules)
    {
        $validator = new Validator();
        return $validator->validate($this->all(), $rules);
    }

    public function sanitize($key, $filter = FILTER_SANITIZE_STRING)
    {
        $value = $this->input($key);
        return filter_var($value, $filter);
    }

    public function sanitizeAll($filter = FILTER_SANITIZE_STRING)
    {
        $data = $this->all();
        foreach ($data as $key => $value) {
            $data[$key] = filter_var($value, $filter);
        }
        return $data;
    }
}
