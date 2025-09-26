# Contributing to Litigation Management System

Thank you for your interest in contributing to our litigation management system! This document provides guidelines for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Architecture Decision Process](#architecture-decision-process)

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- PHP >= 8.0
- MySQL >= 8.0 or MariaDB >= 10.6
- Git

### Local Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org/litigation-management-system.git
   cd litigation-management-system
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment:

   ```bash
   cp .env.example .env
   # Edit .env with your local database credentials
   ```

4. Set up database:

   ```bash
   php scripts/database/migrate.php
   php scripts/database/seed.php
   ```

5. Start development servers:

   ```bash
   npm run dev          # Frontend (React + Vite)
   npm run start:backend # Backend (PHP)
   ```

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) for automated changelog generation:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Build process or auxiliary tool changes

**Examples:**

```
feat(api): add client report generation endpoint
fix(auth): resolve JWT token expiration issue
docs(setup): update development environment guide
test(api): add comprehensive auth endpoint tests
```

### Semantic Versioning

We follow [SemVer](https://semver.org/):

- `MAJOR` - Breaking changes
- `MINOR` - New features (backward compatible)
- `PATCH` - Bug fixes (backward compatible)

## Code Standards

### PHP (Backend)

- Follow [PSR-12](https://www.php-fig.org/psr/psr-12/) coding standard
- Use meaningful variable and function names
- Add type hints for function parameters and return types
- Document complex logic with comments

```php
<?php
// Good
public function createCase(array $caseData): Case
{
    $validator = new CaseValidator();
    $validator->validate($caseData);

    return $this->caseRepository->create($caseData);
}

// Bad
function create($data)
{
    return $this->repo->create($data);
}
```

### TypeScript/React (Frontend)

- Use TypeScript for all new code
- Follow React best practices and hooks patterns
- Use functional components over class components
- Implement proper prop typing

```typescript
// Good
interface ClientFormProps {
  onSubmit: (client: Client) => void;
  initialData?: Partial<Client>;
}

const ClientForm: React.FC<ClientFormProps> = ({ onSubmit, initialData }) => {
  // Component implementation
};

// Bad
const ClientForm = (props: any) => {
  // Component implementation
};
```

### General Guidelines

- Write self-documenting code
- Keep functions small and focused
- Use descriptive commit messages
- Remove dead code and unused imports
- Follow the existing code style in the file you're editing

## Testing Requirements

### Required Tests

All contributions must include appropriate tests:

**Backend (PHP):**

- Unit tests for new functions/methods
- Integration tests for API endpoints
- Database tests for model changes

**Frontend (React):**

- Component tests for new components
- Page tests for new pages
- E2E tests for new user flows

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:api           # Backend API tests
npm run test:web           # Frontend tests
npm run test:integration   # Integration tests
npm run test:e2e          # End-to-end tests

# Run tests with coverage
npm run test:coverage
```

### Test Quality Standards

- Tests must pass consistently (>99% reliability)
- Aim for >80% code coverage on new code
- Write clear test descriptions
- Use appropriate test data and fixtures

## Pull Request Process

### Before Submitting

1. Ensure all tests pass locally
2. Run linting and fix any issues:

   ```bash
   npm run lint:fix
   npm run type-check
   ```

3. Update documentation if needed
4. Add appropriate tests for new functionality

### PR Title and Description

- Use conventional commit format for PR title
- Provide clear description of changes
- Link to related issues
- Include screenshots for UI changes
- List any breaking changes

### PR Template

```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All existing tests pass
- [ ] New tests added for new functionality
- [ ] Manual testing completed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new linting errors
```

### Review Process

1. Automated checks must pass (CI/CD, linting, tests)
2. At least one code review required
3. Architecture changes require architect approval (see CODEOWNERS)
4. Security changes require security team review

## Architecture Decision Process

For significant architectural changes:

1. **Propose**: Create an ADR (Architecture Decision Record) in `/docs/adr/`
2. **Discuss**: Open issue for team discussion
3. **Review**: Present to architecture team
4. **Decide**: Update ADR with final decision
5. **Implement**: Create implementation PR

### ADR Template

Use the template in `/docs/adr/000-adr-template.md` for new architectural decisions.

## Code Review Guidelines

### For Authors

- Keep PRs focused and reasonably sized (<500 lines when possible)
- Provide clear description and context
- Respond to feedback promptly and professionally
- Test your changes thoroughly

### For Reviewers

- Review within 24 hours when possible
- Focus on code quality, security, and maintainability
- Provide constructive feedback
- Approve when satisfied with changes

## Getting Help

- **General Questions**: Open a GitHub Discussion
- **Bug Reports**: Create an issue with the bug template
- **Feature Requests**: Create an issue with the feature template
- **Security Issues**: Email <security@litigation-system.com>
- **Urgent Issues**: Contact the on-call developer via Slack

## Recognition

We appreciate all contributions! Contributors will be:

- Listed in our CHANGELOG.md
- Recognized in release notes
- Invited to team events and discussions

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

**Need help?** Don't hesitate to ask questions in GitHub Discussions or reach out to the maintainers team.
