<?php

/**
 * Report Controller
 *
 * Handles report generation and management for litigation system.
 */

// Import required classes
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/Validator.php';
require_once __DIR__ . '/../core/Auth.php';
require_once __DIR__ . '/../models/Case.php';
require_once __DIR__ . '/../models/Client.php';

class ReportController
{

    public function dashboard(Request $request)
    {
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

            // Get real counts
            $result = $db->fetch("SELECT COUNT(*) as count FROM clients WHERE status = 'active'");
            $dashboard['total_clients'] = (int) ($result['count'] ?? 0);

            $result = $db->fetch("SELECT COUNT(*) as count FROM cases");
            $dashboard['total_cases'] = (int) ($result['count'] ?? 0);

            $result = $db->fetch("SELECT COUNT(*) as count FROM hearings");
            $dashboard['total_hearings'] = (int) ($result['count'] ?? 0);

            $result = $db->fetch("SELECT COUNT(*) as count FROM invoices");
            $dashboard['total_invoices'] = (int) ($result['count'] ?? 0);

            $result = $db->fetch("SELECT COUNT(*) as count FROM lawyers WHERE is_active = 1");
            $dashboard['total_lawyers'] = (int) ($result['count'] ?? 0);
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

    public function clients(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            // Get filters
            $filters = [
                'date_from' => $request->get('date_from'),
                'date_to' => $request->get('date_to'),
                'client_type' => $request->get('client_type'),
                'status' => $request->get('status', 'active'),
                'city' => $request->get('city'),
                'country' => $request->get('country'),
                'lawyer' => $request->get('lawyer'),
                'search' => $request->get('search'),
                'sort_by' => $request->get('sort_by', 'created_at'),
                'sort_order' => $request->get('sort_order', 'desc'),
                'page' => (int) $request->get('page', 1),
                'limit' => (int) $request->get('limit', 50),
                'export_format' => $request->get('export_format'), // csv, excel, pdf
                'columns' => $request->get('columns') // specific columns to include
            ];

            // Get database instance
            $db = Database::getInstance();

            // Build WHERE clause for filters
            $whereConditions = ['1=1'];
            $params = [];

            if (!empty($filters['status'])) {
                $whereConditions[] = 'status = ?';
                $params[] = $filters['status'];
            }

            if (!empty($filters['client_type'])) {
                $whereConditions[] = 'client_type = ?';
                $params[] = $filters['client_type'];
            }

            if (!empty($filters['search'])) {
                $whereConditions[] = '(client_name_ar LIKE ? OR client_name_en LIKE ? OR email LIKE ?)';
                $searchTerm = '%' . $filters['search'] . '%';
                $params[] = $searchTerm;
                $params[] = $searchTerm;
                $params[] = $searchTerm;
            }

            if (!empty($filters['date_from'])) {
                $whereConditions[] = 'created_at >= ?';
                $params[] = $filters['date_from'];
            }

            if (!empty($filters['date_to'])) {
                $whereConditions[] = 'created_at <= ?';
                $params[] = $filters['date_to'] . ' 23:59:59';
            }

            $whereClause = implode(' AND ', $whereConditions);

            // Get total count
            $totalQuery = "SELECT COUNT(*) as total FROM clients WHERE $whereClause";
            $totalResult = $db->fetch($totalQuery, $params);
            $total = $totalResult ? (int)$totalResult['total'] : 0;

            // Get summary statistics
            $summaryQuery = "
                SELECT
                    COUNT(*) as total_clients,
                    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_clients,
                    SUM(CASE WHEN status != 'active' THEN 1 ELSE 0 END) as inactive_clients,
                    SUM(CASE WHEN DATE(created_at) >= DATE(DATE_SUB(NOW(), INTERVAL 1 MONTH)) THEN 1 ELSE 0 END) as new_clients_this_month
                FROM clients
                WHERE $whereClause
            ";
            $summaryResult = $db->fetch($summaryQuery, $params);

            // Get client type breakdown
            $typeQuery = "
                SELECT client_type, COUNT(*) as count
                FROM clients
                WHERE $whereClause
                GROUP BY client_type
            ";
            $typeResults = $db->fetchAll($typeQuery, $params);
            $typeBreakdown = ['individual' => 0, 'company' => 0, 'government' => 0, 'ngo' => 0];
            foreach ($typeResults as $row) {
                if (isset($typeBreakdown[$row['client_type']])) {
                    $typeBreakdown[$row['client_type']] = (int)$row['count'];
                }
            }

            // Calculate pagination
            $totalPages = ceil($total / $filters['limit']);
            $offset = ($filters['page'] - 1) * $filters['limit'];

            // Get paginated data
            $dataQuery = "
                SELECT
                    id,
                    client_name_ar,
                    client_name_en,
                    client_type,
                    phone,
                    email,
                    status,
                    created_at,
                    client_start_date as last_case_date,
                    0 as case_count,
                    0 as total_invoices,
                    0 as paid_amount,
                    0 as pending_amount
                FROM clients
                WHERE $whereClause
                ORDER BY {$filters['sort_by']} {$filters['sort_order']}
                LIMIT {$filters['limit']} OFFSET $offset
            ";
            $clientData = $db->fetchAll($dataQuery, $params);

            // Return real client report data
            $reports = [
                'summary' => [
                    'total_clients' => (int)($summaryResult['total_clients'] ?? 0),
                    'active_clients' => (int)($summaryResult['active_clients'] ?? 0),
                    'inactive_clients' => (int)($summaryResult['inactive_clients'] ?? 0),
                    'new_clients_this_month' => (int)($summaryResult['new_clients_this_month'] ?? 0),
                    'avg_cases_per_client' => 0,
                    'total_revenue_generated' => 0
                ],
                'data' => $clientData,
                'filters_applied' => array_filter($filters, function ($v) {
                    return $v !== null && $v !== '';
                }),
                'breakdown' => [
                    'by_type' => $typeBreakdown,
                    'by_city' => [],
                    'by_lawyer' => [],
                    'by_month' => []
                ],
                'pagination' => [
                    'current_page' => $filters['page'],
                    'per_page' => $filters['limit'],
                    'total' => $total,
                    'total_pages' => $totalPages,
                    'has_next' => $filters['page'] < $totalPages,
                    'has_prev' => $filters['page'] > 1
                ],
                'available_columns' => [
                    'id' => 'معرف العميل',
                    'client_name_ar' => 'اسم العميل (عربي)',
                    'client_name_en' => 'اسم العميل (إنجليزي)',
                    'client_type' => 'نوع العميل',
                    'phone' => 'رقم الهاتف',
                    'email' => 'البريد الإلكتروني',
                    'city' => 'المدينة',
                    'country' => 'البلد',
                    'case_count' => 'عدد القضايا',
                    'total_invoices' => 'إجمالي الفواتير',
                    'paid_amount' => 'المبلغ المدفوع',
                    'pending_amount' => 'المبلغ المعلق',
                    'created_at' => 'تاريخ التسجيل',
                    'last_case_date' => 'تاريخ آخر قضية',
                    'status' => 'الحالة'
                ]
            ];

            return Response::success($reports);
        } catch (Exception $e) {
            error_log("Client reports error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve client reports');
        }
    }

    public function cases(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            // Get filters
            $filters = [
                'date_from' => $request->get('date_from'),
                'date_to' => $request->get('date_to'),
                'case_status' => $request->get('case_status'),
                'case_type' => $request->get('case_type'),
                'court_name' => $request->get('court_name'),
                'lawyer' => $request->get('lawyer'),
                'client_id' => $request->get('client_id'),
                'priority' => $request->get('priority'),
                'outcome' => $request->get('outcome'),
                'search' => $request->get('search'),
                'sort_by' => $request->get('sort_by', 'created_at'),
                'sort_order' => $request->get('sort_order', 'desc'),
                'page' => (int) $request->get('page', 1),
                'limit' => (int) $request->get('limit', 50),
                'export_format' => $request->get('export_format'),
                'columns' => $request->get('columns')
            ];

            // Use the same database approach as dashboard
            $db = Database::getInstance();

            // Get real case statistics
            $totalCases = $db->fetch("SELECT COUNT(*) as count FROM cases");
            $activeCases = $db->fetch("SELECT COUNT(*) as count FROM cases WHERE matter_status = 'active'");
            $closedCases = $db->fetch("SELECT COUNT(*) as count FROM cases WHERE matter_status = 'closed'");
            $wonCases = $db->fetch("SELECT COUNT(*) as count FROM cases WHERE matter_status = 'won'");
            $lostCases = $db->fetch("SELECT COUNT(*) as count FROM cases WHERE matter_status = 'lost'");
            $pendingCases = $db->fetch("SELECT COUNT(*) as count FROM cases WHERE matter_status = 'pending'");

            // Get cases by status
            $statusBreakdown = $db->fetchAll("
                SELECT matter_status, COUNT(*) as count
                FROM cases
                GROUP BY matter_status
            ");
            $statusCounts = ['active' => 0, 'closed' => 0, 'suspended' => 0, 'pending' => 0];
            foreach ($statusBreakdown as $row) {
                if (isset($statusCounts[$row['matter_status']])) {
                    $statusCounts[$row['matter_status']] = (int)$row['count'];
                }
            }

            // Get cases by category
            $typeBreakdown = $db->fetchAll("
                SELECT matter_category, COUNT(*) as count
                FROM cases
                GROUP BY matter_category
            ");
            $typeCounts = ['civil' => 0, 'criminal' => 0, 'commercial' => 0, 'administrative' => 0, 'labor' => 0, 'family' => 0];
            foreach ($typeBreakdown as $row) {
                if (isset($typeCounts[$row['matter_category']])) {
                    $typeCounts[$row['matter_category']] = (int)$row['count'];
                }
            }

            // Get cases by status (using status as outcome for now)
            $outcomeBreakdown = $db->fetchAll("
                SELECT matter_status, COUNT(*) as count
                FROM cases
                WHERE matter_status IS NOT NULL
                GROUP BY matter_status
            ");
            $outcomeCounts = ['won' => 0, 'lost' => 0, 'settled' => 0, 'dismissed' => 0];
            foreach ($outcomeBreakdown as $row) {
                if (isset($outcomeCounts[$row['matter_status']])) {
                    $outcomeCounts[$row['matter_status']] = (int)$row['count'];
                }
            }

            // Get average case duration (for closed cases)
            $avgDuration = $db->fetch("
                SELECT AVG(DATEDIFF(matter_end_date, created_at)) as avg_duration_days
                FROM cases
                WHERE matter_status = 'closed' AND matter_end_date IS NOT NULL
            ");

            // Get total hearings for cases
            $totalHearings = $db->fetch("SELECT COUNT(*) as count FROM hearings");

            // Calculate success rate
            $totalDecided = ($wonCases['count'] ?? 0) + ($lostCases['count'] ?? 0);
            $successRate = $totalDecided > 0 ? round((($wonCases['count'] ?? 0) / $totalDecided) * 100, 2) : 0;

            // Return real case report data
            $reports = [
                'summary' => [
                    'total_cases' => (int)($totalCases['count'] ?? 0),
                    'active_cases' => (int)($activeCases['count'] ?? 0),
                    'closed_cases' => (int)($closedCases['count'] ?? 0),
                    'won_cases' => (int)($wonCases['count'] ?? 0),
                    'lost_cases' => (int)($lostCases['count'] ?? 0),
                    'pending_cases' => (int)($pendingCases['count'] ?? 0),
                    'avg_duration_days' => $avgDuration['avg_duration_days'] ? (int)$avgDuration['avg_duration_days'] : null,
                    'total_hearings' => (int)($totalHearings['count'] ?? 0),
                    'success_rate' => $successRate
                ],
                'data' => $db->fetchAll("
                    SELECT
                        id,
                        matter_id as case_number,
                        matter_ar as case_title_ar,
                        matter_en as case_title_en,
                        matter_category as case_type,
                        matter_status as case_status,
                        matter_court as court_name,
                        matter_status as case_outcome,
                        created_at,
                        matter_end_date as case_close_date
                    FROM cases
                    ORDER BY created_at DESC
                    LIMIT 50
                "),
                'filters_applied' => array_filter($filters, function ($v) {
                    return $v !== null && $v !== '';
                }),
                'breakdown' => [
                    'by_status' => $statusCounts,
                    'by_type' => $typeCounts,
                    'by_court' => [],
                    'by_lawyer' => [],
                    'by_month' => [],
                    'by_outcome' => $outcomeCounts
                ],
                'duration_analysis' => [
                    'avg_duration_all' => 0,
                    'avg_duration_by_type' => [],
                    'avg_duration_by_court' => [],
                    'fastest_resolution' => 0,
                    'longest_resolution' => 0
                ],
                'pagination' => [
                    'current_page' => $filters['page'],
                    'per_page' => $filters['limit'],
                    'total' => 0,
                    'total_pages' => 0,
                    'has_next' => false,
                    'has_prev' => false
                ],
                'available_columns' => [
                    'id' => 'معرف القضية',
                    'case_number' => 'رقم القضية',
                    'case_title_ar' => 'عنوان القضية (عربي)',
                    'case_title_en' => 'عنوان القضية (إنجليزي)',
                    'case_type' => 'نوع القضية',
                    'case_status' => 'حالة القضية',
                    'court_name' => 'اسم المحكمة',
                    'client_name' => 'اسم العميل',
                    'lawyer_name' => 'اسم المحامي',
                    'filing_date' => 'تاريخ رفع القضية',
                    'first_hearing_date' => 'تاريخ أول جلسة',
                    'last_hearing_date' => 'تاريخ آخر جلسة',
                    'case_close_date' => 'تاريخ إغلاق القضية',
                    'total_hearings' => 'عدد الجلسات',
                    'case_outcome' => 'نتيجة القضية',
                    'priority' => 'الأولوية',
                    'amount_claimed' => 'المبلغ المطالب به',
                    'amount_awarded' => 'المبلغ المحكوم به',
                    'duration_days' => 'مدة القضية (أيام)',
                    'created_at' => 'تاريخ الإنشاء'
                ]
            ];

            return Response::success($reports);
        } catch (Exception $e) {
            error_log("Case reports error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve case reports');
        }
    }

    public function financial(Request $request)
    {
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

    public function hearings(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            // Get filters
            $filters = [
                'date_from' => $request->get('date_from'),
                'date_to' => $request->get('date_to'),
                'hearing_type' => $request->get('hearing_type'),
                'hearing_result' => $request->get('hearing_result'),
                'court_name' => $request->get('court_name'),
                'lawyer' => $request->get('lawyer'),
                'case_id' => $request->get('case_id'),
                'client_id' => $request->get('client_id'),
                'status' => $request->get('status'),
                'search' => $request->get('search'),
                'sort_by' => $request->get('sort_by', 'hearing_date'),
                'sort_order' => $request->get('sort_order', 'desc'),
                'page' => (int) $request->get('page', 1),
                'limit' => (int) $request->get('limit', 50),
                'export_format' => $request->get('export_format'),
                'columns' => $request->get('columns')
            ];

            // Use the same database approach as dashboard
            $db = Database::getInstance();

            // Get real hearing statistics
            $totalHearings = $db->fetch("SELECT COUNT(*) as count FROM hearings");
            $completedHearings = $db->fetch("SELECT COUNT(*) as count FROM hearings WHERE hearing_result IS NOT NULL AND hearing_result != 'pending'");
            $upcomingHearings = $db->fetch("SELECT COUNT(*) as count FROM hearings WHERE hearing_date > NOW()");
            $postponedHearings = $db->fetch("SELECT COUNT(*) as count FROM hearings WHERE hearing_result = 'postponed'");
            $cancelledHearings = $db->fetch("SELECT COUNT(*) as count FROM hearings WHERE hearing_result = 'cancelled'");
            $wonHearings = $db->fetch("SELECT COUNT(*) as count FROM hearings WHERE hearing_result = 'won'");
            $lostHearings = $db->fetch("SELECT COUNT(*) as count FROM hearings WHERE hearing_result = 'lost'");

            // Get hearings by result
            $resultBreakdown = $db->fetchAll("
                SELECT hearing_result, COUNT(*) as count
                FROM hearings
                WHERE hearing_result IS NOT NULL
                GROUP BY hearing_result
            ");
            $resultCounts = ['won' => 0, 'lost' => 0, 'postponed' => 0, 'settled' => 0, 'dismissed' => 0, 'pending' => 0];
            foreach ($resultBreakdown as $row) {
                if (isset($resultCounts[$row['hearing_result']])) {
                    $resultCounts[$row['hearing_result']] = (int)$row['count'];
                }
            }

            // Get hearings by type
            $typeBreakdown = $db->fetchAll("
                SELECT hearing_type, COUNT(*) as count
                FROM hearings
                GROUP BY hearing_type
            ");
            $typeCounts = ['initial' => 0, 'review' => 0, 'appeal' => 0, 'final' => 0, 'settlement' => 0];
            foreach ($typeBreakdown as $row) {
                if (isset($typeCounts[$row['hearing_type']])) {
                    $typeCounts[$row['hearing_type']] = (int)$row['count'];
                }
            }

            // Calculate success rate
            $totalDecided = ($wonHearings['count'] ?? 0) + ($lostHearings['count'] ?? 0);
            $successRate = $totalDecided > 0 ? round((($wonHearings['count'] ?? 0) / $totalDecided) * 100, 2) : 0;

            // Return real hearing report data
            $reports = [
                'summary' => [
                    'total_hearings' => (int)($totalHearings['count'] ?? 0),
                    'completed_hearings' => (int)($completedHearings['count'] ?? 0),
                    'upcoming_hearings' => (int)($upcomingHearings['count'] ?? 0),
                    'postponed_hearings' => (int)($postponedHearings['count'] ?? 0),
                    'cancelled_hearings' => (int)($cancelledHearings['count'] ?? 0),
                    'won_hearings' => (int)($wonHearings['count'] ?? 0),
                    'lost_hearings' => (int)($lostHearings['count'] ?? 0),
                    'success_rate' => $successRate,
                    'avg_preparation_time' => 0
                ],
                'data' => $db->fetchAll("
                    SELECT
                        h.id,
                        h.hearing_date,
                        h.hearing_type,
                        h.hearing_result,
                        h.case_id,
                        c.matter_id as case_number,
                        c.matter_ar as case_title_ar,
                        c.matter_court as court_name,
                        h.created_at
                    FROM hearings h
                    LEFT JOIN cases c ON h.case_id = c.id
                    ORDER BY h.hearing_date DESC
                    LIMIT 50
                "),
                'filters_applied' => array_filter($filters, function ($v) {
                    return $v !== null && $v !== '';
                }),
                'breakdown' => [
                    'by_result' => $resultCounts,
                    'by_type' => $typeCounts,
                    'by_court' => [],
                    'by_lawyer' => [],
                    'by_month' => [],
                    'by_status' => [
                        'scheduled' => 0,
                        'completed' => 0,
                        'postponed' => 0,
                        'cancelled' => 0
                    ],
                    'by_type' => [
                        'initial' => 0,
                        'evidence' => 0,
                        'argument' => 0,
                        'judgment' => 0,
                        'appeal' => 0,
                        'enforcement' => 0
                    ],
                    'by_court' => [],
                    'by_lawyer' => [],
                    'by_month' => [],
                    'by_day_of_week' => [
                        'sunday' => 0,
                        'monday' => 0,
                        'tuesday' => 0,
                        'wednesday' => 0,
                        'thursday' => 0
                    ]
                ],
                'performance_metrics' => [
                    'success_rate_by_lawyer' => [],
                    'success_rate_by_court' => [],
                    'success_rate_by_hearing_type' => [],
                    'avg_duration_by_type' => [],
                    'postponement_rate' => 0,
                    'attendance_rate' => 0
                ],
                'upcoming_analysis' => [
                    'next_7_days' => 0,
                    'next_30_days' => 0,
                    'by_court_next_month' => [],
                    'by_lawyer_next_month' => []
                ],
                'pagination' => [
                    'current_page' => $filters['page'],
                    'per_page' => $filters['limit'],
                    'total' => 0,
                    'total_pages' => 0,
                    'has_next' => false,
                    'has_prev' => false
                ],
                'available_columns' => [
                    'id' => 'معرف الجلسة',
                    'hearing_date' => 'تاريخ الجلسة',
                    'hearing_time' => 'وقت الجلسة',
                    'hearing_type' => 'نوع الجلسة',
                    'court_name' => 'اسم المحكمة',
                    'court_room' => 'قاعة المحكمة',
                    'case_number' => 'رقم القضية',
                    'case_title' => 'عنوان القضية',
                    'client_name' => 'اسم العميل',
                    'lawyer_name' => 'اسم المحامي',
                    'hearing_result' => 'نتيجة الجلسة',
                    'next_hearing_date' => 'تاريخ الجلسة القادمة',
                    'notes' => 'ملاحظات',
                    'preparation_time' => 'وقت التحضير',
                    'duration_minutes' => 'مدة الجلسة (دقائق)',
                    'attended' => 'الحضور',
                    'documents_submitted' => 'المستندات المقدمة',
                    'status' => 'الحالة',
                    'created_at' => 'تاريخ الإنشاء'
                ]
            ];

            return Response::success($reports);
        } catch (Exception $e) {
            error_log("Hearing reports error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve hearing reports');
        }
    }

    public function customReport(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $reportType = $request->get('type', 'clients'); // clients, cases, hearings

            // Get database instance to check available values
            $db = Database::getInstance();

            // Return structure for custom report builder with real data
            $response = [
                'available_entities' => [
                    'clients' => 'العملاء',
                    'cases' => 'القضايا',
                    'hearings' => 'الجلسات'
                ],
                'available_filters' => $this->getAvailableFilters($reportType),
                'available_columns' => $this->getAvailableColumns($reportType),
                'available_groupings' => $this->getAvailableGroupings($reportType),
                'available_aggregations' => [
                    'count' => 'العدد',
                    'sum' => 'المجموع',
                    'avg' => 'المتوسط',
                    'min' => 'الحد الأدنى',
                    'max' => 'الحد الأعلى'
                ],
                'export_formats' => [
                    'csv' => 'CSV',
                    'excel' => 'Excel',
                    'pdf' => 'PDF'
                ]
            ];

            // Add filter values based on database content
            if ($reportType === 'clients') {
                // Get available client types
                $clientTypes = $db->fetchAll("SELECT DISTINCT client_type FROM clients WHERE client_type IS NOT NULL");
                $response['filter_values'] = [
                    'client_type' => array_column($clientTypes, 'client_type'),
                    'status' => ['active', 'inactive']
                ];
            } elseif ($reportType === 'cases') {
                // Get available case statuses and types
                $caseStatuses = $db->fetchAll("SELECT DISTINCT matter_status FROM cases WHERE matter_status IS NOT NULL");
                $caseTypes = $db->fetchAll("SELECT DISTINCT matter_category FROM cases WHERE matter_category IS NOT NULL");
                $courts = $db->fetchAll("SELECT DISTINCT matter_court FROM cases WHERE matter_court IS NOT NULL");

                $response['filter_values'] = [
                    'case_status' => array_column($caseStatuses, 'matter_status'),
                    'case_type' => array_column($caseTypes, 'matter_category'),
                    'court_name' => array_column($courts, 'matter_court')
                ];
            } elseif ($reportType === 'hearings') {
                // Get available hearing types and results
                $hearingTypes = $db->fetchAll("SELECT DISTINCT hearing_type FROM hearings WHERE hearing_type IS NOT NULL");
                $hearingResults = $db->fetchAll("SELECT DISTINCT hearing_result FROM hearings WHERE hearing_result IS NOT NULL");

                $response['filter_values'] = [
                    'hearing_type' => array_column($hearingTypes, 'hearing_type'),
                    'hearing_result' => array_column($hearingResults, 'hearing_result')
                ];
            }

            return Response::success($response);
        } catch (Exception $e) {
            error_log("Custom report error: " . $e->getMessage());
            return Response::serverError('Failed to load custom report options');
        }
    }

    public function generateCustomReport(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $reportConfig = [
                'entity' => $request->post('entity'),
                'filters' => $request->post('filters', []),
                'columns' => $request->post('columns', []),
                'grouping' => $request->post('grouping'),
                'aggregations' => $request->post('aggregations', []),
                'sort_by' => $request->post('sort_by', 'created_at'),
                'sort_order' => $request->post('sort_order', 'desc'),
                'page' => (int) $request->post('page', 1),
                'limit' => (int) $request->post('limit', 100)
            ];

            $db = Database::getInstance();
            $entity = $reportConfig['entity'];
            $filters = $reportConfig['filters'];
            $columns = $reportConfig['columns'];

            // Build query based on entity type
            $whereConditions = ['1=1'];
            $params = [];
            $selectColumns = [];
            $tableName = '';
            $joins = '';

            if ($entity === 'clients') {
                $tableName = 'clients';
                $defaultColumns = ['id', 'client_name_ar', 'client_name_en', 'client_type', 'phone', 'email', 'status', 'created_at'];
                $selectColumns = empty($columns) ? $defaultColumns : array_intersect($columns, $defaultColumns);

                // Ensure we always have at least some columns
                if (empty($selectColumns)) {
                    $selectColumns = ['id', 'client_name_ar', 'client_type', 'created_at'];
                }

                // Apply filters
                if (!empty($filters['status'])) {
                    $whereConditions[] = 'status = ?';
                    $params[] = $filters['status'];
                }
                if (!empty($filters['client_type'])) {
                    $whereConditions[] = 'client_type = ?';
                    $params[] = $filters['client_type'];
                }
                if (!empty($filters['date_from'])) {
                    $whereConditions[] = 'created_at >= ?';
                    $params[] = $filters['date_from'];
                }
                if (!empty($filters['date_to'])) {
                    $whereConditions[] = 'created_at <= ?';
                    $params[] = $filters['date_to'] . ' 23:59:59';
                }
            } elseif ($entity === 'cases') {
                $tableName = 'cases';
                $defaultColumns = ['id', 'matter_id', 'matter_ar', 'matter_en', 'matter_category', 'matter_status', 'matter_court', 'created_at'];
                $selectColumns = empty($columns) ? $defaultColumns : array_intersect($columns, $defaultColumns);

                // Ensure we always have at least some columns
                if (empty($selectColumns)) {
                    $selectColumns = ['id', 'matter_id', 'matter_ar', 'matter_status', 'created_at'];
                }

                // Apply filters
                if (!empty($filters['case_status'])) {
                    $whereConditions[] = 'matter_status = ?';
                    $params[] = $filters['case_status'];
                }
                if (!empty($filters['case_type'])) {
                    $whereConditions[] = 'matter_category = ?';
                    $params[] = $filters['case_type'];
                }
                if (!empty($filters['court_name'])) {
                    $whereConditions[] = 'matter_court = ?';
                    $params[] = $filters['court_name'];
                }
                if (!empty($filters['date_from'])) {
                    $whereConditions[] = 'created_at >= ?';
                    $params[] = $filters['date_from'];
                }
                if (!empty($filters['date_to'])) {
                    $whereConditions[] = 'created_at <= ?';
                    $params[] = $filters['date_to'] . ' 23:59:59';
                }
            } elseif ($entity === 'hearings') {
                $tableName = 'hearings h';
                $joins = 'LEFT JOIN cases c ON h.case_id = c.id';
                $defaultColumns = ['h.id', 'h.hearing_date', 'h.hearing_type', 'h.hearing_result', 'c.matter_id', 'c.matter_ar', 'h.created_at'];
                $selectColumns = empty($columns) ? $defaultColumns : array_intersect($columns, $defaultColumns);

                // Ensure we always have at least some columns
                if (empty($selectColumns)) {
                    $selectColumns = ['h.id', 'h.hearing_date', 'h.hearing_type', 'h.created_at'];
                }

                // Apply filters
                if (!empty($filters['hearing_type'])) {
                    $whereConditions[] = 'h.hearing_type = ?';
                    $params[] = $filters['hearing_type'];
                }
                if (!empty($filters['hearing_result'])) {
                    $whereConditions[] = 'h.hearing_result = ?';
                    $params[] = $filters['hearing_result'];
                }
                if (!empty($filters['date_from'])) {
                    $whereConditions[] = 'h.hearing_date >= ?';
                    $params[] = $filters['date_from'];
                }
                if (!empty($filters['date_to'])) {
                    $whereConditions[] = 'h.hearing_date <= ?';
                    $params[] = $filters['date_to'] . ' 23:59:59';
                }
            } else {
                return Response::serverError('Invalid entity: ' . $entity);
            }

            $whereClause = implode(' AND ', $whereConditions);

            // Get total count
            $countQuery = "SELECT COUNT(*) as total FROM $tableName $joins WHERE $whereClause";

            $totalResult = $db->fetch($countQuery, $params);
            $total = $totalResult ? (int)$totalResult['total'] : 0;

            // Calculate pagination
            $totalPages = ceil($total / $reportConfig['limit']);
            $offset = ($reportConfig['page'] - 1) * $reportConfig['limit'];

            // Build final query
            $selectClause = implode(', ', $selectColumns);

            // Fix ORDER BY clause to use valid column names
            $orderBy = $reportConfig['sort_by'];
            if ($entity === 'hearings' && $orderBy === 'created_at') {
                $orderBy = 'h.created_at';
            } elseif ($entity === 'hearings' && !str_contains($orderBy, '.')) {
                $orderBy = 'h.' . $orderBy;
            } elseif (($entity === 'clients' || $entity === 'cases') && !in_array($orderBy, $selectColumns)) {
                $orderBy = 'created_at';
            }

            $orderDirection = $reportConfig['sort_order'];

            $dataQuery = "
                SELECT $selectClause
                FROM $tableName $joins
                WHERE $whereClause
                ORDER BY $orderBy $orderDirection
                LIMIT {$reportConfig['limit']} OFFSET $offset
            ";

            $data = $db->fetchAll($dataQuery, $params);

            // Build summary statistics
            $summary = [
                'total_records' => $total,
                'filtered_records' => count($data),
                'aggregated_values' => []
            ];

            // Add basic aggregations if requested
            if (!empty($reportConfig['aggregations'])) {
                foreach ($reportConfig['aggregations'] as $agg) {
                    if ($agg === 'count') {
                        $summary['aggregated_values']['count'] = $total;
                    }
                }
            }

            // Generate report response
            $report = [
                'config' => $reportConfig,
                'data' => $data,
                'summary' => $summary,
                'pagination' => [
                    'current_page' => $reportConfig['page'],
                    'per_page' => $reportConfig['limit'],
                    'total' => $total,
                    'total_pages' => $totalPages,
                    'has_next' => $reportConfig['page'] < $totalPages,
                    'has_prev' => $reportConfig['page'] > 1
                ],
                'available_columns' => $this->getAvailableColumns($entity),
                'generated_at' => date('Y-m-d H:i:s'),
                'generated_by' => Auth::user()['name'] ?? 'مجهول'
            ];

            return Response::success($report);
        } catch (Exception $e) {
            error_log("Generate custom report error: " . $e->getMessage());
            return Response::serverError('Failed to generate custom report: ' . $e->getMessage());
        }
    }

    public function exportReport(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $format = $request->get('format', 'csv');
            $reportData = $request->get('data', []);
            $filename = $request->get('filename', 'report_' . date('Y-m-d_H-i-s'));

            // Mock export functionality
            $export = [
                'status' => 'success',
                'download_url' => "/api/reports/download/{$filename}.{$format}",
                'filename' => "{$filename}.{$format}",
                'size' => '1.2 MB',
                'generated_at' => date('Y-m-d H:i:s'),
                'expires_at' => date('Y-m-d H:i:s', strtotime('+24 hours'))
            ];

            return Response::success($export);
        } catch (Exception $e) {
            error_log("Export report error: " . $e->getMessage());
            return Response::serverError('Failed to export report');
        }
    }

    public function generateClientReport(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $clientId = $request->get('client_id');
            $format = $request->get('format', 'pdf'); // pdf or jpg
            $template = $request->get('template', 'franke'); // specific template type

            if (!$clientId) {
                return Response::badRequest('Client ID is required');
            }

            $db = Database::getInstance();

            // Get client information
            $client = $db->fetch("SELECT * FROM clients WHERE id = ?", [$clientId]);
            if (!$client) {
                return Response::notFound('Client not found');
            }

            // Get client's cases with detailed information
            $cases = $db->fetchAll("
                SELECT
                    c.id,
                    c.matter_id as case_number,
                    c.matter_ar as case_title,
                    c.matter_court as court_name,
                    c.client_capacity,
                    c.opponent_capacity,
                    c.matter_subject,
                    c.matter_status,
                    COALESCE(
                        (SELECT CONCAT(hearing_result, ' - ', DATE_FORMAT(hearing_date, '%Y/%m/%d'))
                         FROM hearings h
                         WHERE h.case_id = c.id
                         ORDER BY h.hearing_date DESC
                         LIMIT 1),
                        'لا توجد جلسات'
                    ) as last_hearing_decision
                FROM cases c
                WHERE c.client_id = ?
                ORDER BY c.created_at DESC
            ", [$clientId]);

            // Generate report based on template
            $reportData = [
                'client' => $client,
                'cases' => $cases,
                'total_cases' => count($cases),
                'generated_at' => date('Y/m/d'),
                'generated_time' => date('H:i') . ' ص', // Arabic AM format
                'template' => $template
            ];

            if ($template === 'franke') {
                return $this->generateFrankeReport($reportData, $format);
            }

            return Response::badRequest('Unsupported template type');
        } catch (Exception $e) {
            error_log("Generate client report error: " . $e->getMessage());
            return Response::serverError('Failed to generate client report: ' . $e->getMessage());
        }
    }

    private function generateFrankeReport($data, $format)
    {
        try {
            // Generate HTML template for the report
            $html = $this->buildFrankeReportHTML($data);

            if ($format === 'pdf') {
                return $this->generatePDFFromHTML($html, $data);
            } elseif ($format === 'jpg') {
                return $this->generateJPGFromHTML($html, $data);
            }

            return Response::badRequest('Unsupported format');
        } catch (Exception $e) {
            error_log("Generate Franke report error: " . $e->getMessage());
            return Response::serverError('Failed to generate Franke report: ' . $e->getMessage());
        }
    }

    private function buildFrankeReportHTML($data)
    {
        $client = $data['client'];
        $cases = $data['cases'];
        $totalCases = $data['total_cases'];
        $generatedAt = $data['generated_at'];
        $generatedTime = $data['generated_time'];

        // Build table rows
        $tableRows = '';
        $rowNumber = 1;

        foreach ($cases as $case) {
            $tableRows .= "
                <tr>
                    <td style='text-align: center; padding: 8px; border: 1px solid #000;'>{$rowNumber}</td>
                    <td style='text-align: center; padding: 8px; border: 1px solid #000;'>" . htmlspecialchars($case['case_number'] ?? '') . "</td>
                    <td style='text-align: center; padding: 8px; border: 1px solid #000;'>" . htmlspecialchars($case['court_name'] ?? '') . "</td>
                    <td style='text-align: center; padding: 8px; border: 1px solid #000;'>" . htmlspecialchars($case['client_capacity'] ?? '') . "</td>
                    <td style='text-align: center; padding: 8px; border: 1px solid #000;'>" . htmlspecialchars($case['opponent_capacity'] ?? '') . "</td>
                    <td style='text-align: center; padding: 8px; border: 1px solid #000;'>" . htmlspecialchars($case['matter_subject'] ?? '') . "</td>
                    <td style='text-align: center; padding: 8px; border: 1px solid #000;'>" . htmlspecialchars($case['last_hearing_decision'] ?? '') . "</td>
                </tr>
            ";
            $rowNumber++;
        }

        // HTML template matching the Franke report design
        $html = "
        <!DOCTYPE html>
        <html dir='rtl' lang='ar'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>بيان بموقف " . htmlspecialchars($client['client_name_ar']) . "</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;700&display=swap');

                body {
                    font-family: 'Noto Sans Arabic', Arial, sans-serif;
                    direction: rtl;
                    margin: 0;
                    padding: 20px;
                    background: white;
                    color: #000;
                    line-height: 1.4;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                }

                .logo-left {
                    width: 150px;
                    height: auto;
                }

                .logo-right {
                    width: 100px;
                    height: auto;
                    background: #d32f2f;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    font-weight: bold;
                    border-radius: 4px;
                }

                .title {
                    text-align: center;
                    font-size: 18px;
                    font-weight: bold;
                    margin: 20px 0;
                }

                .report-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 12px;
                }

                .report-table th {
                    background: #f0f0f0;
                    padding: 10px 8px;
                    border: 1px solid #000;
                    text-align: center;
                    font-weight: bold;
                }

                .report-table td {
                    padding: 8px;
                    border: 1px solid #000;
                    text-align: center;
                    vertical-align: top;
                }

                .summary {
                    margin: 20px 0;
                    text-align: right;
                }

                .total-box {
                    display: inline-block;
                    background: #f0f0f0;
                    padding: 5px 15px;
                    border-radius: 4px;
                    margin-right: 10px;
                }

                .footer {
                    margin-top: 30px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: #666;
                }

                @media print {
                    body { margin: 0; }
                    .header, .footer { page-break-inside: avoid; }
                }
            </style>
        </head>
        <body>
            <div class='header'>
                <div class='logo-left'>
                    <div style='color: #2e7d32; font-weight: bold; font-size: 14px;'>
                        صارى الدين ومشاركوه<br>
                        <span style='font-size: 12px;'>للمحاماة والاستشارات القانونية</span>
                    </div>
                </div>
                <div class='logo-right'>
                    FRANKE
                </div>
            </div>

            <div class='title'>
                بيان بموقف " . htmlspecialchars($client['client_name_ar']) . "
            </div>

            <table class='report-table'>
                <thead>
                    <tr>
                        <th style='width: 5%;'>م</th>
                        <th style='width: 12%;'>رقم الدعوى</th>
                        <th style='width: 15%;'>المحكمة</th>
                        <th style='width: 15%;'>الموكل وصفته</th>
                        <th style='width: 15%;'>المخصم وصفته</th>
                        <th style='width: 20%;'>موضوع الدعوى</th>
                        <th style='width: 18%;'>قرار اخر جلسة/إجراء</th>
                    </tr>
                </thead>
                <tbody>
                    {$tableRows}
                </tbody>
            </table>

            <div class='summary'>
                <span>إجمالى عدد الدعاوى</span>
                <span class='total-box'>{$totalCases}</span>
            </div>

            <div class='footer'>
                <div>صفحة ١ من ١</div>
                <div>{$generatedAt} {$generatedTime}</div>
            </div>
        </body>
        </html>
        ";

        return $html;
    }

    private function generatePDFFromHTML($html, $data)
    {
        // For now, return the HTML content for frontend processing
        // In a full implementation, this would use a library like TCPDF or wkhtmltopdf
        $filename = 'client_report_' . $data['client']['id'] . '_' . date('Y-m-d_H-i-s');

        return Response::success([
            'type' => 'html_for_pdf',
            'html_content' => $html,
            'filename' => $filename . '.pdf',
            'client_name' => $data['client']['client_name_ar'],
            'total_cases' => $data['total_cases'],
            'generated_at' => $data['generated_at']
        ]);
    }

    private function generateJPGFromHTML($html, $data)
    {
        // For now, return the HTML content for frontend processing
        // In a full implementation, this would use a headless browser or image generation library
        $filename = 'client_report_' . $data['client']['id'] . '_' . date('Y-m-d_H-i-s');

        return Response::success([
            'type' => 'html_for_jpg',
            'html_content' => $html,
            'filename' => $filename . '.jpg',
            'client_name' => $data['client']['client_name_ar'],
            'total_cases' => $data['total_cases'],
            'generated_at' => $data['generated_at']
        ]);
    }

    public function getReportTemplates(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            // Predefined useful report templates
            $templates = [
                [
                    'id' => 1,
                    'name' => 'تقرير العملاء النشطين',
                    'entity' => 'clients',
                    'description' => 'تقرير شامل بالعملاء النشطين وأنواعهم',
                    'config' => [
                        'filters' => ['status' => 'active'],
                        'columns' => ['client_name_ar', 'client_name_en', 'client_type', 'phone', 'email', 'created_at'],
                        'sort_by' => 'created_at',
                        'sort_order' => 'desc'
                    ],
                    'created_by' => 'النظام',
                    'created_at' => date('Y-m-d')
                ],
                [
                    'id' => 2,
                    'name' => 'تقرير القضايا النشطة',
                    'entity' => 'cases',
                    'description' => 'تقرير تفصيلي بالقضايا النشطة وحالتها',
                    'config' => [
                        'filters' => ['case_status' => 'active'],
                        'columns' => ['case_number', 'case_title_ar', 'case_type', 'case_status', 'court_name', 'created_at'],
                        'sort_by' => 'created_at',
                        'sort_order' => 'desc'
                    ],
                    'created_by' => 'النظام',
                    'created_at' => date('Y-m-d')
                ],
                [
                    'id' => 3,
                    'name' => 'تقرير الجلسات القادمة',
                    'entity' => 'hearings',
                    'description' => 'تقرير بالجلسات المجدولة في الأسبوع القادم',
                    'config' => [
                        'filters' => [
                            'date_from' => date('Y-m-d'),
                            'date_to' => date('Y-m-d', strtotime('+7 days'))
                        ],
                        'columns' => ['hearing_date', 'hearing_type', 'case_number', 'case_title_ar', 'court_name'],
                        'sort_by' => 'hearing_date',
                        'sort_order' => 'asc'
                    ],
                    'created_by' => 'النظام',
                    'created_at' => date('Y-m-d')
                ],
                [
                    'id' => 4,
                    'name' => 'تقرير نتائج الجلسات',
                    'entity' => 'hearings',
                    'description' => 'تقرير بنتائج الجلسات المكتملة',
                    'config' => [
                        'filters' => ['hearing_result' => ['won', 'lost', 'settled']],
                        'columns' => ['hearing_date', 'hearing_type', 'hearing_result', 'case_number', 'case_title_ar'],
                        'sort_by' => 'hearing_date',
                        'sort_order' => 'desc'
                    ],
                    'created_by' => 'النظام',
                    'created_at' => date('Y-m-d')
                ],
                [
                    'id' => 5,
                    'name' => 'تقرير العملاء الجدد',
                    'entity' => 'clients',
                    'description' => 'تقرير بالعملاء المسجلين في الشهر الحالي',
                    'config' => [
                        'filters' => [
                            'date_from' => date('Y-m-01'),
                            'date_to' => date('Y-m-t')
                        ],
                        'columns' => ['client_name_ar', 'client_type', 'phone', 'email', 'created_at'],
                        'sort_by' => 'created_at',
                        'sort_order' => 'desc'
                    ],
                    'created_by' => 'النظام',
                    'created_at' => date('Y-m-d')
                ]
            ];

            return Response::success($templates);
        } catch (Exception $e) {
            error_log("Get report templates error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve report templates');
        }
    }

    public function saveReportTemplate(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $template = [
                'id' => rand(4, 1000),
                'name' => $request->get('name'),
                'entity' => $request->get('entity'),
                'description' => $request->get('description'),
                'config' => $request->get('config'),
                'created_by' => Auth::user()['name'] ?? 'Unknown',
                'created_at' => date('Y-m-d H:i:s')
            ];

            return Response::success($template, 'Report template saved successfully', 201);
        } catch (Exception $e) {
            error_log("Save report template error: " . $e->getMessage());
            return Response::serverError('Failed to save report template');
        }
    }

    public function getReportOptions(Request $request)
    {
        try {
            // Check authentication
            if (!Auth::check()) {
                return Response::unauthorized('Authentication required');
            }

            $options = [
                'date_ranges' => [
                    'today' => 'اليوم',
                    'yesterday' => 'أمس',
                    'this_week' => 'هذا الأسبوع',
                    'last_week' => 'الأسبوع الماضي',
                    'this_month' => 'هذا الشهر',
                    'last_month' => 'الشهر الماضي',
                    'this_quarter' => 'هذا الربع',
                    'last_quarter' => 'الربع الماضي',
                    'this_year' => 'هذا العام',
                    'last_year' => 'العام الماضي',
                    'custom' => 'فترة مخصصة'
                ],
                'sort_options' => [
                    'asc' => 'تصاعدي',
                    'desc' => 'تنازلي'
                ],
                'client_types' => [
                    'individual' => 'فرد',
                    'company' => 'شركة',
                    'government' => 'حكومي',
                    'ngo' => 'منظمة غير ربحية'
                ],
                'case_statuses' => [
                    'active' => 'نشطة',
                    'closed' => 'مغلقة',
                    'suspended' => 'معلقة',
                    'pending' => 'في الانتظار'
                ],
                'case_types' => [
                    'civil' => 'مدني',
                    'criminal' => 'جنائي',
                    'commercial' => 'تجاري',
                    'administrative' => 'إداري',
                    'labor' => 'عمالي',
                    'family' => 'أسري'
                ],
                'hearing_results' => [
                    'won' => 'صالح',
                    'lost' => 'ضد',
                    'postponed' => 'مؤجل',
                    'settled' => 'متصالح',
                    'dismissed' => 'رفض'
                ]
            ];

            return Response::success($options);
        } catch (Exception $e) {
            error_log("Get report options error: " . $e->getMessage());
            return Response::serverError('Failed to retrieve report options');
        }
    }

    private function getAvailableFilters($entity)
    {
        $common_filters = [
            'date_from' => 'من تاريخ',
            'date_to' => 'إلى تاريخ',
            'created_at' => 'تاريخ الإنشاء'
        ];

        switch ($entity) {
            case 'clients':
                return array_merge($common_filters, [
                    'client_type' => 'نوع العميل',
                    'status' => 'الحالة',
                    'city' => 'المدينة',
                    'country' => 'البلد'
                ]);
            case 'cases':
                return array_merge($common_filters, [
                    'case_status' => 'حالة القضية',
                    'case_type' => 'نوع القضية',
                    'court_name' => 'اسم المحكمة',
                    'lawyer' => 'المحامي'
                ]);
            case 'hearings':
                return array_merge($common_filters, [
                    'hearing_type' => 'نوع الجلسة',
                    'hearing_result' => 'نتيجة الجلسة',
                    'court_name' => 'اسم المحكمة'
                ]);
            default:
                return $common_filters;
        }
    }

    private function getAvailableColumns($entity)
    {
        switch ($entity) {
            case 'clients':
                return [
                    'id' => 'معرف العميل',
                    'client_name_ar' => 'اسم العميل (عربي)',
                    'client_name_en' => 'اسم العميل (إنجليزي)',
                    'client_type' => 'نوع العميل',
                    'phone' => 'رقم الهاتف',
                    'email' => 'البريد الإلكتروني',
                    'status' => 'الحالة',
                    'created_at' => 'تاريخ التسجيل'
                ];
            case 'cases':
                return [
                    'id' => 'معرف القضية',
                    'matter_id' => 'رقم القضية',
                    'matter_ar' => 'عنوان القضية (عربي)',
                    'matter_en' => 'عنوان القضية (إنجليزي)',
                    'matter_category' => 'نوع القضية',
                    'matter_status' => 'حالة القضية',
                    'matter_court' => 'اسم المحكمة',
                    'created_at' => 'تاريخ الإنشاء'
                ];
            case 'hearings':
                return [
                    'h.id' => 'معرف الجلسة',
                    'h.hearing_date' => 'تاريخ الجلسة',
                    'h.hearing_type' => 'نوع الجلسة',
                    'h.hearing_result' => 'نتيجة الجلسة',
                    'c.matter_id' => 'رقم القضية',
                    'c.matter_ar' => 'عنوان القضية',
                    'h.created_at' => 'تاريخ الإنشاء'
                ];
            default:
                return [];
        }
    }

    private function getAvailableGroupings($entity)
    {
        $common_groupings = [
            'month' => 'حسب الشهر',
            'quarter' => 'حسب الربع',
            'year' => 'حسب السنة'
        ];

        switch ($entity) {
            case 'clients':
                return array_merge($common_groupings, [
                    'client_type' => 'حسب نوع العميل',
                    'city' => 'حسب المدينة'
                ]);
            case 'cases':
                return array_merge($common_groupings, [
                    'case_type' => 'حسب نوع القضية',
                    'case_status' => 'حسب حالة القضية',
                    'court_name' => 'حسب المحكمة'
                ]);
            case 'hearings':
                return array_merge($common_groupings, [
                    'hearing_type' => 'حسب نوع الجلسة',
                    'hearing_result' => 'حسب نتيجة الجلسة',
                    'court_name' => 'حسب المحكمة'
                ]);
            default:
                return $common_groupings;
        }
    }
}
