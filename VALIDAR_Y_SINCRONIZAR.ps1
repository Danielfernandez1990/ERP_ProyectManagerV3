#!/usr/bin/env pwsh

# ============================================================
# ERP V3.0 - SINCRONIZACION COMPLETA DE SERVICIOS
# ============================================================

Write-Host "`n"
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "   🔍 VALIDACION PROFUNDA DE SERVICIOS - ERP V3.0" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "`n"

$errorCount = 0

function Test-Service {
    param(
        [string]$Name,
        [scriptblock]$Test,
        [string]$ErrorMsg,
        [string]$FixMsg
    )
    
    Write-Host "[*] Verificando $Name..." -ForegroundColor Blue
    try {
        & $Test
        Write-Host "[✓] $Name OK" -ForegroundColor Green
        return $true
    } catch {
        Write-Host "[✗] ERROR: $ErrorMsg" -ForegroundColor Red
        if ($FixMsg) {
            Write-Host "    Solución: $FixMsg" -ForegroundColor Yellow
        }
        $script:errorCount++
        return $false
    }
}

# ============================================================
Write-Host "PASO 1: Verificar Docker" -ForegroundColor Cyan
# ============================================================

Test-Service "Docker" `
    { docker ps >$null 2>&1 } `
    "Docker no esta corriendo" `
    "Abre Docker Desktop"

# ============================================================
Write-Host "`nPASO 2: Verificar PostgreSQL" -ForegroundColor Cyan
# ============================================================

Test-Service "PostgreSQL Container" `
    { docker ps | Select-String "erp_postgres" >$null } `
    "PostgreSQL no esta levantado" `
    "Ejecuta: docker-compose up -d"

if ($?) {
    Test-Service "PostgreSQL Conectividad" `
        { docker exec erp_postgres pg_isready -U erp_user -h localhost 2>$null | Select-String "accepting" >$null } `
        "PostgreSQL no responde a conexiones" `
        "Reinicia: docker-compose restart postgres"
    
    Test-Service "PostgreSQL Base de Datos" `
        { docker exec erp_postgres psql -U erp_user -d erp_v3_db -c "SELECT 1" 2>$null | Select-String "1" >$null } `
        "No se puede conectar con las credenciales" `
        "Verifica: usuario=erp_user, password=erp_password_123, db=erp_v3_db"
}

# ============================================================
Write-Host "`nPASO 3: Verificar Redis" -ForegroundColor Cyan
# ============================================================

Test-Service "Redis Container" `
    { docker ps | Select-String "erp_redis" >$null } `
    "Redis no esta levantado" `
    "Ejecuta: docker-compose up -d"

if ($?) {
    Test-Service "Redis Conectividad" `
        { docker exec erp_redis redis-cli -a redis_password_123 ping 2>$null | Select-String "PONG" >$null } `
        "Redis no responde" `
        "Reinicia: docker-compose restart redis"
}

# ============================================================
Write-Host "`nPASO 4: Verificar Puertos Disponibles" -ForegroundColor Cyan
# ============================================================

$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

if ($port3000) {
    Write-Host "[⚠] Puerto 3000 ya esta en uso" -ForegroundColor Yellow
    Write-Host "    Proceso: $($port3000.OwningProcess)" -ForegroundColor Yellow
} else {
    Write-Host "[✓] Puerto 3000 disponible" -ForegroundColor Green
}

if ($port5173) {
    Write-Host "[⚠] Puerto 5173 ya esta en uso" -ForegroundColor Yellow
} else {
    Write-Host "[✓] Puerto 5173 disponible" -ForegroundColor Green
}

# ============================================================
Write-Host "`nPASO 5: Verificar Variables de Entorno Backend" -ForegroundColor Cyan
# ============================================================

if (-not (Test-Path ".env")) {
    Write-Host "[✗] Archivo .env no existe" -ForegroundColor Red
    Copy-Item ".env.example" ".env"
    Write-Host "[✓] .env creado desde .env.example" -ForegroundColor Green
}

$envContent = Get-Content ".env" -Raw

$checks = @(
    @{ Pattern = "DB_HOST=localhost"; Name = "DB_HOST" }
    @{ Pattern = "DB_USER=erp_user"; Name = "DB_USER" }
    @{ Pattern = "DB_PASSWORD=erp_password_123"; Name = "DB_PASSWORD" }
    @{ Pattern = "DB_NAME=erp_v3_db"; Name = "DB_NAME" }
    @{ Pattern = "REDIS_HOST=localhost"; Name = "REDIS_HOST" }
    @{ Pattern = "REDIS_PASSWORD=redis_password_123"; Name = "REDIS_PASSWORD" }
    @{ Pattern = "CORS_ORIGIN"; Name = "CORS_ORIGIN" }
)

foreach ($check in $checks) {
    if ($envContent -match $check.Pattern) {
        Write-Host "[✓] $($check.Name) configurado" -ForegroundColor Green
    } else {
        Write-Host "[⚠] $($check.Name) puede no estar configurado correctamente" -ForegroundColor Yellow
    }
}

# ============================================================
Write-Host "`nPASO 6: Verificar Variables de Entorno Frontend" -ForegroundColor Cyan
# ============================================================

if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "[✗] Archivo frontend\.env.local no existe" -ForegroundColor Red
    Copy-Item "frontend\.env.example" "frontend\.env.local"
    Write-Host "[✓] frontend\.env.local creado" -ForegroundColor Green
}

$frontendEnv = Get-Content "frontend\.env.local" -Raw
if ($frontendEnv -match "VITE_API_URL=http://localhost:3000/api") {
    Write-Host "[✓] VITE_API_URL configurado correctamente" -ForegroundColor Green
} else {
    Write-Host "[⚠] VITE_API_URL puede no ser correcto" -ForegroundColor Yellow
    Write-Host "    Debe ser: http://localhost:3000/api" -ForegroundColor Yellow
}

# ============================================================
Write-Host "`nPASO 7: Verificar Dependencias Node.js" -ForegroundColor Cyan
# ============================================================

if (-not (Test-Path "node_modules")) {
    Write-Host "[✗] Backend node_modules no existe" -ForegroundColor Red
    Write-Host "[*] Instalando dependencias backend..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[✗] Error instalando dependencias backend" -ForegroundColor Red
        $errorCount++
    }
} else {
    Write-Host "[✓] Backend node_modules existe" -ForegroundColor Green
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "[✗] Frontend node_modules no existe" -ForegroundColor Red
    Write-Host "[*] Instalando dependencias frontend..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[✗] Error instalando dependencias frontend" -ForegroundColor Red
        $errorCount++
    }
} else {
    Write-Host "[✓] Frontend node_modules existe" -ForegroundColor Green
}

# ============================================================
Write-Host "`nPASO 8: Verificar Conectividad a Backend" -ForegroundColor Cyan
# ============================================================

Write-Host "[*] Probando http://localhost:3000/api/health..." -ForegroundColor Blue
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "[✓] Backend responde correctamente" -ForegroundColor Green
    }
} catch {
    Write-Host "[⚠] Backend no esta corriendo aun (esto es normal si no lo levantaste)" -ForegroundColor Yellow
}

# ============================================================
Write-Host "`n============================================================" -ForegroundColor Green
Write-Host "   ✅ VALIDACION COMPLETADA" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Green
Write-Host "`n"

if ($errorCount -eq 0) {
    Write-Host "Errores encontrados: 0" -ForegroundColor Green
    Write-Host "`n"
    Write-Host "ORDEN DE LEVANTAMIENTO DE SERVICIOS:" -ForegroundColor Cyan
    Write-Host "`n"
    Write-Host "1. [YA LEVANTADO] Docker (PostgreSQL + Redis)" -ForegroundColor Green
    Write-Host "`n"
    Write-Host "2. [SIGUIENTE] Backend - Abre TERMINAL 1:" -ForegroundColor Blue
    Write-Host "   cd C:\ERP-V3" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host "`n"
    Write-Host "3. [ESPERA 3-5 SEGUNDOS] Verifica que Backend este listo:" -ForegroundColor Blue
    Write-Host "   http://localhost:3000/api/health" -ForegroundColor White
    Write-Host "`n"
    Write-Host "4. [LUEGO] Frontend - Abre TERMINAL 2:" -ForegroundColor Blue
    Write-Host "   cd C:\ERP-V3\frontend" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host "`n"
    Write-Host "5. [FINALMENTE] Abre navegador:" -ForegroundColor Blue
    Write-Host "   http://localhost:5173" -ForegroundColor White
    Write-Host "`n"
    Write-Host "CREDENCIALES DE PRUEBA:" -ForegroundColor Cyan
    Write-Host "   Email:      admin@erp.local" -ForegroundColor White
    Write-Host "   Contraseña: Admin123!" -ForegroundColor White
    Write-Host "`n"
    Write-Host "PUERTOS:" -ForegroundColor Cyan
    Write-Host "   Backend:    http://localhost:3000" -ForegroundColor White
    Write-Host "   Frontend:   http://localhost:5173" -ForegroundColor White
    Write-Host "   PostgreSQL: localhost:5432" -ForegroundColor White
    Write-Host "   Redis:      localhost:6379" -ForegroundColor White
    Write-Host "`n"
} else {
    Write-Host "Errores encontrados: $errorCount" -ForegroundColor Red
    Write-Host "Por favor revisa los errores arriba" -ForegroundColor Red
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "`n"
Read-Host "Presiona ENTER para terminar"
