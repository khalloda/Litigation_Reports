<?php
/**
 * Case Controller
 * 
 * Handles case management operations for litigation system.
 */

class CaseController {
    
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
                'client_id' => $request->get('client_id'),
                'lawyer' => $request->get('lawyer'),
                'category' => $request->get('category'),
                'search' => $request->get('search')
            ];
            
            // Remove empty filters
            $filters = array_filter($filters, function($value) {
                return $value !== null && $value !== '';
            });
            
            $result = CaseModel::getAll($page, $limit, $filters);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Cases index error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve cases');
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
                return Response::error('Case ID is required', 400);
            }
            
            $case = CaseModel::findById($id);
            if (!$case) {
                return Response::notFound('Case not found');
            }
            
            return Response::success($case);
            
        } catch (Exception $e) {
            error_log("Case show error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve case');
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
                'client_id' => 'required|integer',
                'matter_ar' => 'required|min:3|max:500',
                'matter_en' => 'required|min:3|max:500',
                'matter_subject' => 'required|min:10',
                'matter_status' => 'required|in:active,pending,completed,cancelled,on_hold,appealed',
                'matter_category' => 'required|in:civil,commercial,criminal,administrative,labor,family,real_estate,intellectual_property',
                'matter_importance' => 'required|in:low,medium,high,critical'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $data = $request->only([
                'client_id', 'matter_ar', 'matter_en', 'matter_subject',
                'matter_status', 'matter_category', 'matter_importance',
                'client_capacity', 'opponent_capacity', 'matter_degree',
                'matter_start_date', 'matter_end_date', 'circuit_secretary',
                'matter_asked_amount', 'matter_judged_amount', 'client_branch',
                'matter_shelf', 'court_floor', 'court_hall', 'secretary_room',
                'matter_court', 'matter_circuit', 'matter_destination',
                'matter_select', 'matter_partner', 'matter_notes1', 'matter_notes2',
                'lawyer_a', 'lawyer_b', 'matter_evaluation', 'financial_allocation',
                'work_team_id', 'contract_id'
            ]);
            
            $caseId = CaseModel::create($data);
            
            // Get the created case
            $case = CaseModel::findById($caseId);
            
            return Response::success($case, 'Case created successfully', 201);
            
        } catch (Exception $e) {
            error_log("Case store error: " . $e->getMessage());
            return Response::serverError('Failed to create case');
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
                return Response::error('Case ID is required', 400);
            }
            
            // Check if case exists
            $existingCase = CaseModel::findById($id);
            if (!$existingCase) {
                return Response::notFound('Case not found');
            }
            
            // Validate input
            $validator = new Validator($request->all(), [
                'client_id' => 'integer',
                'matter_ar' => 'min:3|max:500',
                'matter_en' => 'min:3|max:500',
                'matter_subject' => 'min:10',
                'matter_status' => 'in:active,pending,completed,cancelled,on_hold,appealed',
                'matter_category' => 'in:civil,commercial,criminal,administrative,labor,family,real_estate,intellectual_property',
                'matter_importance' => 'in:low,medium,high,critical'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $data = $request->only([
                'client_id', 'matter_ar', 'matter_en', 'matter_subject',
                'matter_status', 'matter_category', 'matter_importance',
                'client_capacity', 'opponent_capacity', 'matter_degree',
                'matter_start_date', 'matter_end_date', 'circuit_secretary',
                'matter_asked_amount', 'matter_judged_amount', 'client_branch',
                'matter_shelf', 'court_floor', 'court_hall', 'secretary_room',
                'matter_court', 'matter_circuit', 'matter_destination',
                'matter_select', 'matter_partner', 'matter_notes1', 'matter_notes2',
                'lawyer_a', 'lawyer_b', 'matter_evaluation', 'financial_allocation',
                'work_team_id', 'contract_id'
            ]);
            
            // Remove empty values
            $data = array_filter($data, function($value) {
                return $value !== null && $value !== '';
            });
            
            if (empty($data)) {
                return Response::error('No data provided for update', 400);
            }
            
            CaseModel::update($id, $data);
            
            // Get the updated case
            $case = CaseModel::findById($id);
            
            return Response::success($case, 'Case updated successfully');
            
        } catch (Exception $e) {
            error_log("Case update error: " . $e->getMessage());
            return Response::serverError('Failed to update case');
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
                return Response::error('Case ID is required', 400);
            }
            
            // Check if case exists
            $case = CaseModel::findById($id);
            if (!$case) {
                return Response::notFound('Case not found');
            }
            
            CaseModel::delete($id);
            
            return Response::success(null, 'Case deleted successfully');
            
        } catch (Exception $e) {
            error_log("Case destroy error: " . $e->getMessage());
            return Response::serverError('Failed to delete case');
        }
    }
    
    public function stats(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $stats = CaseModel::getStats();
            
            return Response::success($stats);
            
        } catch (Exception $e) {
            error_log("Case stats error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve case statistics');
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
            
            $result = CaseModel::search($searchTerm, $page, $limit);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Case search error: " . $e->getMessage());
            return Response::serverError('Failed to search cases');
        }
    }
    
    public function byClient(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $clientId = $request->get('client_id');
            if (!$clientId) {
                return Response::error('Client ID is required', 400);
            }
            
            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);
            
            $result = CaseModel::getByClient($clientId, $page, $limit);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Case by client error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve client cases');
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
            
            $result = CaseModel::getByLawyer($lawyerName, $page, $limit);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Case by lawyer error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve lawyer cases');
        }
    }
    
    public function options(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $options = [
                'status' => CaseModel::getStatusOptions(),
                'category' => CaseModel::getCategoryOptions(),
                'importance' => CaseModel::getImportanceOptions()
            ];
            
            return Response::success($options);
            
        } catch (Exception $e) {
            error_log("Case options error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve case options');
        }
    }
}
