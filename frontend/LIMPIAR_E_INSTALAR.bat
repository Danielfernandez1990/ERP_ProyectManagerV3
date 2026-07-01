@echo off
REM Limpiar frontend completamente

cd C:\ERP-V3\frontend

echo Limpiando node_modules...
rmdir /s /q node_modules 2>nul

echo Limpiando package-lock.json...
del package-lock.json 2>nul

echo Limpiando cache npm...
call npm cache clean --force

echo Reinstalando dependencias...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [OK] Frontend limpiado e instalado correctamente
    echo.
    echo Ahora puedes ejecutar:
    echo   npm run dev
) else (
    echo.
    echo [ERROR] Hubo un problema instalando dependencias
    echo.
)

pause
