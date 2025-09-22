<?php
/**
 * Validation Middleware
 * 
 * Handles request validation before reaching controllers.
 */

class ValidationMiddleware {
    private $rules;
    private $messages;
    
    public function __construct($rules, $messages = []) {
        $this->rules = $rules;
        $this->messages = $messages;
    }
    
    public function handle(Request $request) {
        $validator = new Validator($request->all(), $this->rules);
        
        if (!empty($this->messages)) {
            $validator->setMessages($this->messages);
        }
        
        if (!$validator->validate()) {
            return Response::validationError($validator->errors());
        }
        
        // Add validated data to request
        $request->setSession('validated_data', $validator->sanitize());
        
        return null; // Continue to next middleware/controller
    }
    
    public static function validate($rules, $messages = []) {
        return new self($rules, $messages);
    }
}
