<?php
/**
 * Hearing Controller
 * 
 * Handles hearing management operations for litigation system.
 */

class HearingController {
    
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
                'case_id' => $request->get('case_id'),
                'hearing_result' => $request->get('hearing_result'),
                'hearing_type' => $request->get('hearing_type'),
                'date_from' => $request->get('date_from'),
                'date_to' => $request->get('date_to'),
                'search' => $request->get('search')
            ];
            
            // Remove empty filters
            $filters = array_filter($filters, function($value) {
                return $value !== null && $value !== '';
            });
            
            $result = Hearing::getAll($page, $limit, $filters);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Hearings index error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve hearings');
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
                return Response::error('Hearing ID is required', 400);
            }
            
            $hearing = Hearing::findById($id);
            if (!$hearing) {
                return Response::notFound('Hearing not found');
            }
            
            return Response::success($hearing);
            
        } catch (Exception $e) {
            error_log("Hearing show error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve hearing');
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
                'case_id' => 'required|integer',
                'hearing_date' => 'required|date',
                'hearing_result' => 'in:won,lost,postponed,pending',
                'hearing_type' => 'in:initial,procedural,evidence,witness,expert,final,appeal,execution',
                'hearing_duration' => 'in:30min,1hour,2hours,3hours,4hours,fullday'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $data = $request->only([
                'case_id', 'hearing_date', 'hearing_decision', 'hearing_result',
                'last_decision', 'court_notes', 'lawyer_notes', 'expert_notes',
                'hearing_duration', 'hearing_type', 'next_hearing', 'short_decision'
            ]);
            
            $hearingId = Hearing::create($data);
            
            // Get the created hearing
            $hearing = Hearing::findById($hearingId);
            
            return Response::success($hearing, 'Hearing created successfully', 201);
            
        } catch (Exception $e) {
            error_log("Hearing store error: " . $e->getMessage());
            return Response::serverError('Failed to create hearing');
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
                return Response::error('Hearing ID is required', 400);
            }
            
            // Check if hearing exists
            $existingHearing = Hearing::findById($id);
            if (!$existingHearing) {
                return Response::notFound('Hearing not found');
            }
            
            // Validate input
            $validator = new Validator($request->all(), [
                'case_id' => 'integer',
                'hearing_date' => 'date',
                'hearing_result' => 'in:won,lost,postponed,pending',
                'hearing_type' => 'in:initial,procedural,evidence,witness,expert,final,appeal,execution',
                'hearing_duration' => 'in:30min,1hour,2hours,3hours,4hours,fullday'
            ]);
            
            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }
            
            $data = $request->only([
                'case_id', 'hearing_date', 'hearing_decision', 'hearing_result',
                'last_decision', 'court_notes', 'lawyer_notes', 'expert_notes',
                'hearing_duration', 'hearing_type', 'next_hearing', 'short_decision'
            ]);
            
            // Remove empty values
            $data = array_filter($data, function($value) {
                return $value !== null && $value !== '';
            });
            
            if (empty($data)) {
                return Response::error('No data provided for update', 400);
            }
            
            Hearing::update($id, $data);
            
            // Get the updated hearing
            $hearing = Hearing::findById($id);
            
            return Response::success($hearing, 'Hearing updated successfully');
            
        } catch (Exception $e) {
            error_log("Hearing update error: " . $e->getMessage());
            return Response::serverError('Failed to update hearing');
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
                return Response::error('Hearing ID is required', 400);
            }
            
            // Check if hearing exists
            $hearing = Hearing::findById($id);
            if (!$hearing) {
                return Response::notFound('Hearing not found');
            }
            
            Hearing::delete($id);
            
            return Response::success(null, 'Hearing deleted successfully');
            
        } catch (Exception $e) {
            error_log("Hearing destroy error: " . $e->getMessage());
            return Response::serverError('Failed to delete hearing');
        }
    }
    
    public function stats(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $stats = Hearing::getStats();
            
            return Response::success($stats);
            
        } catch (Exception $e) {
            error_log("Hearing stats error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve hearing statistics');
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
            
            $result = Hearing::search($searchTerm, $page, $limit);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Hearing search error: " . $e->getMessage());
            return Response::serverError('Failed to search hearings');
        }
    }
    
    public function byCase(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $caseId = $request->get('case_id');
            if (!$caseId) {
                return Response::error('Case ID is required', 400);
            }
            
            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);
            
            $result = Hearing::getByCase($caseId, $page, $limit);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Hearing by case error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve case hearings');
        }
    }
    
    public function upcoming(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);
            
            $result = Hearing::getUpcoming($page, $limit);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Upcoming hearings error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve upcoming hearings');
        }
    }
    
    public function byDateRange(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $startDate = $request->get('start_date');
            $endDate = $request->get('end_date');
            
            if (!$startDate || !$endDate) {
                return Response::error('Start date and end date are required', 400);
            }
            
            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);
            
            $result = Hearing::getByDateRange($startDate, $endDate, $page, $limit);
            
            return Response::success($result);
            
        } catch (Exception $e) {
            error_log("Hearing by date range error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve hearings by date range');
        }
    }
    
    public function options(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }
            
            $options = [
                'result' => Hearing::getResultOptions(),
                'type' => Hearing::getTypeOptions(),
                'duration' => Hearing::getDurationOptions()
            ];
            
            return Response::success($options);
            
        } catch (Exception $e) {
            error_log("Hearing options error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve hearing options');
        }
    }
}
