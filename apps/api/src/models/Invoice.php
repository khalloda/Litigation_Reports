<?php
/**
 * Invoice Model
 *
 * Handles invoice data operations.
 */

class Invoice {
    private static $table = 'invoices';

    /**
     * Get all invoices with pagination and filtering
     */
    public static function getAll($page = 1, $limit = 20, $filters = []) {
        $db = Database::getInstance();

        $offset = ($page - 1) * $limit;
        $where = ['1=1'];
        $params = [];

        // Apply filters
        if (!empty($filters['search'])) {
            $where[] = "(invoice_number LIKE ? OR contract_id LIKE ? OR invoice_details LIKE ?)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        if (!empty($filters['invoice_status'])) {
            $where[] = "invoice_status = ?";
            $params[] = $filters['invoice_status'];
        }

        if (!empty($filters['invoice_type'])) {
            $where[] = "invoice_type = ?";
            $params[] = $filters['invoice_type'];
        }

        if (!empty($filters['currency'])) {
            $where[] = "currency = ?";
            $params[] = $filters['currency'];
        }

        if (!empty($filters['date_from'])) {
            $where[] = "invoice_date >= ?";
            $params[] = $filters['date_from'];
        }

        if (!empty($filters['date_to'])) {
            $where[] = "invoice_date <= ?";
            $params[] = $filters['date_to'];
        }

        $whereClause = implode(' AND ', $where);

        // Get total count
        $countSql = "SELECT COUNT(*) as count FROM " . self::$table . " WHERE " . $whereClause;
        $total = $db->fetch($countSql, $params)['count'];

        // Get data
        $sql = "SELECT * FROM " . self::$table . " WHERE " . $whereClause . " ORDER BY invoice_date DESC, created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $invoices = $db->fetchAll($sql, $params);

        // Format data
        foreach ($invoices as &$invoice) {
            $invoice = self::formatInvoice($invoice);
        }

        // Calculate pagination
        $totalPages = ceil($total / $limit);

        return [
            'data' => $invoices,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => $totalPages,
                'has_next' => $page < $totalPages,
                'has_prev' => $page > 1
            ]
        ];
    }

    /**
     * Find invoice by ID
     */
    public static function findById($id) {
        $db = Database::getInstance();

        $sql = "SELECT * FROM " . self::$table . " WHERE id = ?";
        $invoice = $db->fetch($sql, [$id]);

        if ($invoice) {
            return self::formatInvoice($invoice);
        }

        return null;
    }

    /**
     * Create new invoice
     */
    public static function create($data) {
        $db = Database::getInstance();

        // Generate invoice number if not provided
        if (empty($data['invoice_number'])) {
            $data['invoice_number'] = self::generateInvoiceNumber();
        }

        $sql = "INSERT INTO " . self::$table . " (
            invoice_number, contract_id, invoice_date, amount, currency, usd_amount,
            invoice_details, invoice_status, invoice_type, has_vat, payment_date, report_generated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $db->query($sql, [
            $data['invoice_number'],
            $data['contract_id'] ?? null,
            $data['invoice_date'],
            $data['amount'],
            $data['currency'] ?? 'EGP',
            $data['usd_amount'] ?? null,
            $data['invoice_details'] ?? '',
            $data['invoice_status'] ?? 'draft',
            $data['invoice_type'] ?? 'service',
            $data['has_vat'] ?? 0,
            $data['payment_date'] ?? null,
            $data['report_generated'] ?? 0
        ]);

        return $db->lastInsertId();
    }

    /**
     * Update invoice
     */
    public static function update($id, $data) {
        $db = Database::getInstance();

        $fields = [];
        $params = [];

        $allowedFields = [
            'invoice_number', 'contract_id', 'invoice_date', 'amount', 'currency', 'usd_amount',
            'invoice_details', 'invoice_status', 'invoice_type', 'has_vat', 'payment_date', 'report_generated'
        ];

        foreach ($allowedFields as $field) {
            if (isset($data[$field])) {
                $fields[] = $field . ' = ?';
                $params[] = $data[$field];
            }
        }

        if (empty($fields)) {
            return false;
        }

        $fields[] = 'updated_at = NOW()';
        $params[] = $id;

        $sql = "UPDATE " . self::$table . " SET " . implode(', ', $fields) . " WHERE id = ?";

        $db->query($sql, $params);
        return true;
    }

    /**
     * Delete invoice
     */
    public static function delete($id) {
        $db = Database::getInstance();

        $sql = "DELETE FROM " . self::$table . " WHERE id = ?";
        $db->query($sql, [$id]);
        return true;
    }

    /**
     * Search invoices
     */
    public static function search($searchTerm, $page = 1, $limit = 20) {
        return self::getAll($page, $limit, ['search' => $searchTerm]);
    }

    /**
     * Get invoices by status
     */
    public static function getByStatus($status, $page = 1, $limit = 20) {
        return self::getAll($page, $limit, ['invoice_status' => $status]);
    }

    /**
     * Get overdue invoices
     */
    public static function getOverdue($page = 1, $limit = 20) {
        $db = Database::getInstance();

        $offset = ($page - 1) * $limit;

        // Get overdue invoices (unpaid and past due date)
        $sql = "SELECT * FROM " . self::$table . "
                WHERE invoice_status IN ('sent', 'overdue')
                AND invoice_date < DATE_SUB(NOW(), INTERVAL 30 DAY)
                ORDER BY invoice_date ASC
                LIMIT ? OFFSET ?";

        $invoices = $db->fetchAll($sql, [$limit, $offset]);

        // Get total count
        $countSql = "SELECT COUNT(*) as count FROM " . self::$table . "
                     WHERE invoice_status IN ('sent', 'overdue')
                     AND invoice_date < DATE_SUB(NOW(), INTERVAL 30 DAY)";
        $total = $db->fetch($countSql)['count'];

        // Format data
        foreach ($invoices as &$invoice) {
            $invoice = self::formatInvoice($invoice);
        }

        $totalPages = ceil($total / $limit);

        return [
            'data' => $invoices,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => $totalPages,
                'has_next' => $page < $totalPages,
                'has_prev' => $page > 1
            ]
        ];
    }

    /**
     * Get invoice statistics
     */
    public static function getStats() {
        $db = Database::getInstance();

        $stats = [];

        // Total invoices
        $stats['total'] = $db->fetch("SELECT COUNT(*) as count FROM " . self::$table)['count'];

        // By status
        $statusStats = $db->fetchAll("
            SELECT invoice_status, COUNT(*) as count, SUM(amount) as total_amount
            FROM " . self::$table . "
            GROUP BY invoice_status
        ");

        $stats['by_status'] = [];
        foreach ($statusStats as $stat) {
            $stats['by_status'][$stat['invoice_status']] = [
                'count' => (int) $stat['count'],
                'total_amount' => (float) $stat['total_amount']
            ];
        }

        // Total amounts
        $amounts = $db->fetch("
            SELECT
                SUM(CASE WHEN currency = 'EGP' THEN amount ELSE 0 END) as total_egp,
                SUM(CASE WHEN currency = 'USD' THEN amount ELSE 0 END) as total_usd,
                SUM(CASE WHEN currency = 'EUR' THEN amount ELSE 0 END) as total_eur,
                SUM(CASE WHEN invoice_status = 'paid' THEN amount ELSE 0 END) as total_paid,
                SUM(CASE WHEN invoice_status IN ('sent', 'overdue') THEN amount ELSE 0 END) as total_pending
            FROM " . self::$table
        );

        $stats['totals'] = [
            'egp' => (float) ($amounts['total_egp'] ?? 0),
            'usd' => (float) ($amounts['total_usd'] ?? 0),
            'eur' => (float) ($amounts['total_eur'] ?? 0),
            'paid' => (float) ($amounts['total_paid'] ?? 0),
            'pending' => (float) ($amounts['total_pending'] ?? 0)
        ];

        return $stats;
    }

    /**
     * Get options for dropdowns
     */
    public static function getStatusOptions() {
        return [
            'draft' => 'مسودة',
            'sent' => 'مرسلة',
            'paid' => 'مدفوعة',
            'overdue' => 'متأخرة',
            'cancelled' => 'ملغية'
        ];
    }

    public static function getTypeOptions() {
        return [
            'service' => 'خدمات',
            'expenses' => 'مصروفات',
            'advance' => 'دفعة مقدمة'
        ];
    }

    public static function getCurrencyOptions() {
        return [
            'EGP' => 'جنيه مصري',
            'USD' => 'دولار أمريكي',
            'EUR' => 'يورو'
        ];
    }

    /**
     * Generate unique invoice number
     */
    private static function generateInvoiceNumber() {
        $db = Database::getInstance();

        $year = date('Y');
        $month = date('m');

        // Get the last invoice number for this month
        $sql = "SELECT invoice_number FROM " . self::$table . "
                WHERE invoice_number LIKE ?
                ORDER BY invoice_number DESC
                LIMIT 1";

        $prefix = "INV-{$year}{$month}-";
        $result = $db->fetch($sql, [$prefix . '%']);
        $lastInvoice = $result ? $result['invoice_number'] : null;

        if ($lastInvoice) {
            // Extract sequence number and increment
            $lastSequence = (int) substr($lastInvoice, -4);
            $newSequence = $lastSequence + 1;
        } else {
            $newSequence = 1;
        }

        return $prefix . str_pad($newSequence, 4, '0', STR_PAD_LEFT);
    }

    /**
     * Format invoice data
     */
    private static function formatInvoice($invoice) {
        return [
            'id' => (int) $invoice['id'],
            'invoice_number' => $invoice['invoice_number'],
            'contract_id' => $invoice['contract_id'],
            'invoice_date' => $invoice['invoice_date'],
            'amount' => (float) $invoice['amount'],
            'currency' => $invoice['currency'],
            'usd_amount' => $invoice['usd_amount'] ? (float) $invoice['usd_amount'] : null,
            'invoice_details' => $invoice['invoice_details'] ?? '',
            'invoice_status' => $invoice['invoice_status'],
            'invoice_type' => $invoice['invoice_type'],
            'has_vat' => (bool) $invoice['has_vat'],
            'payment_date' => $invoice['payment_date'],
            'report_generated' => (bool) $invoice['report_generated'],
            'created_at' => $invoice['created_at'],
            'updated_at' => $invoice['updated_at']
        ];
    }
}