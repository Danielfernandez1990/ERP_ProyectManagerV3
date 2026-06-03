@echo off
REM ERP V3.0 - Setup y Start Script
REM Este script instala y levanta el proyecto

echo.
echo ========================================
echo ERP V3.0 - Setup y Start
echo ========================================
echo.

REM 1. Crear .env si no existe
if not exist ".env" (
    echo Creando archivo .env...
    copy .env.example .env
    echo .env creado
) else (
    echo .env ya existe
)

REM 2. Instalar dependencias backend
echo.
echo ========================================
echo Instalando dependencias backend...
echo ========================================
call npm install
if errorlevel 1 (
    echo Error instalando dependencias backend
    pause
    exit /b 1
)

REM 3. Instalar dependencias frontend
echo.
echo ========================================
echo Instalando dependencias frontend...
echo ========================================
cd frontend
if not exist ".env.local" (
    echo Creando archivo .env.local...
    copy .env.example .env.local
    echo .env.local creado
)
call npm install
if errorlevel 1 (
    echo Error instalando dependencias frontend
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Levantando servicios con Docker...
echo ========================================
echo.
echo Asegúrate de que Docker Desktop está corriendo
echo Presiona Enter para continuar...
pause

docker-compose up -d

if errorlevel 1 (
    echo Error levantando Docker Compose
    pause
    exit /b 1
)

echo.
echo ========================================
echo Esperando a que los servicios inicien...
echo ========================================
timeout /t 10 /nobreak

REM 4. Verificar salud
echo.
echo Verificando conexión al backend...
:retry
timeout /t 2 /nobreak
curl -s http://localhost:3000/api/health > nul
if errorlevel 1 (
    echo Backend aún iniciando...
    goto retry
)

echo.
echo ========================================
echo ✅ Setup completado!
echo ========================================
echo.
echo URLs:
echo   Frontend:   http://localhost:5173
echo   Backend:    http://localhost:3000/api
echo   PostgreSQL: localhost:5432
echo   Redis:      localhost:6379
echo.
echo Credenciales de prueba:
echo   Email:      admin@erp.local
echo   Contraseña: Admin123!
echo.
echo Para iniciar en otra terminal:
echo   Backend: npm run dev
echo   Frontend: cd frontend && npm run dev
echo.
echo Comandos útiles:
echo   docker-compose ps      - Ver estado de containers
echo   docker-compose logs -f - Ver logs
echo   npm test               - Ejecutar tests
echo   npm run test:coverage  - Coverage report
echo.
pause
