<?php
/**
 * Client Controller
 * 
 * Handles client management operations for litigation system.
 */

class ClientController {
    
    public function index(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            // Get query parameters
            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);
            $filters = [
                'status' => $request->get('status'),
                'type' => $request->get('type'),
                'cash_pro_bono' => $request->get('cash_pro_bono'),
                'search' => $request->get('search')
            ];
            
            // Remove empty filters
            $filters = array_filter($filters, function($value) {
                return $value !== null && $value !== '';
            });
            
            $result = Client::getAll($page, $limit, $filters);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Clients index error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve clients');
        }
    }
    
    public function show(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $id = $request->get('id');
            if (!$id) {
                return Response::error('Client ID is required', 400);
            }
            
            $client = Client::findById($id);
            if (!$client) {
                return Response::notFound('Client not found');
            }
            
            return Response::success($client);
            
        } catch (Exception $e) {
            error_log("Client show error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve client');
        }
    }
    
    public function store(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            // Validate input
            $validator = new Validator($request->all(), [
                'client_name_ar' => 'required|min:2|max:200',
                'client_name_en' => 'min:2|max:200',
                'client_type' => 'required|in:individual,company',
                'cash_pro_bono' => 'required|in:cash,probono',
                'status' => 'in:active,disabled,inactive',
                'email' => 'email|max:200',
                'phone' => 'max:50',
                'address_ar' => 'max:500',
                'address_en' => 'max:500',
                'notes_ar' => 'max:1000',
                'notes_en' => 'max:1000',
                'contact_lawyer' => 'max:200'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $data = $request->only([
                'client_name_ar', 'client_name_en', 'client_type', 'cash_pro_bono',
                'status', 'logo', 'contact_lawyer', 'client_start_date', 'client_end_date',
                'phone', 'email', 'address_ar', 'address_en', 'notes_ar', 'notes_en'
            ]);
            
            $clientId = Client::create($data);
            
            // Get the created client
            $client = Client::findById($clientId);
            
            return Response::success($client, 'Client created successfully', 201);
            
        } catch (Exception $e) {
            error_log("Client store error: " . $e->getMessage());
            return Response::serverError('Failed to create client');
        }
    }
    
    public function update(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $id = $request->get('id');
            if (!$id) {
                return Response::error('Client ID is required', 400);
            }
            
            // Check if client exists
            $existingClient = Client::findById($id);
            if (!$existingClient) {
                return Response::notFound('Client not found');
            }
            
            // Validate input
            $validator = new Validator($request->all(), [
                'client_name_ar' => 'min:2|max:200',
                'client_name_en' => 'min:2|max:200',
                'client_type' => 'in:individual,company',
                'cash_pro_bono' => 'in:cash,probono',
                'status' => 'in:active,disabled,inactive'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $data = $request->only([
                'client_name_ar', 'client_name_en', 'client_type', 'cash_pro_bono',
                'status', 'logo', 'contact_lawyer', 'client_start_date', 'client_end_date',
                'phone', 'email', 'address_ar', 'address_en', 'notes_ar', 'notes_en'
            ]);
            
            // Remove empty values
            $data = array_filter($data, function($value) {
                return $value !== null && $value !== '';
            });
            
            if (empty($data)) {
                return Response::error('No data provided for update', 400);
            }
            
            Client::update($id, $data);
            
            // Get the updated client
            $client = Client::findById($id);
            
            return Response::success($client, 'Client updated successfully');
            
        } catch (Exception $e) {
            error_log("Client update error: " . $e->getMessage());
            return Response::serverError('Failed to update client');
        }
    }
    
    public function destroy(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $id = $request->get('id');
            if (!$id) {
                return Response::error('Client ID is required', 400);
            }
            
            // Check if client exists
            $client = Client::findById($id);
            if (!$client) {
                return Response::notFound('Client not found');
            }
            
            Client::delete($id);
            
            return Response::success(null, 'Client deleted successfully');
            
        } catch (Exception $e) {
            error_log("Client destroy error: " . $e->getMessage());
            if (strpos($e->getMessage(), 'Cannot delete client with existing cases') !== false) {
                return Response::error('Cannot delete client with existing cases', 400);
            }
            return Response::serverError('Failed to delete client');
        }
    }
    
    public function stats(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $stats = Client::getStats();
            
            return Response::success($stats);
            
        } catch (Exception $e) {
            error_log("Client stats error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve client statistics');
        }
    }
    
    public function search(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $searchTerm = $request->get('q');
            if (!$searchTerm) {
                return Response::error('Search term is required', 400);
            }
            
            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);
            
            $result = Client::search($searchTerm, $page, $limit);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Client search error: " . $e->getMessage());
            return Response::serverError('Failed to search clients');
        }
    }
    
    public function byLawyer(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $lawyerName = $request->get('lawyer');
            if (!$lawyerName) {
                return Response::error('Lawyer name is required', 400);
            }
            
            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);
            
            $result = Client::getByLawyer($lawyerName, $page, $limit);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Client by lawyer error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve lawyer clients');
        }
    }
    
    public function active(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);
            
            $result = Client::getActiveClients($page, $limit);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Active clients error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve active clients');
        }
    }
    
    public function options(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $options = [
                'status' => Client::getStatusOptions(),
                'type' => Client::getTypeOptions(),
                'cash_pro_bono' => Client::getCashProBonoOptions()
            ];
            
            return Response::success($options);
            
        } catch (Exception $e) {
            error_log("Client options error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve client options');
        }
    }
    
    public function forSelect(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $clients = Client::getClientsForSelect();
            
            return Response::success($clients);
            
        } catch (Exception $e) {
            error_log("Client for select error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve clients for select');
        }
    }
}
