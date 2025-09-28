# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our litigation management system seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT Create a Public Issue

**Never report security vulnerabilities through public GitHub issues, discussions, or pull requests.**

### 2. Report Privately

Send an email to: **<security@litigation-system.com>**

Include the following information:

- Type of vulnerability
- Affected component(s)
- Steps to reproduce
- Potential impact
- Suggested fix (if you have one)

### 3. Response Timeline

- **Acknowledgment**: Within 24 hours
- **Initial Assessment**: Within 72 hours
- **Status Update**: Weekly until resolved
- **Resolution**: Target 30 days for critical issues, 90 days for others

### 4. Responsible Disclosure

Please give us reasonable time to investigate and fix the issue before making it public. We commit to:

- Acknowledging your report promptly
- Working diligently to understand and resolve the issue
- Keeping you informed of our progress
- Crediting you appropriately (if desired)

## Security Measures

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: bcrypt with appropriate rounds
- **Role-Based Access Control**: Granular permissions system
- **Session Management**: Secure session handling

### Data Protection

- **Input Validation**: All user inputs validated and sanitized
- **SQL Injection Prevention**: Parameterized queries only
- **XSS Protection**: Content Security Policy and output encoding
- **CSRF Protection**: Anti-CSRF tokens for state-changing operations

### Infrastructure Security

- **HTTPS Only**: All communications encrypted in transit
- **Environment Variables**: Sensitive data stored in environment variables
- **Database Security**: Least privilege database access
- **File Upload Security**: Restricted file types and scanning

### Code Security

- **Dependency Scanning**: Regular security audits of dependencies
- **Static Analysis**: Automated code security scanning
- **Secret Scanning**: Prevention of secrets in source code
- **Security Headers**: Proper HTTP security headers

## Security Best Practices for Contributors

### Environment Security

```bash
# Use environment variables for sensitive data
DB_PASSWORD=your-secure-password
JWT_SECRET=your-long-random-string
SMTP_PASSWORD=your-email-password

# Never commit .env files
echo ".env" >> .gitignore
```

### Code Security Guidelines

#### PHP Backend (PHP 8.4+ with Modern Security)

```php
<?php
declare(strict_types=1);

// Good: Modern PHP 8.4+ with strict typing and prepared statements
final readonly class UserRepository
{
    public function __construct(
        private PDO $pdo,
        private EmailValidator $validator,
    ) {}

    public function findByEmail(string $email): ?User
    {
        // Input validation with strict typing
        if (!$this->validator->isValid($email)) {
            throw new InvalidArgumentException('Invalid email format');
        }

        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data ? User::fromArray($data) : null;
    }

    public function hashPassword(string $password): string
    {
        // Modern password hashing with PHP 8.4+
        return password_hash($password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 4,
            'threads' => 3
        ]);
    }
}

// Bad: Old style without types and security
function getUser($email) {
    $query = "SELECT * FROM users WHERE email = '" . $email . "'"; // SQL injection risk
    return mysql_query($query); // Deprecated function
}

// Good: Exception handling with TypeError/ValueError
try {
    $user = $userRepository->findByEmail($email);
} catch (InvalidArgumentException | TypeError $e) {
    $logger->error('Invalid email validation', ['email' => $email, 'error' => $e->getMessage()]);
    throw new ValidationException('Invalid input provided');
}
```

#### React Frontend (TypeScript 5.9+ with Modern Security)

```typescript
// Good: Modern React 18.3.1 + TypeScript 5.9+ security patterns
import { useCallback, useMemo } from 'react';
import DOMPurify from 'dompurify';
import { z } from 'zod';

// Strict API response validation with Zod
const UserResponseSchema = z.object({
  id: z.number().positive(),
  email: z.string().email(),
  name: z.string().min(1).max(255),
  role: z.enum(['admin', 'lawyer', 'staff']),
  createdAt: z.string().datetime(),
});

type UserResponse = z.infer<typeof UserResponseSchema>;

// Good: Type-safe API calls with validation
const useSecureApi = () => {
  const fetchUser = useCallback(async (id: number): Promise<UserResponse> => {
    try {
      const response = await api.get(`/users/${id}`);

      // Validate response structure with runtime type checking
      const validatedData = UserResponseSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('API response validation failed:', error.errors);
        throw new Error('Invalid server response format');
      }
      throw error;
    }
  }, []);

  return { fetchUser };
};

// Good: Sanitize user input with memoization
const useSanitizedContent = (userInput: string) => {
  return useMemo(() => {
    const config = {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: false,
    };
    return DOMPurify.sanitize(userInput, config);
  }, [userInput]);
};

// Good: Secure token management
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const useSecureAuth = () => {
  // Store sensitive tokens in httpOnly cookies (server-side)
  // Only store non-sensitive data in localStorage
  const storeTokens = useCallback((tokens: AuthTokens) => {
    // Send tokens to server for httpOnly cookie storage
    fetch('/auth/store-tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tokens),
      credentials: 'include', // Include httpOnly cookies
    });

    // Store only non-sensitive session info
    localStorage.setItem('sessionId', crypto.randomUUID());
  }, []);

  return { storeTokens };
};

// Bad: Unsafe practices
const unsafeComponent = (props: any) => {
  localStorage.setItem('token', props.sensitiveToken); // Security risk
  return <div dangerouslySetInnerHTML={{ __html: props.userInput }} />; // XSS risk
};
```

### File Upload Security

```php
// Validate file type
$allowedTypes = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
$fileExtension = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));

if (!in_array($fileExtension, $allowedTypes)) {
    throw new InvalidFileTypeException();
}

// Validate file size
if ($_FILES['file']['size'] > MAX_FILE_SIZE) {
    throw new FileTooLargeException();
}

// Generate secure filename
$filename = bin2hex(random_bytes(16)) . '.' . $fileExtension;
```

## Security Testing

### Required Security Tests

1. **Authentication Tests**
   - Login with invalid credentials
   - JWT token validation
   - Session timeout handling

2. **Authorization Tests**
   - Access control for different user roles
   - Direct object reference attempts
   - Privilege escalation attempts

3. **Input Validation Tests**
   - SQL injection attempts
   - XSS payload injection
   - File upload attacks

4. **API Security Tests**
   - Rate limiting validation
   - CORS policy enforcement
   - Content-Type validation

### Running Security Tests

```bash
# Run security-focused tests
npm run test:security

# Run dependency vulnerability scan
npm audit
composer audit

# Run static security analysis
npm run security:scan
```

## Incident Response

### Security Incident Levels

- **Critical**: Immediate threat to user data or system integrity
- **High**: Potential data exposure or significant security weakness
- **Medium**: Security improvement needed but no immediate threat
- **Low**: Security enhancement or best practice implementation

### Response Process

1. **Detection**: Automated monitoring and manual reporting
2. **Assessment**: Determine severity and impact
3. **Containment**: Immediate steps to limit damage
4. **Investigation**: Root cause analysis
5. **Resolution**: Fix implementation and verification
6. **Communication**: User notification if required
7. **Recovery**: Full system restoration
8. **Lessons Learned**: Process improvement

## Security Tools and Dependencies

### Automated Security Scanning

- **Snyk**: Dependency vulnerability scanning
- **ESLint Security**: Static analysis for JavaScript/TypeScript
- **PHPStan**: Static analysis for PHP
- **GitHub Security Advisories**: Automatic dependency alerts

### Security Headers

```php
// Security headers in PHP
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('Content-Security-Policy: default-src \'self\'');
```

## Compliance

### Data Protection

- **GDPR Compliance**: European data protection regulations
- **Data Minimization**: Collect only necessary data
- **Right to Erasure**: User data deletion capabilities
- **Data Portability**: Export user data functionality

### Legal Requirements

- **Attorney-Client Privilege**: Secure handling of privileged communications
- **Document Retention**: Compliance with legal document retention requirements
- **Audit Trails**: Comprehensive logging for legal compliance

## Security Updates

### Update Notifications

Security updates will be communicated through:

- GitHub Security Advisories
- Release notes with [SECURITY] prefix
- Email notifications to registered administrators

### Emergency Updates

Critical security fixes may be released outside the normal release cycle:

- Hotfix branches for immediate deployment
- Automated deployment for critical patches
- Emergency notification procedures

## Contact Information

- **Security Team**: <security@litigation-system.com>
- **General Support**: <support@litigation-system.com>
- **Emergency Contact**: +1-XXX-XXX-XXXX (24/7 for critical issues)

## Recognition

We appreciate responsible security researchers and offer:

- Public recognition (if desired)
- Detailed credit in release notes
- Direct communication with our security team
- Invitation to participate in our security improvement process

---

**Last Updated**: 2025-09-22
**Next Review**: 2025-12-22
