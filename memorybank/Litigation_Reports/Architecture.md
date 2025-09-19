# Application Architecture

## System Overview
**Litigation Reports System** - A bilingual (Arabic/English) web application for managing legal cases, clients, hearings, and billing with RTL support.

## Architecture Pattern
**Single Page Application (SPA)** with React frontend and RESTful API backend

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
├── hooks/              # Custom React hooks (useLanguage, useRTL)
├── services/           # API service layer
├── utils/              # Utility functions (mixedContent, etc.)
├── types/              # TypeScript type definitions
└── assets/             # Static assets
```

### Key Components
- **Navigation System** - Bilingual navigation with RTL support
- **Authentication** - Role-based access control (super_admin, admin, lawyer, staff)
- **Dashboard** - System overview with statistics
- **CRUD Views** - Cases, Clients, Hearings, Bills management
- **Language Toggle** - Arabic/English switching
- **Modal System** - Reusable modal components for CRUD operations

### State Management
- **React Hooks** - useState, useEffect for local state
- **Custom Hooks** - Shared business logic (useLanguage, useRTL)
- **Context API** - Global state (authentication, language)
- **No External Store** - Keeping architecture simple

### New Component Patterns (2025-09-17)

#### Client Management Architecture
```
ClientsPage
├── Client List Table
│   ├── Logo Display (32x32px)
│   ├── Search & Filtering
│   ├── Action Buttons (View/Edit/Delete)
│   └── Pagination Controls
└── ClientModal (Multi-mode)
    ├── Create Mode (Empty form)
    ├── Edit Mode (Pre-filled form)  
    ├── View Mode (Read-only)
    └── Logo Upload Section
        ├── Drag & Drop Interface
        ├── File Validation
        ├── Preview Display
        └── Remove Functionality
```

#### Form Component Architecture
```
MixedContentInput
├── Bilingual Support (Arabic/English)
├── RTL/LTR Direction Detection
├── Mixed Content Handling
├── Validation Integration
└── Accessibility Features

ClientModal
├── Form Validation (Real-time)
├── Bilingual Error Messages
├── Logo Upload Management
├── Multi-mode Support
└── TypeScript Integration
```

## Backend Architecture

### API Design
- **RESTful API** - Standard HTTP methods and status codes
- **Mock Implementation** - Development phase with mock data
- **Future: Real Backend** - Node.js/Express or similar

### Authentication
- **JWT Tokens** - Stateless authentication
- **Role-Based Access** - Different permissions per user type
- **Session Management** - Token refresh and logout

### Data Models (Updated 2025-09-17)
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
  logo_url?: string        // New: Client logo
  created_at: string
  updated_at: string
}

Case {
  id: number
  title: string
  description: string
  status: string
  clientId: number
  hearings: Hearing[]
}

Hearing {
  id: number
  caseId: number
  date: string
  type: string
  status: string
  notes: string
}

Bill {
  id: number
  caseId: number
  amount: number
  status: string
  dueDate: string
}
```

## File Upload Architecture (New - 2025-09-17)

### Client Logo System
```
File Upload Flow:
1. Client Selection → Drag & Drop / File Input
2. Validation → Type, Size, Format Check
3. Preview → Real-time Image Display
4. Storage → Temporary URL Generation
5. Submission → Form Data with File
6. Display → Logo in Client List
```

### File Validation Rules
- **Allowed Types**: JPEG, PNG, GIF, WebP
- **Size Limit**: 5MB maximum
- **Dimensions**: Optimal 300x100px, displays at 32x32px
- **Background**: Transparent preferred for logos

### File Storage Strategy
- **Development**: Blob URLs for preview
- **Production**: CDN storage with optimized delivery
- **Fallback**: Type icons when no logo present

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

### Frontend Security
- **Input Validation** - Client-side form validation with TypeScript
- **XSS Prevention** - React's built-in protection
- **Secure Storage** - No sensitive data in localStorage
- **File Upload Security** - Type and size validation

### API Security
- **Authentication Required** - Protected routes
- **Role Validation** - Server-side permission checks
- **CORS Configuration** - Controlled cross-origin access
- **File Upload Security** - Server-side validation and scanning

## Data Flow

### Request Flow
1. **User Action** → Component Event Handler
2. **API Call** → Service Layer (ApiService)
3. **HTTP Request** → Backend API
4. **Response** → State Update → UI Re-render

### Authentication Flow
1. **Login Form** → Credentials Submission
2. **API Authentication** → JWT Token Response
3. **Token Storage** → Local state management
4. **Authenticated Requests** → Token in headers

### Client CRUD Flow (2025-09-17)
```
1. Client List Load → API GET /clients
2. Create Client → Modal Open → Form Fill → API POST /clients
3. Edit Client → Modal Open → Form Pre-fill → API PUT /clients/:id
4. View Client → Modal Open → Read-only Display
5. Delete Client → Confirmation → API DELETE /clients/:id
6. Logo Upload → File Validation → Preview → Form Submission
```

## Development Environment

### Local Development
- **Vite Dev Server** - `http://lit.local:3001`
- **Hot Module Replacement** - Real-time updates
- **Mock API** - Simulated backend responses

### Build Process
- **Vite Build** - Production optimization
- **TypeScript Compilation** - Type checking with strict mode
- **Asset Optimization** - Minification and bundling
- **ESLint/Prettier** - Code quality and formatting

## Testing Strategy

### Unit Testing
- **React Testing Library** - Component behavior testing
- **Jest** - Test runner and assertions
- **User-Centric Testing** - Focus on user interactions

### End-to-End Testing (Enhanced 2025-09-17)
- **Playwright** - Browser automation testing
- **Cross-Browser** - Chrome, Firefox, Safari support
- **RTL Testing** - Arabic layout validation
- **Test Helpers** - LoginHelpers, ClientHelpers for reusable test logic

### Testing Patterns
```typescript
// E2E Test Structure
describe('Client CRUD Operations', () => {
  beforeEach(async ({ page }) => {
    await loginHelpers.login(page, 'admin@litigation.com', 'password123')
    await page.goto('/clients')
  })

  test('should create client with logo', async ({ page }) => {
    await clientHelpers.createClient(page, {
      nameAr: 'شركة التقنية',
      logoPath: 'tests/fixtures/logo.png'
    })
    await clientHelpers.verifyClientLogo(page, 'شركة التقنية')
  })
})
```

### Test Coverage Requirements
- **Component Testing** - All CRUD components
- **Form Validation** - Bilingual error handling
- **File Upload** - Logo upload and validation
- **Accessibility** - Screen reader compatibility
- **RTL Layout** - Arabic interface testing

## Deployment Architecture

### Production Environment
- **Static Hosting** - CDN distribution
- **Environment Variables** - Configuration management
- **SSL/HTTPS** - Secure communication

### CI/CD Pipeline
- **Git Workflow** - Feature branches → main
- **Automated Testing** - Pre-deployment validation
- **Build Automation** - Continuous deployment

## Performance Considerations

### Frontend Optimization
- **Code Splitting** - Lazy loading of routes
- **Memoization** - React.memo for expensive components
- **Virtual Scrolling** - Large dataset handling
- **Image Optimization** - Compressed assets and logo optimization

### Data Management
- **Server-Side Pagination** - Default table behavior
- **Caching Strategy** - API response caching
- **Debounced Search** - Reduced API calls
- **File Upload Optimization** - Client-side compression

## Scalability Design

### Component Scalability
- **Modular Design** - Reusable components (ClientModal pattern)
- **Hook Patterns** - Shared business logic
- **Prop Drilling Prevention** - Context for deep data
- **TypeScript Interfaces** - Scalable type definitions

### API Scalability
- **Pagination Support** - Large dataset handling
- **Filtering/Sorting** - Server-side operations
- **Rate Limiting** - API abuse prevention
- **File Storage Scaling** - CDN integration for logos

## Monitoring & Analytics

### Error Tracking
- **Error Boundaries** - React error handling
- **Console Logging** - Development debugging
- **Production Monitoring** - Error aggregation

### Performance Monitoring
- **Core Web Vitals** - User experience metrics
- **API Response Times** - Backend performance
- **Bundle Size Analysis** - Asset optimization

## Future Architecture Considerations

### Planned Enhancements
- **PDF Generation** - Client logos in reports
- **Advanced File Management** - Multiple file types
- **Real-time Updates** - WebSocket integration
- **Mobile App** - React Native implementation

### Scalability Roadmap
- **Microservices** - Backend service decomposition
- **Caching Layer** - Redis integration
- **Database Optimization** - Query performance
- **CDN Integration** - Global asset delivery

---
**Created**: 2025-09-17  
**Last Updated**: 2025-09-17  
**System**: Litigation Reports Management  
**Environment**: Development Phase  
**Recent Updates**: Client CRUD architecture, file upload system, testing strategy, component patterns