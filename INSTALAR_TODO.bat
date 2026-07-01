@echo off
REM ERP V3.0 - Instalacion completa automatica (Version Simplificada)
REM Este script hace TODO por ti

cls
echo.
echo ════════════════════════════════════════════════════════════
echo    🚀 ERP V3.0 - INSTALACION AUTOMATICA SIMPLIFICADA
echo ════════════════════════════════════════════════════════════
echo.
echo Este script va a:
echo   1. Crear archivos de configuracion
echo   2. Limpiar cache npm
echo   3. Instalar dependencias backend
echo   4. Instalar dependencias frontend
echo   5. Levantar Docker Compose (solo BD y Redis)
echo   6. Verificar que todo funcione
echo.
echo Presiona ENTER para comenzar...
pause

REM Verificar requisitos
echo.
echo ════════════════════════════════════════════════════════════
echo VERIFICANDO REQUISITOS
echo ════════════════════════════════════════════════════════════

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: Node.js no esta instalado
    echo.
    echo Descarga e instala Node.js desde: https://nodejs.org/
    echo Asegurate de instalar la version LTS (recomendada)
    echo.
    echo Despues de instalar, reinicia esta terminal
    echo.
    pause
    exit /b 1
)
echo ✓ Node.js instalado

where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: Docker no esta instalado
    echo.
    echo Descarga e instala Docker Desktop desde:
    echo https://www.docker.com/products/docker-desktop
    echo.
    echo Despues de instalar, abre Docker Desktop y vuelve a ejecutar este script
    echo.
    pause
    exit /b 1
)
echo ✓ Docker instalado

docker ps >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: Docker no esta corriendo
    echo.
    echo Por favor:
    echo   1. Abre Docker Desktop
    echo   2. Espera a que diga "Docker is running"
    echo   3. Vuelve a ejecutar este script
    echo.
    pause
    exit /b 1
)
echo ✓ Docker esta corriendo

echo.
echo ════════════════════════════════════════════════════════════
echo CREANDO ARCHIVOS DE CONFIGURACION
echo ════════════════════════════════════════════════════════════

if not exist ".env" (
    echo Creando .env...
    copy .env.example .env >nul
    echo ✓ Archivo .env creado
) else (
    echo ✓ Archivo .env ya existe
)

if not exist "frontend\.env.local" (
    echo Creando frontend\.env.local...
    copy frontend\.env.example frontend\.env.local >nul
    echo ✓ Archivo frontend\.env.local creado
) else (
    echo ✓ Archivo frontend\.env.local ya existe
)

echo.
echo ════════════════════════════════════════════════════════════
echo LIMPIANDO CACHE NPM
echo ════════════════════════════════════════════════════════════

echo Limpiando cache...
call npm cache clean --force >nul 2>nul
echo ✓ Cache limpio

echo.
echo ════════════════════════════════════════════════════════════
echo INSTALANDO DEPENDENCIAS BACKEND
echo ════════════════════════════════════════════════════════════
echo (esto puede tardar 3-5 minutos)
echo.

REM Limpiar node_modules y package-lock.json
if exist "node_modules" (
    echo Removiendo node_modules existentes...
    rmdir /s /q node_modules >nul 2>nul
)
if exist "package-lock.json" (
    echo Removiendo package-lock.json...
    del package-lock.json >nul 2>nul
)

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: No se pudo instalar backend
    echo.
    echo Intenta manualmente:
    echo   npm cache clean --force
    echo   npm install
    echo.
    pause
    exit /b 1
)

echo.
echo ════════════════════════════════════════════════════════════
echo INSTALANDO DEPENDENCIAS FRONTEND
echo ════════════════════════════════════════════════════════════
echo (esto puede tardar 3-5 minutos)
echo.

cd frontend

REM Limpiar node_modules y package-lock.json
if exist "node_modules" (
    echo Removiendo node_modules existentes...
    rmdir /s /q node_modules >nul 2>nul
)
if exist "package-lock.json" (
    echo Removiendo package-lock.json...
    del package-lock.json >nul 2>nul
)

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: No se pudo instalar frontend
    echo.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ════════════════════════════════════════════════════════════
echo LEVANTANDO SERVICIOS DOCKER (PostgreSQL + Redis)
echo ════════════════════════════════════════════════════════════
echo.

docker-compose down -v 2>nul
timeout /t 2 /nobreak

docker-compose up -d
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: No se pudo levantar Docker Compose
    echo.
    pause
    exit /b 1
)

echo.
echo Esperando a que los servicios inicien...
echo (esto toma 15-20 segundos)
echo.

timeout /t 20 /nobreak

echo.
echo ════════════════════════════════════════════════════════════
echo VERIFICANDO SERVICIOS
echo ════════════════════════════════════════════════════════════
echo.

docker-compose ps

echo.
echo ════════════════════════════════════════════════════════════
echo ✅ INSTALACION COMPLETADA!
echo ════════════════════════════════════════════════════════════
echo.
echo 📍 UBICACION DEL PROYECTO: C:\ERP-V3
echo.
echo 🌐 ACCESOS:
echo    Frontend:    http://localhost:5173
echo    Backend API: http://localhost:3000/api
echo    Health:      http://localhost:3000/api/health
echo    PostgreSQL:  localhost:5432
echo    Redis:       localhost:6379
echo.
echo 🔑 CREDENCIALES:
echo    Email:      admin@erp.local
echo    Contraseña: Admin123!
echo.
echo 📝 PROXIMOS PASOS:
echo.
echo 1. Abre DOS terminales PowerShell nuevas
echo.
echo 2. En TERMINAL 1 - Inicia el backend:
echo    cd C:\ERP-V3
echo    npm run dev
echo.
echo 3. En TERMINAL 2 - Inicia el frontend:
echo    cd C:\ERP-V3\frontend
echo    npm run dev
echo.
echo 4. Abre navegador en:
echo    http://localhost:5173
echo.
echo 5. Login con:
echo    admin@erp.local / Admin123!
echo.
echo 📊 COMANDOS UTILES:
echo    docker-compose ps          - Ver estado
echo    docker-compose logs -f     - Ver logs
echo    npm test                   - Tests backend
echo    cd frontend; npm test      - Tests frontend
echo    docker-compose down        - Bajar servicios
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
