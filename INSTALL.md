# GUÍA DE INSTALACIÓN - ERP V3.0

**Versión:** 3.0.0  
**Última actualización:** 2026-01-15

---

## ⚡ INSTALACIÓN RÁPIDA (5 minutos)

### Opción 1: Windows (Automático)

```bash
# 1. Abre PowerShell o CMD en la carpeta erp-v3-project
cd erp-v3-project

# 2. Ejecuta el script de instalación
INSTALL.bat

# 3. Espera a que termine
# El script hace:
#   ✓ Crea .env
#   ✓ Instala npm backend
#   ✓ Instala npm frontend
#   ✓ Levanta Docker Compose
#   ✓ Verifica conexión

# 4. Abre en navegador
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000/api
```

### Opción 2: Linux/Mac (Automático)

```bash
# 1. Abre terminal en la carpeta erp-v3-project
cd erp-v3-project

# 2. Dale permisos y ejecuta
chmod +x INSTALL.sh
./INSTALL.sh

# 3. Sigue las instrucciones
# Presiona Enter cuando pida continuar
```

### Opción 3: Manual (Cualquier SO)

```bash
# 1. Crear archivo .env
cp .env.example .env

# 2. Instalar dependencias backend
npm install

# 3. Instalar dependencias frontend
cd frontend
npm install
cd ..

# 4. Crear archivo .env frontend
cd frontend
cp .env.example .env.local
cd ..

# 5. Levantar Docker Compose
docker-compose up -d

# 6. Esperar 10 segundos a que inicien
# 7. Abrir navegadores
# Frontend: http://localhost:5173
# Backend:  http://localhost:3000/api
```

---

## 📋 REQUISITOS PREVIOS

- ✅ **Node.js 20+** - Descargar de https://nodejs.org/
- ✅ **Docker Desktop** - Descargar de https://www.docker.com/products/docker-desktop
- ✅ **Git** (opcional) - Para clonar el repo

### Verificar que todo esté instalado

```bash
node --version      # Debe mostrar v20.x.x o mayor
npm --version       # Debe mostrar 10.x.x o mayor
docker --version    # Debe mostrar la versión de Docker
```

---

## 🚀 STARTUP RÁPIDO

Después de la instalación inicial:

### Terminal 1 - Backend
```bash
cd erp-v3-project
npm run dev
# Backend corriendo en http://localhost:3000
```

### Terminal 2 - Frontend
```bash
cd erp-v3-project/frontend
npm run dev
# Frontend corriendo en http://localhost:5173
```

### Terminal 3 - Tests (opcional)
```bash
cd erp-v3-project
npm test
# Ejecuta los tests
```

---

## 🔑 CREDENCIALES DE PRUEBA

```
Email:      admin@erp.local
Contraseña: Admin123!
Rol:        SUPER_ADMIN
```

O registra un nuevo usuario desde la página de registro.

---

## 📍 ACCESOS PRINCIPALES

```
Frontend:       http://localhost:5173
Backend API:    http://localhost:3000/api
Health Check:   http://localhost:3000/api/health
PostgreSQL:     localhost:5432
Redis:          localhost:6379

Admin Usuario:   admin@erp.local
Admin Password:  Admin123!
```

---

## 🛠️ COMANDOS ÚTILES

### Backend

```bash
npm run dev              # Desarrollo con hot reload
npm run build            # Compilar TypeScript
npm start                # Producción
npm test                 # Ejecutar tests
npm run test:coverage    # Tests con coverage
npm run test:unit        # Solo unit tests
npm run test:integration # Solo integration tests
npm run lint             # Verificar código
npm run migrate          # Ejecutar migraciones DB
npm run seed             # Seed inicial de datos
```

### Frontend

```bash
cd frontend
npm run dev              # Desarrollo con hot reload
npm run build            # Build para producción
npm run preview          # Previsualizar build
npm test                 # Ejecutar tests
npm run test:coverage    # Tests con coverage
npm run lint             # Verificar código
```

### Docker

```bash
docker-compose up -d        # Levantar servicios
docker-compose down         # Bajar servicios
docker-compose logs -f      # Ver logs en tiempo real
docker-compose ps           # Ver estado de containers
docker-compose restart      # Reiniciar
docker-compose build        # Rebuild de images
```

---

## 🐛 TROUBLESHOOTING

### ❌ "No se puede acceder a localhost:5173"

**Solución:**
```bash
# 1. Verificar que el frontend esté corriendo
cd frontend
npm run dev

# 2. Si sigue sin funcionar, limpiar y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ❌ "Error: EADDRINUSE: address already in use :::3000"

**Solución:**
```bash
# Puerto 3000 ya está en uso
# Opción 1: Matar el proceso
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac:
lsof -i :3000
kill -9 <PID>

# Opción 2: Cambiar puerto en .env
PORT=3001
```

### ❌ "Docker Compose no encuentra PostgreSQL"

**Solución:**
```bash
# 1. Verificar que Docker está corriendo
docker ps

# 2. Reiniciar Docker
docker-compose down
docker-compose up -d

# 3. Esperar 15 segundos (init DB)
```

### ❌ "Error en npm install"

**Solución:**
```bash
# Limpiar cache
npm cache clean --force

# Reinstalar
rm -rf node_modules package-lock.json
npm install
```

### ❌ "Conexión rechazada a PostgreSQL"

**Solución:**
```bash
# Verificar que el container está corriendo
docker-compose ps

# Ver logs
docker-compose logs postgres

# Reiniciar
docker-compose restart postgres

# Esperar 10 segundos
```

---

## 📊 VERIFICAR QUE TODO FUNCIONA

### 1. Backend Health Check

```bash
curl http://localhost:3000/api/health

# Respuesta esperada:
# {
#   "status": "ok",
#   "timestamp": "2026-01-15T...",
#   "version": "3.0.0"
# }
```

### 2. Frontend Cargue

```bash
# En navegador:
http://localhost:5173

# Verás la página de Login
```

### 3. Login

```bash
Email: admin@erp.local
Contraseña: Admin123!

# Deberías entrar al Dashboard
```

### 4. Tests

```bash
npm test

# Debería mostrar: PASS (60+ tests)
```

---

## 🎯 PRÓXIMOS PASOS

Después de la instalación exitosa:

1. **Explora el Dashboard**
   - Ve a http://localhost:5173
   - Navega por las diferentes secciones

2. **Prueba las APIs**
   ```bash
   # En otra terminal
   curl -X GET http://localhost:3000/api/usuarios \
     -H "Authorization: Bearer <token>"
   ```

3. **Ejecuta los tests**
   ```bash
   npm test
   npm run test:coverage
   ```

4. **Lee la documentación**
   - README.md - Descripción general
   - TEST_PLAN.md - Plan de pruebas
   - PROJECT_COMPLETE.md - Resumen del proyecto

---

## 📞 AYUDA

Si algo no funciona:

1. **Revisar los logs**
   ```bash
   docker-compose logs -f backend
   docker-compose logs -f frontend
   ```

2. **Verificar puertos**
   ```bash
   # ¿Está algo en los puertos?
   netstat -an | grep 3000
   netstat -an | grep 5173
   ```

3. **Reiniciar desde cero**
   ```bash
   docker-compose down
   docker-compose up -d
   sleep 15
   npm run dev  # backend en otra terminal
   cd frontend && npm run dev
   ```

---

## ✅ CHECKLIST DE INSTALACIÓN

```
☑ Node.js 20+ instalado
☑ Docker Desktop instalado y corriendo
☑ npm install ejecutado (backend)
☑ npm install ejecutado (frontend)
☑ .env creado
☑ .env.local creado (frontend)
☑ docker-compose up -d ejecutado
☑ Backend respondiendo en http://localhost:3000/api/health
☑ Frontend cargando en http://localhost:5173
☑ Login funciona (admin@erp.local / Admin123!)
☑ Tests pasan (npm test)
```

---

**¡Listo! Tu ERP V3.0 está instalado y funcionando 🎉**

Para soporte: Revisa los logs o consulta la documentación en las carpetas `docs/` y archivos `.md`
