#!/bin/bash

# Playwright Test Runner Script
# This script runs different types of Playwright tests based on the environment and requirements

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
TEST_TYPE="all"
BROWSER="all"
HEADLESS="true"
WORKERS="auto"
RETRIES="2"
REPORTER="html,json,junit"

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
    echo "  -t, --test-type TYPE     Test type: all, auth, rtl, accessibility, visual, smoke (default: all)"
    echo "  -b, --browser BROWSER    Browser: all, chromium, firefox, webkit, chromium-rtl (default: all)"
    echo "  -h, --headless BOOLEAN   Run in headless mode: true, false (default: true)"
    echo "  -w, --workers NUMBER     Number of workers: auto, 1, 2, 4 (default: auto)"
    echo "  -r, --retries NUMBER     Number of retries (default: 2)"
    echo "  --reporter TYPE          Reporter: html, json, junit, line (default: html,json,junit)"
    echo "  --ci                     Run in CI mode (headless, specific workers)"
    echo "  --local                  Run in local development mode"
    echo "  --update-snapshots       Update visual regression snapshots"
    echo "  --help                   Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 --test-type smoke --browser chromium"
    echo "  $0 --ci --test-type visual"
    echo "  $0 --local --headless false"
    echo "  $0 --update-snapshots"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -t|--test-type)
            TEST_TYPE="$2"
            shift 2
            ;;
        -b|--browser)
            BROWSER="$2"
            shift 2
            ;;
        -h|--headless)
            HEADLESS="$2"
            shift 2
            ;;
        -w|--workers)
            WORKERS="$2"
            shift 2
            ;;
        -r|--retries)
            RETRIES="$2"
            shift 2
            ;;
        --reporter)
            REPORTER="$2"
            shift 2
            ;;
        --ci)
            HEADLESS="true"
            WORKERS="2"
            RETRIES="3"
            shift
            ;;
        --local)
            HEADLESS="false"
            WORKERS="1"
            RETRIES="0"
            shift
            ;;
        --update-snapshots)
            UPDATE_SNAPSHOTS="true"
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

# Validate inputs
validate_inputs() {
    if [[ ! "$TEST_TYPE" =~ ^(all|auth|rtl|accessibility|visual|smoke)$ ]]; then
        print_error "Invalid test type: $TEST_TYPE"
        show_usage
        exit 1
    fi
    
    if [[ ! "$BROWSER" =~ ^(all|chromium|firefox|webkit|chromium-rtl|firefox-rtl|Mobile Chrome|Mobile Safari)$ ]]; then
        print_error "Invalid browser: $BROWSER"
        show_usage
        exit 1
    fi
    
    if [[ ! "$HEADLESS" =~ ^(true|false)$ ]]; then
        print_error "Invalid headless value: $HEADLESS"
        show_usage
        exit 1
    fi
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check if Playwright is installed
    if ! command -v npx playwright &> /dev/null; then
        print_error "Playwright is not installed. Run: npm install"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Function to setup test environment
setup_environment() {
    print_status "Setting up test environment..."
    
    # Create test results directory
    mkdir -p test-results/screenshots
    mkdir -p test-results/videos
    mkdir -p test-results/traces
    
    # Install browsers if needed
    if [[ "$BROWSER" == "all" ]]; then
        print_status "Installing all browsers..."
        npx playwright install
    else
        print_status "Installing browser: $BROWSER"
        npx playwright install "$BROWSER"
    fi
    
    print_success "Environment setup completed"
}

# Function to build test command
build_test_command() {
    local cmd="npx playwright test"
    
    # Add test type filter
    case "$TEST_TYPE" in
        auth)
            cmd="$cmd tests/auth.spec.js"
            ;;
        rtl)
            cmd="$cmd tests/rtl-mixed-content.spec.js"
            ;;
        accessibility)
            cmd="$cmd tests/accessibility.spec.js"
            ;;
        visual)
            cmd="$cmd tests/visual-regression.spec.js"
            ;;
        smoke)
            cmd="$cmd tests/auth.spec.js --grep \"should display login page\""
            ;;
        all)
            cmd="$cmd tests/"
            ;;
    esac
    
    # Add browser filter
    if [[ "$BROWSER" != "all" ]]; then
        cmd="$cmd --project=$BROWSER"
    fi
    
    # Add headless option
    if [[ "$HEADLESS" == "false" ]]; then
        cmd="$cmd --headed"
    fi
    
    # Add workers
    if [[ "$WORKERS" != "auto" ]]; then
        cmd="$cmd --workers=$WORKERS"
    fi
    
    # Add retries
    if [[ "$RETRIES" != "0" ]]; then
        cmd="$cmd --retries=$RETRIES"
    fi
    
    # Add reporter
    cmd="$cmd --reporter=$REPORTER"
    
    # Add update snapshots flag
    if [[ "$UPDATE_SNAPSHOTS" == "true" ]]; then
        cmd="$cmd --update-snapshots"
    fi
    
    echo "$cmd"
}

# Function to run tests
run_tests() {
    print_status "Starting Playwright tests..."
    print_status "Test Type: $TEST_TYPE"
    print_status "Browser: $BROWSER"
    print_status "Headless: $HEADLESS"
    print_status "Workers: $WORKERS"
    print_status "Retries: $RETRIES"
    print_status "Reporter: $REPORTER"
    
    local test_cmd=$(build_test_command)
    print_status "Running command: $test_cmd"
    
    # Run the tests
    if eval "$test_cmd"; then
        print_success "Tests completed successfully!"
        
        # Show test results
        if [[ "$REPORTER" == *"html"* ]]; then
            print_status "Opening HTML report..."
            npx playwright show-report
        fi
        
        return 0
    else
        print_error "Tests failed!"
        
        # Show test results even on failure
        if [[ "$REPORTER" == *"html"* ]]; then
            print_status "Opening HTML report for failed tests..."
            npx playwright show-report
        fi
        
        return 1
    fi
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up..."
    
    # Kill any remaining Playwright processes
    pkill -f playwright || true
    
    # Clean up temporary files if needed
    # rm -rf /tmp/playwright-* || true
    
    print_success "Cleanup completed"
}

# Main execution
main() {
    print_status "Starting Playwright test runner..."
    
    # Validate inputs
    validate_inputs
    
    # Check prerequisites
    check_prerequisites
    
    # Setup environment
    setup_environment
    
    # Set up cleanup trap
    trap cleanup EXIT
    
    # Run tests
    if run_tests; then
        print_success "All tests passed!"
        exit 0
    else
        print_error "Some tests failed!"
        exit 1
    fi
}

# Run main function
main "$@"
