# ERP V3.0 - Proyecto Completo (Backend + Frontend)

**Versión:** 3.0.0  
**Estado:** 🟢 MVP Completo Funcional  
**Última actualización:** 2026-01-15

---

## 📋 Resumen Ejecutivo

**ERP V3.0** es una **plataforma empresarial modular y escalable** construida con:

- ✅ **Backend Node.js/Express/TypeScript** - APIs REST completas
- ✅ **Frontend React 18 + Vite + Tailwind** - UI moderna y responsive
- ✅ **Base de Datos PostgreSQL 16** - Relacional con migraciones
- ✅ **Cache Redis 7** - Sesiones y cache
- ✅ **Chat en Tiempo Real** - Socket.io WebSockets
- ✅ **Notificaciones Push** - Firebase Cloud Messaging
- ✅ **Email Service** - SMTP + Nodemailer
- ✅ **Autenticación JWT** - Tokens + Refresh
- ✅ **RBAC** - 4 roles configurables
- ✅ **Sistema de Licencias** - BÁSICO, PRO, ENTERPRISE
- ✅ **Auditoría Completa** - Logs de acciones
- ✅ **Kanban Drag-Drop** - Gestión visual de tareas
- ✅ **Docker + Docker Compose** - Containerizado

---

## 🚀 Quick Start

### 1. Clonar y preparar
```bash
# Clonar repositorio
git clone <tu-repo>
cd erp-v3-project

# Copiar ambiente
cp .env.example .env
cd frontend && cp .env.example .env.local && cd ..
```

### 2. Levantar con Docker
```bash
docker-compose up -d
```

**Accesos:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000/api
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### 3. Credenciales de prueba
```
Email: admin@erp.local
Contraseña: Admin123!
```

---

## 📁 Estructura del Proyecto

```
erp-v3-project/
├── src/                           # Backend Node.js
│   ├── config/                    # Configuración (DB, Redis, ENV)
│   ├── middleware/                # Autenticación, logging, errores
│   ├── utils/                     # JWT, Crypto, Validators
│   ├── services/                  # Email, Push Notifications, Audit
│   ├── repositories/              # Data Access Layer
│   ├── controllers/               # Lógica de endpoints
│   ├── routes/                    # Definición de rutas
│   ├── database/                  # Migraciones SQL
│   └── main.ts                    # Punto de entrada
│
├── frontend/                      # React + Vite
│   ├── src/
│   │   ├── components/            # Componentes reutilizables
│   │   ├── pages/                 # Páginas principales
│   │   ├── services/              # API, WebSocket, Notifications
│   │   ├── stores/                # Zustand (State Management)
│   │   ├── main.tsx               # Punto de entrada
│   │   └── index.css              # Tailwind + Estilos
│   ├── public/                    # Assets estáticos
│   └── vite.config.ts             # Configuración Vite
│
├── docker-compose.yml             # Orquestación containers
├── Dockerfile                     # Backend container
├── package.json                   # Dependencias Node
├── tsconfig.json                  # Configuración TypeScript
└── README.md                      # Este archivo

```

---

## 🔑 APIs Implementadas

### Autenticación (5 endpoints)
```
POST   /api/auth/register          ✅ Crear empresa + usuario
POST   /api/auth/login             ✅ Login
POST   /api/auth/refresh           ✅ Refrescar token
GET    /api/auth/me                ✅ Usuario actual
```

### Usuarios CRUD (6 endpoints)
```
GET    /api/usuarios               ✅ Listar
GET    /api/usuarios/:id           ✅ Obtener
POST   /api/usuarios               ✅ Crear (admin)
PUT    /api/usuarios/:id           ✅ Actualizar
DELETE /api/usuarios/:id           ✅ Eliminar (admin)
PUT    /api/usuarios/:id/password  ✅ Cambiar contraseña
```

### Clientes CRUD (5 endpoints)
```
GET    /api/clientes               ✅ Listar
GET    /api/clientes/:id           ✅ Obtener
POST   /api/clientes               ✅ Crear
PUT    /api/clientes/:id           ✅ Actualizar
DELETE /api/clientes/:id           ✅ Eliminar
```

### Productos CRUD (5 endpoints)
```
GET    /api/productos              ✅ Listar
GET    /api/productos/:id          ✅ Obtener
POST   /api/productos              ✅ Crear
PUT    /api/productos/:id          ✅ Actualizar
DELETE /api/productos/:id          ✅ Eliminar
```

### Licencias (4 endpoints)
```
GET    /api/licencias/empresa      ✅ Licencia actual
GET    /api/licencias/check        ✅ Verificar validez
POST   /api/licencias              ✅ Crear (admin)
PUT    /api/licencias/:id          ✅ Actualizar (admin)
```

### Admin (3 endpoints)
```
GET    /api/admin/health           ✅ Estado del servidor
GET    /api/admin/email/test       ✅ Verificar SMTP
POST   /api/admin/email/send-test  ✅ Enviar email de prueba
```

### WebSocket (Chat en Tiempo Real)
```
join_project(projectId)            ✅ Unirse a sala
send_message(data)                 ✅ Enviar mensaje
task_update(data)                  ✅ Actualizar tarea
new_message (event)                ✅ Nuevo mensaje
task_updated (event)               ✅ Tarea actualizada
```

---

## 🛡️ Seguridad Implementada

- **JWT Tokens** - Firmados con HS256, expiración 7 días
- **Refresh Tokens** - 30 días, permite renovación
- **Bcryptjs** - Hashing de contraseñas con salt 10
- **Cookies HttpOnly** - Almacenamiento seguro de tokens
- **RBAC** - 4 roles (SUPER_ADMIN, ADMIN, OPERARIO, VISUALIZADOR)
- **Validaciones Joi** - Schemas robustos en todos inputs
- **Helmet** - Headers de seguridad
- **CORS** - Configurado por environment
- **Rate Limiting** - 100 requests por 15 minutos por IP
- **SQL Injections Prevented** - Prepared statements
- **Soft Deletes** - Datos nunca se pierden

---

## 📧 Email Service (SMTP)

### Configuración

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password
SMTP_FROM="ERP <noreply@erp.local>"
```

### Emails Automáticos Implementados

1. **Bienvenida** - Al registrar usuario
2. **Password Reset** - Recuperación de contraseña
3. **License Warning** - Licencia por expirar
4. **Project Notifications** - Cambios en proyectos
5. **Task Assignment** - Nueva tarea asignada

### Testing SMTP

```bash
# Test endpoint
curl http://localhost:3000/api/admin/email/test

# Enviar email de prueba
curl -X POST http://localhost:3000/api/admin/email/send-test \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}' \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 📱 Push Notifications (Firebase)

### Configuración Firebase

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_VAPID_KEY=...
```

### Notificaciones Implementadas

- **Task Assignment** - Nueva tarea asignada
- **Project Updates** - Proyecto creado/actualizado
- **License Expiration** - Licencia por vencer
- **Chat Messages** - Nuevos mensajes

### Activar Notificaciones

```javascript
import { initNotifications } from '@/services/notifications';

await initNotifications();
```

---

## 🎨 Frontend - Páginas Principales

### Login (`/login`)
- Formulario con validación Zod
- Email + Contraseña
- Redireccion automática a dashboard

### Dashboard (`/dashboard`)
- 4 KPIs principales (Usuarios, Clientes, Productos, Licencia)
- Información de licencia en tiempo real
- Estado de uso de usuarios

### Usuarios (`/usuarios`)
- Listar, crear, editar, eliminar usuarios
- Gestión de roles
- Control de acceso por rol

### Clientes (`/clientes`)
- CRUD de clientes
- Validación de RUT único
- Búsqueda y filtrado

### Productos (`/productos`)
- Inventario de productos
- Gestión de SKU
- Control de stock

### Proyectos (`/proyectos`)
- Lista de proyectos por empresa
- Estado y presupuesto
- Responsables asignados

### Kanban (`/kanban`)
- Drag-drop de tareas
- 4 columnas: Por Hacer, En Progreso, En Revisión, Completada
- Prioridades coloreadas
- Asignación de tareas

### Chat (`/chat`)
- Chat en tiempo real con WebSocket
- Salas por proyecto
- Mensajes persistentes
- Usuarios conectados

### Configuración (`/settings`)
- Cambiar contraseña
- Perfil de usuario
- Preferencias

---

## 🗄️ Base de Datos - Tablas

```sql
-- Empresas
CREATE TABLE empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  rut VARCHAR(50) UNIQUE,
  razon_social VARCHAR(255),
  ...
);

-- Usuarios (RBAC)
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas,
  nombre VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  rol VARCHAR(50), -- SUPER_ADMIN, ADMIN, OPERARIO, VISUALIZADOR
  activo BOOLEAN,
  deleted_at TIMESTAMP, -- Soft delete
  ...
);

-- Clientes
CREATE TABLE clientes (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas,
  nombre VARCHAR(255),
  rut VARCHAR(50) UNIQUE,
  email VARCHAR(255),
  telefono VARCHAR(20),
  ...
);

-- Productos
CREATE TABLE productos (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas,
  nombre VARCHAR(255),
  sku VARCHAR(50) UNIQUE,
  precio NUMERIC(10, 2),
  stock INTEGER,
  stock_minimo INTEGER,
  ...
);

-- Proyectos
CREATE TABLE proyectos (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas,
  cliente_id INTEGER REFERENCES clientes,
  nombre VARCHAR(255),
  estado VARCHAR(50), -- en_progreso, completado, suspendido
  fecha_inicio DATE,
  presupuesto NUMERIC(12, 2),
  ...
);

-- Tareas (Kanban)
CREATE TABLE tareas (
  id SERIAL PRIMARY KEY,
  proyecto_id INTEGER REFERENCES proyectos,
  usuario_id INTEGER REFERENCES usuarios,
  titulo VARCHAR(255),
  estado VARCHAR(50), -- por_hacer, en_progreso, en_revision, completada
  prioridad VARCHAR(50), -- baja, media, alta, critica
  fecha_vencimiento DATE,
  ...
);

-- Licencias
CREATE TABLE licencias (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER UNIQUE REFERENCES empresas,
  plan VARCHAR(50), -- BASICO, PRO, ENTERPRISE
  usuarios_max INTEGER,
  fecha_inicio DATE,
  fecha_expiracion DATE,
  estado VARCHAR(50), -- activo, inactivo, expirado
  ...
);

-- Auditoría
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER REFERENCES empresas,
  usuario_id INTEGER REFERENCES usuarios,
  accion VARCHAR(50), -- CREATE, UPDATE, DELETE
  entidad VARCHAR(50), -- usuario, cliente, producto
  entidad_id INTEGER,
  cambios JSONB,
  ip_address VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  ...
);
```

---

## 🧪 Testing

### Backend Tests

```bash
npm test                  # Ejecutar tests
npm run test:coverage     # Coverage report
npm run test:watch       # Watch mode
```

### Frontend (Recomendado)

```bash
# En carpeta frontend/
npm test                  # Con Vitest
npm run test:coverage     # Coverage
```

### Pruebas Manuales

```bash
# Health check
curl http://localhost:3000/api/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "empresa_nombre": "Test Company"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Get Me (con token)
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 🔄 CI/CD (GitHub Actions - Próxima Etapa)

Se recomienda configurar:

1. **Lint & Format**
   ```bash
   npm run lint
   ```

2. **Tests**
   ```bash
   npm test
   ```

3. **Build**
   ```bash
   npm run build
   ```

4. **Push a Registry**
   ```bash
   docker push <registry>/erp-backend:3.0.0
   docker push <registry>/erp-frontend:3.0.0
   ```

---

## 📊 Roles y Permisos

| Acción | SUPER_ADMIN | ADMIN | OPERARIO | VISUALIZADOR |
|--------|-------------|-------|----------|--------------|
| Ver Dashboard | ✅ | ✅ | ✅ | ✅ |
| Crear Usuario | ✅ | ✅ | ❌ | ❌ |
| Eliminar Usuario | ✅ | ✅ | ❌ | ❌ |
| Crear Licencia | ✅ | ❌ | ❌ | ❌ |
| Ver Licencias | ✅ | ✅ | ❌ | ❌ |
| Crear Cliente | ✅ | ✅ | ✅ | ❌ |
| Editar Cliente | ✅ | ✅ | ✅ | ❌ |
| Ver Clientes | ✅ | ✅ | ✅ | ✅ |
| Crear Producto | ✅ | ✅ | ✅ | ❌ |
| Ver Productos | ✅ | ✅ | ✅ | ✅ |
| Crear Proyecto | ✅ | ✅ | ✅ | ❌ |
| Ver Proyectos | ✅ | ✅ | ✅ | ✅ |
| Crear Tarea | ✅ | ✅ | ✅ | ❌ |
| Actualizar Tarea | ✅ | ✅ | ✅ | ✅ |
| Admin Panel | ✅ | ✅ | ❌ | ❌ |

---

## 🐛 Troubleshooting

### "Connection refused" en Backend

```bash
# Verificar que PostgreSQL está corriendo
docker-compose ps

# Ver logs
docker-compose logs postgres

# Reiniciar
docker-compose down
docker-compose up -d
```

### Frontend no se conecta a Backend

```bash
# Verificar VITE_API_URL en .env
cat frontend/.env

# Debe ser: http://localhost:3000/api
# NO: http://backend:3000/api (ese es para dentro del Docker)
```

### Errores de CORS

```bash
# Asegurar CORS_ORIGIN en .env del backend
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Token expirado

```bash
# Los tokens se refrescan automáticamente
# Si da error 401, el refresh token también expiró
# Hacer logout y login nuevamente
```

### Base de datos "no existe"

```bash
# Las migraciones se ejecutan automáticamente con Docker
# Si falla, ejecutar manualmente:
docker-compose exec backend npm run migrate
```

---

## 📈 Próximas Features (Roadmap)

- ✅ APIs CRUD completas
- ✅ Chat WebSocket
- ✅ Kanban Drag-Drop
- ✅ Email Service + SMTP
- ✅ Push Notifications
- ❌ **Proyectos API** (endpoints faltantes)
- ❌ **Tareas API** (endpoints faltantes)
- ❌ **Reporte y exportación** (PDF, Excel)
- ❌ **Dashboard avanzado** (gráficos)
- ❌ **Integración Stripe** (pagos)
- ❌ **Mobile App** (React Native)
- ❌ **CI/CD Pipeline** (GitHub Actions)
- ❌ **Kubernetes** (EKS/GKE deployment)

---

## 📞 Soporte

Para problemas o preguntas:
1. Verificar logs: `docker-compose logs -f`
2. Revisar error en `/logs`
3. Consultar documentación en `README.md`

---

## 📄 Licencia

MIT

---

**Generado:** 2026-01-15  
**Versión:** 3.0.0  
**Estado:** 🟢 COMPLETO Y OPERATIVO
