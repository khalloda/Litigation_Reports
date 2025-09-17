# Technology Stack Decisions

## Frontend Framework: React

### Core Libraries
- **React 18+** - Primary UI library with hooks and concurrent features
- **React Testing Library (RTL)** - Testing framework following best practices

### React Development Rules

#### Component Patterns
- Use functional components with hooks over class components
- Prefer custom hooks for reusable stateful logic
- Follow single responsibility principle for components
- Use composition over inheritance

#### State Management
- `useState` for local component state
- `useEffect` for side effects and lifecycle management
- Custom hooks for complex state logic (e.g., `useOnlineStatus`, `useData`)
- Implement proper cleanup in `useEffect` to prevent memory leaks

#### Data Fetching
- Use `useEffect` with cleanup for API calls
- Implement race condition protection with ignore flags
- Consider server-side rendering for better performance
- Avoid client-server waterfalls by batching requests

#### Code Quality
- Follow existing code conventions and patterns
- Use TypeScript for type safety
- Implement proper error boundaries
- Never expose or log secrets/keys

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

### Development Workflow
1. Write components following React best practices
2. Add RTL tests for component behavior
3. Use Playwright for E2E workflows
4. Run linting and type checking before commits
5. Never commit without explicit user request

### Performance Considerations
- Implement proper memoization for expensive calculations
- Use React.lazy for code splitting
- Optimize bundle size and loading patterns
- Consider server-side rendering for better UX

---
*Last Updated: 2025-09-17*
*Context: Litigation Reports System*