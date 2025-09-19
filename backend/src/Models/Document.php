<?php
/**
 * Document Model
 *
 * Handles document management operations.
 */

class Document {

    public static function getAll($page = 1, $limit = DEFAULT_PAGE_SIZE, $filters = []) {
        try {
            $db = Database::getInstance();

            $offset = ($page - 1) * $limit;
            $where_conditions = [];
            $params = [];

            // Build where conditions based on filters
            if (!empty($filters['search'])) {
                $where_conditions[] = "(d.title LIKE :search OR d.description LIKE :search OR d.original_filename LIKE :search)";
                $params[':search'] = '%' . $filters['search'] . '%';
            }

            if (!empty($filters['document_type'])) {
                $where_conditions[] = "d.document_type = :document_type";
                $params[':document_type'] = $filters['document_type'];
            }

            if (!empty($filters['entity_type'])) {
                $where_conditions[] = "d.entity_type = :entity_type";
                $params[':entity_type'] = $filters['entity_type'];
            }

            if (!empty($filters['entity_id'])) {
                $where_conditions[] = "d.entity_id = :entity_id";
                $params[':entity_id'] = $filters['entity_id'];
            }

            if (!empty($filters['uploaded_by'])) {
                $where_conditions[] = "d.uploaded_by = :uploaded_by";
                $params[':uploaded_by'] = $filters['uploaded_by'];
            }

            if (!empty($filters['date_from'])) {
                $where_conditions[] = "DATE(d.created_at) >= :date_from";
                $params[':date_from'] = $filters['date_from'];
            }

            if (!empty($filters['date_to'])) {
                $where_conditions[] = "DATE(d.created_at) <= :date_to";
                $params[':date_to'] = $filters['date_to'];
            }

            $where_clause = !empty($where_conditions) ? 'WHERE ' . implode(' AND ', $where_conditions) : '';

            // Get total count
            $count_sql = "
                SELECT COUNT(*) as total
                FROM documents d
                $where_clause
            ";

            $total = $db->fetch($count_sql, $params)['total'];

            // Get documents with related data
            $sql = "
                SELECT
                    d.*,
                    u.name as uploader_name,
                    CASE
                        WHEN d.entity_type = 'client' THEN c.client_name_en
                        WHEN d.entity_type = 'case' THEN cs.case_title_en
                        WHEN d.entity_type = 'hearing' THEN h.matter_en
                        WHEN d.entity_type = 'invoice' THEN CONCAT('Invoice #', i.invoice_number)
                        ELSE NULL
                    END as entity_name,
                    CASE
                        WHEN d.entity_type = 'client' THEN c.client_name_ar
                        WHEN d.entity_type = 'case' THEN cs.case_title_ar
                        WHEN d.entity_type = 'hearing' THEN h.matter_ar
                        WHEN d.entity_type = 'invoice' THEN CONCAT('فاتورة رقم ', i.invoice_number)
                        ELSE NULL
                    END as entity_name_ar
                FROM documents d
                LEFT JOIN users u ON d.uploaded_by = u.id
                LEFT JOIN clients c ON d.entity_type = 'client' AND d.entity_id = c.id
                LEFT JOIN cases cs ON d.entity_type = 'case' AND d.entity_id = cs.id
                LEFT JOIN hearings h ON d.entity_type = 'hearing' AND d.entity_id = h.id
                LEFT JOIN invoices i ON d.entity_type = 'invoice' AND d.entity_id = i.id
                $where_clause
                ORDER BY d.created_at DESC
                LIMIT :limit OFFSET :offset
            ";

            // Add pagination parameters
            $params[':limit'] = $limit;
            $params[':offset'] = $offset;

            $documents = $db->fetchAll($sql, $params);

            // Calculate pagination
            $total_pages = ceil($total / $limit);

            return [
                'data' => $documents,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => $total,
                    'total_pages' => $total_pages,
                    'has_next' => $page < $total_pages,
                    'has_prev' => $page > 1
                ]
            ];

        } catch (Exception $e) {
            error_log("Document getAll error: " . $e->getMessage());
            throw $e;
        }
    }

    public static function findById($id) {
        try {
            $db = Database::getInstance();

            $sql = "
                SELECT
                    d.*,
                    u.name as uploader_name,
                    CASE
                        WHEN d.entity_type = 'client' THEN c.client_name_en
                        WHEN d.entity_type = 'case' THEN cs.case_title_en
                        WHEN d.entity_type = 'hearing' THEN h.matter_en
                        WHEN d.entity_type = 'invoice' THEN CONCAT('Invoice #', i.invoice_number)
                        ELSE NULL
                    END as entity_name,
                    CASE
                        WHEN d.entity_type = 'client' THEN c.client_name_ar
                        WHEN d.entity_type = 'case' THEN cs.case_title_ar
                        WHEN d.entity_type = 'hearing' THEN h.matter_ar
                        WHEN d.entity_type = 'invoice' THEN CONCAT('فاتورة رقم ', i.invoice_number)
                        ELSE NULL
                    END as entity_name_ar
                FROM documents d
                LEFT JOIN users u ON d.uploaded_by = u.id
                LEFT JOIN clients c ON d.entity_type = 'client' AND d.entity_id = c.id
                LEFT JOIN cases cs ON d.entity_type = 'case' AND d.entity_id = cs.id
                LEFT JOIN hearings h ON d.entity_type = 'hearing' AND d.entity_id = h.id
                LEFT JOIN invoices i ON d.entity_type = 'invoice' AND d.entity_id = i.id
                WHERE d.id = :id
            ";

            return $db->fetch($sql, [':id' => $id]);

        } catch (Exception $e) {
            error_log("Document findById error: " . $e->getMessage());
            throw $e;
        }
    }

    public static function create($data) {
        try {
            $db = Database::getInstance();

            $sql = "
                INSERT INTO documents (
                    title, description, document_type, entity_type, entity_id,
                    original_filename, stored_filename, file_path, file_size, mime_type,
                    uploaded_by, is_public, tags, created_at, updated_at
                ) VALUES (
                    :title, :description, :document_type, :entity_type, :entity_id,
                    :original_filename, :stored_filename, :file_path, :file_size, :mime_type,
                    :uploaded_by, :is_public, :tags, NOW(), NOW()
                )
            ";

            $db->query($sql, [
                ':title' => $data['title'],
                ':description' => $data['description'] ?? null,
                ':document_type' => $data['document_type'],
                ':entity_type' => $data['entity_type'] ?? null,
                ':entity_id' => $data['entity_id'] ?? null,
                ':original_filename' => $data['original_filename'],
                ':stored_filename' => $data['stored_filename'],
                ':file_path' => $data['file_path'],
                ':file_size' => $data['file_size'],
                ':mime_type' => $data['mime_type'],
                ':uploaded_by' => $data['uploaded_by'],
                ':is_public' => $data['is_public'] ?? false,
                ':tags' => $data['tags'] ?? null
            ]);

            return $db->lastInsertId();

        } catch (Exception $e) {
            error_log("Document create error: " . $e->getMessage());
            throw $e;
        }
    }

    public static function update($id, $data) {
        try {
            $db = Database::getInstance();

            $set_clauses = [];
            $params = [':id' => $id];

            // Build SET clause dynamically
            foreach ($data as $key => $value) {
                if (in_array($key, ['title', 'description', 'document_type', 'entity_type', 'entity_id', 'is_public', 'tags'])) {
                    $set_clauses[] = "$key = :$key";
                    $params[":$key"] = $value;
                }
            }

            if (empty($set_clauses)) {
                throw new Exception("No valid fields to update");
            }

            $set_clauses[] = "updated_at = NOW()";
            $set_clause = implode(', ', $set_clauses);

            $sql = "UPDATE documents SET $set_clause WHERE id = :id";

            $db->query($sql, $params);
            return true;

        } catch (Exception $e) {
            error_log("Document update error: " . $e->getMessage());
            throw $e;
        }
    }

    public static function delete($id) {
        try {
            $db = Database::getInstance();

            // First get the document to delete the file
            $document = self::findById($id);

            if ($document && file_exists($document['file_path'])) {
                unlink($document['file_path']);
            }

            $sql = "DELETE FROM documents WHERE id = :id";
            $db->query($sql, [':id' => $id]);
            return true;

        } catch (Exception $e) {
            error_log("Document delete error: " . $e->getMessage());
            throw $e;
        }
    }

    public static function getByEntity($entity_type, $entity_id) {
        try {
            $db = Database::getInstance();

            $sql = "
                SELECT
                    d.*,
                    u.name as uploader_name
                FROM documents d
                LEFT JOIN users u ON d.uploaded_by = u.id
                WHERE d.entity_type = :entity_type AND d.entity_id = :entity_id
                ORDER BY d.created_at DESC
            ";

            return $db->fetchAll($sql, [
                ':entity_type' => $entity_type,
                ':entity_id' => $entity_id
            ]);

        } catch (Exception $e) {
            error_log("Document getByEntity error: " . $e->getMessage());
            throw $e;
        }
    }

    public static function search($searchTerm, $page = 1, $limit = DEFAULT_PAGE_SIZE) {
        try {
            $filters = ['search' => $searchTerm];
            return self::getAll($page, $limit, $filters);

        } catch (Exception $e) {
            error_log("Document search error: " . $e->getMessage());
            throw $e;
        }
    }

    public static function getStats() {
        try {
            $db = Database::getInstance();

            $sql = "
                SELECT
                    COUNT(*) as total_documents,
                    COUNT(CASE WHEN document_type = 'contract' THEN 1 END) as contracts,
                    COUNT(CASE WHEN document_type = 'evidence' THEN 1 END) as evidence,
                    COUNT(CASE WHEN document_type = 'correspondence' THEN 1 END) as correspondence,
                    COUNT(CASE WHEN document_type = 'legal_memo' THEN 1 END) as legal_memos,
                    COUNT(CASE WHEN document_type = 'court_filing' THEN 1 END) as court_filings,
                    COUNT(CASE WHEN document_type = 'other' THEN 1 END) as other,
                    ROUND(SUM(file_size) / 1024 / 1024, 2) as total_size_mb,
                    COUNT(CASE WHEN is_public = 1 THEN 1 END) as public_documents,
                    COUNT(CASE WHEN is_public = 0 THEN 1 END) as private_documents
                FROM documents
            ";

            return $db->fetch($sql);

        } catch (Exception $e) {
            error_log("Document getStats error: " . $e->getMessage());
            throw $e;
        }
    }

    public static function getTypeOptions() {
        return [
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
        ];
    }

    public static function getEntityTypeOptions() {
        return [
            'client' => 'عميل',
            'case' => 'قضية',
            'hearing' => 'جلسة',
            'invoice' => 'فاتورة',
            'general' => 'عام'
        ];
    }
}