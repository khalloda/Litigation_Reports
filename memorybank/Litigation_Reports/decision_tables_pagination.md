# Decision: Tables Default to Server-Side Pagination

## Context
- Arabic/RTL application requiring consistent data presentation
- CRUD views need compatibility across different data volumes
- Performance considerations for large datasets
- User experience consistency in bilingual interface

## Decision
**Use server-side pagination by default for all table components**

### Implementation Guidelines
- Default to server-side pagination for data tables
- Virtual scrolling only for huge logs or real-time data streams
- Maintain consistent pagination controls in Arabic/RTL layout
- Include standard page size options (10, 25, 50, 100 items)

### Rationale
1. **Performance**: Better handling of large datasets without client-side memory issues
2. **Consistency**: Uniform behavior across all CRUD views
3. **RTL Compatibility**: Server-side pagination works better with RTL table layouts
4. **Scalability**: Supports growth as data volume increases
5. **Network Efficiency**: Reduces initial load times and bandwidth usage

### Exceptions
- **Virtual Scroll**: Only for log viewers or real-time data feeds with thousands of entries
- **Client-side**: Small, static datasets (<100 items) that don't change frequently

### Technical Requirements
- Implement pagination at API level
- Support sorting and filtering with pagination
- Maintain Arabic pagination labels (الصفحة، من، إلى، المجموع)
- Include total count display
- Handle empty states appropriately

---
**Date**: 2025-09-17  
**Context**: Litigation Reports System - Arabic/RTL CRUD Implementation  
**Status**: Active Decision