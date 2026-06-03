# 🏢 ERP V3.0 - Plataforma Empresarial Modular

[![Node.js](https://img.shields.io/badge/Node.js-v26.2.0-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D)](https://redis.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](#license)

Sistema ERP profesional con CRUD completo, autenticación JWT, y arquitectura escalable. Desarrollado con Express, React, PostgreSQL y Redis.

---

## ✨ Características Principales

### 🎯 Backend (Node.js + Express)
- ✅ **8 Rutas CRUD completas** - Usuarios, Clientes, Productos, Proyectos, Tareas, Licencias, Pagos, Admin
- ✅ **Autenticación JWT** - Login seguro con refresh tokens
- ✅ **PostgreSQL 15** - 9 tablas con relaciones
- ✅ **Redis 7** - Cache y sesiones
- ✅ **TypeScript** - Type safety completo
- ✅ **Validación** - Joi schemas para todas las APIs
- ✅ **Error handling** - Middleware centralizado
- ✅ **Logging** - Winston para auditoría

### 🎨 Frontend (React + TypeScript)
- ✅ **4 Páginas CRUD** - Usuarios, Clientes, Productos, Proyectos
- ✅ **Componentes Reutilizables** - GenericTable, GenericModal, Layout
- ✅ **Tailwind CSS** - Diseño moderno y responsivo
- ✅ **Vite** - Build rápido y desarrollo ágil
- ✅ **React Router** - Navegación sin refrescar
- ✅ **Zustand** - State management ligero
- ✅ **Toast Notifications** - Feedback usuario
- ✅ **Tests** - Unitarios e integración

### 🗄️ Base de Datos
- ✅ **9 Tablas** - usuarios, empresas, licencias, clientes, productos, proyectos, tareas, auditorias, pagos
- ✅ **Relaciones FK** - Integridad referencial
- ✅ **Índices** - Optimización de queries
- ✅ **Seed automático** - Datos de prueba con bcrypt

### 🔐 Seguridad
- ✅ **JWT Auth** - Tokens con expiración
- ✅ **bcryptjs** - Contraseñas hasheadas (10 rounds)
- ✅ **CORS** - Origen validado
- ✅ **Rate Limiting** - 100 req/15min
- ✅ **Helmet** - Headers de seguridad
- ✅ **Auditoría** - Log de cambios

---

## 🚀 Inicio Rápido

### Prerequisitos
```bash
- Node.js v26.2.0+
- Docker & Docker Compose
- Git
```

### 1. Clonar repositorio
```bash
git clone https://github.com/Danielfernandez1990/ERP-ProyectManager3_03.git
cd ERP-ProyectManager3_03
```

### 2. Levantar servicios (PostgreSQL + Redis)
```bash
docker-compose up -d
```

### 3. Backend
```bash
npm install
npm run seed  # Cargar datos de prueba
npm run dev   # http://localhost:3000
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

### 5. Login
```
Email: admin@erp.local
Contraseña: Admin123!
```

---

## 📁 Estructura del Proyecto

```
ERP-V3/
│
├── src/                                 # Backend
│   ├── main.ts                         # Entry point
│   ├── config/                         # Configuración
│   │   ├── env.ts                     # Variables de entorno
│   │   ├── database.ts                # PostgreSQL
│   │   └── redis.ts                   # Redis
│   ├── controllers/                    # Lógica de negocio
│   │   ├── authController.ts
│   │   ├── usuariosController.ts
│   │   └── ...
│   ├── routes/                         # Rutas API
│   ├── middleware/                     # Middleware
│   ├── repositories/                   # Acceso a datos
│   └── utils/                          # Utilidades
│
├── frontend/                            # Frontend React
│   ├── src/
│   │   ├── main.tsx                   # Entry point
│   │   ├── pages/                     # Páginas CRUD
│   │   │   ├── UsuariosPage.tsx
│   │   │   ├── ClientesPage.tsx
│   │   │   ├── ProductosPage.tsx
│   │   │   └── ProyectosPage.tsx
│   │   ├── components/                # Componentes
│   │   │   ├── Layout.tsx            # Sidebar + Header
│   │   │   ├── GenericTable.tsx      # Tabla reutilizable
│   │   │   └── GenericModal.tsx      # Modal reutilizable
│   │   └── services/                 # API client
│   └── package.json
│
├── docker-compose.yml                   # PostgreSQL + Redis
├── .env.example                         # Variables de ejemplo
├── .gitignore                           # Archivos ignorados
└── README.md                            # Este archivo
```

---

## 🛠️ Stack Tecnológico

### Backend
| Herramienta | Versión | Propósito |
|-------------|---------|----------|
| Node.js | 26.2.0 | Runtime |
| Express | 4.18.2 | Framework web |
| TypeScript | 5.3.3 | Type safety |
| PostgreSQL | 15 | Base de datos |
| Redis | 7 | Cache/Sesiones |
| JWT | 9.0.3 | Autenticación |
| bcryptjs | 2.4.3 | Hash de contraseñas |
| Joi | 17.11.0 | Validación |
| Winston | 3.11.0 | Logging |

### Frontend
| Herramienta | Versión | Propósito |
|-------------|---------|----------|
| React | 18.2.0 | Interfaz de usuario |
| TypeScript | 5.3.3 | Type safety |
| Vite | 5.0.8 | Build tool |
| Tailwind | 3.4.1 | Styling |
| React Router | 6.20.1 | Navegación |
| Zustand | 4.4.5 | State management |
| Axios | 1.6.5 | HTTP client |

---

## 📋 Endpoints API

### Autenticación
```bash
POST   /api/auth/login        # Login
POST   /api/auth/register     # Registro
POST   /api/auth/refresh      # Refresh token
GET    /api/auth/me           # Usuario actual
```

### Usuarios
```bash
GET    /api/usuarios          # Listar
GET    /api/usuarios/:id      # Obtener
POST   /api/usuarios          # Crear
PUT    /api/usuarios/:id      # Actualizar
DELETE /api/usuarios/:id      # Eliminar
```

### Clientes, Productos, Proyectos
```bash
# Mismas operaciones que Usuarios
GET    /api/clientes
POST   /api/clientes
...
```

---

## 🧪 Testing

### Ejecutar tests
```bash
npm test                      # Todos los tests
npm test -- GenericTable      # Test específico
npm test -- --coverage        # Con cobertura
```

### Documentación de testing
Ver `frontend/TESTING_GUIDE.md` para guía completa.

---

## 📊 Credenciales de Prueba

```
Admin
  Email: admin@erp.local
  Contraseña: Admin123!
  Rol: SUPER_ADMIN

Test User
  Email: test@erp.local
  Contraseña: Admin123!
  Rol: OPERARIO
```

---

## 🔧 Variables de Entorno

### Backend (.env)
```bash
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=erp_user
DB_PASSWORD=erp_password_123
DB_NAME=erp_v3_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password_123

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Frontend (.env.local)
```bash
VITE_API_URL=http://localhost:3000/api
```

---

## 📖 Documentación

- [Database Guide](./docs/DATABASE.md) - Estructura y migraciones
- [Testing Guide](./frontend/TESTING_GUIDE.md) - Cómo ejecutar tests
- [Testing Report](./frontend/TESTING_REPORT.md) - Funcionalidades testeadas
- [GitHub Upload](./GITHUB_UPLOAD_GUIDE.md) - Cómo subir a GitHub

---

## 🐛 Troubleshooting

### PostgreSQL no conecta
```bash
docker-compose restart postgres
```

### Redis error
```bash
docker-compose restart redis
```

### npm install falla
```bash
rm -r node_modules package-lock.json
npm install
```

### Frontend no carga
```bash
# Limpiar cache
rm -r frontend/node_modules frontend/dist
cd frontend && npm install
npm run dev
```

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📝 Licencia

Este proyecto está bajo licencia MIT. Ver LICENSE para detalles.

---

## 👤 Autor

**Daniel Fernández**
- GitHub: [@Danielfernandez1990](https://github.com/Danielfernandez1990)
- Email: daniel@example.com

---

## 🙏 Agradecimientos

- [Express.js](https://expressjs.com/) - Web framework
- [React](https://react.dev/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Redis](https://redis.io/) - Cache

---

## 📞 Soporte

Para reportar bugs o pedir features, abre un [Issue](https://github.com/Danielfernandez1990/ERP-ProyectManager3_03/issues).

---

**Última actualización:** 2026-06-01  
**Versión:** 3.0.0  
**Status:** ✅ Producción Ready

