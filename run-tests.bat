@echo off
REM ERP V3.0 - Complete Test Suite (Windows)

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ========================================
echo ERP V3.0 - Test Suite (Windows)
echo ========================================
echo.

set PASSED=0
set FAILED=0

REM 1. Backend Unit Tests
echo === Backend Tests ===
echo.

echo [1/7] Running Unit Tests (Crypto)...
call npm test -- crypto.unit.test.ts
if !errorlevel! equ 0 (set /a PASSED+=1) else (set /a FAILED+=1)

echo [2/7] Running Unit Tests (JWT)...
call npm test -- jwt.unit.test.ts
if !errorlevel! equ 0 (set /a PASSED+=1) else (set /a FAILED+=1)

echo [3/7] Running Unit Tests (Validators)...
call npm test -- validators.unit.test.ts
if !errorlevel! equ 0 (set /a PASSED+=1) else (set /a FAILED+=1)

echo [4/7] Running Integration Tests (Auth)...
call npm test -- auth.integration.test.ts
if !errorlevel! equ 0 (set /a PASSED+=1) else (set /a FAILED+=1)

REM 2. Coverage
echo [5/7] Running Coverage Report...
call npm run test:coverage
if !errorlevel! equ 0 (set /a PASSED+=1) else (set /a FAILED+=1)

REM 3. Frontend Tests
echo === Frontend Tests ===
cd frontend
echo [6/7] Running Frontend Tests...
call npm run test
if !errorlevel! equ 0 (set /a PASSED+=1) else (set /a FAILED+=1)

echo [7/7] Running Frontend Coverage...
call npm run test:coverage
if !errorlevel! equ 0 (set /a PASSED+=1) else (set /a FAILED+=1)

cd ..

REM Summary
echo.
echo ========================================
echo Test Summary
echo ========================================
echo Passed: %PASSED%
echo Failed: %FAILED%
echo ========================================

if %FAILED% equ 0 (
    echo All tests passed!
    exit /b 0
) else (
    echo Some tests failed!
    exit /b 1
)
