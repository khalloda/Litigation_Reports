<?php
/**
 * Router Class
 * 
 * Handles HTTP routing and request dispatching.
 */

class Router {
    private $routes = [];
    private $middlewares = [];
    
    public function __construct() {
        $this->routes = [
            'GET' => [],
            'POST' => [],
            'PUT' => [],
            'DELETE' => [],
            'PATCH' => [],
            'OPTIONS' => []
        ];
    }
    
    public function get($path, $handler) {
        $this->addRoute('GET', $path, $handler);
    }
    
    public function post($path, $handler) {
        $this->addRoute('POST', $path, $handler);
    }
    
    public function put($path, $handler) {
        $this->addRoute('PUT', $path, $handler);
    }
    
    public function delete($path, $handler) {
        $this->addRoute('DELETE', $path, $handler);
    }
    
    public function patch($path, $handler) {
        $this->addRoute('PATCH', $path, $handler);
    }
    
    public function options($path, $handler) {
        $this->addRoute('OPTIONS', $path, $handler);
    }
    
    private function addRoute($method, $path, $handler) {
        $this->routes[$method][$path] = $handler;
    }
    
    public function middleware($middleware) {
        $this->middlewares[] = $middleware;
        return $this;
    }
    
    public function handle(Request $request) {
        $method = $request->getMethod();
        $path = $request->getPath();
        
        // Apply middlewares
        foreach ($this->middlewares as $middleware) {
            $response = $middleware->handle($request);
            if ($response !== null) {
                return $response;
            }
        }
        
        // Find matching route
        $handler = $this->findRoute($method, $path);
        
        if ($handler === null) {
            return new Response(['error' => 'Route not found'], 404);
        }
        
        // Execute handler
        return $this->executeHandler($handler, $request);
    }
    
    private function findRoute($method, $path) {
        if (!isset($this->routes[$method])) {
            return null;
        }
        
        // Direct match
        if (isset($this->routes[$method][$path])) {
            return $this->routes[$method][$path];
        }
        
        // Pattern matching for dynamic routes
        foreach ($this->routes[$method] as $route => $handler) {
            if ($this->matchRoute($route, $path)) {
                return $handler;
            }
        }
        
        return null;
    }
    
    private function matchRoute($route, $path) {
        // Convert route pattern to regex
        $pattern = preg_replace('/\{([^}]+)\}/', '([^/]+)', $route);
        $pattern = '#^' . $pattern . '$#';
        
        if (preg_match($pattern, $path, $matches)) {
            // Extract parameters
            preg_match_all('/\{([^}]+)\}/', $route, $paramNames);
            $params = [];
            
            for ($i = 1; $i < count($matches); $i++) {
                $params[$paramNames[1][$i - 1]] = $matches[$i];
            }
            
            // Store parameters in request
            $_REQUEST['route_params'] = $params;
            
            return true;
        }
        
        return false;
    }
    
    private function executeHandler($handler, Request $request) {
        if (is_callable($handler)) {
            return call_user_func($handler, $request);
        }
        
        if (is_string($handler)) {
            // Format: "Controller@method"
            if (strpos($handler, '@') !== false) {
                list($controllerName, $method) = explode('@', $handler);
                
                $controllerClass = $controllerName;
                if (!class_exists($controllerClass)) {
                    throw new Exception("Controller {$controllerClass} not found");
                }
                
                $controller = new $controllerClass();
                
                if (!method_exists($controller, $method)) {
                    throw new Exception("Method {$method} not found in controller {$controllerClass}");
                }
                
                return call_user_func([$controller, $method], $request);
            }
        }
        
        throw new Exception("Invalid route handler");
    }
}
