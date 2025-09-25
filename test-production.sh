#!/bin/bash

# PulseHub Production Test Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Test function
test_endpoint() {
    local url=$1
    local name=$2
    
    print_status "Testing $name: $url"
    
    if curl -s -f "$url" > /dev/null; then
        print_success "$name is working"
        return 0
    else
        print_error "$name failed"
        return 1
    fi
}

# Main test function
main() {
    print_status "Starting PulseHub production tests..."
    
    # Check if service is running
    if ! curl -s http://localhost:3001/api/health > /dev/null; then
        print_error "PulseHub service is not running on port 3001"
        print_status "Please start the service first:"
        echo "  npm run dev"
        echo "  or"
        echo "  docker-compose up -d"
        exit 1
    fi
    
    print_success "PulseHub service is running"
    
    # Test all endpoints
    local failed_tests=0
    
    test_endpoint "http://localhost:3001/api/health" "Health Check" || ((failed_tests++))
    test_endpoint "http://localhost:3001/api/all" "All Platforms" || ((failed_tests++))
    test_endpoint "http://localhost:3001/api/weibo" "Weibo API" || ((failed_tests++))
    test_endpoint "http://localhost:3001/api/douyin" "Douyin API" || ((failed_tests++))
    test_endpoint "http://localhost:3001/api/bilibili" "Bilibili API" || ((failed_tests++))
    test_endpoint "http://localhost:3001/api/zhihu" "Zhihu API" || ((failed_tests++))
    test_endpoint "http://localhost:3001/api/baidu" "Baidu API" || ((failed_tests++))
    test_endpoint "http://localhost:3001/api/toutiao" "Toutiao API" || ((failed_tests++))
    
    # Test frontend
    if curl -s -f "http://localhost:3000" > /dev/null; then
        print_success "Frontend is accessible"
    else
        print_warning "Frontend is not accessible (this is normal if only backend is running)"
    fi
    
    # Summary
    if [ $failed_tests -eq 0 ]; then
        print_success "All tests passed! PulseHub is ready for production."
    else
        print_error "$failed_tests test(s) failed. Please check the issues above."
        exit 1
    fi
}

# Run tests
main "$@"
