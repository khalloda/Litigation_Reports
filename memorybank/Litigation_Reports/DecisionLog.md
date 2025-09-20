# Decision Log - Litigation Reports System

## 2025-09-20 - Strict lit.local Architecture & CORS Elimination

### Decision: Implement Same-Origin Architecture with lit.local Only

**Context**: النظام كان يستخدم CORS للتعامل مع المنافذ المختلفة، مما يسبب تعقيدات في الأمان والمصادقة وإدارة الجلسات.

**Decision**: Eliminate CORS entirely by serving React static files through PHP backend on single origin (lit.local:8080).

**Options Considered**:
1. Continue with CORS configuration between ports 3010 and 8080
2. Use proxy server to handle cross-origin requests
3. Serve React static files directly from PHP backend (same-origin)

**Chosen Option**: #3 - Same-origin architecture

**Rationale**:
- إزالة تعقيدات CORS وتحسين الأمان
- Simplified authentication flow with shared sessions
- Better performance without preflight requests
- Reduced security attack surface
- Easier deployment and configuration management
- Native browser cookie/session handling

**Implementation Details**:
- **Build Integration**: `npm run build` outputs to `backend/public/`
- **Apache Routing**: `.htaccess` handles API routes and SPA fallback
- **API Path Fixing**: Updated PHP includes for copied API structure
- **Authentication**: Session-based + JWT token dual support
- **No CORS Headers**: Removed all cross-origin configuration

**Directory Structure**:
```
backend/public/          # Apache DocumentRoot
├── index.html          # React SPA entry
├── assets/             # React static assets
├── api/                # PHP API endpoints
└── .htaccess           # Routing configuration
```

**Impact**:
- ✅ Eliminated CORS vulnerabilities entirely
- ✅ Simplified authentication and session management
- ✅ Improved performance with no preflight requests
- ✅ Single-origin security model
- ✅ Production-ready deployment architecture

**Files Modified**:
- `backend/public/.htaccess` - Apache routing rules
- `backend/public/api/index.php` - Fixed include paths
- `backend/api/index.php` - Removed CORS headers
- `src/services/api.ts` - Relative URLs and no credentials

**Cross-References**: 
- [Architecture.md](Architecture.md) - Updated architecture documentation
- [Progress.md](Progress.md) - Implementation status

---

## 2025-09-20 - Advanced Reporting System Implementation

### Decision: Implement Comprehensive Custom Reporting System

**Context**: المستخدمون يحتاجون إلى تقارير مفصلة وقابلة للتخصيص لإدارة القضايا والعملاء والجلسات مع إمكانيات فلترة متقدمة.

**Decision**: Build full-featured reporting system with dashboard, custom report builder, templates, and export functionality.

**Options Considered**:
1. Basic static reports with fixed formats
2. Simple filtering with limited customization
3. Advanced reporting system with full customization (chosen)

**Chosen Option**: #3 - Advanced reporting system

**Rationale**:
- تلبية احتياجات المستخدمين للتقارير المخصصة
- Professional litigation management requires detailed reporting
- Export capabilities essential for external stakeholders
- Template system improves workflow efficiency
- Arabic-first reporting interface

**Implementation Details**:

#### Backend API Enhancement
- **8 New Endpoints**: Dashboard, custom reports, templates, export
- **Advanced Filtering**: Date ranges, status filters, entity-specific filters
- **Dynamic Columns**: User-selectable column configuration
- **Template Management**: Save/load report configurations
- **Export Support**: CSV, Excel, PDF format support

#### Frontend Components
- **Enhanced ReportsPage.tsx**: Complete dashboard with metrics
- **Report Builder Modal**: Tabbed interface with filters and columns
- **Templates Modal**: Template management and application
- **Quick Access Cards**: View/Customize buttons for each report type
- **Detailed Report Modal**: Full-screen results with export options

#### Key Features
- **Dashboard Overview**: Key metrics, financial summary, recent activities
- **Custom Report Builder**: Entity selection, filter configuration, column selection
- **Report Templates**: Save and reuse report configurations
- **Export Functionality**: Multi-format export capabilities
- **Real-time Generation**: Dynamic report generation with pagination

**Data Structures**:
```typescript
interface CustomReportConfig {
  entity: 'clients' | 'cases' | 'hearings' | 'invoices' | 'lawyers'
  filters: Record<string, any>
  columns: string[]
  grouping?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
```

**Impact**:
- ✅ Professional reporting capabilities for litigation management
- ✅ Customizable reports with advanced filtering
- ✅ Template system for workflow efficiency
- ✅ Export functionality for stakeholder distribution
- ✅ Arabic-first interface with RTL compliance
- ✅ Comprehensive dashboard with key metrics

**Files Created/Modified**:
- `backend/src/Controllers/ReportController.php` - Enhanced with 8 new methods
- `src/pages/ReportsPage.tsx` - Complete reporting interface
- `backend/api/index.php` - Added advanced reporting routes
- `ReportingSystem.md` - Comprehensive documentation

**Cross-References**: 
- [ReportingSystem.md](ReportingSystem.md) - Detailed system documentation
- [Architecture.md](Architecture.md) - Architectural integration

---

## 2025-09-17 - Client Logo Implementation

### Decision: Implement Client Logo Upload and Display Functionality

**Context**: العملاء الشركات والمؤسسات يحتاجون إلى عرض شعاراتهم في التقارير والوثائق الرسمية لإضافة الطابع المهني والهوية المؤسسية.

**Decision**: Add comprehensive logo upload and display system to Client CRUD operations.

**Options Considered**:
1. Simple file upload with basic validation
2. Advanced image processing with resizing and optimization
3. External image hosting service integration

**Chosen Option**: #1 - Simple file upload with validation

**Rationale**:
- شعارات العملاء مهمة للتقارير والوثائق الرسمية
- Keep implementation simple and maintainable
- File validation ensures quality and security
- Preview functionality improves user experience
- Fallback handling maintains system robustness

**Implementation Details**:
- **File Validation**: JPEG, PNG, GIF, WebP formats, 5MB max size
- **Upload Interface**: Drag-and-drop area with manual file selection
- **Preview System**: Real-time logo preview in modal
- **Display Integration**: 32x32px logos in client list table
- **Fallback Handling**: Type icons when no logo is present
- **Bilingual Support**: Upload instructions in Arabic and English

**Impact**:
- ✅ Professional branding for company clients
- ✅ Enhanced PDF reports with client logos
- ✅ Improved visual client identification
- ✅ Maintains RTL layout compliance
- ✅ Proper TypeScript integration

**Files Modified**:
- `src/components/modals/ClientModal.tsx` - Logo upload functionality
- `src/pages/ClientsPage.tsx` - Logo display in client list
- `src/components/forms/MixedContentInput.tsx` - Enhanced props support

**Testing Coverage**:
- E2E tests for logo upload, preview, validation
- Logo display verification in client list
- File type and size validation tests
- Logo removal functionality tests

**Cross-References**: 
- [Progress.md](Progress.md) - Implementation status
- [Commit e4ce8969](feature/client-crud-implementation) - TypeScript fixes
- [Commit 1cd4038d](feature/client-crud-implementation) - Main implementation

---

## 2025-09-16 - Server-Side Pagination Default

### Decision: Adopt Server-Side Pagination as Default Pattern

**Context**: نظام إدارة القضايا والعملاء يتطلب التعامل مع كميات كبيرة من البيانات مع الحفاظ على الأداء والاستجابة.

**Decision**: Implement server-side pagination as the default pattern for all data tables in the litigation management system.

**Options Considered**:
1. Client-side pagination with full data loading
2. Server-side pagination with API endpoints
3. Hybrid approach with intelligent caching

**Chosen Option**: #2 - Server-side pagination

**Rationale**:
- العربية تتطلب معالجة نص خاصة للبحث والفرز
- Better performance with large datasets
- Reduced memory footprint on client
- Improved search and filtering capabilities
- Better support for real-time data updates

**Implementation Standards**:
- Default page size: 20 items
- API endpoints support `page`, `limit`, `search`, `sort` parameters
- Arabic text search using proper collation
- RTL-aware sorting for Arabic content
- Consistent pagination controls across all tables

**Impact**: Improved system performance and Arabic text handling

**Cross-References**: [ADR-0003](../docs/adr/0003-server-side-pagination-default.md)

---

## 2025-09-16 - Playwright E2E Testing Standard

### Decision: Standardize on Playwright for E2E Testing

**Context**: الحاجة إلى اختبارات شاملة للنظام ثنائي اللغة مع دعم التخطيط من اليمين إلى اليسار.

**Decision**: Use Playwright as the primary E2E testing framework.

**Rationale**:
- دعم ممتاز للنصوص العربية واختبار RTL
- Cross-browser testing capabilities
- Built-in accessibility testing
- Visual regression testing support
- Arabic font rendering validation

**Testing Priorities**:
1. RTL layout correctness
2. Arabic text rendering
3. Mixed content handling
4. Accessibility compliance
5. Cross-browser compatibility

**Impact**: Comprehensive test coverage for bilingual system

---

**Log Format**: Date - Decision Title - Context (Arabic-first) - Technical Details - Impact Assessment