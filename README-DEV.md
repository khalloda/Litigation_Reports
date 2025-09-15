# Litigation Management System - Development Setup

## Overview

This is a professional litigation management web application built with PHP 8.4 backend and modern JavaScript frontend, featuring comprehensive RTL support for Arabic and advanced accessibility features.

## Technology Stack

### Backend
- **PHP 8.4** - Server-side logic and API
- **MySQL 9.1.0** - Database
- **Apache** - Web server (WAMP)

### Frontend
- **Vanilla JavaScript (ES6+)** - Client-side logic
- **Bootstrap 5** - UI framework with custom RTL theme
- **Sass/PostCSS** - CSS preprocessing
- **Webpack** - Asset bundling and optimization

### Development Tools
- **Node.js 18+** - Development tooling
- **Playwright** - End-to-end testing
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Stylelint** - CSS linting

## Prerequisites

### Required Software
- **WAMP Server** (Windows, Apache, MySQL, PHP)
- **Node.js 18+** and npm
- **Git** for version control
- **VS Code** (recommended) with extensions:
  - PHP Intelephense
  - JavaScript (ES6) code snippets
  - ESLint
  - Prettier
  - Sass
  - Auto Rename Tag

### PHP Extensions
- php_mysqli
- php_pdo_mysql
- php_curl
- php_gd
- php_mbstring
- php_openssl
- php_xml

## Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd litigation-management-system
```

### 2. Install Node.js Dependencies
```bash
npm install
```

### 3. Install Playwright Browsers
```bash
npx playwright install
```

### 4. Configure WAMP
1. Start WAMP server
2. Create database: `litigation_db`
3. Import database schema (when available)
4. Configure virtual host: `lit.local`

### 5. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit configuration
# Update database credentials, API keys, etc.
```

## Development Workflow

### Start Development Server
```bash
# Start PHP development server
npm run start

# In another terminal, start asset compilation
npm run dev
```

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
# Run all Playwright tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug

# View test report
npm run test:report
```

### Code Quality
```bash
# Lint JavaScript
npm run lint
npm run lint:fix

# Lint CSS/SCSS
npm run lint:css
npm run lint:css:fix

# Format code
npm run format
npm run format:check
```

## Project Structure

```
litigation-management-system/
├── public/                 # Public web files
│   ├── assets/            # Compiled assets
│   ├── css/               # Additional CSS
│   ├── js/                # Additional JavaScript
│   └── index.php          # Entry point
├── src/                   # Source files
│   ├── js/                # JavaScript source
│   ├── scss/              # Sass source
│   ├── images/            # Images
│   └── templates/         # HTML templates
├── tests/                 # Playwright tests
│   ├── auth.spec.js       # Authentication tests
│   ├── global-setup.js    # Test setup
│   └── global-teardown.js # Test cleanup
├── config/                # Configuration files
├── database/              # Database files
├── docs/                  # Documentation
├── package.json           # Node.js dependencies
├── webpack.config.js      # Webpack configuration
├── playwright.config.js   # Playwright configuration
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
└── .stylelintrc.js       # Stylelint configuration
```

## RTL and Arabic Support

### CSS RTL Implementation
- Uses CSS logical properties (`margin-inline-start`, `padding-inline-end`)
- Automatic RTL CSS generation with PostCSS
- Bootstrap 5 custom RTL theme
- Arabic font optimization

### JavaScript RTL Support
- Automatic text direction detection
- RTL-aware date formatting
- Arabic number formatting
- Mixed content handling (Arabic/English)

### Testing RTL
```bash
# Test RTL layout specifically
npm run test -- --grep "RTL"
```

## Accessibility Features

### WCAG 2.1 AA Compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast support

### Testing Accessibility
```bash
# Run accessibility tests
npm run test -- --grep "accessibility"
```

## Browser Support

### Desktop Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Browsers
- Chrome Mobile 90+
- Safari Mobile 14+

## Development Guidelines

### Code Style
- Follow ESLint and Prettier configurations
- Use semantic HTML elements
- Implement proper ARIA attributes
- Write descriptive commit messages

### RTL Development
- Always use logical CSS properties
- Test with both LTR and RTL layouts
- Handle mixed content properly
- Use `dir="auto"` for dynamic content

### Testing
- Write tests for all user interactions
- Test RTL layouts specifically
- Verify accessibility compliance
- Test cross-browser compatibility

## Troubleshooting

### Common Issues

#### WAMP Not Starting
- Check if port 80 is available
- Run as administrator
- Check Windows firewall settings

#### Node.js Build Errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`
- Update npm: `npm install -g npm@latest`

#### Playwright Tests Failing
- Ensure WAMP is running
- Check `lit.local` virtual host configuration
- Verify test database setup

#### RTL Layout Issues
- Check CSS logical properties usage
- Verify Bootstrap RTL theme
- Test with different Arabic content lengths

### Getting Help
- Check the documentation in `/docs`
- Review test files for examples
- Check browser developer tools
- Verify PHP and MySQL logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
