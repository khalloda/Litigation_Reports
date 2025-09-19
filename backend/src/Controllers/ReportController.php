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

            $dashboard = [];

            // Test database initialization
            try {
                $db = Database::getInstance();
                $dashboard['db_status'] = 'Database initialized successfully';
            } catch (Exception $e) {
                $dashboard['db_status'] = 'Database init failed: ' . $e->getMessage();
                return Response::success($dashboard);
            }

            // Test simple query
            try {
                $testResult = $db->fetch("SELECT 1 as test");
                $dashboard['query_test'] = $testResult ? 'Query successful' : 'Query failed';
            } catch (Exception $e) {
                $dashboard['query_test'] = 'Query failed: ' . $e->getMessage();
                return Response::success($dashboard);
            }

            // Return mock data for now to fix the frontend
            $dashboard['total_clients'] = 0;
            $dashboard['total_cases'] = 0;
            $dashboard['total_hearings'] = 0;
            $dashboard['total_invoices'] = 0;
            $dashboard['total_lawyers'] = 0;
            $dashboard['recent_activities'] = [];
            $dashboard['upcoming_hearings'] = [];
            $dashboard['financial_summary'] = [
                'total_revenue' => 0,
                'paid_amount' => 0,
                'pending_amount' => 0,
                'paid_count' => 0,
                'pending_count' => 0,
                'overdue_count' => 0
            ];
            $dashboard['case_statistics'] = [];
            $dashboard['hearing_statistics'] = [];
            $dashboard['revenue_trend'] = [];

            return Response::success($dashboard);

        } catch (Exception $e) {
            error_log("Dashboard error: " . $e->getMessage());
            return Response::serverError('Dashboard error: ' . $e->getMessage());
        }
    }

    public function clients(Request $request) {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $db = Database::getInstance();

            $dateFrom = $request->get('date_from');
            $dateTo = $request->get('date_to');

            // Client statistics
            $reports = [];

            // Total clients
            $reports['total_clients'] = (int) $db->fetch("SELECT COUNT(*) as count FROM clients WHERE is_active = 1")['count'];

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

            $reports['new_clients'] = (int) $db->fetch("SELECT COUNT(*) as count FROM clients WHERE {$whereClause}", $params)['count'];

            // Clients by type
            $reports['clients_by_type'] = $db->fetchAll("
                SELECT client_type, COUNT(*) as count
                FROM clients
                WHERE is_active = 1
                GROUP BY client_type
            ");

            // Top clients by case count
            $reports['top_clients'] = $db->fetchAll("
                SELECT c.client_name_ar, c.client_name_en, COUNT(cs.id) as case_count
                FROM clients c
                LEFT JOIN cases cs ON c.id = cs.client_id
                WHERE c.is_active = 1
                GROUP BY c.id, c.client_name_ar, c.client_name_en
                ORDER BY case_count DESC
                LIMIT 10
            ");

            // Monthly client registration trend
            $reports['registration_trend'] = $db->fetchAll("
                SELECT
                    DATE_FORMAT(created_at, '%Y-%m') as month,
                    COUNT(*) as count
                FROM clients
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month
            ");

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

            $db = Database::getInstance();

            $dateFrom = $request->get('date_from');
            $dateTo = $request->get('date_to');

            $reports = [];

            // Total cases
            $reports['total_cases'] = (int) $db->fetch("SELECT COUNT(*) as count FROM cases WHERE is_active = 1")['count'];

            // Cases by status
            $reports['cases_by_status'] = $db->fetchAll("
                SELECT case_status, COUNT(*) as count
                FROM cases
                WHERE is_active = 1
                GROUP BY case_status
            ");

            // Cases by type
            $reports['cases_by_type'] = $db->fetchAll("
                SELECT case_type, COUNT(*) as count
                FROM cases
                WHERE is_active = 1
                GROUP BY case_type
            ");

            // Cases by court
            $reports['cases_by_court'] = $db->fetchAll("
                SELECT court_name, COUNT(*) as count
                FROM cases
                WHERE is_active = 1 AND court_name IS NOT NULL
                GROUP BY court_name
                ORDER BY count DESC
                LIMIT 10
            ");

            // Cases by lawyer
            $reports['cases_by_lawyer'] = $db->fetchAll("
                SELECT contact_lawyer, COUNT(*) as count
                FROM cases
                WHERE is_active = 1 AND contact_lawyer IS NOT NULL
                GROUP BY contact_lawyer
                ORDER BY count DESC
                LIMIT 10
            ");

            // Monthly case creation trend
            $reports['creation_trend'] = $db->fetchAll("
                SELECT
                    DATE_FORMAT(created_at, '%Y-%m') as month,
                    COUNT(*) as count
                FROM cases
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month
            ");

            // Average case duration (for closed cases)
            $avgDuration = $db->fetch("
                SELECT
                    AVG(DATEDIFF(case_close_date, created_at)) as avg_duration_days
                FROM cases
                WHERE case_status = 'closed' AND case_close_date IS NOT NULL
            ")['avg_duration_days'];
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

            $db = Database::getInstance();

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
            $reports['summary'] = $db->fetch("
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
            ", $params);

            // Revenue by currency
            $reports['revenue_by_currency'] = $db->fetchAll("
                SELECT
                    currency,
                    SUM(CASE WHEN invoice_status = 'paid' THEN amount ELSE 0 END) as paid_amount,
                    SUM(amount) as total_amount
                FROM invoices
                WHERE {$dateFilter}
                GROUP BY currency
            ", $params);

            // Revenue by type
            $reports['revenue_by_type'] = $db->fetchAll("
                SELECT
                    invoice_type,
                    SUM(CASE WHEN invoice_status = 'paid' THEN amount ELSE 0 END) as paid_amount,
                    COUNT(*) as count
                FROM invoices
                WHERE {$dateFilter}
                GROUP BY invoice_type
            ", $params);

            // Monthly revenue trend
            $reports['monthly_trend'] = $db->fetchAll("
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

            // Top overdue invoices
            $reports['top_overdue'] = $db->fetchAll("
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

            // Payment collection rate (last 6 months)
            $reports['collection_rate'] = $db->fetchAll("
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

            $db = Database::getInstance();

            $dateFrom = $request->get('date_from');
            $dateTo = $request->get('date_to');

            $reports = [];

            // Total hearings
            $reports['total_hearings'] = (int) $db->fetch("SELECT COUNT(*) as count FROM hearings")['count'];

            // Hearings by result
            $reports['hearings_by_result'] = $db->fetchAll("
                SELECT hearing_result, COUNT(*) as count
                FROM hearings
                GROUP BY hearing_result
            ");

            // Hearings by type
            $reports['hearings_by_type'] = $db->fetchAll("
                SELECT hearing_type, COUNT(*) as count
                FROM hearings
                GROUP BY hearing_type
            ");

            // Monthly hearing trend
            $reports['monthly_trend'] = $db->fetchAll("
                SELECT
                    DATE_FORMAT(hearing_date, '%Y-%m') as month,
                    COUNT(*) as count
                FROM hearings
                WHERE hearing_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(hearing_date, '%Y-%m')
                ORDER BY month
            ");

            // Success rate by hearing type
            $reports['success_rate_by_type'] = $db->fetchAll("
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

            return Response::success($reports);

        } catch (Exception $e) {
            error_log("Hearing reports error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve hearing reports');
        }
    }
}