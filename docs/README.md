# 📚 Litigation Management System - Documentation Hub

**Welcome to the comprehensive documentation for the Litigation Management System.**

---

## 🚀 Quick Start

### For Developers
1. **[Development Setup](setup/development.md)** - Get your local environment running
2. **[Frontend Guide](setup/frontend.md)** - React/TypeScript development
3. **[Testing Guide](setup/testing.md)** - Playwright E2E testing setup

### For DevOps
1. **[Deployment Overview](deployment/overview.md)** - Deployment strategy and process
2. **[Deployment Guide](deployment/guide.md)** - Step-by-step deployment instructions
3. **[GoDaddy Deployment](deployment/godaddy.md)** - Production hosting setup

---

## 📖 Documentation Sections

### 🛠️ Setup & Installation
| Document | Description | Audience |
|----------|-------------|----------|
| [Development Setup](setup/development.md) | Local development environment | Developers |
| [Frontend Guide](setup/frontend.md) | React application setup and development | Frontend Developers |
| [Testing Setup](setup/testing.md) | Playwright E2E testing configuration | QA/Developers |

### 🚀 Deployment
| Document | Description | Audience |
|----------|-------------|----------|
| [Deployment Overview](deployment/overview.md) | High-level deployment strategy | DevOps/Leads |
| [Deployment Guide](deployment/guide.md) | Detailed deployment instructions | DevOps |
| [GoDaddy Hosting](deployment/godaddy.md) | Production hosting configuration | DevOps |

### 🔧 Troubleshooting
| Document | Description | Audience |
|----------|-------------|----------|
| [Apache Configuration](troubleshooting/apache.md) | Apache server setup and issues | DevOps |
| [WAMP Issues](troubleshooting/wamp.md) | Windows development stack troubleshooting | Developers |

### 🏗️ Architecture
| Document | Description | Audience |
|----------|-------------|----------|
| [Architecture Decision Records](adr/) | Major architectural decisions and rationale | Architects/Leads |
| [Repository Migration](../_arch_audit/) | Architecture audit and migration documentation | Principal Engineers |

### 📊 Analysis & Planning
| Document | Description | Audience |
|----------|-------------|----------|
| [Database Analysis](analysis/Comprehensive_Litigation_Database_Analysis.md) | Complete database schema analysis | Developers/DBAs |
| [Current State](analysis/Current_state.md) | System state documentation | All |
| [Project Planning](analysis/Plan.md) | Project roadmap and planning | Management |
| [Product Requirements](analysis/PRD.md) | Product requirements document | Product/Development |

---

## 🎯 By Role

### 👩‍💻 **New Developer**
1. [Development Setup](setup/development.md) → [Frontend Guide](setup/frontend.md) → [Testing Setup](setup/testing.md)
2. Review [Architecture Decision Records](adr/) for context
3. Check [Current State](analysis/Current_state.md) for system overview

### 🚀 **DevOps Engineer**
1. [Deployment Overview](deployment/overview.md) → [Deployment Guide](deployment/guide.md)
2. [GoDaddy Deployment](deployment/godaddy.md) for production
3. [Troubleshooting](troubleshooting/) for issue resolution

### 🏗️ **System Architect**
1. [Architecture Decision Records](adr/) for design decisions
2. [Database Analysis](analysis/Comprehensive_Litigation_Database_Analysis.md) for data architecture
3. [Repository Migration](../_arch_audit/) for architectural evolution

### 📋 **Product Manager**
1. [Product Requirements](analysis/PRD.md) for feature specifications
2. [Project Planning](analysis/Plan.md) for roadmap
3. [Current State](analysis/Current_state.md) for system capabilities

---

## 🔍 Quick Reference

### Essential Commands
```bash
# Development
npm run dev              # Start frontend development server
npm run start:backend    # Start PHP backend server
npm run test:all         # Run all tests

# Testing
npm run test:e2e         # Run E2E tests
npm run test:api         # Run API tests
npm run test:coverage    # Generate coverage report

# Production
npm run build:production # Build for production
```

### Key Directories
```
litigation-management-system/
├── src/                 # React frontend source
├── backend/             # PHP backend source
├── tests/               # All tests organized by service
├── docs/                # This documentation
└── _arch_audit/         # Architecture audit and migration
```

---

## 📝 Contributing

Before contributing to documentation:
1. Read [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines
2. Follow the established structure in this documentation hub
3. Update this README when adding new documentation sections
4. Ensure all internal links work correctly

---

## 🔗 External Resources

- **GitHub Repository**: [Your Repository URL]
- **Production Site**: https://lit.sarieldin.com
- **Issue Tracker**: [GitHub Issues URL]
- **Team Communication**: [Slack/Teams Channel]

---

## 📞 Support

- **Technical Questions**: Create an issue with the `question` label
- **Bug Reports**: Use the bug report template
- **Feature Requests**: Use the feature request template
- **Urgent Issues**: Contact the development team directly

---

**Last Updated**: 2025-09-22
**Maintained By**: Development Team
**Review Schedule**: Monthly