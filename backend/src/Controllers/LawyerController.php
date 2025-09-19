<?php
/**
 * Lawyer Controller
 *
 * Handles lawyer management operations.
 */

class LawyerController {

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
                'search' => $request->get('search'),
                'is_active' => $request->get('is_active')
            ];

            // Remove empty filters
            $filters = array_filter($filters, function($value) {
                return $value !== null && $value !== '';
            });

            $result = Lawyer::getAll($page, $limit, $filters);

            return Response::success($result);

        } catch (Exception $e) {
            error_log("Lawyers index error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve lawyers');
        }
    }

    public function show(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $id = $request->getRouteParam('id');
            if (!$id) {
                return Response::error('Lawyer ID is required', 400);
            }

            $lawyer = Lawyer::findById($id);
            if (!$lawyer) {
                return Response::notFound('Lawyer not found');
            }

            return Response::success($lawyer);

        } catch (Exception $e) {
            error_log("Lawyer show error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve lawyer');
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
                'lawyer_name_ar' => 'required|min:2|max:100',
                'lawyer_name_en' => 'max:100',
                'lawyer_email' => 'email|max:100'
            ]);

            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }

            $data = $request->only([
                'lawyer_name_ar', 'lawyer_name_en', 'lawyer_email', 'is_active'
            ]);

            $lawyerId = Lawyer::create($data);

            // Get the created lawyer
            $lawyer = Lawyer::findById($lawyerId);

            return Response::success($lawyer, 'Lawyer created successfully', 201);

        } catch (Exception $e) {
            error_log("Lawyer store error: " . $e->getMessage());
            return Response::serverError('Failed to create lawyer');
        }
    }

    public function update(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $id = $request->getRouteParam('id');
            if (!$id) {
                return Response::error('Lawyer ID is required', 400);
            }

            // Check if lawyer exists
            $existingLawyer = Lawyer::findById($id);
            if (!$existingLawyer) {
                return Response::notFound('Lawyer not found');
            }

            // Validate input - for updates, only validate provided fields
            $validationRules = [];
            $requestData = $request->all();

            // Only add validation rules for fields that are actually provided
            if (isset($requestData['lawyer_name_ar'])) {
                $validationRules['lawyer_name_ar'] = 'min:2|max:100';
            }
            if (isset($requestData['lawyer_name_en'])) {
                $validationRules['lawyer_name_en'] = 'max:100';
            }
            if (isset($requestData['lawyer_email'])) {
                $validationRules['lawyer_email'] = 'email|max:100';
            }

            $validator = new Validator($requestData, $validationRules);

            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }

            $data = $request->only([
                'lawyer_name_ar', 'lawyer_name_en', 'lawyer_email', 'is_active'
            ]);

            // Remove empty values
            $data = array_filter($data, function($value) {
                return $value !== null && $value !== '';
            });

            if (empty($data)) {
                return Response::error('No data provided for update', 400);
            }

            Lawyer::update($id, $data);

            // Get the updated lawyer
            $lawyer = Lawyer::findById($id);

            return Response::success($lawyer, 'Lawyer updated successfully');

        } catch (Exception $e) {
            error_log("Lawyer update error: " . $e->getMessage());
            return Response::serverError('Failed to update lawyer');
        }
    }

    public function destroy(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $id = $request->getRouteParam('id');
            if (!$id) {
                return Response::error('Lawyer ID is required', 400);
            }

            // Check if lawyer exists
            $lawyer = Lawyer::findById($id);
            if (!$lawyer) {
                return Response::notFound('Lawyer not found');
            }

            Lawyer::delete($id);

            return Response::success(null, 'Lawyer deleted successfully');

        } catch (Exception $e) {
            error_log("Lawyer destroy error: " . $e->getMessage());
            return Response::serverError('Failed to delete lawyer');
        }
    }

    public function stats(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $stats = Lawyer::getStats();

            return Response::success($stats);

        } catch (Exception $e) {
            error_log("Lawyer stats error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve lawyer statistics');
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

            $result = Lawyer::search($searchTerm, $page, $limit);

            return Response::success($result);

        } catch (Exception $e) {
            error_log("Lawyer search error: " . $e->getMessage());
            return Response::serverError('Failed to search lawyers');
        }
    }

    public function active(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $lawyers = Lawyer::getActiveLawyers();

            return Response::success($lawyers);

        } catch (Exception $e) {
            error_log("Active lawyers error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve active lawyers');
        }
    }
}