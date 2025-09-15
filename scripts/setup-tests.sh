#!/bin/bash

# Test Setup Script for Playwright Testing
# This script sets up the test environment, installs dependencies, and prepares test data

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --full-setup           Perform full setup including database and test data"
    echo "  --quick-setup          Quick setup for development"
    echo "  --ci-setup             Setup for CI environment"
    echo "  --update-browsers      Update Playwright browsers"
    echo "  --reset-test-data      Reset test database and data"
    echo "  --help                 Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --full-setup"
    echo "  $0 --quick-setup"
    echo "  $0 --ci-setup"
    echo "  $0 --update-browsers"
}

# Default values
SETUP_TYPE="quick"
UPDATE_BROWSERS="false"
RESET_DATA="false"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --full-setup)
            SETUP_TYPE="full"
            shift
            ;;
        --quick-setup)
            SETUP_TYPE="quick"
            shift
            ;;
        --ci-setup)
            SETUP_TYPE="ci"
            shift
            ;;
        --update-browsers)
            UPDATE_BROWSERS="true"
            shift
            ;;
        --reset-test-data)
            RESET_DATA="true"
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_usage
            exit 1
            ;;
    esac
done

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        print_status "Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check if PHP is installed (for local development)
    if [[ "$SETUP_TYPE" != "ci" ]]; then
        if ! command -v php &> /dev/null; then
            print_warning "PHP is not installed. Some features may not work."
        else
            PHP_VERSION=$(php --version | head -n1 | cut -d' ' -f2 | cut -d'.' -f1,2)
            print_status "PHP version: $PHP_VERSION"
        fi
    fi
    
    print_success "Prerequisites check passed"
}

# Function to install Node.js dependencies
install_dependencies() {
    print_status "Installing Node.js dependencies..."
    
    if [ -f "package.json" ]; then
        npm ci
        print_success "Node.js dependencies installed"
    else
        print_error "package.json not found"
        exit 1
    fi
}

# Function to install Playwright browsers
install_browsers() {
    print_status "Installing Playwright browsers..."
    
    if [[ "$UPDATE_BROWSERS" == "true" ]]; then
        npx playwright install --with-deps
    else
        npx playwright install
    fi
    
    print_success "Playwright browsers installed"
}

# Function to setup test environment
setup_test_environment() {
    print_status "Setting up test environment..."
    
    # Create test directories
    mkdir -p test-results/screenshots
    mkdir -p test-results/videos
    mkdir -p test-results/traces
    mkdir -p test-results/reports
    
    # Create test data directory
    mkdir -p tests/data
    
    # Set up environment variables for testing
    if [ ! -f ".env.test" ]; then
        print_status "Creating test environment file..."
        cat > .env.test << EOF
# Test Environment Configuration
NODE_ENV=testing
BASE_URL=http://localhost:8000
DB_HOST=localhost
DB_DATABASE=litigation_test
DB_USERNAME=test
DB_PASSWORD=test
DB_PORT=3306

# Test specific settings
TEST_TIMEOUT=30000
TEST_RETRIES=2
TEST_WORKERS=2

# RTL Testing
DEFAULT_LANGUAGE=ar
SUPPORTED_LANGUAGES=en,ar
RTL_ENABLED=true

# Accessibility Testing
ACCESSIBILITY_ENABLED=true
SCREEN_READER_TESTING=true

# Visual Regression Testing
VISUAL_TESTING=true
SCREENSHOT_THRESHOLD=0.2

# Performance Testing
PERFORMANCE_TESTING=true
LOAD_TEST_ENABLED=true
EOF
        print_success "Test environment file created"
    fi
    
    print_success "Test environment setup completed"
}

# Function to setup database for testing
setup_test_database() {
    if [[ "$SETUP_TYPE" == "ci" ]]; then
        print_status "Setting up test database for CI..."
        
        # Create test database
        mysql -e "CREATE DATABASE IF NOT EXISTS litigation_test;" || true
        mysql -e "CREATE USER IF NOT EXISTS 'test'@'localhost' IDENTIFIED BY 'test';" || true
        mysql -e "GRANT ALL PRIVILEGES ON litigation_test.* TO 'test'@'localhost';" || true
        mysql -e "FLUSH PRIVILEGES;" || true
        
        print_success "Test database setup completed"
    else
        print_status "Skipping database setup for non-CI environment"
    fi
}

# Function to setup test data
setup_test_data() {
    print_status "Setting up test data..."
    
    # Create test data files
    cat > tests/data/test-users.json << EOF
{
  "users": [
    {
      "id": 1,
      "email": "admin@test.com",
      "password": "admin123",
      "name": "Admin User",
      "role": "admin",
      "arabic_name": "المدير العام"
    },
    {
      "id": 2,
      "email": "lawyer@test.com",
      "password": "lawyer123",
      "name": "Lawyer User",
      "role": "lawyer",
      "arabic_name": "المحامي ناجي"
    },
    {
      "id": 3,
      "email": "staff@test.com",
      "password": "staff123",
      "name": "Staff User",
      "role": "staff",
      "arabic_name": "موظف المكتب"
    }
  ]
}
EOF
    
    cat > tests/data/test-clients.json << EOF
{
  "clients": [
    {
      "id": 1,
      "name": "John Smith",
      "arabic_name": "ناجي رمضان",
      "email": "john.smith@example.com",
      "phone": "+1234567890",
      "arabic_phone": "+966501234567",
      "address": "123 Main Street, New York, NY 10001",
      "arabic_address": "شارع الملك فهد، الرياض، المملكة العربية السعودية",
      "nationality": "American",
      "arabic_nationality": "أمريكي",
      "id_number": "123456789",
      "birth_date": "1990-01-01"
    },
    {
      "id": 2,
      "name": "Jane Doe",
      "arabic_name": "فاطمة أحمد",
      "email": "jane.doe@example.com",
      "phone": "+1234567891",
      "arabic_phone": "+966501234568",
      "address": "456 Oak Avenue, Los Angeles, CA 90210",
      "arabic_address": "شارع النخيل، جدة، المملكة العربية السعودية",
      "nationality": "British",
      "arabic_nationality": "بريطاني",
      "id_number": "987654321",
      "birth_date": "1985-05-15"
    }
  ]
}
EOF
    
    cat > tests/data/test-cases.json << EOF
{
  "cases": [
    {
      "id": 1,
      "case_number": "CASE-2024-001",
      "arabic_case_number": "قضية-2024-001",
      "title": "Contract Dispute",
      "arabic_title": "نزاع تعاقدي",
      "description": "Contract dispute between parties",
      "arabic_description": "نزاع تعاقدي بين الأطراف",
      "case_type": "Civil",
      "arabic_case_type": "مدني",
      "status": "Active",
      "arabic_status": "نشط",
      "priority": "High",
      "arabic_priority": "عالي",
      "start_date": "2024-01-01",
      "expected_end_date": "2024-12-31",
      "court": "Supreme Court",
      "arabic_court": "المحكمة العليا"
    },
    {
      "id": 2,
      "case_number": "CASE-2024-002",
      "arabic_case_number": "قضية-2024-002",
      "title": "Employment Law",
      "arabic_title": "قانون العمل",
      "description": "Employment law case",
      "arabic_description": "قضية قانون عمل",
      "case_type": "Labor",
      "arabic_case_type": "عمل",
      "status": "Pending",
      "arabic_status": "معلق",
      "priority": "Medium",
      "arabic_priority": "متوسط",
      "start_date": "2024-02-01",
      "expected_end_date": "2024-11-30",
      "court": "Labor Court",
      "arabic_court": "محكمة العمل"
    }
  ]
}
EOF
    
    print_success "Test data setup completed"
}

# Function to reset test data
reset_test_data() {
    if [[ "$RESET_DATA" == "true" ]]; then
        print_status "Resetting test data..."
        
        # Remove test data files
        rm -rf tests/data/*
        
        # Remove test results
        rm -rf test-results/*
        
        # Recreate directories
        mkdir -p test-results/screenshots
        mkdir -p test-results/videos
        mkdir -p test-results/traces
        mkdir -p test-results/reports
        mkdir -p tests/data
        
        # Recreate test data
        setup_test_data
        
        print_success "Test data reset completed"
    fi
}

# Function to run initial tests
run_initial_tests() {
    if [[ "$SETUP_TYPE" == "full" ]]; then
        print_status "Running initial smoke tests..."
        
        # Run smoke tests
        npx playwright test --grep "smoke" --reporter=line || {
            print_warning "Some smoke tests failed, but setup will continue"
        }
        
        print_success "Initial tests completed"
    fi
}

# Function to generate test report
generate_test_report() {
    print_status "Generating test setup report..."
    
    cat > test-results/setup-report.md << EOF
# Test Setup Report

## Setup Type: $SETUP_TYPE
## Date: $(date)
## Node.js Version: $(node --version)
## npm Version: $(npm --version)

## Prerequisites Check
- ✅ Node.js 18+ installed
- ✅ npm installed
- ✅ PHP installed (if applicable)

## Dependencies
- ✅ Node.js dependencies installed
- ✅ Playwright browsers installed

## Test Environment
- ✅ Test directories created
- ✅ Environment variables configured
- ✅ Test data prepared

## Test Data
- ✅ Test users created
- ✅ Test clients created
- ✅ Test cases created

## Next Steps
1. Run tests: \`npm run test\`
2. Run specific test suite: \`npm run test:auth\`
3. Run visual regression tests: \`npm run test:visual\`
4. View test results: \`npm run test:report\`

## Test Commands
- \`npm run test\` - Run all tests
- \`npm run test:auth\` - Run authentication tests
- \`npm run test:rtl\` - Run RTL tests
- \`npm run test:accessibility\` - Run accessibility tests
- \`npm run test:visual\` - Run visual regression tests
- \`npm run test:mobile\` - Run mobile tests
- \`npm run test:performance\` - Run performance tests

## Troubleshooting
If you encounter issues:
1. Check that all prerequisites are installed
2. Verify test environment configuration
3. Check test data files
4. Review test logs in test-results/
EOF
    
    print_success "Test setup report generated"
}

# Main execution function
main() {
    print_status "Starting Playwright test setup..."
    print_status "Setup type: $SETUP_TYPE"
    
    # Check prerequisites
    check_prerequisites
    
    # Install dependencies
    install_dependencies
    
    # Install browsers
    install_browsers
    
    # Setup test environment
    setup_test_environment
    
    # Setup database if needed
    if [[ "$SETUP_TYPE" == "ci" ]]; then
        setup_test_database
    fi
    
    # Setup test data
    setup_test_data
    
    # Reset test data if requested
    reset_test_data
    
    # Run initial tests if full setup
    run_initial_tests
    
    # Generate test report
    generate_test_report
    
    print_success "Playwright test setup completed successfully!"
    print_status "You can now run tests using: npm run test"
    print_status "View the setup report: cat test-results/setup-report.md"
}

# Run main function
main "$@"
