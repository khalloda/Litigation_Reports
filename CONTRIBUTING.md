# Contributing Guide

## Welcome Contributors! 👋

Thank you for your interest in contributing to the Litigation Management System. This guide will help you understand how to contribute effectively to our project.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## 🎯 Code of Conduct

We are committed to fostering a welcoming and inclusive community. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.0.0 or higher
- **PHP** 8.1 or higher
- **MySQL** 8.0 or higher
- **Git** 2.30 or higher
- **npm** 8.0 or higher

### Environment Setup
1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/litigation-management-system.git
   cd litigation-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   mysql -u root -p < database/setup.sql
   ```

5. **Start development servers**
   ```bash
   # Frontend development server
   npm run dev

   # Backend API server
   npm run start:backend
   ```

## 💻 Development Workflow

### Branch Strategy
We use the [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) branching model:

- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: New features (`feature/user-auth`, `feature/case-management`)
- **`hotfix/*`**: Urgent production fixes
- **`release/*`**: Release preparation

### Commit Conventions
We follow [Conventional Commits](https://conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
git commit -m "feat(auth): add JWT token refresh functionality"
git commit -m "fix(api): resolve case retrieval performance issue"
git commit -m "docs: update API documentation for v2.0"
```

### Code Organization
```
├── apps/
│   ├── api/          # Backend API service
│   └── web/          # Frontend React application
├── config/           # Configuration files
├── docs/             # Documentation
├── tests/            # Test suites
└── _arch_audit/     # Architecture audit artifacts
```

## 📏 Code Standards

### Frontend (React/TypeScript)
- **Framework**: React 18+ with TypeScript
- **Styling**: SCSS modules with Bootstrap 5
- **State Management**: React Query for server state
- **Routing**: React Router v6
- **Testing**: Vitest + React Testing Library

**Code Style:**
```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

const UserProfile: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

// ❌ Avoid
const user_profile = (user) => {
  return '<div>' + user.name + '</div>';
};
```

### Backend (PHP)
- **Framework**: Custom MVC architecture
- **Database**: PDO with prepared statements
- **Authentication**: JWT tokens
- **Testing**: PHPUnit

**Code Style:**
```php
// ✅ Good
<?php
declare(strict_types=1);

class UserController extends BaseController
{
    public function getProfile(Request $request): JsonResponse
    {
        $userId = $request->getParam('id');
        $user = $this->userService->getUserById($userId);

        return $this->jsonResponse(['user' => $user]);
    }
}

// ❌ Avoid
<?php
function get_user($id) {
    $result = mysql_query("SELECT * FROM users WHERE id = $id");
    return mysql_fetch_assoc($result);
}
?>
```

## 🧪 Testing Guidelines

### Testing Structure
```
tests/
├── api/              # API integration tests
├── frontend/         # Frontend unit tests
├── e2e/             # End-to-end tests
└── fixtures/        # Test data fixtures
```

### Running Tests
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e         # End-to-end tests

# Run with coverage
npm run test:coverage

# Run E2E tests in UI mode
npm run test:e2e:ui
```

### Test Coverage Requirements
- **Minimum Coverage**: 80%
- **Critical Paths**: 90%+ coverage
- **New Features**: 100% coverage for new code

## 🔄 Pull Request Process

### Before Submitting
1. **Test your changes**
   ```bash
   npm test && npm run test:e2e
   ```

2. **Check code quality**
   ```bash
   npm run lint && npm run type-check
   ```

3. **Update documentation**
   - Add API documentation for new endpoints
   - Update user guides for new features
   - Add code comments for complex logic

4. **Rebase your branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout your-feature-branch
   git rebase develop
   ```

### PR Template
```markdown
## Description
Brief description of changes

## Related Issues
Closes #123

## Changes Made
- Added new feature X
- Fixed bug Y
- Updated documentation Z

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots
[Add screenshots if UI changes]

## Checklist
- [ ] Code follows project standards
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Linting passes
- [ ] Accessibility considered
- [ ] Performance impact assessed
```

### Review Process
1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: At least one approval from code owners
3. **Integration Testing**: Changes tested in staging environment
4. **Final Approval**: Product owner approval for user-facing changes

## 🚀 Release Process

### Version Management
We follow [Semantic Versioning](https://semver.org/):
- **Major** (x.0.0): Breaking changes
- **Minor** (x.y.0): New features, backward compatible
- **Patch** (x.y.z): Bug fixes, backward compatible

### Release Branches
1. Create release branch from develop
2. Update version numbers
3. Update CHANGELOG.md
4. Create pull request for release
5. Deploy to staging for testing
6. Merge to main for production

### Deployment
- **Staging**: Automated deployment on develop branch
- **Production**: Manual deployment from main branch
- **Rollback**: Automated rollback capability

## 🐛 Bug Reports

### Reporting Bugs
1. **Check existing issues** to avoid duplicates
2. **Use issue template** for consistent bug reports
3. **Include reproduction steps**
4. **Add screenshots** for UI bugs
5. **Specify environment** details

### Bug Priority
- **P0**: Critical (security, data loss)
- **P1**: High (major functionality broken)
- **P2**: Medium (minor functionality issues)
- **P3**: Low (cosmetic, enhancement)

## 💡 Feature Requests

### Submitting Features
1. **Check roadmap** for planned features
2. **Create detailed proposal** with use cases
3. **Consider implementation approach**
4. **Estimate development effort**
5. **Identify testing requirements**

## 📞 Getting Help

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Q&A and general discussions
- **Email**: For urgent or sensitive matters
- **Office Hours**: Weekly sessions for questions

### Resources
- [API Documentation](docs/api/)
- [Development Guide](docs/development/)
- [Architecture Decisions](docs/adr/)
- [Troubleshooting Guide](docs/troubleshooting/)

## 🎉 Recognition

Contributors are recognized through:
- **Code contributions** tracked in GitHub
- **Feature acknowledgments** in release notes
- **Community recognition** in team meetings
- **Special mentions** for significant contributions

---

**Last Updated**: January 22, 2025

*Thank you for contributing to make the Litigation Management System better! 🙏*
