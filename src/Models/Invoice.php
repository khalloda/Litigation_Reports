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
        global $pdo;

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
        $countSql = "SELECT COUNT(*) FROM " . self::$table . " WHERE " . $whereClause;
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute($params);
        $total = $countStmt->fetchColumn();

        // Get data
        $sql = "SELECT * FROM " . self::$table . " WHERE " . $whereClause . " ORDER BY invoice_date DESC, created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
        global $pdo;

        $sql = "SELECT * FROM " . self::$table . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$id]);
        $invoice = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($invoice) {
            return self::formatInvoice($invoice);
        }

        return null;
    }

    /**
     * Create new invoice
     */
    public static function create($data) {
        global $pdo;

        // Generate invoice number if not provided
        if (empty($data['invoice_number'])) {
            $data['invoice_number'] = self::generateInvoiceNumber();
        }

        $sql = "INSERT INTO " . self::$table . " (
            invoice_number, contract_id, invoice_date, amount, currency, usd_amount,
            invoice_details, invoice_status, invoice_type, has_vat, payment_date, report_generated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
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

        return $pdo->lastInsertId();
    }

    /**
     * Update invoice
     */
    public static function update($id, $data) {
        global $pdo;

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

        $stmt = $pdo->prepare($sql);
        return $stmt->execute($params);
    }

    /**
     * Delete invoice
     */
    public static function delete($id) {
        global $pdo;

        $sql = "DELETE FROM " . self::$table . " WHERE id = ?";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([$id]);
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
        global $pdo;

        $offset = ($page - 1) * $limit;

        // Get overdue invoices (unpaid and past due date)
        $sql = "SELECT * FROM " . self::$table . "
                WHERE invoice_status IN ('sent', 'overdue')
                AND invoice_date < DATE_SUB(NOW(), INTERVAL 30 DAY)
                ORDER BY invoice_date ASC
                LIMIT ? OFFSET ?";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([$limit, $offset]);
        $invoices = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Get total count
        $countSql = "SELECT COUNT(*) FROM " . self::$table . "
                     WHERE invoice_status IN ('sent', 'overdue')
                     AND invoice_date < DATE_SUB(NOW(), INTERVAL 30 DAY)";
        $countStmt = $pdo->prepare($countSql);
        $countStmt->execute();
        $total = $countStmt->fetchColumn();

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
        global $pdo;

        $stats = [];

        // Total invoices
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM " . self::$table);
        $stmt->execute();
        $stats['total'] = $stmt->fetchColumn();

        // By status
        $stmt = $pdo->prepare("
            SELECT invoice_status, COUNT(*) as count, SUM(amount) as total_amount
            FROM " . self::$table . "
            GROUP BY invoice_status
        ");
        $stmt->execute();
        $statusStats = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $stats['by_status'] = [];
        foreach ($statusStats as $stat) {
            $stats['by_status'][$stat['invoice_status']] = [
                'count' => (int) $stat['count'],
                'total_amount' => (float) $stat['total_amount']
            ];
        }

        // Total amounts
        $stmt = $pdo->prepare("
            SELECT
                SUM(CASE WHEN currency = 'EGP' THEN amount ELSE 0 END) as total_egp,
                SUM(CASE WHEN currency = 'USD' THEN amount ELSE 0 END) as total_usd,
                SUM(CASE WHEN currency = 'EUR' THEN amount ELSE 0 END) as total_eur,
                SUM(CASE WHEN invoice_status = 'paid' THEN amount ELSE 0 END) as total_paid,
                SUM(CASE WHEN invoice_status IN ('sent', 'overdue') THEN amount ELSE 0 END) as total_pending
            FROM " . self::$table
        );
        $stmt->execute();
        $amounts = $stmt->fetch(PDO::FETCH_ASSOC);

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
        global $pdo;

        $year = date('Y');
        $month = date('m');

        // Get the last invoice number for this month
        $sql = "SELECT invoice_number FROM " . self::$table . "
                WHERE invoice_number LIKE ?
                ORDER BY invoice_number DESC
                LIMIT 1";

        $prefix = "INV-{$year}{$month}-";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$prefix . '%']);
        $lastInvoice = $stmt->fetchColumn();

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