# Application Architecture

## System Overview
**Litigation Reports System** - A bilingual (Arabic/English) web application for managing legal cases, clients, hearings, and billing with RTL support and advanced reporting capabilities.

## Architecture Pattern
**Single Page Application (SPA)** with React frontend served by PHP backend using same-origin architecture

## Deployment Architecture (Updated 2025-09-20)

### Core Principle: Strict lit.local Only
- **Single Origin**: Everything serves from `http://lit.local:8080`
- **No CORS**: Same-origin eliminates cross-origin issues
- **PHP Serves React**: Static React files served by Apache/PHP
- **Shared Sessions**: Authentication works seamlessly across app and API

### Directory Structure
```
backend/
├── public/                 # Web root (Apache DocumentRoot)
│   ├── index.html         # React SPA entry point
│   ├── assets/            # React static assets (CSS, JS)
│   ├── api/               # PHP API endpoints
│   │   └── index.php      # API router
│   └── .htaccess          # Apache routing rules
├── src/                   # PHP backend source
│   ├── Core/              # Authentication, routing, validation
│   ├── Controllers/       # API endpoint handlers
│   ├── Models/            # Data models
│   └── Middleware/        # Request processing
└── config/                # Configuration files
```

### Routing Strategy
```apache
# .htaccess routing rules
RewriteEngine On

# API routes → api/index.php
RewriteRule ^api/(.*)$ api/index.php [QSA,L]

# Static files → serve directly
RewriteCond %{REQUEST_FILENAME} -f
RewriteRule ^.*$ - [L]

# All other routes → index.html (React SPA)
RewriteRule . index.html [L]
```

### Build Process Integration
```bash
# Build React for production
npm run build  # Outputs to backend/public/

# Result structure:
backend/public/
├── index.html              # React app entry
├── assets/                 # Optimized JS/CSS bundles
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── vendor-[hash].js
└── api/                    # PHP API (copied and path-fixed)
```

## Frontend Architecture

### Technology Stack
- **React 18+** - Component-based UI library with hooks
- **Vite** - Build tool and development server
- **TypeScript** - Type safety and enhanced developer experience
- **CSS/SCSS** - Styling with RTL support
- **React Bootstrap** - UI component library with RTL compatibility
- **React Router** - Client-side routing for SPA navigation

### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── modals/         # Modal components (ClientModal, etc.)
│   ├── forms/          # Form components (MixedContentInput, etc.)
│   ├── layout/         # Layout components (Navbar, Sidebar, Footer)
│   └── auth/           # Authentication components
├── pages/              # Route-based page components
│   ├── ReportsPage.tsx # Advanced reporting interface
│   └── auth/Login.tsx  # Authentication pages
├── hooks/              # Custom React hooks (useLanguage, useRTL)
├── services/           # API service layer
├── utils/              # Utility functions (mixedContent, etc.)
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

### Advanced Reporting System (New - 2025-09-20)

#### Reporting Architecture
```
ReportsPage
├── Dashboard Overview
│   ├── Key Metrics Cards (Clients, Cases, Hearings, Revenue)
│   ├── Financial Summary (Paid, Pending, Overdue)
│   ├── Recent Activities Table
│   └── Upcoming Hearings Table
├── Quick Report Access Cards
│   ├── Clients Report Card
│   │   ├── View Button → Detailed Modal
│   │   └── Customize Button → Report Builder
│   ├── Cases Report Card
│   │   ├── View Button → Detailed Modal
│   │   └── Customize Button → Report Builder
│   └── Hearings Report Card
│       ├── View Button → Detailed Modal
│       └── Customize Button → Report Builder
├── Report Builder Modal
│   ├── Entity Selection (Clients/Cases/Hearings)
│   ├── Filter Configuration
│   │   ├── Date Range Filters
│   │   ├── Status Filters
│   │   └── Custom Field Filters
│   ├── Column Selection
│   │   ├── Available Columns Checkbox List
│   │   └── Column Order Management
│   ├── Grouping Options
│   └── Sort Configuration
├── Templates Management Modal
│   ├── Saved Templates List
│   ├── Template Application
│   └── Template Creation/Update
└── Export Options Modal
    ├── Format Selection (CSV, Excel, PDF)
    ├── Data Range Selection
    └── Export Configuration
```

#### Report Builder Features
```typescript
interface CustomReportConfig {
  entity: 'clients' | 'cases' | 'hearings' | 'invoices' | 'lawyers'
  filters: {
    date_from?: string
    date_to?: string
    status?: string[]
    [key: string]: any
  }
  columns: string[]
  grouping?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

interface ReportTemplate {
  id: number
  name: string
  entity: string
  description: string
  config: CustomReportConfig
  created_by: string
  created_at: string
}
```

#### API Endpoints for Reporting
```
GET  /api/reports/dashboard     # Dashboard overview data
GET  /api/reports/clients       # Clients report with filters
GET  /api/reports/cases         # Cases report with filters
GET  /api/reports/hearings      # Hearings report with filters
GET  /api/reports/financial     # Financial summary
GET  /api/reports/custom        # Custom report builder options
POST /api/reports/custom        # Generate custom report
GET  /api/reports/templates     # Report templates management
POST /api/reports/templates     # Save new template
GET  /api/reports/export        # Export reports (CSV/Excel/PDF)
GET  /api/reports/options       # Available filter/column options
```

### Key Components
- **Navigation System** - Bilingual navigation with RTL support
- **Authentication** - Role-based access control (super_admin, admin, lawyer, staff)
- **Dashboard** - System overview with statistics
- **CRUD Views** - Cases, Clients, Hearings, Bills management
- **Advanced Reporting** - Customizable, filterable report system
- **Language Toggle** - Arabic/English switching
- **Modal System** - Reusable modal components for CRUD operations

### State Management
- **React Hooks** - useState, useEffect for local state
- **Custom Hooks** - Shared business logic (useLanguage, useRTL)
- **Context API** - Global state (authentication, language)
- **No External Store** - Keeping architecture simple

## Backend Architecture

### Technology Stack
- **PHP 8+** - Server-side logic
- **Custom MVC Framework** - Lightweight routing and controllers
- **MySQL** - Database storage
- **Apache** - Web server with mod_rewrite
- **Session-based Auth** - PHP sessions + JWT tokens

### API Design
- **RESTful API** - Standard HTTP methods and status codes
- **JSON Response Format** - Consistent API responses
- **Authentication Required** - Protected endpoints
- **Role-Based Access Control** - Permission-based access

### Authentication Architecture
```php
// Dual authentication support
class Auth {
    public static function check() {
        // 1. Check PHP session (web requests)
        if (isset($_SESSION['user_id'])) {
            return true;
        }
        
        // 2. Check JWT token (API requests)
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (strpos($authHeader, 'Bearer ') === 0) {
            $token = substr($authHeader, 7);
            return self::validateToken($token);
        }
        
        return false;
    }
}
```

### Data Models (Updated 2025-09-20)
```typescript
User {
  id: number
  email: string
  role: 'super_admin' | 'admin' | 'lawyer' | 'staff'
  name: string
  arabicName?: string
  permissions: Permission[]
}

Client {
  id: number
  client_name_ar: string
  client_name_en?: string
  client_type: 'individual' | 'company'
  cash_pro_bono: 'cash' | 'probono'
  status: 'active' | 'inactive' | 'disabled'
  contact_lawyer: string
  phone?: string
  email?: string
  address_ar?: string
  address_en?: string
  notes_ar?: string
  notes_en?: string
  client_start_date: string
  logo_url?: string
  created_at: string
  updated_at: string
}

Case {
  id: number
  matter_ar: string
  matter_en?: string
  matter_category: 'civil' | 'commercial' | 'criminal' | 'administrative'
  status: 'active' | 'closed' | 'suspended'
  client_id: number
  assigned_lawyer: string
  court_name?: string
  case_number?: string
  case_start_date: string
  expected_end_date?: string
  priority: 'high' | 'medium' | 'low'
  notes_ar?: string
  notes_en?: string
  created_at: string
  updated_at: string
}

Hearing {
  id: number
  case_id: number
  hearing_date: string
  hearing_type: 'initial' | 'follow_up' | 'final'
  status: 'scheduled' | 'completed' | 'postponed'
  court_name?: string
  judge_name?: string
  outcome?: 'for' | 'against' | 'pending'
  notes_ar?: string
  notes_en?: string
  created_at: string
  updated_at: string
}

Invoice {
  id: number
  case_id?: number
  client_id: number
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue'
  issue_date: string
  due_date: string
  description_ar?: string
  description_en?: string
  created_at: string
  updated_at: string
}

Document {
  id: number
  title: string
  document_type: 'contract' | 'evidence' | 'correspondence' | 'legal_memo'
  entity_type?: 'client' | 'case' | 'hearing' | 'invoice'
  entity_id?: number
  file_path: string
  original_filename: string
  file_size: number
  uploaded_by: number
  created_at: string
}
```

### Advanced Reporting Backend (New - 2025-09-20)

#### Report Controller Architecture
```php
class ReportController {
    // Dashboard with comprehensive statistics
    public function dashboard() {
        return [
            'total_clients' => $this->getClientCount(),
            'total_cases' => $this->getCaseCount(),
            'total_hearings' => $this->getHearingCount(),
            'financial_summary' => $this->getFinancialSummary(),
            'recent_activities' => $this->getRecentActivities(),
            'upcoming_hearings' => $this->getUpcomingHearings(),
            'case_statistics' => $this->getCaseStatistics(),
            'revenue_trend' => $this->getRevenueTrend()
        ];
    }
    
    // Advanced filtering and customization
    public function clients(Request $request) {
        $filters = $request->getFilters();
        $columns = $request->getColumns();
        $pagination = $request->getPagination();
        
        return $this->generateFilteredReport('clients', $filters, $columns, $pagination);
    }
    
    // Custom report builder
    public function customReport(Request $request) {
        return [
            'available_entities' => $this->getAvailableEntities(),
            'available_filters' => $this->getAvailableFilters($request->get('type')),
            'available_columns' => $this->getAvailableColumns($request->get('type')),
            'grouping_options' => $this->getGroupingOptions($request->get('type'))
        ];
    }
    
    // Report template management
    public function getReportTemplates() {
        return ReportTemplate::getByUser(Auth::id());
    }
    
    // Export functionality
    public function exportReport(Request $request) {
        $format = $request->get('format', 'csv');
        $config = $request->get('config');
        
        return $this->generateExport($config, $format);
    }
}
```

#### Filtering System
```php
// Advanced filtering capabilities
class ReportFilters {
    private function applyFilters($query, $filters, $entity) {
        foreach ($filters as $field => $value) {
            switch ($field) {
                case 'date_from':
                    $query .= " AND created_at >= '{$value}'";
                    break;
                case 'date_to':
                    $query .= " AND created_at <= '{$value}'";
                    break;
                case 'status':
                    if (is_array($value)) {
                        $statuses = implode("','", $value);
                        $query .= " AND status IN ('{$statuses}')";
                    } else {
                        $query .= " AND status = '{$value}'";
                    }
                    break;
                case 'client_type':
                    $query .= " AND client_type = '{$value}'";
                    break;
                case 'case_category':
                    $query .= " AND matter_category = '{$value}'";
                    break;
                case 'priority':
                    $query .= " AND priority = '{$value}'";
                    break;
                // Add more filters as needed
            }
        }
        return $query;
    }
}
```

## API Service Architecture (Updated 2025-09-20)

### Same-Origin API Service
```typescript
class ApiService {
  private baseUrl: string = '/api'; // Relative URL for same-origin
  
  // No CORS configuration needed
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json'
    };

    // JWT token for API authentication
    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    return response.json();
  }
  
  // Reporting API methods
  async getDashboard(): Promise<ApiResponse<DashboardData>> {
    return this.request('/reports/dashboard');
  }
  
  async getCustomReportOptions(entity: string): Promise<ApiResponse<any>> {
    return this.request(`/reports/custom?type=${entity}`);
  }
  
  async generateCustomReport(config: CustomReportConfig): Promise<ApiResponse<any>> {
    return this.request('/reports/custom', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }
}
```

## File Upload Architecture

### Client Logo System
```
File Upload Flow:
1. Client Selection → Drag & Drop / File Input
2. Validation → Type, Size, Format Check
3. Preview → Real-time Image Display
4. Storage → Server-side file management
5. Submission → Form Data with File
6. Display → Logo in Client List
```

### Document Management System (New - 2025-09-20)
```php
class DocumentController {
    const UPLOAD_PATH = __DIR__ . '/../../uploads/documents/';
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
    
    public function store(Request $request) {
        // File validation and storage
        $uploadResult = $this->handleFileUpload($_FILES['file']);
        
        $document = Document::create([
            'title' => $request->get('title'),
            'document_type' => $request->get('document_type'),
            'entity_type' => $request->get('entity_type'),
            'entity_id' => $request->get('entity_id'),
            'file_path' => $uploadResult['file_path'],
            'original_filename' => $uploadResult['original_filename'],
            'uploaded_by' => Auth::id()
        ]);
        
        return Response::success($document);
    }
}
```

## Internationalization (i18n)

### RTL Support
- **HTML Configuration** - `html[lang="ar"][dir="rtl"]`
- **CSS Flexbox/Grid** - RTL-aware layout using logical properties
- **Text Direction** - Automatic text flow direction
- **Component Direction** - Modal, form, and table RTL compliance

### Language Support
- **Arabic (Primary)** - Right-to-left layout
- **English (Secondary)** - Left-to-right layout
- **Dynamic Switching** - Runtime language toggle
- **Mixed Content** - Proper handling of Arabic/English mixed text

### Custom Hooks for i18n
```typescript
useLanguage(): {
  currentLanguage: 'ar' | 'en'
  setLanguage: (lang: 'ar' | 'en') => void
  toggleLanguage: () => void
  isArabic: boolean
  isEnglish: boolean
}

useRTL(): {
  isRTL: boolean
  direction: 'ltr' | 'rtl'
}
```

## Security Architecture

### Same-Origin Security Benefits
- **No CORS Vulnerabilities** - Eliminates cross-origin attack vectors
- **Shared Session Context** - Secure authentication flow
- **Simplified CSP** - Content Security Policy easier to manage
- **No Preflight Requests** - Reduced attack surface

### Authentication Security
```php
// Multi-layer authentication
class Auth {
    public static function login($email, $password) {
        // 1. Validate credentials
        $user = User::findByEmail($email);
        if (!password_verify($password, $user['password'])) {
            return false;
        }
        
        // 2. Generate JWT token
        $token = self::generateToken($user);
        
        // 3. Set PHP session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_role'] = $user['role'];
        $_SESSION['token'] = $token;
        
        return [
            'user' => self::sanitizeUser($user),
            'token' => $token
        ];
    }
}
```

### File Upload Security
- **Type Validation** - Server-side MIME type checking
- **Size Limits** - Prevent large file attacks
- **Path Sanitization** - Secure file storage
- **Access Control** - User-based file permissions

## Data Flow

### Same-Origin Request Flow
1. **User Action** → Component Event Handler
2. **API Call** → Service Layer (relative URLs)
3. **Apache Routing** → .htaccess → PHP API
4. **Response** → State Update → UI Re-render

### Authentication Flow (Updated)
1. **Login Form** → Credentials Submission (`/api/auth/login`)
2. **PHP Authentication** → Session + JWT Token Response
3. **Token Storage** → localStorage + session cookie
4. **Authenticated Requests** → JWT header + session context

### Report Generation Flow (New)
```
1. Dashboard Load → GET /api/reports/dashboard
2. Report Builder Open → GET /api/reports/custom?type=clients
3. Filter Configuration → User selects date ranges, columns
4. Report Generation → POST /api/reports/custom with config
5. Results Display → Modal with paginated data table
6. Export Option → GET /api/reports/export?format=csv&config=...
```

## Development Environment

### Local Development Setup
- **lit.local Configuration** - Apache virtual host
- **PHP Development** - Local Apache/PHP/MySQL stack
- **React Development** - Vite build integration
- **No CORS Issues** - Same-origin development

### Build Process Integration
```bash
# Development workflow
npm run dev          # Vite dev server (development only)
npm run build        # Build for production → backend/public/
php -S lit.local:8080 -t backend/public  # Serve integrated app

# Production deployment
npm run build        # React production build
# Apache serves backend/public/ with .htaccess routing
```

### Configuration Files
```bash
backend/
├── config/
│   ├── config.php           # Environment configuration
│   ├── database.php         # Database connection
│   └── config.development.php  # Dev-specific settings
└── public/
    └── .htaccess           # Apache routing rules
```

## Testing Strategy (Enhanced 2025-09-20)

### End-to-End Testing
```typescript
// Integrated testing with same-origin setup
describe('Reports System', () => {
  beforeEach(async ({ page }) => {
    // Login through integrated auth system
    await page.goto('http://lit.local:8080/login')
    await page.fill('[name="email"]', 'admin@litigation.com')
    await page.fill('[name="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // Navigate to reports
    await page.goto('http://lit.local:8080/reports')
  })

  test('should display dashboard metrics', async ({ page }) => {
    await expect(page.locator('[data-testid="total-clients"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-cases"]')).toBeVisible()
    await expect(page.locator('[data-testid="financial-summary"]')).toBeVisible()
  })
  
  test('should open custom report builder', async ({ page }) => {
    await page.click('[data-testid="customize-clients-report"]')
    await expect(page.locator('[data-testid="report-builder-modal"]')).toBeVisible()
    await expect(page.locator('[data-testid="filter-options"]')).toBeVisible()
    await expect(page.locator('[data-testid="column-selection"]')).toBeVisible()
  })
  
  test('should generate custom report', async ({ page }) => {
    await page.click('[data-testid="customize-clients-report"]')
    await page.check('[data-testid="column-client-name"]')
    await page.check('[data-testid="column-status"]')
    await page.click('[data-testid="generate-report"]')
    
    await expect(page.locator('[data-testid="report-results"]')).toBeVisible()
    await expect(page.locator('[data-testid="export-options"]')).toBeVisible()
  })
})
```

### API Testing
```bash
# Same-origin API testing
curl -X GET "http://lit.local:8080/api/health"
# Response: {"status": "ok", "timestamp": "2025-09-20 00:05:18"}

curl -X GET "http://lit.local:8080/api/reports/dashboard" \
  -H "Authorization: Bearer {token}"
# Response: Dashboard data with metrics
```

## Performance Considerations

### Same-Origin Performance Benefits
- **No Preflight Requests** - Direct API calls
- **Shared Connection Pool** - Reduced connection overhead
- **Simplified Caching** - Browser cache optimization
- **Reduced Latency** - No cross-origin delays

### Frontend Optimization
- **Code Splitting** - Lazy loading of routes
- **Report Data Virtualization** - Handle large datasets
- **Memoized Report Components** - Prevent unnecessary re-renders
- **Debounced Filter Updates** - Smooth user experience

### Backend Optimization
```php
// Efficient report generation
class ReportOptimization {
    public function generateReport($config) {
        // 1. Query optimization
        $query = $this->buildOptimizedQuery($config);
        
        // 2. Pagination for large datasets
        $limit = min($config['limit'] ?? 100, 1000);
        $offset = ($config['page'] ?? 1 - 1) * $limit;
        
        // 3. Column selection to reduce data transfer
        $columns = $this->validateColumns($config['columns']);
        
        // 4. Caching for repeated requests
        $cacheKey = md5(serialize($config));
        if ($cached = $this->getCache($cacheKey)) {
            return $cached;
        }
        
        $result = $this->executeQuery($query, $columns, $limit, $offset);
        $this->setCache($cacheKey, $result, 300); // 5-minute cache
        
        return $result;
    }
}
```

## Monitoring & Analytics

### Error Tracking
- **PHP Error Logging** - Server-side error capture
- **React Error Boundaries** - Frontend error handling
- **API Response Monitoring** - Failed request tracking

### Performance Monitoring
- **Report Generation Times** - Query performance tracking
- **File Upload Metrics** - Upload success rates
- **Session Management** - Authentication flow monitoring

## Future Architecture Considerations

### Planned Enhancements
- **Advanced Report Scheduling** - Automated report generation
- **Report Sharing** - Secure report distribution
- **Advanced Analytics** - Trend analysis and predictions
- **Mobile Optimization** - Responsive report viewing

### Scalability Roadmap
- **Database Optimization** - Query performance improvements
- **Caching Layer** - Redis integration for reports
- **CDN Integration** - Static asset optimization
- **Microservices Migration** - Gradual service decomposition

---
**Created**: 2025-09-17  
**Last Updated**: 2025-09-20  
**System**: Litigation Reports Management  
**Environment**: Production Ready with lit.local Architecture  
**Recent Updates**: Same-origin architecture, advanced reporting system, authentication integration, CORS elimination