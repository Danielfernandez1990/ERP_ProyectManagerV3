# 📦 DESCARGA INMEDIATA - ERP V3.0

## 🎯 ¿QUÉ NECESITAS HACER?

### OPCIÓN A: Descarga Rápida (RECOMENDADO)

Te voy a proporcionar un enlace para descargar el proyecto completo listo para instalar.

### OPCIÓN B: Instrucciones Paso a Paso

A continuación tienes todos los pasos exactos para Windows PowerShell.

---

## 📋 PASOS EXACTOS PARA WINDOWS

### Paso 1: Descargar Node.js (si no lo tienes)

1. Ve a: https://nodejs.org/
2. Descarga: **LTS version** (la recomendada)
3. Ejecuta el instalador
4. Reinicia PowerShell/CMD

Verifica:
```powershell
node --version
npm --version
```

### Paso 2: Descargar Docker Desktop (si no lo tienes)

1. Ve a: https://www.docker.com/products/docker-desktop
2. Descarga e instala
3. Abre Docker Desktop
4. Espera a que diga "Docker Desktop is running"

Verifica:
```powershell
docker --version
```

### Paso 3: Descarga el Proyecto

**Opción A: Como ZIP (MÁS FÁCIL)**
- Te daré un enlace para descargar
- Extrae en una carpeta
- Abre PowerShell en esa carpeta

**Opción B: Git**
```powershell
git clone https://github.com/tu-usuario/erp-v3.git
cd erp-v3
```

### Paso 4: Configuración Inicial

```powershell
# Copiar archivo de configuración backend
copy .env.example .env

# Copiar archivo de configuración frontend
copy frontend\.env.example frontend\.env.local
```

### Paso 5: Instalar Dependencias

```powershell
# Instalar backend (espera 2-3 minutos)
npm install

# Instalar frontend (espera 2-3 minutos)
cd frontend
npm install
cd ..
```

### Paso 6: Levantar Servicios Docker

```powershell
# Verificar que Docker está corriendo
docker --version

# Levantar todos los servicios
# (PostgreSQL, Redis, etc)
docker-compose up -d

# Espera 10-15 segundos a que inicien
```

### Paso 7: Iniciar Backend

**Abre una nueva terminal PowerShell**

```powershell
# Asegúrate de estar en la carpeta correcta
cd ruta\a\erp-v3

# Inicia el backend
npm run dev

# Deberías ver:
# 🚀 Server running on http://localhost:3000
# 🔌 WebSocket available at ws://localhost:3000
```

### Paso 8: Iniciar Frontend

**Abre OTRA terminal PowerShell nueva**

```powershell
# Asegúrate de estar en la carpeta correcta
cd ruta\a\erp-v3

# Entra a la carpeta frontend
cd frontend

# Inicia el frontend
npm run dev

# Deberías ver:
#   VITE v... ready in ... ms
#   ➜  Local:   http://localhost:5173/
```

### Paso 9: Abre tu Navegador

```
URL: http://localhost:5173

Email:      admin@erp.local
Contraseña: Admin123!
```

---

## ✅ VERIFICACIÓN

**En otra terminal PowerShell:**

```powershell
# Ver estado de servicios
docker-compose ps

# Debería mostrar algo como:
# CONTAINER ID    IMAGE         STATUS
# xxxxx          postgres      Up 5 minutes
# xxxxx          redis         Up 5 minutes
```

---

## 🛑 CUANDO TERMINES

```powershell
# Bajar los servicios Docker
docker-compose down

# Bajar y eliminar TODO (cuidado: borra la BD)
docker-compose down -v
```

---

## 🆘 TROUBLESHOOTING

### Error: "npm: El término no se reconoce"

**Causa:** Node.js no está instalado
**Solución:**
1. Descarga de https://nodejs.org/
2. Instala
3. Reinicia PowerShell

### Error: "Docker not found"

**Causa:** Docker no está instalado
**Solución:**
1. Descarga de https://www.docker.com/products/docker-desktop
2. Instala
3. Abre Docker Desktop
4. Reinicia PowerShell

### Error: "EADDRINUSE: address already in use :::3000"

**Causa:** Algo está usando el puerto 3000
**Solución:**
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :3000

# Matar el proceso (reemplaza el número)
taskkill /PID 12345 /F

# Intenta de nuevo
npm run dev
```

### Error: "Cannot find module 'xxx'"

**Causa:** Las dependencias no se instalaron bien
**Solución:**
```powershell
# Limpiar
rm -r node_modules
rm package-lock.json

# Reinstalar
npm cache clean --force
npm install
```

### Docker Compose no inicia PostgreSQL

**Causa:** Conflicto de puertos o Docker no está corriendo
**Solución:**
```powershell
# Bajar todo
docker-compose down

# Abre Docker Desktop
# Espera a que diga "Docker is running"

# Levanta de nuevo
docker-compose up -d

# Espera 20 segundos
```

---

## 📊 COMANDOS ÚTILES

```powershell
# Ver estado de TODO
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f postgres

# Ejecutar tests
npm test

# Ver coverage
npm run test:coverage

# Limpiar todo
docker-compose down -v
```

---

## 📍 UBICACIÓN DE ARCHIVOS IMPORTANTES

```
Tu carpeta de proyecto:
erp-v3/
├── .env                      ← Configuración backend
├── frontend/
│   └── .env.local            ← Configuración frontend
├── src/                      ← Código backend
├── frontend/src/             ← Código frontend
├── docker-compose.yml        ← Servicios Docker
└── package.json              ← Dependencias
```

---

## 🎯 RESUMEN VISUAL

```
1. Node.js 20+ → Descargar e instalar
   ↓
2. Docker Desktop → Descargar e instalar y ejecutar
   ↓
3. Descargar proyecto ERP V3.0
   ↓
4. copy .env.example .env
   ↓
5. copy frontend\.env.example frontend\.env.local
   ↓
6. npm install (backend)
   ↓
7. npm install (frontend)
   ↓
8. docker-compose up -d
   ↓
9. Terminal 1: npm run dev (backend)
   Terminal 2: cd frontend; npm run dev (frontend)
   ↓
10. http://localhost:5173 en navegador
    ↓
11. Login: admin@erp.local / Admin123!
    ↓
12. ¡Listo! 🎉
```

---

## ✨ CARACTERÍSTICAS DISPONIBLES

Una vez instalado, tendrás acceso a:

✅ Dashboard con 4 KPIs  
✅ Gestión de Usuarios, Clientes, Productos, Proyectos  
✅ Kanban drag-drop para tareas  
✅ Chat en tiempo real  
✅ Pagos con Stripe  
✅ Notificaciones push  
✅ 40+ APIs REST  
✅ Monitoreo en tiempo real  

---

## 📞 ¿NECESITAS AYUDA?

1. Lee los logs: `docker-compose logs -f`
2. Verifica puertos: `netstat -ano | findstr :3000`
3. Revisa los archivos .md en el proyecto
4. Reinicia Docker: `docker-compose down && docker-compose up -d`

---

**¡Listo para instalar! 🚀**

Tiempo estimado: 5-10 minutos  
Dificultad: Muy Fácil  
Result: Aplicación ERP completa funcionando
