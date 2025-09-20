<?php
/**
 * Report Controller
 *
 * Handles report generation and dashboard operations.
 */

class ReportController {

    public function dashboard(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            global $pdo;

            $dashboard = [];

            // Get total counts
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM clients WHERE is_active = 1");
            $stmt->execute();
            $dashboard['total_clients'] = (int) $stmt->fetchColumn();

            $stmt = $pdo->prepare("SELECT COUNT(*) FROM cases WHERE is_active = 1");
            $stmt->execute();
            $dashboard['total_cases'] = (int) $stmt->fetchColumn();

            $stmt = $pdo->prepare("SELECT COUNT(*) FROM hearings");
            $stmt->execute();
            $dashboard['total_hearings'] = (int) $stmt->fetchColumn();

            $stmt = $pdo->prepare("SELECT COUNT(*) FROM invoices");
            $stmt->execute();
            $dashboard['total_invoices'] = (int) $stmt->fetchColumn();

            $stmt = $pdo->prepare("SELECT COUNT(*) FROM lawyers WHERE is_active = 1");
            $stmt->execute();
            $dashboard['total_lawyers'] = (int) $stmt->fetchColumn();

            // Get recent activities (last 10)
            $stmt = $pdo->prepare("
                SELECT 'client' as type, client_name_ar as name, created_at, 'إضافة عميل جديد' as action
                FROM clients
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                UNION ALL
                SELECT 'case' as type, matter_ar as name, created_at, 'إنشاء قضية جديدة' as action
                FROM cases
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                UNION ALL
                SELECT 'hearing' as type, CONCAT('جلسة ', hearing_type) as name, created_at, 'جدولة جلسة' as action
                FROM hearings
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                UNION ALL
                SELECT 'invoice' as type, invoice_number as name, created_at, 'إنشاء فاتورة' as action
                FROM invoices
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                ORDER BY created_at DESC
                LIMIT 10
            ");
            $stmt->execute();
            $dashboard['recent_activities'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get upcoming hearings (next 7 days)
            $stmt = $pdo->prepare("
                SELECT h.*, c.matter_ar, c.matter_en, cl.client_name_ar
                FROM hearings h
                LEFT JOIN cases c ON h.case_id = c.id
                LEFT JOIN clients cl ON c.client_id = cl.id
                WHERE h.hearing_date BETWEEN NOW() AND DATE_ADD(NOW(), INTERVAL 7 DAY)
                ORDER BY h.hearing_date ASC
                LIMIT 5
            ");
            $stmt->execute();
            $dashboard['upcoming_hearings'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Get financial summary
            $stmt = $pdo->prepare("
                SELECT
                    SUM(CASE WHEN invoice_status = 'paid' THEN amount ELSE 0 END) as paid_amount,
                    SUM(CASE WHEN invoice_status IN ('sent', 'overdue') THEN amount ELSE 0 END) as pending_amount,
                    SUM(amount) as total_revenue,
                    COUNT(CASE WHEN invoice_status = 'paid' THEN 1 END) as paid_count,
                    COUNT(CASE WHEN invoice_status IN ('sent', 'overdue') THEN 1 END) as pending_count,
                    COUNT(CASE WHEN invoice_status = 'overdue' THEN 1 END) as overdue_count
                FROM invoices
            ");
            $stmt->execute();
            $financial = $stmt->fetch(PDO::FETCH_ASSOC);

            $dashboard['financial_summary'] = [
                'total_revenue' => (float) ($financial['total_revenue'] ?? 0),
                'paid_amount' => (float) ($financial['paid_amount'] ?? 0),
                'pending_amount' => (float) ($financial['pending_amount'] ?? 0),
                'paid_count' => (int) ($financial['paid_count'] ?? 0),
                'pending_count' => (int) ($financial['pending_count'] ?? 0),
                'overdue_count' => (int) ($financial['overdue_count'] ?? 0)
            ];

            // Get case statistics by status
            $stmt = $pdo->prepare("
                SELECT case_status, COUNT(*) as count
                FROM cases
                WHERE is_active = 1
                GROUP BY case_status
            ");
            $stmt->execute();
            $caseStats = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $dashboard['case_statistics'] = [];
            foreach ($caseStats as $stat) {
                $dashboard['case_statistics'][$stat['case_status']] = (int) $stat['count'];
            }

            // Get hearing statistics by result
            $stmt = $pdo->prepare("
                SELECT hearing_result, COUNT(*) as count
                FROM hearings
                WHERE hearing_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY hearing_result
            ");
            $stmt->execute();
            $hearingStats = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $dashboard['hearing_statistics'] = [];
            foreach ($hearingStats as $stat) {
                $dashboard['hearing_statistics'][$stat['hearing_result']] = (int) $stat['count'];
            }

            // Get monthly revenue trend (last 6 months)
            $stmt = $pdo->prepare("
                SELECT
                    DATE_FORMAT(invoice_date, '%Y-%m') as month,
                    SUM(CASE WHEN invoice_status = 'paid' THEN amount ELSE 0 END) as revenue
                FROM invoices
                WHERE invoice_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(invoice_date, '%Y-%m')
                ORDER BY month
            ");
            $stmt->execute();
            $dashboard['revenue_trend'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return Response::success($dashboard);

        } catch (Exception $e) {
            error_log("Get dashboard error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve dashboard data');
        }
    }

    public function clients(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            global $pdo;

            $dateFrom = $request->get('date_from');
            $dateTo = $request->get('date_to');

            // Client statistics
            $reports = [];

            // Total clients
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM clients WHERE is_active = 1");
            $stmt->execute();
            $reports['total_clients'] = (int) $stmt->fetchColumn();

            // New clients in date range
            $whereClause = "1=1";
            $params = [];
            if ($dateFrom) {
                $whereClause .= " AND created_at >= ?";
                $params[] = $dateFrom;
            }
            if ($dateTo) {
                $whereClause .= " AND created_at <= ?";
                $params[] = $dateTo . ' 23:59:59';
            }

            $stmt = $pdo->prepare("SELECT COUNT(*) FROM clients WHERE {$whereClause}");
            $stmt->execute($params);
            $reports['new_clients'] = (int) $stmt->fetchColumn();

            // Clients by type
            $stmt = $pdo->prepare("
                SELECT client_type, COUNT(*) as count
                FROM clients
                WHERE is_active = 1
                GROUP BY client_type
            ");
            $stmt->execute();
            $reports['clients_by_type'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Top clients by case count
            $stmt = $pdo->prepare("
                SELECT c.client_name_ar, c.client_name_en, COUNT(cs.id) as case_count
                FROM clients c
                LEFT JOIN cases cs ON c.id = cs.client_id
                WHERE c.is_active = 1
                GROUP BY c.id, c.client_name_ar, c.client_name_en
                ORDER BY case_count DESC
                LIMIT 10
            ");
            $stmt->execute();
            $reports['top_clients'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Monthly client registration trend
            $stmt = $pdo->prepare("
                SELECT
                    DATE_FORMAT(created_at, '%Y-%m') as month,
                    COUNT(*) as count
                FROM clients
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month
            ");
            $stmt->execute();
            $reports['registration_trend'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return Response::success($reports);

        } catch (Exception $e) {
            error_log("Client reports error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve client reports');
        }
    }

    public function cases(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            global $pdo;

            $dateFrom = $request->get('date_from');
            $dateTo = $request->get('date_to');

            $reports = [];

            // Total cases
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM cases WHERE is_active = 1");
            $stmt->execute();
            $reports['total_cases'] = (int) $stmt->fetchColumn();

            // Cases by status
            $stmt = $pdo->prepare("
                SELECT case_status, COUNT(*) as count
                FROM cases
                WHERE is_active = 1
                GROUP BY case_status
            ");
            $stmt->execute();
            $reports['cases_by_status'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Cases by type
            $stmt = $pdo->prepare("
                SELECT case_type, COUNT(*) as count
                FROM cases
                WHERE is_active = 1
                GROUP BY case_type
            ");
            $stmt->execute();
            $reports['cases_by_type'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Cases by court
            $stmt = $pdo->prepare("
                SELECT court_name, COUNT(*) as count
                FROM cases
                WHERE is_active = 1 AND court_name IS NOT NULL
                GROUP BY court_name
                ORDER BY count DESC
                LIMIT 10
            ");
            $stmt->execute();
            $reports['cases_by_court'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Cases by lawyer
            $stmt = $pdo->prepare("
                SELECT contact_lawyer, COUNT(*) as count
                FROM cases
                WHERE is_active = 1 AND contact_lawyer IS NOT NULL
                GROUP BY contact_lawyer
                ORDER BY count DESC
                LIMIT 10
            ");
            $stmt->execute();
            $reports['cases_by_lawyer'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Monthly case creation trend
            $stmt = $pdo->prepare("
                SELECT
                    DATE_FORMAT(created_at, '%Y-%m') as month,
                    COUNT(*) as count
                FROM cases
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month
            ");
            $stmt->execute();
            $reports['creation_trend'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Average case duration (for closed cases)
            $stmt = $pdo->prepare("
                SELECT
                    AVG(DATEDIFF(case_close_date, created_at)) as avg_duration_days
                FROM cases
                WHERE case_status = 'closed' AND case_close_date IS NOT NULL
            ");
            $stmt->execute();
            $avgDuration = $stmt->fetchColumn();
            $reports['average_duration_days'] = $avgDuration ? (int) $avgDuration : null;

            return Response::success($reports);

        } catch (Exception $e) {
            error_log("Case reports error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve case reports');
        }
    }

    public function financial(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            global $pdo;

            $dateFrom = $request->get('date_from');
            $dateTo = $request->get('date_to');

            $reports = [];

            // Build date filter
            $dateFilter = "1=1";
            $params = [];
            if ($dateFrom) {
                $dateFilter .= " AND invoice_date >= ?";
                $params[] = $dateFrom;
            }
            if ($dateTo) {
                $dateFilter .= " AND invoice_date <= ?";
                $params[] = $dateTo;
            }

            // Overall financial summary
            $stmt = $pdo->prepare("
                SELECT
                    COUNT(*) as total_invoices,
                    SUM(amount) as total_amount,
                    SUM(CASE WHEN invoice_status = 'paid' THEN amount ELSE 0 END) as paid_amount,
                    SUM(CASE WHEN invoice_status IN ('sent', 'overdue') THEN amount ELSE 0 END) as pending_amount,
                    SUM(CASE WHEN invoice_status = 'overdue' THEN amount ELSE 0 END) as overdue_amount,
                    COUNT(CASE WHEN invoice_status = 'paid' THEN 1 END) as paid_count,
                    COUNT(CASE WHEN invoice_status IN ('sent', 'overdue') THEN 1 END) as pending_count,
                    COUNT(CASE WHEN invoice_status = 'overdue' THEN 1 END) as overdue_count
                FROM invoices
                WHERE {$dateFilter}
            ");
            $stmt->execute($params);
            $reports['summary'] = $stmt->fetch(PDO::FETCH_ASSOC);

            // Revenue by currency
            $stmt = $pdo->prepare("
                SELECT
                    currency,
                    SUM(CASE WHEN invoice_status = 'paid' THEN amount ELSE 0 END) as paid_amount,
                    SUM(amount) as total_amount
                FROM invoices
                WHERE {$dateFilter}
                GROUP BY currency
            ");
            $stmt->execute($params);
            $reports['revenue_by_currency'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Revenue by type
            $stmt = $pdo->prepare("
                SELECT
                    invoice_type,
                    SUM(CASE WHEN invoice_status = 'paid' THEN amount ELSE 0 END) as paid_amount,
                    COUNT(*) as count
                FROM invoices
                WHERE {$dateFilter}
                GROUP BY invoice_type
            ");
            $stmt->execute($params);
            $reports['revenue_by_type'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Monthly revenue trend
            $stmt = $pdo->prepare("
                SELECT
                    DATE_FORMAT(invoice_date, '%Y-%m') as month,
                    SUM(CASE WHEN invoice_status = 'paid' THEN amount ELSE 0 END) as paid_amount,
                    SUM(amount) as total_amount,
                    COUNT(*) as invoice_count
                FROM invoices
                WHERE invoice_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(invoice_date, '%Y-%m')
                ORDER BY month
            ");
            $stmt->execute();
            $reports['monthly_trend'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Top overdue invoices
            $stmt = $pdo->prepare("
                SELECT
                    invoice_number,
                    amount,
                    currency,
                    invoice_date,
                    DATEDIFF(NOW(), invoice_date) as days_overdue
                FROM invoices
                WHERE invoice_status = 'overdue'
                ORDER BY days_overdue DESC, amount DESC
                LIMIT 10
            ");
            $stmt->execute();
            $reports['top_overdue'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Payment collection rate (last 6 months)
            $stmt = $pdo->prepare("
                SELECT
                    DATE_FORMAT(invoice_date, '%Y-%m') as month,
                    COUNT(*) as total_invoices,
                    COUNT(CASE WHEN invoice_status = 'paid' THEN 1 END) as paid_invoices,
                    ROUND((COUNT(CASE WHEN invoice_status = 'paid' THEN 1 END) / COUNT(*)) * 100, 2) as collection_rate
                FROM invoices
                WHERE invoice_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(invoice_date, '%Y-%m')
                ORDER BY month
            ");
            $stmt->execute();
            $reports['collection_rate'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return Response::success($reports);

        } catch (Exception $e) {
            error_log("Financial reports error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve financial reports');
        }
    }

    public function hearings(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            global $pdo;

            $dateFrom = $request->get('date_from');
            $dateTo = $request->get('date_to');

            $reports = [];

            // Total hearings
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM hearings");
            $stmt->execute();
            $reports['total_hearings'] = (int) $stmt->fetchColumn();

            // Hearings by result
            $stmt = $pdo->prepare("
                SELECT hearing_result, COUNT(*) as count
                FROM hearings
                GROUP BY hearing_result
            ");
            $stmt->execute();
            $reports['hearings_by_result'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Hearings by type
            $stmt = $pdo->prepare("
                SELECT hearing_type, COUNT(*) as count
                FROM hearings
                GROUP BY hearing_type
            ");
            $stmt->execute();
            $reports['hearings_by_type'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Monthly hearing trend
            $stmt = $pdo->prepare("
                SELECT
                    DATE_FORMAT(hearing_date, '%Y-%m') as month,
                    COUNT(*) as count
                FROM hearings
                WHERE hearing_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(hearing_date, '%Y-%m')
                ORDER BY month
            ");
            $stmt->execute();
            $reports['monthly_trend'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Success rate by hearing type
            $stmt = $pdo->prepare("
                SELECT
                    hearing_type,
                    COUNT(*) as total,
                    COUNT(CASE WHEN hearing_result = 'won' THEN 1 END) as won,
                    ROUND((COUNT(CASE WHEN hearing_result = 'won' THEN 1 END) / COUNT(*)) * 100, 2) as success_rate
                FROM hearings
                WHERE hearing_result IN ('won', 'lost')
                GROUP BY hearing_type
                HAVING total >= 5
                ORDER BY success_rate DESC
            ");
            $stmt->execute();
            $reports['success_rate_by_type'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return Response::success($reports);

        } catch (Exception $e) {
            error_log("Hearing reports error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve hearing reports');
        }
    }
}