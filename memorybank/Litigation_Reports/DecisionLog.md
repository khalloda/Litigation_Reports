# Decision Log - Litigation Reports System

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