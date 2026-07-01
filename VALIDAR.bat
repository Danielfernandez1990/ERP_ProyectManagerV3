@echo off
REM ============================================================
REM ERP V3.0 - VALIDACION SIMPLE Y EFECTIVA
REM ============================================================

cls
echo.
echo ============================================================
echo    VALIDACION DE SERVICIOS - ERP V3.0
echo ============================================================
echo.

set "ERROR_COUNT=0"

REM ============================================================
echo [1/10] Verificando Docker...
REM ============================================================
docker ps >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker no esta corriendo
    echo [SOLUCION] Abre Docker Desktop
    set /a ERROR_COUNT+=1
) else (
    echo [OK] Docker corriendo
)

REM ============================================================
echo [2/10] Verificando PostgreSQL Container...
REM ============================================================
docker ps | findstr erp_postgres >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PostgreSQL no esta levantado
    echo [SOLUCION] Ejecuta: docker-compose up -d
    set /a ERROR_COUNT+=1
) else (
    echo [OK] PostgreSQL Container levantado
)

REM ============================================================
echo [3/10] Verificando conectividad PostgreSQL...
REM ============================================================
docker exec erp_postgres pg_isready -U erp_user -h localhost >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ADVERTENCIA] PostgreSQL no responde aun
) else (
    echo [OK] PostgreSQL acepta conexiones
)

REM ============================================================
echo [4/10] Verificando credenciales PostgreSQL...
REM ============================================================
docker exec erp_postgres psql -U erp_user -d erp_v3_db -c "SELECT 1" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Credenciales PostgreSQL incorrectas
    echo Usuario: erp_user
    echo Password: erp_password_123
    echo Database: erp_v3_db
    set /a ERROR_COUNT+=1
) else (
    echo [OK] Credenciales validas
)

REM ============================================================
echo [5/10] Verificando Redis Container...
REM ============================================================
docker ps | findstr erp_redis >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Redis no esta levantado
    echo [SOLUCION] Ejecuta: docker-compose up -d
    set /a ERROR_COUNT+=1
) else (
    echo [OK] Redis Container levantado
)

REM ============================================================
echo [6/10] Verificando conectividad Redis...
REM ============================================================
docker exec erp_redis redis-cli -a redis_password_123 ping >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ADVERTENCIA] Redis no responde
) else (
    echo [OK] Redis responde
)

REM ============================================================
echo [7/10] Verificando archivo .env...
REM ============================================================
if not exist ".env" (
    echo [ERROR] Archivo .env no existe
    copy .env.example .env >nul
    echo [INFO] Creado .env desde .env.example
) else (
    echo [OK] Archivo .env existe
)

REM ============================================================
echo [8/10] Verificando archivo frontend\.env.local...
REM ============================================================
if not exist "frontend\.env.local" (
    echo [ERROR] Archivo frontend\.env.local no existe
    copy frontend\.env.example frontend\.env.local >nul
    echo [INFO] Creado frontend\.env.local
) else (
    echo [OK] Archivo frontend\.env.local existe
)

REM ============================================================
echo [9/10] Verificando node_modules backend...
REM ============================================================
if not exist "node_modules" (
    echo [ERROR] Backend node_modules no existe
    echo [SOLUCION] Ejecuta: npm install
    set /a ERROR_COUNT+=1
) else (
    echo [OK] Backend node_modules existe
)

REM ============================================================
echo [10/10] Verificando node_modules frontend...
REM ============================================================
if not exist "frontend\node_modules" (
    echo [ERROR] Frontend node_modules no existe
    echo [SOLUCION] Ejecuta: cd frontend && npm install
    set /a ERROR_COUNT+=1
) else (
    echo [OK] Frontend node_modules existe
)

REM ============================================================
echo.
echo ============================================================
if %ERROR_COUNT% EQU 0 (
    echo [SUCCESS] VALIDACION COMPLETADA - 0 ERRORES
) else (
    echo [FAILED] VALIDACION COMPLETADA - %ERROR_COUNT% ERRORES
)
echo ============================================================
echo.

echo.
echo ORDEN DE LEVANTAMIENTO:
echo.
echo 1. Docker (ya deberia estar levantado)
echo    docker-compose up -d
echo.
echo 2. Backend - Abre TERMINAL 1:
echo    cd C:\ERP-V3
echo    npm run dev
echo.
echo 3. Frontend - Abre TERMINAL 2:
echo    cd C:\ERP-V3\frontend
echo    npm run dev
echo.
echo 4. Navegador:
echo    http://localhost:5173
echo.
echo 5. Login:
echo    Email: admin@erp.local
echo    Pass: Admin123!
echo.
echo ============================================================
echo.
pause
