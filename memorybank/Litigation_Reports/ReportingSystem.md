# Advanced Reporting System Documentation

## System Overview
The Advanced Reporting System provides comprehensive, customizable, and filterable reports for all litigation management data including clients, cases, hearings, invoices, and lawyers. Built with React frontend and PHP backend serving from same-origin lit.local architecture.

## Architecture Components

### Backend API Structure

#### ReportController.php Endpoints
```php
// Dashboard and Overview
GET  /api/reports/dashboard     # Comprehensive dashboard metrics
GET  /api/reports/clients       # Clients report with advanced filtering  
GET  /api/reports/cases         # Cases report with filtering
GET  /api/reports/hearings      # Hearings report with filtering
GET  /api/reports/financial     # Financial summary and trends

// Advanced Reporting Features
GET  /api/reports/custom        # Report builder configuration options
POST /api/reports/custom        # Generate custom reports
GET  /api/reports/templates     # User's saved report templates
POST /api/reports/templates     # Save new report template
GET  /api/reports/export        # Export reports (CSV, Excel, PDF)
GET  /api/reports/options       # Available filter and column options
```

#### Key Backend Methods

##### Dashboard Data Generation
```php
public function dashboard(Request $request) {
    return [
        'total_clients' => $this->getClientStats(),
        'total_cases' => $this->getCaseStats(), 
        'total_hearings' => $this->getHearingStats(),
        'total_invoices' => $this->getInvoiceStats(),
        'total_lawyers' => $this->getLawyerStats(),
        'financial_summary' => [
            'total_revenue' => $this->calculateTotalRevenue(),
            'paid_amount' => $this->getPaidAmount(),
            'pending_amount' => $this->getPendingAmount(),
            'overdue_count' => $this->getOverdueCount()
        ],
        'recent_activities' => $this->getRecentActivities(10),
        'upcoming_hearings' => $this->getUpcomingHearings(5),
        'case_statistics' => $this->getCaseStatisticsByStatus(),
        'hearing_statistics' => $this->getHearingStatisticsByStatus(),
        'revenue_trend' => $this->getMonthlyRevenueTrend(6)
    ];
}
```

##### Advanced Filtering System
```php
public function clients(Request $request) {
    $filters = [
        'search' => $request->get('search'),
        'status' => $request->get('status'),
        'client_type' => $request->get('client_type'),
        'contact_lawyer' => $request->get('contact_lawyer'),
        'date_from' => $request->get('date_from'),
        'date_to' => $request->get('date_to'),
        'cash_pro_bono' => $request->get('cash_pro_bono')
    ];
    
    $columns = $request->get('columns', [
        'client_name_ar', 'client_type', 'status', 
        'contact_lawyer', 'phone', 'created_at'
    ]);
    
    $pagination = [
        'page' => (int) $request->get('page', 1),
        'limit' => (int) $request->get('limit', 20)
    ];
    
    return $this->generateClientReport($filters, $columns, $pagination);
}
```

##### Custom Report Builder
```php
public function customReport(Request $request) {
    $reportType = $request->get('type', 'clients');
    
    return [
        'available_entities' => [
            'clients' => 'العملاء',
            'cases' => 'القضايا', 
            'hearings' => 'الجلسات',
            'invoices' => 'الفواتير',
            'lawyers' => 'المحامين'
        ],
        'available_filters' => $this->getAvailableFilters($reportType),
        'available_columns' => $this->getAvailableColumns($reportType),
        'grouping_options' => $this->getGroupingOptions($reportType),
        'sort_options' => $this->getSortOptions($reportType)
    ];
}
```

##### Template Management System
```php
public function getReportTemplates(Request $request) {
    return [
        [
            'id' => 1,
            'name' => 'تقرير العملاء النشطين',
            'entity' => 'clients',
            'description' => 'تقرير شامل للعملاء النشطين مع معلومات الاتصال',
            'config' => [
                'filters' => ['status' => 'active'],
                'columns' => ['client_name_ar', 'contact_lawyer', 'phone'],
                'grouping' => 'contact_lawyer'
            ],
            'created_by' => 'Admin',
            'created_at' => '2025-09-20'
        ],
        [
            'id' => 2,
            'name' => 'تقرير القضايا الحالية',
            'entity' => 'cases',
            'description' => 'تقرير بالقضايا النشطة والمعلقة',
            'config' => [
                'filters' => ['status' => ['active', 'suspended']],
                'columns' => ['matter_ar', 'client_name', 'status', 'assigned_lawyer'],
                'sort_by' => 'case_start_date'
            ],
            'created_by' => 'Admin',
            'created_at' => '2025-09-20'
        ]
    ];
}
```

### Frontend Implementation

#### ReportsPage.tsx Structure
```typescript
const ReportsPage: React.FC = () => {
  // State Management
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [reportConfig, setReportConfig] = useState<CustomReportConfig>({
    entity: 'clients',
    filters: {},
    columns: [],
  });

  // Component Sections
  return (
    <Container fluid className='py-4'>
      {/* Dashboard Overview */}
      <DashboardMetrics data={dashboardData} />
      <FinancialSummary data={dashboardData.financial_summary} />
      <RecentActivities activities={dashboardData.recent_activities} />
      
      {/* Quick Report Access */}
      <QuickReportCards onCustomize={openReportBuilder} />
      
      {/* Advanced Modals */}
      <ReportBuilderModal />
      <TemplatesModal />
      <DetailedReportModal />
    </Container>
  );
};
```

#### Dashboard Metrics Display
```typescript
// Key Metrics Cards
<Row className='mb-4'>
  <Col md={2} className='mb-3'>
    <Card className='h-100 text-center border-primary'>
      <Card.Body>
        <Users size={32} className='text-primary mb-2' />
        <h3 className='mb-1'>{dashboardData.total_clients}</h3>
        <p className='text-muted mb-0'>العملاء</p>
      </Card.Body>
    </Card>
  </Col>
  {/* Similar cards for Cases, Hearings, Invoices, Lawyers, Revenue */}
</Row>

// Financial Summary with Charts
<Card>
  <Card.Header>
    <h5 className='mb-0'>الملخص المالي</h5>
  </Card.Header>
  <Card.Body>
    <Row>
      <Col md={4} className='text-center'>
        <h4 className='text-success'>{formatCurrency(paid_amount)}</h4>
        <p className='text-muted'>المدفوع ({paid_count} فاتورة)</p>
      </Col>
      <Col md={4} className='text-center'>
        <h4 className='text-warning'>{formatCurrency(pending_amount)}</h4>
        <p className='text-muted'>المعلق ({pending_count} فاتورة)</p>
      </Col>
      <Col md={4} className='text-center'>
        <h4 className='text-danger'>{overdue_count}</h4>
        <p className='text-muted'>فواتير متأخرة</p>
      </Col>
    </Row>
  </Card.Body>
</Card>
```

#### Quick Report Access Cards
```typescript
// Detailed Reports Section with View/Customize Buttons
<Row>
  <Col md={4} className='mb-3'>
    <Card className='h-100 border-primary'>
      <Card.Body className='text-center'>
        <Users size={48} className='text-primary mb-3' />
        <h5>تقارير العملاء</h5>
        <p className='text-muted mb-3'>تقارير شاملة عن العملاء والأنشطة</p>
        
        {/* View Button */}
        <Button
          variant='primary'
          size='sm'
          className='me-2'
          onClick={() => generateDetailedReport('clients')}
          disabled={reportLoading}
        >
          <Eye className='me-1' size={14} />
          عرض
        </Button>
        
        {/* Customize Button */}
        <Button
          variant='outline-primary'
          size='sm'
          onClick={() => openCustomReportBuilder('clients')}
        >
          <Settings className='me-1' size={14} />
          تخصيص
        </Button>
      </Card.Body>
    </Card>
  </Col>
  {/* Similar cards for Cases and Hearings */}
</Row>
```

#### Report Builder Modal
```typescript
<Modal show={showReportBuilder} onHide={() => setShowReportBuilder(false)} size='lg'>
  <Modal.Header closeButton>
    <Modal.Title>إنشاء تقرير مخصص</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Tabs defaultActiveKey='filters' className='mb-3'>
      
      {/* Filters Tab */}
      <Tab eventKey='filters' title='المرشحات'>
        <Row>
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>نوع التقرير</Form.Label>
              <Form.Select
                value={reportConfig.entity}
                onChange={(e) => updateReportEntity(e.target.value)}
              >
                {Object.entries(availableEntities).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>من تاريخ</Form.Label>
              <Form.Control
                type='date'
                value={reportConfig.filters.date_from || ''}
                onChange={(e) => updateFilter('date_from', e.target.value)}
              />
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className='mb-3'>
              <Form.Label>إلى تاريخ</Form.Label>
              <Form.Control
                type='date'
                value={reportConfig.filters.date_to || ''}
                onChange={(e) => updateFilter('date_to', e.target.value)}
              />
            </Form.Group>
          </Col>
          
          {/* Dynamic filters based on entity type */}
          {reportConfig.entity === 'clients' && (
            <Col md={6}>
              <Form.Group className='mb-3'>
                <Form.Label>نوع العميل</Form.Label>
                <Form.Select
                  value={reportConfig.filters.client_type || ''}
                  onChange={(e) => updateFilter('client_type', e.target.value)}
                >
                  <option value=''>الكل</option>
                  <option value='individual'>فرد</option>
                  <option value='company'>شركة</option>
                  <option value='government'>حكومي</option>
                </Form.Select>
              </Form.Group>
            </Col>
          )}
        </Row>
      </Tab>
      
      {/* Columns Tab */}
      <Tab eventKey='columns' title='الأعمدة'>
        <Row>
          {Object.entries(availableColumns).map(([key, value]) => (
            <Col md={6} key={key} className='mb-2'>
              <Form.Check
                type='checkbox'
                id={`column-${key}`}
                label={value}
                checked={reportConfig.columns.includes(key)}
                onChange={(e) => toggleColumn(key, e.target.checked)}
              />
            </Col>
          ))}
        </Row>
      </Tab>
      
    </Tabs>
  </Modal.Body>
  <Modal.Footer>
    <Button variant='secondary' onClick={() => setShowReportBuilder(false)}>
      إلغاء
    </Button>
    <Button
      variant='primary'
      onClick={() => generateCustomReport(reportConfig)}
      disabled={reportLoading}
    >
      {reportLoading && <Spinner size='sm' className='me-2' />}
      إنشاء التقرير
    </Button>
  </Modal.Footer>
</Modal>
```

#### Templates Management
```typescript
<Modal show={showTemplates} onHide={() => setShowTemplates(false)} size='lg'>
  <Modal.Header closeButton>
    <Modal.Title>قوالب التقارير</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <ListGroup>
      {reportTemplates.map((template) => (
        <ListGroup.Item key={template.id} className='d-flex justify-content-between'>
          <div className='ms-2 me-auto'>
            <div className='fw-bold'>{template.name}</div>
            <p className='mb-1'>{template.description}</p>
            <small className='text-muted'>
              بواسطة {template.created_by} - {template.created_at}
            </small>
          </div>
          <ButtonGroup>
            <Button
              variant='outline-primary'
              size='sm'
              onClick={() => applyTemplate(template)}
            >
              استخدام
            </Button>
            <Button
              variant='outline-secondary'
              size='sm'
              onClick={() => editTemplate(template)}
            >
              تعديل
            </Button>
          </ButtonGroup>
        </ListGroup.Item>
      ))}
    </ListGroup>
  </Modal.Body>
</Modal>
```

### Data Models and Interfaces

#### Core Report Interfaces
```typescript
interface DashboardData {
  total_clients: number;
  total_cases: number;
  total_hearings: number;
  total_invoices: number;
  total_lawyers: number;
  recent_activities: Array<{
    type: string;
    name: string;
    action: string;
    created_at: string;
  }>;
  upcoming_hearings: Array<{
    id: number;
    hearing_date: string;
    hearing_type: string;
    matter_ar: string;
    client_name_ar: string;
  }>;
  financial_summary: {
    total_revenue: number;
    paid_amount: number;
    pending_amount: number;
    paid_count: number;
    pending_count: number;
    overdue_count: number;
  };
  case_statistics: Record<string, number>;
  hearing_statistics: Record<string, number>;
  revenue_trend: Array<{
    month: string;
    revenue: number;
  }>;
}

interface CustomReportConfig {
  entity: 'clients' | 'cases' | 'hearings' | 'invoices' | 'lawyers';
  filters: Record<string, any>;
  columns: string[];
  grouping?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

interface ReportTemplate {
  id: number;
  name: string;
  entity: string;
  description: string;
  config: CustomReportConfig;
  created_by: string;
  created_at: string;
}
```

#### Filter Options Structure
```typescript
interface FilterOptions {
  clients: {
    status: Array<{key: string, label: string}>;
    client_type: Array<{key: string, label: string}>;
    contact_lawyer: Array<{key: string, label: string}>;
    cash_pro_bono: Array<{key: string, label: string}>;
  };
  cases: {
    status: Array<{key: string, label: string}>;
    matter_category: Array<{key: string, label: string}>;
    priority: Array<{key: string, label: string}>;
    assigned_lawyer: Array<{key: string, label: string}>;
  };
  hearings: {
    status: Array<{key: string, label: string}>;
    hearing_type: Array<{key: string, label: string}>;
    outcome: Array<{key: string, label: string}>;
  };
}
```

### API Response Examples

#### Dashboard Response
```json
{
  "success": true,
  "data": {
    "total_clients": 25,
    "total_cases": 45,
    "total_hearings": 120,
    "total_invoices": 85,
    "total_lawyers": 8,
    "recent_activities": [
      {
        "type": "client",
        "name": "شركة الأمان للتأمين",
        "action": "تم إضافة عميل جديد",
        "created_at": "2025-09-19T10:30:00Z"
      }
    ],
    "upcoming_hearings": [
      {
        "id": 1,
        "hearing_date": "2025-09-25T10:00:00Z",
        "hearing_type": "جلسة أولى",
        "matter_ar": "قضية مدنية تجارية",
        "client_name_ar": "شركة الخليج للتجارة"
      }
    ],
    "financial_summary": {
      "total_revenue": 250000,
      "pending_amount": 45000,
      "paid_amount": 205000,
      "paid_count": 65,
      "pending_count": 20,
      "overdue_count": 5
    },
    "case_statistics": {
      "نشطة": 28,
      "مغلقة": 15,
      "معلقة": 2
    },
    "revenue_trend": [
      {"month": "يناير 2025", "revenue": 85000},
      {"month": "فبراير 2025", "revenue": 92000}
    ]
  }
}
```

#### Custom Report Response
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_records": 150,
      "filtered_records": 45,
      "generated_at": "2025-09-20T14:30:00Z"
    },
    "available_columns": {
      "client_name_ar": "اسم العميل",
      "client_type": "نوع العميل",
      "status": "الحالة",
      "contact_lawyer": "المحامي المسؤول",
      "created_at": "تاريخ الإنشاء"
    },
    "data": [
      {
        "id": 1,
        "client_name_ar": "شركة التقنية المتقدمة",
        "client_type": "company",
        "status": "active",
        "contact_lawyer": "أحمد محمد",
        "created_at": "2025-01-15T09:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "total_pages": 3,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### User Experience Features

#### Real-time Interactivity
- **Dynamic Filter Updates**: Filters update available options based on selections
- **Column Preview**: Show sample data when selecting columns
- **Instant Validation**: Form validation with real-time feedback
- **Loading States**: Progress indicators during report generation
- **Error Handling**: User-friendly error messages with retry options

#### Responsive Design
- **Mobile Optimization**: Responsive tables with horizontal scrolling
- **Touch-Friendly**: Large buttons and touch targets for mobile
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility**: Screen reader support and keyboard navigation

#### Performance Optimization
- **Pagination**: Large datasets split into manageable pages
- **Lazy Loading**: Load report data on demand
- **Caching**: Cache frequently accessed report configurations
- **Debounced Filters**: Reduce API calls with input debouncing
- **Virtual Scrolling**: Handle large result sets efficiently

### Security Considerations

#### Data Access Control
```php
// Role-based report access
public function authorizeReportAccess($reportType, $user) {
    $permissions = [
        'clients' => ['admin', 'lawyer', 'staff'],
        'cases' => ['admin', 'lawyer'],
        'financial' => ['admin', 'super_admin'],
        'hearings' => ['admin', 'lawyer', 'staff']
    ];
    
    return in_array($user['role'], $permissions[$reportType] ?? []);
}

// Data filtering by user permissions
public function filterDataByUser($query, $user) {
    if ($user['role'] === 'lawyer') {
        $query .= " AND assigned_lawyer = '{$user['name']}'";
    }
    
    return $query;
}
```

#### Export Security
- **File Access Control**: Temporary URLs with expiration
- **Data Sanitization**: Clean data before export
- **Size Limits**: Prevent large export attacks
- **Rate Limiting**: Limit export frequency per user

### Testing Strategy

#### Unit Tests
```typescript
describe('ReportBuilder', () => {
  test('should generate correct filter query', () => {
    const config = {
      entity: 'clients',
      filters: {
        status: 'active',
        date_from: '2025-01-01',
        date_to: '2025-12-31'
      }
    };
    
    const query = buildFilterQuery(config);
    expect(query).toContain("status = 'active'");
    expect(query).toContain("created_at >= '2025-01-01'");
  });
  
  test('should validate report configuration', () => {
    const config = { entity: 'clients', columns: [] };
    const isValid = validateReportConfig(config);
    expect(isValid).toBe(false); // No columns selected
  });
});
```

#### Integration Tests
```bash
# Test API endpoints
curl -X GET "http://lit.local:8080/api/reports/dashboard" \
  -H "Authorization: Bearer {token}"

curl -X POST "http://lit.local:8080/api/reports/custom" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"entity":"clients","filters":{"status":"active"},"columns":["client_name_ar","status"]}'
```

#### End-to-End Tests
```typescript
describe('Reporting System E2E', () => {
  test('should generate custom client report', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/reports');
    
    // Open report builder
    await page.click('[data-testid="customize-clients-report"]');
    
    // Configure filters
    await page.selectOption('[data-testid="status-filter"]', 'active');
    await page.fill('[data-testid="date-from"]', '2025-01-01');
    
    // Select columns
    await page.check('[data-testid="column-client-name"]');
    await page.check('[data-testid="column-status"]');
    
    // Generate report
    await page.click('[data-testid="generate-report"]');
    
    // Verify results
    await expect(page.locator('[data-testid="report-table"]')).toBeVisible();
    await expect(page.locator('tbody tr')).toHaveCount.toBeGreaterThan(0);
  });
});
```

### Deployment Configuration

#### Production Setup
```apache
# .htaccess for lit.local
RewriteEngine On

# API routes
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# Static files
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^.*$ - [L]

# React SPA
RewriteRule . index.html [L]
```

#### Environment Variables
```php
// config/config.php
define('REPORTS_CACHE_TTL', 300);        // 5 minutes
define('MAX_EXPORT_ROWS', 10000);        // Export limit
define('REPORT_TEMP_PATH', '/tmp/reports/');
define('ENABLE_REPORT_CACHING', true);
```

### Future Enhancements

#### Planned Features
1. **Automated Report Scheduling**: Generate and email reports automatically
2. **Advanced Charts**: Interactive charts and visualizations
3. **Report Sharing**: Share reports with external stakeholders
4. **Data Export**: PDF reports with charts and branding
5. **Audit Trail**: Track report access and modifications
6. **Performance Analytics**: Report generation performance metrics

#### Scalability Considerations
1. **Database Optimization**: Query performance improvements
2. **Caching Layer**: Redis integration for report data
3. **Queue System**: Background report generation
4. **CDN Integration**: Faster asset delivery
5. **API Rate Limiting**: Prevent report abuse

---
**Created**: 2025-09-20  
**System**: Advanced Reporting System for Litigation Management  
**Status**: Production Ready ✅  
**Access**: http://lit.local:8080/reports (after authentication)