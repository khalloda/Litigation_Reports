# Technology Stack Decisions

## Frontend Framework: React

### Core Libraries
- **React 18+** - Primary UI library with hooks and concurrent features
- **React Testing Library (RTL)** - Testing framework following best practices
- **React Bootstrap** - UI component library with RTL support
- **React Router** - Client-side routing for SPA navigation

### React Development Rules

#### Component Patterns
- Use functional components with hooks over class components
- Prefer custom hooks for reusable stateful logic
- Follow single responsibility principle for components
- Use composition over inheritance
- **Modal Components**: Use React Bootstrap Modal with proper RTL support
- **Form Components**: Implement bilingual validation and mixed content handling

#### State Management
- `useState` for local component state
- `useEffect` for side effects and lifecycle management
- Custom hooks for complex state logic (e.g., `useLanguage`, `useRTL`)
- Implement proper cleanup in `useEffect` to prevent memory leaks
- **File Upload State**: Handle preview state, validation errors, and upload progress

#### Data Fetching
- Use `useEffect` with cleanup for API calls
- Implement race condition protection with ignore flags
- Consider server-side rendering for better performance
- Avoid client-server waterfalls by batching requests
- **CRUD Operations**: Implement optimistic updates with proper error handling

#### Code Quality
- Follow existing code conventions and patterns
- Use TypeScript for type safety with proper interfaces
- Implement proper error boundaries
- Never expose or log secrets/keys
- **Component Interfaces**: Define comprehensive TypeScript interfaces for props

### New Component Patterns (2025-09-17)

#### Client Management Components
- **ClientModal**: Multi-mode component (create/edit/view) with bilingual forms
- **MixedContentInput**: Enhanced input component supporting RTL/LTR mixed content
- **Logo Upload**: File upload component with drag-and-drop, validation, and preview

#### Form Component Standards
```typescript
interface ComponentProps {
  value: string
  onChange: (value: string) => void
  isInvalid?: boolean
  dir?: 'ltr' | 'rtl' | 'auto'
  id?: string
  // Standard Bootstrap form props
}
```

#### File Upload Pattern
- Client-side validation (file type, size limits)
- Real-time preview functionality
- Drag-and-drop interface with fallback
- Error handling in current language
- Proper file cleanup and memory management

### React Testing Library (RTL) Rules

#### Testing Philosophy
- Test behavior, not implementation details
- Query by accessibility attributes and user-facing text
- Avoid testing internal component state directly
- Focus on user interactions and outcomes

#### Best Practices
- Use semantic queries (getByRole, getByLabelText)
- Test user workflows end-to-end
- Mock external dependencies appropriately
- Maintain test isolation and cleanup
- **Bilingual Testing**: Test both Arabic and English UI states
- **File Upload Testing**: Use fixtures for upload validation tests

#### API Testing Integration
- Combine UI tests with API validation when needed
- Use proper test setup/teardown for API contexts
- Verify both UI state and backend changes

### Browser Automation: Playwright

#### When to Use Playwright vs RTL
- **RTL**: Unit and integration testing of React components
- **Playwright**: End-to-end testing, cross-browser validation, complex user flows

#### Integration Patterns
- Use `page.exposeFunction()` for Node.js-browser communication
- Combine UI automation with API testing
- Implement proper browser context management
- Use `page.evaluate()` for browser-specific operations
- **Test Helpers**: Create reusable helper classes for common operations

#### E2E Testing Standards (2025-09-17)
```typescript
// Test Helper Pattern
export class ComponentHelpers {
  async createItem(page: Page, data: ItemData): Promise<void>
  async editItem(page: Page, identifier: string, data: Partial<ItemData>): Promise<void>
  async deleteItem(page: Page, identifier: string): Promise<void>
  async verifyItem(page: Page, identifier: string): Promise<void>
}
```

### Internationalization (i18n)

#### Language Management
- **useLanguage Hook**: Custom hook for language state management
- **useRTL Hook**: RTL layout detection and management
- **Mixed Content Support**: Handle Arabic/English mixed text inputs
- **LocalStorage Integration**: Persist language preferences

#### Implementation Standards
- Arabic-first approach in bilingual forms
- CSS logical properties for RTL compatibility
- Proper font stack for Arabic text rendering
- Direction-aware component styling

### Development Workflow
1. Write components following React best practices
2. Add RTL tests for component behavior
3. Use Playwright for E2E workflows
4. Run linting and type checking before commits
5. Never commit without explicit user request
6. **Update Memory Bank**: Document architectural decisions and patterns

### Performance Considerations
- Implement proper memoization for expensive calculations
- Use React.lazy for code splitting
- Optimize bundle size and loading patterns
- Consider server-side rendering for better UX
- **File Upload Optimization**: Client-side image compression and validation

### Quality Standards
- **TypeScript Coverage**: All components must have proper type definitions
- **Test Coverage**: RTL unit tests + Playwright E2E tests for all CRUD operations
- **Accessibility**: WCAG compliance with screen reader support
- **Cross-Browser**: Testing across Chrome, Firefox, Safari, Edge

---
*Last Updated: 2025-09-17*  
*Context: Litigation Reports System - Client CRUD Implementation*  
*Recent Additions: Modal patterns, file upload, bilingual forms, E2E testing standards*