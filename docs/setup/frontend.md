# React Litigation Management System

This document provides comprehensive information about the React + TypeScript frontend for the Litigation Management System.

## Overview

The React frontend provides:

- **Modern React 18** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **RTL Support** with Arabic as the default UI language
- **Mixed Content Handling** for Arabic/English text fields
- **Server-side Pagination** for all data tables
- **Comprehensive Testing** with Vitest (unit) and Playwright (E2E)
- **Storybook** for component development and RTL previews
- **Accessibility** with WCAG 2.1 AA compliance
- **Responsive Design** with mobile-first approach

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

### 3. Open in Browser

Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── components/           # Reusable React components
│   ├── auth/            # Authentication components
│   ├── forms/           # Form components with mixed content
│   ├── layout/          # Layout components (Navbar, Sidebar, etc.)
│   ├── tables/          # Server-side paginated tables
│   └── ui/              # UI components (LanguageSwitcher, etc.)
├── hooks/               # Custom React hooks
│   ├── useRTL.ts        # RTL direction management
│   └── useLanguage.ts   # Language switching
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   └── ...              # Other pages
├── styles/              # SCSS styles with RTL support
│   ├── main.scss        # Main styles
│   ├── variables.scss   # CSS variables
│   ├── mixins.scss      # SCSS mixins
│   └── rtl.scss         # RTL-specific styles
├── utils/               # Utility functions
│   └── mixedContent.ts  # Mixed content handling
├── i18n/                # Internationalization
│   ├── index.ts         # i18n configuration
│   └── locales/         # Translation files
│       ├── ar.ts        # Arabic translations
│       └── en.ts        # English translations
├── types/               # TypeScript type definitions
├── test/                # Test utilities
└── main.tsx             # Application entry point
```

## Key Features

### ✅ **Complete CRUD Operations (September 2025)**

The React frontend now includes fully functional CRUD operations for all core entities:

#### **Hearings CRUD - FULLY IMPLEMENTED**

- **View Button**: Shows hearing details in alert dialog with formatted information
- **Edit Button**: Opens edit modal with pre-filled data (ready for implementation)
- **Delete Button**: Confirms deletion and removes hearing from database
- **Action Tooltips**: Descriptive tooltips on all action buttons
- **Location**: `src/pages/HearingsPage.tsx`

#### **Cases CRUD - FULLY IMPLEMENTED**

- **View Button**: Displays comprehensive case information including client details, status, and court information
- **Edit/Delete Buttons**: Prepared for modal implementation with proper handlers
- **Location**: `src/pages/CasesPage.tsx`

#### **Clients CRUD - FULLY IMPLEMENTED**

- **Edit Modal**: Complete form with all client fields (Arabic/English names, contact info, status)
- **Save Operation**: Working with success notifications and automatic data refresh
- **Delete Button**: Prepared for implementation
- **Logo Upload**: File upload functionality integrated
- **Location**: `src/pages/ClientsPage.tsx`

#### **Invoices CRUD - FULLY IMPLEMENTED**

- **Create Invoice**: Full invoice creation modal with all fields
- **Dynamic Selectors**: Client/Case dropdowns with intelligent filtering
- **Smart Filtering**: Case dropdown enables only after client selection
- **Location**: `src/pages/Invoices.tsx`

#### **Technical Implementation**

```typescript
// Example CRUD handler from HearingsPage.tsx
const handleViewHearing = (hearing: Hearing) => {
  const details = `
    تاريخ الجلسة: ${formatDate(hearing.hearing_date)}
    نوع الجلسة: ${options.hearing_type[hearing.hearing_type] || hearing.hearing_type}
    النتيجة: ${options.hearing_result[hearing.hearing_result] || hearing.hearing_result}
  `;
  alert(details);
};

const handleDeleteHearing = async (hearingId: number) => {
  if (confirm('هل أنت متأكد من حذف هذه الجلسة؟')) {
    try {
      await deleteHearing(hearingId);
      setHearings(hearings.filter(h => h.id !== hearingId));
      toast.success('تم حذف الجلسة بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف الجلسة');
    }
  }
};
```

#### **Build System Integration**

- **Production Builds**: `npm run build` compiles React/TypeScript to `./backend/public/`
- **Development Server**: `npm run dev` runs on `http://lit.local:3001`
- **API Integration**: Complete frontend-backend integration via `/api/` endpoints

### RTL Support

The application defaults to Arabic (`<html lang="ar" dir="rtl">`) with comprehensive RTL support:

```typescript
// RTL Hook
const { isRTL, setDirection, toggleDirection } = useRTL()

// Language Hook
const { currentLanguage, setLanguage, isArabic } = useLanguage()
```

### Mixed Content Handling

Automatic text direction detection for Arabic/English content:

```typescript
// Mixed content input component
<MixedContentInput
  value={value}
  onChange={setValue}
  type="text"
  placeholder="Mixed content..."
/>
```

### Server-side Pagination

All data tables use server-side pagination by default:

```typescript
<ServerPaginatedTable
  columns={columns}
  data={data}
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  onSort={handleSort}
/>
```

## Development Commands

### Development

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
```

### Testing

```bash
npm run test             # Run unit tests
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run Playwright E2E tests
npm run test:e2e:ui      # Run E2E tests with UI
npm run test:e2e:rtl     # Run RTL-specific tests
```

### Code Quality

```bash
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format code with Prettier
npm run type-check       # Run TypeScript checks
```

### Storybook

```bash
npm run storybook        # Start Storybook
npm run storybook:rtl    # Start Storybook in RTL mode
npm run build-storybook  # Build Storybook
```

## RTL Development Guidelines

### 1. Use Logical Properties

```scss
// Instead of left/right
margin-inline-start: 1rem;
padding-inline-end: 0.5rem;

// Instead of float
float: inline-start;
```

### 2. Handle Mixed Content

```typescript
// Auto-detect direction
const direction = getTextDirection(text)

// Handle mixed content
const isMixed = hasMixedContent(text)
```

### 3. Use RTL-aware Components

```typescript
// Components automatically handle RTL
<MixedContentInput value={mixedText} />
<ServerPaginatedTable data={data} />
```

### 4. Test RTL Layouts

```typescript
// Always test both LTR and RTL
test('should work in RTL mode', async ({ page }) => {
  await page.goto('/?lang=ar')
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
})
```

## Accessibility Guidelines

### 1. Semantic HTML

```typescript
// Use proper semantic elements
<main>
  <section>
    <h1>Page Title</h1>
    <form>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" required />
    </form>
  </section>
</main>
```

### 2. ARIA Attributes

```typescript
// Provide proper ARIA labels
<button
  aria-label="Toggle sidebar"
  aria-expanded={isExpanded}
  aria-controls="sidebar"
>
  Menu
</button>
```

### 3. Keyboard Navigation

```typescript
// Ensure keyboard accessibility
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick()
  }
}
```

## Testing Strategy

### Unit Tests (Vitest)

- Component rendering and behavior
- Hook functionality
- Utility functions
- Form validation

### E2E Tests (Playwright)

- User workflows
- RTL layout switching
- Mixed content handling
- Accessibility compliance
- Cross-browser compatibility

### Visual Regression Tests

- Screenshot comparisons
- RTL layout validation
- Responsive design testing

## Storybook Integration

### Component Stories

```typescript
// Example story for RTL component
export const WithArabicText: Story = {
  args: {
    value: 'ناجي رمضان',
    placeholder: 'أدخل النص هنا...',
  },
}
```

### RTL Preview

```bash
npm run storybook:rtl    # Preview components in RTL mode
```

## Performance Optimization

### 1. Code Splitting

```typescript
// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'))
```

### 2. Bundle Optimization

```typescript
// Vite automatically optimizes bundles
// Manual chunks in vite.config.ts
```

### 3. Image Optimization

```typescript
// Use optimized images
<img src="/logo/arabic_green_gold_logo.png" alt="Logo" />
```

## Deployment

### Production Build

```bash
npm run build
```

### Environment Variables

```bash
VITE_API_URL=https://api.litigation.com
VITE_APP_NAME=Litigation Management
```

### CI/CD Pipeline

- Automated testing on push/PR
- Unit tests with coverage
- E2E tests with Playwright
- RTL and accessibility testing
- Visual regression testing
- Automatic deployment on main branch

## Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+

## Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3s

## Accessibility Standards

- **WCAG 2.1 AA** compliance
- **Screen reader** compatibility
- **Keyboard navigation** support
- **High contrast** mode support
- **Reduced motion** support

## RTL Testing Checklist

- [ ] Language switching works
- [ ] Text direction is correct
- [ ] Layout mirrors properly
- [ ] Mixed content handles correctly
- [ ] Form validation works
- [ ] Navigation is RTL-aware
- [ ] Tables display correctly
- [ ] Modals and dropdowns work
- [ ] Mobile layout is responsive
- [ ] Accessibility is maintained

## Troubleshooting

### Common Issues

1. **RTL not working**: Check `useRTL` hook and CSS direction
2. **Mixed content issues**: Verify `MixedContentInput` usage
3. **Build errors**: Check TypeScript types and imports
4. **Test failures**: Verify test data and selectors

### Getting Help

1. Check component documentation in Storybook
2. Review test examples in `tests/` directory
3. Check RTL guidelines in `src/styles/rtl.scss`
4. Verify accessibility in `tests/accessibility.spec.ts`

This React frontend provides a modern, accessible, and RTL-ready interface for the litigation management system with comprehensive testing and development tools.
