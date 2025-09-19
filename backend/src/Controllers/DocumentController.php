<?php
/**
 * Document Controller
 *
 * Handles document management operations.
 */

class DocumentController {

    private const UPLOAD_PATH = __DIR__ . '/../../uploads/documents/';
    private const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private const ALLOWED_TYPES = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif'];

    public function index(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            // Get query parameters
            $page = (int) $request->get('page', 1);
            $limit = (int) $request->get('limit', DEFAULT_PAGE_SIZE);

            // Return mock data for now since documents table might not exist
            $result = [
                'data' => [],
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => 0,
                    'total_pages' => 0,
                    'has_next' => false,
                    'has_prev' => false
                ]
            ];

            return Response::success($result);

        } catch (Exception $e) {
            error_log("Documents index error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve documents');
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
                return Response::error('Document ID is required', 400);
            }

            $document = Document::findById($id);
            if (!$document) {
                return Response::notFound('Document not found');
            }

            return Response::success($document);

        } catch (Exception $e) {
            error_log("Document show error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve document');
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
                'title' => 'required|max:255',
                'document_type' => 'required|in:contract,evidence,correspondence,legal_memo,court_filing,power_of_attorney,settlement,judgment,appeal,expert_report,financial_document,identification,other',
                'entity_type' => 'in:client,case,hearing,invoice,general',
                'entity_id' => 'numeric',
                'description' => 'max:1000',
                'is_public' => 'boolean',
                'tags' => 'max:500'
            ]);

            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }

            // Handle file upload
            if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
                return Response::error('File upload is required', 400);
            }

            $uploadResult = $this->handleFileUpload($_FILES['file']);
            if (!$uploadResult['success']) {
                return Response::error($uploadResult['message'], 400);
            }

            $data = [
                'title' => $request->get('title'),
                'description' => $request->get('description'),
                'document_type' => $request->get('document_type'),
                'entity_type' => $request->get('entity_type'),
                'entity_id' => $request->get('entity_id'),
                'original_filename' => $uploadResult['original_filename'],
                'stored_filename' => $uploadResult['stored_filename'],
                'file_path' => $uploadResult['file_path'],
                'file_size' => $uploadResult['file_size'],
                'mime_type' => $uploadResult['mime_type'],
                'uploaded_by' => Auth::id(),
                'is_public' => $request->get('is_public', false),
                'tags' => $request->get('tags')
            ];

            $documentId = Document::create($data);

            // Get the created document
            $document = Document::findById($documentId);

            return Response::success($document, 'Document uploaded successfully', 201);

        } catch (Exception $e) {
            error_log("Document store error: " . $e->getMessage());
            return Response::serverError('Failed to upload document');
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
                return Response::error('Document ID is required', 400);
            }

            // Check if document exists
            $existingDocument = Document::findById($id);
            if (!$existingDocument) {
                return Response::notFound('Document not found');
            }

            // Validate input
            $validator = new Validator($request->all(), [
                'title' => 'max:255',
                'document_type' => 'in:contract,evidence,correspondence,legal_memo,court_filing,power_of_attorney,settlement,judgment,appeal,expert_report,financial_document,identification,other',
                'entity_type' => 'in:client,case,hearing,invoice,general',
                'entity_id' => 'numeric',
                'description' => 'max:1000',
                'is_public' => 'boolean',
                'tags' => 'max:500'
            ]);

            if (!$validator->validate()) {
                return Response::validationError($validator->errors());
            }

            $data = $request->only([
                'title', 'description', 'document_type', 'entity_type', 'entity_id', 'is_public', 'tags'
            ]);

            // Remove empty values
            $data = array_filter($data, function($value) {
                return $value !== null && $value !== '';
            });

            if (empty($data)) {
                return Response::error('No data provided for update', 400);
            }

            Document::update($id, $data);

            // Get the updated document
            $document = Document::findById($id);

            return Response::success($document, 'Document updated successfully');

        } catch (Exception $e) {
            error_log("Document update error: " . $e->getMessage());
            return Response::serverError('Failed to update document');
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
                return Response::error('Document ID is required', 400);
            }

            // Check if document exists
            $document = Document::findById($id);
            if (!$document) {
                return Response::notFound('Document not found');
            }

            Document::delete($id);

            return Response::success(null, 'Document deleted successfully');

        } catch (Exception $e) {
            error_log("Document destroy error: " . $e->getMessage());
            return Response::serverError('Failed to delete document');
        }
    }

    public function download(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $id = $request->getRouteParam('id');
            if (!$id) {
                return Response::error('Document ID is required', 400);
            }

            $document = Document::findById($id);
            if (!$document) {
                return Response::notFound('Document not found');
            }

            $filePath = $document['file_path'];
            if (!file_exists($filePath)) {
                return Response::notFound('File not found on server');
            }

            // Set headers for file download
            header('Content-Type: ' . $document['mime_type']);
            header('Content-Disposition: attachment; filename="' . $document['original_filename'] . '"');
            header('Content-Length: ' . filesize($filePath));

            // Output file
            readfile($filePath);
            exit;

        } catch (Exception $e) {
            error_log("Document download error: " . $e->getMessage());
            return Response::serverError('Failed to download document');
        }
    }

    public function getByEntity(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $entityType = $request->get('entity_type');
            $entityId = $request->get('entity_id');

            if (!$entityType || !$entityId) {
                return Response::error('Entity type and ID are required', 400);
            }

            $documents = Document::getByEntity($entityType, $entityId);

            return Response::success($documents);

        } catch (Exception $e) {
            error_log("Document getByEntity error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve entity documents');
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

            $result = Document::search($searchTerm, $page, $limit);

            return Response::success($result);

        } catch (Exception $e) {
            error_log("Document search error: " . $e->getMessage());
            return Response::serverError('Failed to search documents');
        }
    }

    public function stats(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $stats = Document::getStats();

            return Response::success($stats);

        } catch (Exception $e) {
            error_log("Document stats error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve document statistics');
        }
    }

    public function options(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $options = [
                'document_types' => [
                    'contract' => 'عقد',
                    'evidence' => 'دليل',
                    'correspondence' => 'مراسلات',
                    'legal_memo' => 'مذكرة قانونية',
                    'court_filing' => 'مرافعة محكمة',
                    'power_of_attorney' => 'توكيل',
                    'settlement' => 'تسوية',
                    'judgment' => 'حكم',
                    'appeal' => 'استئناف',
                    'expert_report' => 'تقرير خبير',
                    'financial_document' => 'مستند مالي',
                    'identification' => 'هوية',
                    'other' => 'أخرى'
                ],
                'entity_types' => [
                    'client' => 'عميل',
                    'case' => 'قضية',
                    'hearing' => 'جلسة',
                    'invoice' => 'فاتورة',
                    'general' => 'عام'
                ]
            ];

            return Response::success($options);

        } catch (Exception $e) {
            error_log("Document options error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve document options');
        }
    }

    private function handleFileUpload($file) {
        try {
            // Check file size
            if ($file['size'] > self::MAX_FILE_SIZE) {
                return [
                    'success' => false,
                    'message' => 'File size exceeds maximum allowed size of ' . (self::MAX_FILE_SIZE / 1024 / 1024) . 'MB'
                ];
            }

            // Get file extension
            $originalFilename = $file['name'];
            $pathInfo = pathinfo($originalFilename);
            $extension = strtolower($pathInfo['extension']);

            // Check allowed file types
            if (!in_array($extension, self::ALLOWED_TYPES)) {
                return [
                    'success' => false,
                    'message' => 'File type not allowed. Allowed types: ' . implode(', ', self::ALLOWED_TYPES)
                ];
            }

            // Create upload directory if it doesn't exist
            if (!is_dir(self::UPLOAD_PATH)) {
                mkdir(self::UPLOAD_PATH, 0755, true);
            }

            // Generate unique filename
            $storedFilename = uniqid() . '_' . time() . '.' . $extension;
            $filePath = self::UPLOAD_PATH . $storedFilename;

            // Move uploaded file
            if (!move_uploaded_file($file['tmp_name'], $filePath)) {
                return [
                    'success' => false,
                    'message' => 'Failed to move uploaded file'
                ];
            }

            return [
                'success' => true,
                'original_filename' => $originalFilename,
                'stored_filename' => $storedFilename,
                'file_path' => $filePath,
                'file_size' => $file['size'],
                'mime_type' => $file['type']
            ];

        } catch (Exception $e) {
            error_log("File upload error: " . $e->getMessage());
            return [
                'success' => false,
                'message' => 'File upload failed: ' . $e->getMessage()
            ];
        }
    }
}