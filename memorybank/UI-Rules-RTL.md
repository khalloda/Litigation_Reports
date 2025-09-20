# UI Rules and RTL Guidelines

## Overview
Comprehensive UI/UX rules for the bilingual Litigation Reports System with primary Arabic RTL support and secondary English LTR functionality.

## RTL (Right-to-Left) Design Principles

### HTML Foundation
```html
<html lang="ar" dir="rtl">
```
- **Primary Language**: Arabic with RTL direction
- **Secondary Language**: English with LTR direction
- **Dynamic Switching**: Runtime language toggle capability

### Layout Direction Rules

#### Text Flow
- **Arabic Text**: Flows right-to-left naturally
- **Numbers**: Display left-to-right (123, not ٣٢١)
- **Mixed Content**: Proper bidirectional text handling
- **Punctuation**: Follows Arabic punctuation rules

#### Component Alignment
- **Navigation**: Right-aligned in Arabic, left-aligned in English
- **Forms**: Labels on the right in Arabic, left in English
- **Buttons**: Primary actions on the right in Arabic
- **Icons**: Mirror horizontally when direction matters (arrows, chevrons)

### CSS Implementation

#### Flexbox Rules
```css
/* Use logical properties */
.container {
  padding-inline-start: 1rem;  /* Not padding-left */
  margin-inline-end: 0.5rem;   /* Not margin-right */
  border-inline-start: 1px solid; /* Not border-left */
}

/* Flex direction awareness */
.nav-items {
  display: flex;
  flex-direction: row; /* Automatically reverses in RTL */
}
```

#### Grid Implementation
```css
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  /* Grid automatically handles RTL */
}
```

#### Icon Mirroring
```css
.icon-arrow {
  transform: scaleX(-1); /* Mirror arrows in RTL */
}

.icon-neutral {
  /* Don't mirror: settings, user, close, etc. */
}
```

## Typography System

### Font Stack
```css
.arabic-text {
  font-family: 'Noto Sans Arabic', 'Tahoma', sans-serif;
  font-weight: 400;
  line-height: 1.6;
}

.english-text {
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-weight: 400;
  line-height: 1.5;
}
```

### Font Size Scale
- **H1**: 2.5rem / 40px - Page titles
- **H2**: 2rem / 32px - Section headers
- **H3**: 1.5rem / 24px - Subsection headers
- **H4**: 1.25rem / 20px - Card titles
- **Body**: 1rem / 16px - Standard text
- **Small**: 0.875rem / 14px - Captions, metadata

### Font Weights
- **Regular (400)**: Body text, form inputs
- **Medium (500)**: Button text, emphasized text
- **Semibold (600)**: Headings, navigation
- **Bold (700)**: Critical information, alerts

## Color System

### Primary Palette
```css
:root {
  /* Brand Colors */
  --primary-900: #1e3a8a;    /* Dark blue */
  --primary-700: #1d4ed8;    /* Medium blue */
  --primary-500: #3b82f6;    /* Primary blue */
  --primary-300: #93c5fd;    /* Light blue */
  --primary-100: #dbeafe;    /* Very light blue */

  /* Neutral Colors */
  --gray-900: #111827;       /* Dark text */
  --gray-700: #374151;       /* Medium text */
  --gray-500: #6b7280;       /* Muted text */
  --gray-300: #d1d5db;       /* Borders */
  --gray-100: #f3f4f6;       /* Background */
  --gray-50: #f9fafb;        /* Light background */
}
```

### Semantic Colors
```css
:root {
  /* Status Colors */
  --success: #10b981;        /* Green */
  --warning: #f59e0b;        /* Amber */
  --error: #ef4444;          /* Red */
  --info: #3b82f6;           /* Blue */

  /* Background */
  --bg-primary: #ffffff;     /* Main background */
  --bg-secondary: #f9fafb;   /* Card background */
  --bg-tertiary: #f3f4f6;    /* Section background */
}
```

## Component Design Rules

### Navigation Components

#### Top Navigation
- **Arabic**: Logo on right, menu items flow right-to-left
- **English**: Logo on left, menu items flow left-to-right
- **User Menu**: Always on the opposite side of logo
- **Language Toggle**: Prominent position, clear current state

#### Sidebar Navigation
- **Placement**: Right side in Arabic, left side in English
- **Icons**: Leading icons (before text) in both languages
- **Hierarchy**: Proper visual hierarchy with indentation
- **Active State**: Clear visual indication of current page

### Form Components

#### Form Layout
```css
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

/* Label positioning */
.label {
  align-self: flex-start;
  margin-inline-end: 0.5rem; /* Logical property */
}
```

#### Input Fields
- **Label Position**: Above input in both languages
- **Placeholder Text**: Bilingual support with proper direction
- **Error Messages**: Below input, right-aligned in Arabic
- **Required Indicators**: Appropriate for each language
- **Help Text**: Consistent positioning and styling

#### Button Placement
- **Primary Actions**: Right side in Arabic, left in English
- **Secondary Actions**: Left side in Arabic, right in English
- **Cancel/Back**: Leading position (opposite of primary)
- **Submit/Save**: Trailing position (primary action)

### Table Components

#### Table Structure
```css
.table-container {
  overflow-x: auto;
  direction: ltr; /* Always LTR for horizontal scroll */
}

.table {
  width: 100%;
  direction: rtl; /* Back to RTL for content */
}

.table th,
.table td {
  text-align: start; /* Logical alignment */
  padding: 0.75rem;
}
```

#### Column Organization
- **ID/Number Columns**: Always leftmost (first in reading order)
- **Name/Title Columns**: After ID, main identification
- **Status Columns**: Use visual indicators (badges, icons)
- **Action Columns**: Rightmost in Arabic, leftmost in English
- **Date Columns**: Consistent format (YYYY-MM-DD or Arabic format)

### Card Components

#### Card Layout
```css
.card {
  background: var(--bg-primary);
  border: 1px solid var(--gray-300);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end; /* Logical end */
}
```

#### Content Organization
- **Header**: Title, subtitle, and actions
- **Body**: Main content with proper spacing
- **Footer**: Secondary actions or metadata
- **Visual Hierarchy**: Clear information architecture

## Responsive Design Rules

### Breakpoint System
```css
/* Mobile First Approach */
:root {
  --breakpoint-sm: 640px;   /* Small devices */
  --breakpoint-md: 768px;   /* Tablets */
  --breakpoint-lg: 1024px;  /* Desktop */
  --breakpoint-xl: 1280px;  /* Large desktop */
}
```

### Mobile Adaptations
- **Navigation**: Hamburger menu with proper RTL behavior
- **Tables**: Horizontal scroll with sticky first column
- **Forms**: Single column layout on mobile
- **Touch Targets**: Minimum 44px for accessibility

### Tablet Adaptations
- **Sidebar**: Collapsible with overlay on smaller screens
- **Grid Layouts**: Reduce columns on medium screens
- **Typography**: Maintain readability at all sizes

## Accessibility Standards

### WCAG Compliance
- **AA Level**: Minimum standard for all components
- **Color Contrast**: 4.5:1 for normal text, 3:1 for large text
- **Focus Indicators**: Clear and visible focus states
- **Keyboard Navigation**: Full keyboard accessibility

### Arabic Accessibility
- **Screen Readers**: Proper Arabic text pronunciation
- **Text Alternatives**: Arabic alt text for images
- **Language Tags**: Correct language identification
- **Reading Order**: Logical content flow in RTL

### Semantic HTML
```html
<!-- Proper heading hierarchy -->
<h1>نظام إدارة التقاضي</h1>
<h2>لوحة التحكم</h2>
<h3>الإحصائيات</h3>

<!-- Form semantics -->
<label for="email">البريد الإلكتروني</label>
<input id="email" type="email" required>

<!-- Button semantics -->
<button type="submit">حفظ</button>
<button type="button">إلغاء</button>
```

## Animation and Interaction

### Motion Principles
- **Respect Reduced Motion**: Honor user preferences
- **Natural Movement**: Animations feel organic and purposeful
- **Performance**: 60fps animations, use transform and opacity
- **Duration**: 200-300ms for micro-interactions

### RTL Animation Considerations
```css
/* Slide animations respect direction */
.slide-enter {
  transform: translateX(100%); /* From right in RTL */
}

.slide-enter-active {
  transform: translateX(0);
  transition: transform 300ms ease-out;
}

/* Rotation animations */
.dropdown-arrow {
  transition: transform 200ms ease;
}

.dropdown-open .dropdown-arrow {
  transform: rotate(180deg); /* Same rotation in both directions */
}
```

## State Management

### Loading States
- **Skeleton Screens**: Maintain layout during loading
- **Spinners**: Centered with proper RTL positioning
- **Progress Indicators**: Clear progress communication
- **Optimistic Updates**: Show immediate feedback

### Error States
- **Error Messages**: Clear, actionable, properly positioned
- **Validation**: Real-time with appropriate feedback
- **Empty States**: Helpful guidance for empty content
- **404 Pages**: Branded and helpful navigation

### Success States
- **Confirmations**: Clear success indicators
- **Toast Messages**: Properly positioned for RTL
- **Badge Indicators**: Consistent visual treatment
- **Status Changes**: Immediate visual feedback

## Performance Guidelines

### CSS Optimization
- **Critical CSS**: Inline critical styles for RTL
- **CSS Custom Properties**: Use for dynamic theming
- **Avoid Reflows**: Use logical properties consistently
- **Optimize Fonts**: Preload Arabic fonts

### Image Optimization
- **Icon Systems**: SVG icons with RTL variants
- **Responsive Images**: Proper srcset implementation
- **Lazy Loading**: Improve initial page load
- **Compression**: Optimized file sizes

## Testing Requirements

### RTL Testing Checklist
- [ ] Text flows correctly in Arabic
- [ ] Icons mirror appropriately
- [ ] Forms function in RTL layout
- [ ] Tables scroll and sort correctly
- [ ] Navigation works in both directions
- [ ] Animations respect RTL direction
- [ ] Keyboard navigation follows RTL order
- [ ] Screen readers work with Arabic content

### Browser Testing
- **Primary**: Chrome, Firefox, Safari (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Android
- **RTL Support**: Test in browsers with Arabic OS settings
- **Font Rendering**: Verify Arabic font rendering quality

## Maintenance Guidelines

### Code Organization
- **CSS Logical Properties**: Always use instead of directional
- **Component Variants**: RTL/LTR variants when needed
- **Documentation**: Document RTL considerations
- **Design System**: Maintain consistent patterns

### Design Updates
- **RTL First**: Design for Arabic, adapt for English
- **Component Library**: Maintain RTL examples
- **Style Guide**: Keep RTL guidelines updated
- **Review Process**: Include RTL in design reviews

---
**Created**: 2025-09-17
**Last Updated**: 2025-09-17
**System**: Litigation Reports Management
**Scope**: Complete UI/RTL Guidelines