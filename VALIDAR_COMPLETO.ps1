#!/usr/bin/env pwsh

# ============================================================
# ERP V3.0 - SINCRONIZACION COMPLETA DE SERVICIOS
# ============================================================

$logFile = "C:\ERP-V3\validation_log.txt"
$null = "" | Out-File $logFile -Force

function Log-Message {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    
    Write-Host $Message -ForegroundColor $Color
    $Message | Out-File $logFile -Append
}

Log-Message "`n============================================================" "Cyan"
Log-Message "   🔍 VALIDACION PROFUNDA DE SERVICIOS - ERP V3.0" "Cyan"
Log-Message "============================================================`n" "Cyan"

$errorCount = 0

# ============================================================
Log-Message "PASO 1: Verificar Docker" "Cyan"
# ============================================================

try {
    docker ps >$null 2>&1
    Log-Message "[✓] Docker esta corriendo" "Green"
} catch {
    Log-Message "[✗] ERROR: Docker no esta corriendo" "Red"
    Log-Message "    Solución: Abre Docker Desktop" "Yellow"
    $errorCount++
}

# ============================================================
Log-Message "`nPASO 2: Verificar PostgreSQL" "Cyan"
# ============================================================

try {
    $pgRunning = docker ps | Select-String "erp_postgres"
    if ($pgRunning) {
        Log-Message "[✓] PostgreSQL Container esta levantado" "Green"
    } else {
        throw "Container no encontrado"
    }
} catch {
    Log-Message "[✗] ERROR: PostgreSQL no esta levantado" "Red"
    Log-Message "    Solución: Ejecuta: docker-compose up -d" "Yellow"
    $errorCount++
}

# Probar conectividad PostgreSQL
try {
    $pgReady = docker exec erp_postgres pg_isready -U erp_user -h localhost 2>&1 | Select-String "accepting"
    if ($pgReady) {
        Log-Message "[✓] PostgreSQL acepta conexiones" "Green"
    }
} catch {
    Log-Message "[⚠] PostgreSQL no acepta conexiones aun" "Yellow"
}

# Probar credenciales
try {
    $dbTest = docker exec erp_postgres psql -U erp_user -d erp_v3_db -c "SELECT 1" 2>&1
    if ($dbTest -match "1") {
        Log-Message "[✓] Credenciales PostgreSQL validas" "Green"
    }
} catch {
    Log-Message "[✗] ERROR: No se puede conectar con credenciales" "Red"
    Log-Message "    Usuario: erp_user" "Yellow"
    Log-Message "    Password: erp_password_123" "Yellow"
    Log-Message "    Database: erp_v3_db" "Yellow"
    $errorCount++
}

# ============================================================
Log-Message "`nPASO 3: Verificar Redis" "Cyan"
# ============================================================

try {
    $redisRunning = docker ps | Select-String "erp_redis"
    if ($redisRunning) {
        Log-Message "[✓] Redis Container esta levantado" "Green"
    } else {
        throw "Container no encontrado"
    }
} catch {
    Log-Message "[✗] ERROR: Redis no esta levantado" "Red"
    Log-Message "    Solución: Ejecuta: docker-compose up -d" "Yellow"
    $errorCount++
}

# Probar conectividad Redis
try {
    $redisTest = docker exec erp_redis redis-cli -a redis_password_123 ping 2>&1
    if ($redisTest -match "PONG") {
        Log-Message "[✓] Redis responde correctamente" "Green"
    }
} catch {
    Log-Message "[⚠] Redis no responde" "Yellow"
}

# ============================================================
Log-Message "`nPASO 4: Verificar Puertos Disponibles" "Cyan"
# ============================================================

try {
    $port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
    if ($port3000) {
        Log-Message "[⚠] Puerto 3000 ya esta en uso (PID: $($port3000.OwningProcess))" "Yellow"
    } else {
        Log-Message "[✓] Puerto 3000 disponible" "Green"
    }
} catch {
    Log-Message "[✓] Puerto 3000 disponible" "Green"
}

try {
    $port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
    if ($port5173) {
        Log-Message "[⚠] Puerto 5173 ya esta en uso" "Yellow"
    } else {
        Log-Message "[✓] Puerto 5173 disponible" "Green"
    }
} catch {
    Log-Message "[✓] Puerto 5173 disponible" "Green"
}

# ============================================================
Log-Message "`nPASO 5: Verificar Variables de Entorno Backend (.env)" "Cyan"
# ============================================================

if (-not (Test-Path "C:\ERP-V3\.env")) {
    Log-Message "[✗] Archivo .env no existe" "Red"
    if (Test-Path "C:\ERP-V3\.env.example") {
        Copy-Item "C:\ERP-V3\.env.example" "C:\ERP-V3\.env"
        Log-Message "[✓] .env creado desde .env.example" "Green"
    }
} else {
    Log-Message "[✓] Archivo .env existe" "Green"
    
    $envContent = Get-Content "C:\ERP-V3\.env" -Raw
    
    $checks = @(
        @{ Pattern = "DB_HOST"; Value = "localhost" }
        @{ Pattern = "DB_USER"; Value = "erp_user" }
        @{ Pattern = "DB_PASSWORD"; Value = "erp_password_123" }
        @{ Pattern = "DB_NAME"; Value = "erp_v3_db" }
        @{ Pattern = "REDIS_HOST"; Value = "localhost" }
        @{ Pattern = "REDIS_PASSWORD"; Value = "redis_password_123" }
        @{ Pattern = "CORS_ORIGIN"; Value = "http://localhost:5173" }
    )
    
    foreach ($check in $checks) {
        if ($envContent -match "$($check.Pattern)=$($check.Value)") {
            Log-Message "    [✓] $($check.Pattern) = $($check.Value)" "Green"
        } else {
            Log-Message "    [⚠] $($check.Pattern) puede no estar correcto" "Yellow"
        }
    }
}

# ============================================================
Log-Message "`nPASO 6: Verificar Variables de Entorno Frontend (.env.local)" "Cyan"
# ============================================================

if (-not (Test-Path "C:\ERP-V3\frontend\.env.local")) {
    Log-Message "[✗] Archivo frontend\.env.local no existe" "Red"
    if (Test-Path "C:\ERP-V3\frontend\.env.example") {
        Copy-Item "C:\ERP-V3\frontend\.env.example" "C:\ERP-V3\frontend\.env.local"
        Log-Message "[✓] frontend\.env.local creado" "Green"
    }
} else {
    Log-Message "[✓] Archivo frontend\.env.local existe" "Green"
    
    $frontendEnv = Get-Content "C:\ERP-V3\frontend\.env.local" -Raw
    if ($frontendEnv -match "VITE_API_URL=http://localhost:3000/api") {
        Log-Message "    [✓] VITE_API_URL = http://localhost:3000/api" "Green"
    } else {
        Log-Message "    [⚠] VITE_API_URL puede no ser correcto" "Yellow"
    }
}

# ============================================================
Log-Message "`nPASO 7: Verificar Dependencias Node.js Backend" "Cyan"
# ============================================================

if (Test-Path "C:\ERP-V3\node_modules") {
    Log-Message "[✓] Backend node_modules existe" "Green"
    $packageCount = (Get-ChildItem "C:\ERP-V3\node_modules" -Directory).Count
    Log-Message "    Paquetes instalados: $packageCount" "Gray"
} else {
    Log-Message "[✗] Backend node_modules NO existe" "Red"
    Log-Message "    Necesitas ejecutar: npm install" "Yellow"
    $errorCount++
}

# ============================================================
Log-Message "`nPASO 8: Verificar Dependencias Node.js Frontend" "Cyan"
# ============================================================

if (Test-Path "C:\ERP-V3\frontend\node_modules") {
    Log-Message "[✓] Frontend node_modules existe" "Green"
    $packageCount = (Get-ChildItem "C:\ERP-V3\frontend\node_modules" -Directory).Count
    Log-Message "    Paquetes instalados: $packageCount" "Gray"
} else {
    Log-Message "[✗] Frontend node_modules NO existe" "Red"
    Log-Message "    Necesitas ejecutar: cd frontend && npm install" "Yellow"
    $errorCount++
}

# ============================================================
Log-Message "`nPASO 9: Verificar Conectividad a Backend" "Cyan"
# ============================================================

try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" `
        -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
    
    if ($response.StatusCode -eq 200) {
        Log-Message "[✓] Backend responde en http://localhost:3000/api/health" "Green"
        Log-Message "    Respuesta: $($response.Content)" "Gray"
    }
} catch {
    Log-Message "[⚠] Backend NO esta corriendo (normal si no lo levantaste)" "Yellow"
    Log-Message "    Necesitas ejecutar en Terminal 1: npm run dev" "Yellow"
}

# ============================================================
Log-Message "`nPASO 10: Verificar Archivos de Configuracion" "Cyan"
# ============================================================

$files = @(
    "C:\ERP-V3\package.json"
    "C:\ERP-V3\frontend\package.json"
    "C:\ERP-V3\tsconfig.json"
    "C:\ERP-V3\frontend\tsconfig.json"
    "C:\ERP-V3\docker-compose.yml"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Log-Message "[✓] $file existe" "Green"
    } else {
        Log-Message "[✗] $file NO existe" "Red"
        $errorCount++
    }
}

# ============================================================
Log-Message "`n============================================================" "Green"
Log-Message "   RESUMEN DE VALIDACION" "Green"
Log-Message "============================================================`n" "Green"

Log-Message "Errores encontrados: $errorCount" $(if ($errorCount -eq 0) { "Green" } else { "Red" })

if ($errorCount -eq 0) {
    Log-Message "`n✅ TODAS LAS VALIDACIONES PASARON`n" "Green"
    Log-Message "ORDEN CORRECTO DE LEVANTAMIENTO:" "Cyan"
    Log-Message "`n1. Docker (PostgreSQL + Redis)" "Blue"
    Log-Message "   docker-compose up -d" "White"
    Log-Message "`n2. Backend - Terminal 1" "Blue"
    Log-Message "   cd C:\ERP-V3" "White"
    Log-Message "   npm run dev" "White"
    Log-Message "`n3. Frontend - Terminal 2" "Blue"
    Log-Message "   cd C:\ERP-V3\frontend" "White"
    Log-Message "   npm run dev" "White"
    Log-Message "`n4. Navegador" "Blue"
    Log-Message "   http://localhost:5173" "White"
    Log-Message "`n5. Login" "Blue"
    Log-Message "   Email: admin@erp.local" "White"
    Log-Message "   Pass: Admin123!" "White"
} else {
    Log-Message "`n❌ SE ENCONTRARON $errorCount ERROR(ES)`n" "Red"
    Log-Message "Por favor revisa los errores arriba" "Red"
}

Log-Message "`n============================================================" "Cyan"
Log-Message "`nLog guardado en: $logFile" "Gray"
Log-Message "`nPresiona ENTER para terminar..." "Yellow"

Read-Host
