# 🚀 GUÍA DE INSTALACIÓN RÁPIDA - ERP V3.0

## ⚠️ IMPORTANTE - Lee Esto Primero

El proyecto **ERP V3.0** ya está completamente creado. Solo necesitas:

1. **Instalar Node.js y Docker** (si no los tienes)
2. **Descargar/clonar el proyecto**
3. **Ejecutar los comandos de instalación**

---

## 📋 REQUISITOS

### ✅ Node.js 20+
- Descargar: https://nodejs.org/
- Verificar: `node --version` (debe mostrar v20.x.x)

### ✅ Docker Desktop
- Descargar: https://www.docker.com/products/docker-desktop
- Instalar y ejecutar

### ✅ Git (recomendado)
- Descargar: https://git-scm.com/

---

## 📥 OPCIÓN 1: Descargar como ZIP (MÁS FÁCIL)

1. **Descarga el proyecto completo**
   - URL: (te la daré en el siguiente paso)

2. **Extrae el ZIP**
   - Click derecho → Extraer aquí
   - O: `Expand-Archive archivo.zip`

3. **Abre PowerShell/CMD en la carpeta**
   - En Windows: Shift + Click derecho → "Abrir PowerShell aquí"

4. **Ejecuta los comandos**

---

## 📥 OPCIÓN 2: Clonar desde GitHub

```powershell
# 1. Clonar
git clone <tu-repo>
cd erp-v3-project

# 2. Continúa con los pasos de instalación abajo
```

---

## ⚡ INSTALACIÓN (5-10 minutos)

### Paso 1: Crear archivos de configuración

```powershell
# Copiar configuración backend
copy .env.example .env

# Copiar configuración frontend
copy frontend\.env.example frontend\.env.local
```

### Paso 2: Instalar dependencias

```powershell
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### Paso 3: Levantar Docker

```powershell
# Verificar que Docker está corriendo
docker --version

# Levantar servicios
docker-compose up -d

# Esperar 10-15 segundos
```

### Paso 4: Verificar que todo funcione

```powershell
# Ver si todo está corriendo
docker-compose ps

# Debería mostrar: postgres, redis, backend (corriendo)
```

### Paso 5: Iniciar servidores

**Terminal 1 - Backend:**
```powershell
npm run dev
```

Verás: "🚀 Server running on http://localhost:3000"

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

Verás: "VITE v... ready in XXX ms"

---

## 🌐 ACCEDE A LA APLICACIÓN

```
Frontend:    http://localhost:5173
Backend API: http://localhost:3000/api

Login:
  Email:      admin@erp.local
  Contraseña: Admin123!
```

---

## 📊 Verificar Estado

```powershell
# Ver servicios Docker
docker-compose ps

# Ver logs backend
docker-compose logs backend -f

# Ver logs Redis
docker-compose logs redis -f

# Verificar conexión
curl http://localhost:3000/api/health
```

---

## 🧪 Ejecutar Tests

```powershell
# Backend tests
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npx playwright test
```

---

## 🛑 Detener Todo

```powershell
# Bajar servicios Docker
docker-compose down

# Bajar y eliminar volúmenes (CUIDADO: borra BD)
docker-compose down -v
```

---

## ✅ CHECKLIST FINAL

```
☑ Node.js 20+ instalado      → node --version
☑ Docker corriendo           → docker --version
☑ .env creado
☑ frontend\.env.local creado
☑ npm install completado (backend)
☑ npm install completado (frontend)
☑ docker-compose up -d ejecutado
☑ Backend corriendo          → http://localhost:3000/api/health
☑ Frontend corriendo         → http://localhost:5173
☑ Login funciona             → admin@erp.local / Admin123!
```

---

## 🆘 SI ALGO NO FUNCIONA

### "npm: El término no se reconoce"
```powershell
# Node.js no está instalado
# Descarga de: https://nodejs.org/
# Reinicia PowerShell/CMD después de instalar
```

### "Docker command not found"
```powershell
# Docker no está instalado
# Descarga de: https://www.docker.com/products/docker-desktop
# Abre Docker Desktop después de instalar
```

### "Error en npm install"
```powershell
# Limpiar cache
npm cache clean --force

# Reinstalar
rm -r node_modules
rm package-lock.json
npm install
```

### "Puerto 3000 en uso"
```powershell
# Ver qué está usando puerto 3000
netstat -ano | findstr :3000

# Matar proceso (reemplaza PID)
taskkill /PID <PID> /F
```

### "Docker compose no inicia PostgreSQL"
```powershell
# Bajar todo
docker-compose down

# Levantar de nuevo
docker-compose up -d

# Esperar 20 segundos
```

---

## 📚 DOCUMENTACIÓN EN CARPETA

```
erp-v3-project/
├── README.md                    ← Documentación general
├── PROJECT_COMPLETE.md          ← Resumen del proyecto
├── INSTALL.md                   ← Guía detallada
├── TEST_PLAN.md                 ← Plan de pruebas
├── IMPLEMENTATIONS_COMPLETE.md  ← Detalle técnico
└── DONDE_ESTA.md                ← Ubicación
```

---

## 📞 SOPORTE

Si necesitas ayuda:

1. **Lee los logs:**
   ```powershell
   docker-compose logs -f
   ```

2. **Reinicia todo:**
   ```powershell
   docker-compose down
   docker-compose up -d
   ```

3. **Revisa archivos de configuración:**
   - `.env` - Variables backend
   - `frontend\.env.local` - Variables frontend
   - `docker-compose.yml` - Servicios

---

## 🎯 RESUMEN RÁPIDO

```powershell
# 1. Asegurate que tienes Node.js y Docker
node --version
docker --version

# 2. Entra a la carpeta del proyecto
cd erp-v3-project

# 3. Copia configuraciones
copy .env.example .env
copy frontend\.env.example frontend\.env.local

# 4. Instala dependencias
npm install
cd frontend; npm install; cd ..

# 5. Levanta Docker
docker-compose up -d

# 6. Espera 10-15 segundos

# 7. Terminal 1 - Backend
npm run dev

# 8. Terminal 2 - Frontend
cd frontend; npm run dev

# 9. Abre navegador
# http://localhost:5173
# Login: admin@erp.local / Admin123!
```

---

## ✨ ¡Listo!

Tu aplicación ERP V3.0 estará corriendo en:
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000/api

Con todas las features:
- ✅ 40+ APIs
- ✅ 8 páginas
- ✅ Chat en tiempo real
- ✅ Kanban drag-drop
- ✅ Pagos con Stripe
- ✅ Notificaciones
- ✅ Monitoreo

---

**Tiempo estimado:** 5-10 minutos  
**Dificultad:** Fácil  
**Status:** 🟢 100% Listo
