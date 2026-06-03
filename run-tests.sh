#!/bin/bash

# ERP V3.0 - Complete Test Suite
# Ejecuta todos los tests: unit, integration, E2E, performance

set -e

echo "========================================"
echo "ERP V3.0 - Test Suite"
echo "========================================"
echo ""

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function para correr tests
run_test() {
    local name=$1
    local command=$2
    
    echo -e "${YELLOW}▶ $name${NC}"
    
    if eval "$command"; then
        echo -e "${GREEN}✅ $name passed${NC}\n"
        ((PASSED++))
    else
        echo -e "${RED}❌ $name failed${NC}\n"
        ((FAILED++))
    fi
}

# 1. Backend Unit & Integration Tests
echo -e "${YELLOW}=== Backend Tests ===${NC}\n"
run_test "Unit Tests (Crypto)" "npm test -- crypto.unit.test.ts"
run_test "Unit Tests (JWT)" "npm test -- jwt.unit.test.ts"
run_test "Unit Tests (Validators)" "npm test -- validators.unit.test.ts"
run_test "Integration Tests (Auth)" "npm test -- auth.integration.test.ts"

# 2. Backend Coverage
echo -e "${YELLOW}=== Coverage Report ===${NC}\n"
run_test "Coverage Report" "npm run test:coverage"

# 3. Frontend Tests
echo -e "${YELLOW}=== Frontend Tests ===${NC}\n"
cd frontend
run_test "Frontend Unit Tests" "npm run test"
run_test "Frontend Coverage" "npm run test:coverage"
cd ..

# 4. E2E Tests (if containers running)
if docker ps | grep -q erp_frontend; then
    echo -e "${YELLOW}=== E2E Tests ===${NC}\n"
    cd frontend
    run_test "E2E Authentication" "npx playwright test e2e/auth.e2e.ts"
    run_test "E2E Kanban" "npx playwright test e2e/kanban.e2e.ts"
    cd ..
else
    echo -e "${YELLOW}⚠ Skipping E2E tests (containers not running)${NC}\n"
fi

# 5. Performance Tests (if backend running)
if curl -s http://localhost:3000/api/health > /dev/null; then
    echo -e "${YELLOW}=== Performance Tests ===${NC}\n"
    run_test "Load Tests" "artillery run load-tests.yml"
else
    echo -e "${YELLOW}⚠ Skipping performance tests (backend not running)${NC}\n"
fi

# Summary
echo ""
echo "========================================"
echo -e "Test Summary"
echo "========================================"
echo -e "${GREEN}✅ Passed: $PASSED${NC}"
echo -e "${RED}❌ Failed: $FAILED${NC}"
echo "========================================"

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️ Some tests failed${NC}"
    exit 1
fi
