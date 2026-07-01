#!/bin/bash

# ERP V3.0 - Setup y Start Script
# Este script instala y levanta el proyecto

echo ""
echo "========================================"
echo "ERP V3.0 - Setup y Start"
echo "========================================"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Crear .env si no existe
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creando archivo .env...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env creado${NC}"
else
    echo -e "${GREEN}✓ .env ya existe${NC}"
fi

# 2. Instalar dependencias backend
echo ""
echo "========================================"
echo -e "${YELLOW}Instalando dependencias backend...${NC}"
echo "========================================"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Error instalando dependencias backend${NC}"
    exit 1
fi

# 3. Instalar dependencias frontend
echo ""
echo "========================================"
echo -e "${YELLOW}Instalando dependencias frontend...${NC}"
echo "========================================"
cd frontend
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creando archivo .env.local...${NC}"
    cp .env.example .env.local
    echo -e "${GREEN}✓ .env.local creado${NC}"
fi
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Error instalando dependencias frontend${NC}"
    exit 1
fi
cd ..

echo ""
echo "========================================"
echo -e "${YELLOW}Levantando servicios con Docker...${NC}"
echo "========================================"
echo ""
echo "Asegúrate de que Docker está corriendo"
read -p "Presiona Enter para continuar..."

docker-compose up -d
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Error levantando Docker Compose${NC}"
    exit 1
fi

echo ""
echo "========================================"
echo -e "${YELLOW}Esperando a que los servicios inicien...${NC}"
echo "========================================"
sleep 10

# 4. Verificar salud
echo ""
echo -e "${YELLOW}Verificando conexión al backend...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:3000/api/health > /dev/null; then
        echo -e "${GREEN}✓ Backend respondiendo${NC}"
        break
    fi
    echo "Backend aún iniciando... ($i/30)"
    sleep 2
done

echo ""
echo "========================================"
echo -e "${GREEN}✅ Setup completado!${NC}"
echo "========================================"
echo ""
echo "URLs:"
echo "  Frontend:   http://localhost:5173"
echo "  Backend:    http://localhost:3000/api"
echo "  PostgreSQL: localhost:5432"
echo "  Redis:      localhost:6379"
echo ""
echo "Credenciales de prueba:"
echo "  Email:      admin@erp.local"
echo "  Contraseña: Admin123!"
echo ""
echo "Para iniciar en otra terminal:"
echo "  Backend: npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "Comandos útiles:"
echo "  docker-compose ps      - Ver estado de containers"
echo "  docker-compose logs -f - Ver logs"
echo "  npm test               - Ejecutar tests"
echo "  npm run test:coverage  - Coverage report"
echo ""
