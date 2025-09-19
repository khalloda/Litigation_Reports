<?php

/**
 * Client Controller
 * 
 * Handles client management operations for litigation system.
 */

class ClientController
{

    public function index(Request $request)
    {
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
            $filters = array_filter($filters, function ($value) {
                return $value !== null && $value !== '';
            });

            $result = Client::getAll($page, $limit, $filters);

            return Response::success($result);
        } catch (Exception $e) {
            error_log("Clients index error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve clients');
        }
    }

    public function options(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $options = [
                'status' => [
                    'active' => 'Active',
                    'inactive' => 'Inactive',
                    'disabled' => 'Disabled'
                ],
                'type' => [
                    'individual' => 'Individual',
                    'company' => 'Company'
                ],
                'cash_pro_bono' => [
                    'cash' => 'Cash',
                    'probono' => 'Pro Bono'
                ]
            ];

            return Response::success($options);
        } catch (Exception $e) {
            error_log("Client options error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve client options');
        }
    }

    public function show(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $id = $request->getRouteParam('id');
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

    public function store(Request $request)
    {
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
                'client_name_ar',
                'client_name_en',
                'client_type',
                'cash_pro_bono',
                'status',
                'contact_lawyer',
                'client_start_date',
                'client_end_date',
                'phone',
                'email',
                'address_ar',
                'address_en',
                'notes_ar',
                'notes_en'
            ]);

            // Handle logo file upload
            $logoFile = $request->file('logo_file');
            if ($logoFile && $logoFile['error'] === UPLOAD_ERR_OK) {
                // Validate file type
                $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mimeType = finfo_file($finfo, $logoFile['tmp_name']);
                finfo_close($finfo);

                if (!in_array($mimeType, $allowedTypes)) {
                    return Response::validationError(['logo_file' => ['File must be a valid image (JPEG, PNG, GIF, WebP)']]);
                }

                // Validate file extension
                $fileExtension = strtolower(pathinfo($logoFile['name'], PATHINFO_EXTENSION));
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                if (!in_array($fileExtension, $allowedExtensions)) {
                    return Response::validationError(['logo_file' => ['Invalid file extension. Allowed: JPG, PNG, GIF, WebP']]);
                }

                // Validate file size (max 5MB)
                if ($logoFile['size'] > 5 * 1024 * 1024) {
                    return Response::validationError(['logo_file' => ['File size must be less than 5MB']]);
                }

                $uploadDir = '../uploads/logos/';
                if (!is_dir($uploadDir)) {
                    if (!mkdir($uploadDir, 0755, true)) {
                        return Response::serverError('Failed to create upload directory');
                    }
                }

                // Check if directory is writable
                if (!is_writable($uploadDir)) {
                    return Response::serverError('Upload directory is not writable');
                }

                $fileName = 'client_' . time() . '_' . uniqid() . '.' . $fileExtension;
                $filePath = $uploadDir . $fileName;

                // Validate filename length
                if (strlen($fileName) > 255) {
                    return Response::serverError('Generated filename too long');
                }

                if (!move_uploaded_file($logoFile['tmp_name'], $filePath)) {
                    return Response::serverError('Failed to save uploaded file');
                }

                $data['logo'] = $fileName;
            }

            $clientId = Client::create($data);

            // Get the created client
            $client = Client::findById($clientId);

            return Response::success($client, 'Client created successfully', 201);
        } catch (Exception $e) {
            error_log("Client store error: " . $e->getMessage());
            return Response::serverError('Failed to create client');
        }
    }

    public function update(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $id = $request->getRouteParam('id');
            if (!$id) {
                return Response::error('Client ID is required', 400);
            }

            // Debug logging
            error_log("Update request for client ID: " . $id);
            error_log("Request method: " . $request->getMethod());
            error_log("Request data: " . json_encode($request->all()));
            error_log("Request files: " . json_encode($request->files()));


            // Check if client exists
            $existingClient = Client::findById($id);
            if (!$existingClient) {
                return Response::notFound('Client not found');
            }

            // Validate input - for updates, only validate provided fields
            $validationRules = [];
            $requestData = $request->all();

            // Only add validation rules for fields that are actually provided
            if (isset($requestData['client_name_ar'])) {
                $validationRules['client_name_ar'] = 'min:2|max:200';
            }
            if (isset($requestData['client_name_en'])) {
                $validationRules['client_name_en'] = 'min:2|max:200';
            }
            if (isset($requestData['client_type'])) {
                $validationRules['client_type'] = 'in:individual,company';
            }
            if (isset($requestData['cash_pro_bono'])) {
                $validationRules['cash_pro_bono'] = 'in:cash,probono';
            }
            if (isset($requestData['status'])) {
                $validationRules['status'] = 'in:active,disabled,inactive';
            }
            if (isset($requestData['email'])) {
                $validationRules['email'] = 'email|max:200';
            }
            if (isset($requestData['phone'])) {
                $validationRules['phone'] = 'max:50';
            }
            if (isset($requestData['address_ar'])) {
                $validationRules['address_ar'] = 'max:500';
            }
            if (isset($requestData['address_en'])) {
                $validationRules['address_en'] = 'max:500';
            }
            if (isset($requestData['notes_ar'])) {
                $validationRules['notes_ar'] = 'max:1000';
            }
            if (isset($requestData['notes_en'])) {
                $validationRules['notes_en'] = 'max:1000';
            }
            if (isset($requestData['contact_lawyer'])) {
                $validationRules['contact_lawyer'] = 'min:1|max:200';
            }

            $validator = new Validator($requestData, $validationRules);

            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }

            $data = $request->only([
                'client_name_ar',
                'client_name_en',
                'client_type',
                'cash_pro_bono',
                'status',
                'contact_lawyer',
                'client_start_date',
                'client_end_date',
                'phone',
                'email',
                'address_ar',
                'address_en',
                'notes_ar',
                'notes_en'
            ]);

            // Handle logo file upload
            $logoFile = $request->file('logo_file');
            if ($logoFile && $logoFile['error'] === UPLOAD_ERR_OK) {
                // Validate file type
                $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
                $finfo = finfo_open(FILEINFO_MIME_TYPE);
                $mimeType = finfo_file($finfo, $logoFile['tmp_name']);
                finfo_close($finfo);

                if (!in_array($mimeType, $allowedTypes)) {
                    return Response::validationError(['logo_file' => ['File must be a valid image (JPEG, PNG, GIF, WebP)']]);
                }

                // Validate file extension
                $fileExtension = strtolower(pathinfo($logoFile['name'], PATHINFO_EXTENSION));
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
                if (!in_array($fileExtension, $allowedExtensions)) {
                    return Response::validationError(['logo_file' => ['Invalid file extension. Allowed: JPG, PNG, GIF, WebP']]);
                }

                // Validate file size (max 5MB)
                if ($logoFile['size'] > 5 * 1024 * 1024) {
                    return Response::validationError(['logo_file' => ['File size must be less than 5MB']]);
                }

                $uploadDir = '../uploads/logos/';
                if (!is_dir($uploadDir)) {
                    if (!mkdir($uploadDir, 0755, true)) {
                        return Response::serverError('Failed to create upload directory');
                    }
                }

                // Check if directory is writable
                if (!is_writable($uploadDir)) {
                    return Response::serverError('Upload directory is not writable');
                }

                $fileName = 'client_' . time() . '_' . uniqid() . '.' . $fileExtension;
                $filePath = $uploadDir . $fileName;

                // Validate filename length
                if (strlen($fileName) > 255) {
                    return Response::serverError('Generated filename too long');
                }

                if (!move_uploaded_file($logoFile['tmp_name'], $filePath)) {
                    return Response::serverError('Failed to save uploaded file');
                }

                $data['logo'] = $fileName;

                // Delete old logo file if it exists
                if (!empty($existingClient['logo'])) {
                    $oldFilePath = $uploadDir . $existingClient['logo'];
                    if (file_exists($oldFilePath)) {
                        if (!unlink($oldFilePath)) {
                            error_log("Failed to delete old logo file: " . $oldFilePath);
                        }
                    }
                }
            }

            // Remove empty values
            $data = array_filter($data, function ($value) {
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
            error_log("Client update error trace: " . $e->getTraceAsString());
            return Response::serverError('Failed to update client: ' . $e->getMessage());
        }
    }

    public function destroy(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $id = $request->getRouteParam('id');
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

    public function stats(Request $request)
    {
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

    public function search(Request $request)
    {
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

    public function byLawyer(Request $request)
    {
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

    public function active(Request $request)
    {
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


    public function forSelect(Request $request)
    {
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
