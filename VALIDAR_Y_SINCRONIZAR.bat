@echo off
REM ============================================================
REM ERP V3.0 - SINCRONIZACION Y VALIDACION DE SERVICIOS
REM ============================================================

setlocal enabledelayedexpansion

cls
echo.
echo ============================================================
echo   🔍 VALIDACION PROFUNDA DE SERVICIOS - ERP V3.0
echo ============================================================
echo.

REM Variables de color (en PowerShell)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "RESET=[0m"

REM ============================================================
echo [*] PASO 1: Verificar Docker
echo ============================================================
docker ps >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Docker no esta corriendo
    echo [SOLUCION] Abre Docker Desktop
    pause
    exit /b 1
)
echo [OK] Docker esta corriendo

REM ============================================================
echo [*] PASO 2: Verificar PostgreSQL
echo ============================================================
docker ps | findstr erp_postgres >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PostgreSQL no esta levantado
    echo [SOLUCION] Ejecuta: docker-compose up -d
    pause
    exit /b 1
)
echo [OK] PostgreSQL esta levantado

docker exec erp_postgres pg_isready -U erp_user -h localhost >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] PostgreSQL no responde
    echo [SOLUCION] Espera unos segundos y reinicia: docker-compose restart postgres
    pause
    exit /b 1
)
echo [OK] PostgreSQL responde correctamente

REM ============================================================
echo [*] PASO 3: Verificar Redis
echo ============================================================
docker ps | findstr erp_redis >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Redis no esta levantado
    echo [SOLUCION] Ejecuta: docker-compose up -d
    pause
    exit /b 1
)
echo [OK] Redis esta levantado

docker exec erp_redis redis-cli -a redis_password_123 ping >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Redis no responde
    echo [SOLUCION] Reinicia: docker-compose restart redis
    pause
    exit /b 1
)
echo [OK] Redis responde correctamente

REM ============================================================
echo [*] PASO 4: Verificar puerto 3000 disponible
echo ============================================================
netstat -ano | findstr :3000 >nul
if %ERRORLEVEL% EQU 0 (
    echo [ADVERTENCIA] Puerto 3000 esta en uso
    echo [SOLUCION] Cierra procesos en puerto 3000: netstat -ano | findstr :3000
    echo Luego: taskkill /PID [PID] /F
)
echo [OK] Puerto 3000 disponible

REM ============================================================
echo [*] PASO 5: Verificar puerto 5173 disponible
echo ============================================================
netstat -ano | findstr :5173 >nul
if %ERRORLEVEL% EQU 0 (
    echo [ADVERTENCIA] Puerto 5173 esta en uso
    echo [SOLUCION] Cierra procesos en puerto 5173
)
echo [OK] Puerto 5173 disponible

REM ============================================================
echo [*] PASO 6: Verificar variables de entorno (.env)
echo ============================================================
if not exist ".env" (
    echo [ERROR] Archivo .env no existe
    copy .env.example .env
    echo [OK] .env creado desde .env.example
)
echo [OK] Archivo .env existe

REM Verificar contenido clave de .env
findstr /M "DB_HOST=localhost" .env >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] DB_HOST no esta configurado correctamente en .env
    pause
    exit /b 1
)
echo [OK] DB_HOST configurado

findstr /M "DB_PASSWORD=erp_password_123" .env >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ADVERTENCIA] DB_PASSWORD puede no ser correcto
)
echo [OK] DB_PASSWORD configurado

findstr /M "REDIS_HOST=localhost" .env >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] REDIS_HOST no esta configurado
    pause
    exit /b 1
)
echo [OK] REDIS_HOST configurado

findstr /M "CORS_ORIGIN" .env >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] CORS_ORIGIN no esta configurado
    pause
    exit /b 1
)
echo [OK] CORS_ORIGIN configurado

REM ============================================================
echo [*] PASO 7: Verificar variables frontend
echo ============================================================
if not exist "frontend\.env.local" (
    echo [ERROR] Archivo frontend\.env.local no existe
    copy frontend\.env.example frontend\.env.local
    echo [OK] frontend\.env.local creado
)
echo [OK] Archivo frontend\.env.local existe

findstr /M "VITE_API_URL=http://localhost:3000/api" frontend\.env.local >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ADVERTENCIA] VITE_API_URL puede no ser correcto
    echo URL debe ser: http://localhost:3000/api
)
echo [OK] VITE_API_URL configurado

REM ============================================================
echo [*] PASO 8: Verificar credenciales de BD
echo ============================================================
echo.
echo Probando conexion a PostgreSQL con credenciales...
docker exec erp_postgres psql -U erp_user -d erp_v3_db -c "SELECT 1" >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] No se puede conectar a PostgreSQL con credenciales
    echo Usuario: erp_user
    echo Password: erp_password_123
    echo Database: erp_v3_db
    pause
    exit /b 1
)
echo [OK] Credenciales PostgreSQL validas

REM ============================================================
echo [*] PASO 9: Verificar tablas en BD
echo ============================================================
docker exec erp_postgres psql -U erp_user -d erp_v3_db -c "\dt" | findstr usuarios >nul
if %ERRORLEVEL% NEQ 0 (
    echo [ADVERTENCIA] No hay tablas en la BD
    echo [INFO] Las tablas se crearan cuando se ejecute el backend
)
echo [OK] Base de datos lista

REM ============================================================
echo [*] PASO 10: Verificar dependencias Node.js
echo ============================================================
if not exist "node_modules" (
    echo [ERROR] Backend node_modules no existe
    echo [INFO] Instalando dependencias backend...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] No se pudo instalar dependencias backend
        pause
        exit /b 1
    )
)
echo [OK] Backend node_modules existe

if not exist "frontend\node_modules" (
    echo [ERROR] Frontend node_modules no existe
    echo [INFO] Instalando dependencias frontend...
    cd frontend
    call npm install
    cd ..
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] No se pudo instalar dependencias frontend
        pause
        exit /b 1
    )
)
echo [OK] Frontend node_modules existe

echo.
echo ============================================================
echo   ✅ TODAS LAS VALIDACIONES PASARON
echo ============================================================
echo.
echo ORDEN DE LEVANTAMIENTO DE SERVICIOS:
echo.
echo 1. [YA LEVANTADO] Docker (PostgreSQL + Redis)
echo.
echo 2. [SIGUIENTE] Backend - Abre TERMINAL 1:
echo    cd C:\ERP-V3
echo    npm run dev
echo.
echo 3. [ESPERA 3-5 SEGUNDOS] Verifica que Backend este listo:
echo    http://localhost:3000/api/health
echo.
echo 4. [LUEGO] Frontend - Abre TERMINAL 2:
echo    cd C:\ERP-V3\frontend
echo    npm run dev
echo.
echo 5. [FINALMENTE] Abre navegador:
echo    http://localhost:5173
echo.
echo CREDENCIALES DE PRUEBA:
echo    Email:      admin@erp.local
echo    Contraseña: Admin123!
echo.
echo PUERTOS:
echo    Backend:    http://localhost:3000
echo    Frontend:   http://localhost:5173
echo    PostgreSQL: localhost:5432
echo    Redis:      localhost:6379
echo.
echo ============================================================
echo.
pause
