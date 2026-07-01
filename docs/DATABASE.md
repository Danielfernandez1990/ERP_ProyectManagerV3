# 🗄️ Database Setup - ERP V3.0

## Descripción General

Este documento describe cómo configurar, inicializar y mantener la base de datos de ERP V3.0.

## Estructura de Base de Datos

### Tablas Principales

```
usuarios              - Usuarios del sistema
empresas             - Empresas/Clientes
licencias            - Licencias y planes
clientes             - Catálogo de clientes
productos            - Catálogo de productos
proyectos            - Gestión de proyectos
tareas               - Tareas y actividades
auditorias           - Log de cambios del sistema
pagos                - Registro de pagos
```

## Credenciales de Conexión

**Archivo:** `.env`

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USER=erp_user
DB_PASSWORD=erp_password_123
DB_NAME=erp_v3_db
```

## Inicialización de la Base de Datos

### Paso 1: Crear la Base de Datos

```bash
docker-compose up -d
```

Esto levanta PostgreSQL con la BD `erp_v3_db` creada automáticamente.

### Paso 2: Crear Tablas

Las tablas se crean automáticamente al ejecutar el backend:

```bash
npm run dev
```

O manualmente ejecutando las migraciones:

```bash
npm run migrate
```

### Paso 3: Cargar Datos de Prueba

```bash
npm run seed
```

Este comando:
- ✅ Crea empresa de prueba: `ERP Test Company`
- ✅ Crea usuarios de prueba
- ✅ Genera contraseñas hasheadas con bcryptjs
- ✅ Crea licencia PRO válida por 1 año
- ✅ Verifica la integridad de datos

## Usuarios de Prueba

Después de ejecutar `npm run seed`:

| Email | Contraseña | Rol | Estado |
|-------|-----------|-----|--------|
| admin@erp.local | Admin123! | SUPER_ADMIN | Activo |
| test@erp.local | Admin123! | OPERARIO | Activo |

⚠️ **IMPORTANTE:** Cambiar estas credenciales en producción.

## Gestión de Contraseñas

### Hashing de Contraseñas

Las contraseñas se hashean con **bcryptjs** usando 10 rounds de salt.

**Nunca almacenar contraseñas en texto plano.**

### Generar Hash Manualmente

En caso de necesitar resetear una contraseña:

```typescript
import bcryptjs from 'bcryptjs';

const password = 'NuevaContraseña123!';
const hash = await bcryptjs.hash(password, 10);
console.log(hash); // $2a$10$...
```

Luego actualizar la BD:

```sql
UPDATE usuarios 
SET password_hash = '$2a$10$...' 
WHERE email = 'usuario@ejemplo.com';
```

## Variables de Entorno Críticas

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `DB_HOST` | `localhost` | Host de PostgreSQL |
| `DB_PORT` | `5432` | Puerto de PostgreSQL |
| `DB_USER` | `erp_user` | Usuario BD |
| `DB_PASSWORD` | `erp_password_123` | Contraseña BD |
| `DB_NAME` | `erp_v3_db` | Nombre de BD |

## Verificación de Conexión

```bash
# Conectarse a la BD
docker exec erp_postgres psql -U erp_user -d erp_v3_db

# Listar tablas
\dt

# Contar usuarios
SELECT COUNT(*) FROM usuarios;

# Ver usuarios
SELECT id, email, nombre, rol FROM usuarios;
```

## Backup y Restore

### Crear Backup

```bash
docker exec erp_postgres pg_dump -U erp_user -d erp_v3_db > backup.sql
```

### Restaurar Backup

```bash
docker exec -i erp_postgres psql -U erp_user -d erp_v3_db < backup.sql
```

## Troubleshooting

### Error: "Database connection failed"

**Causa:** PostgreSQL no está corriendo

**Solución:**
```bash
docker-compose up -d
docker-compose logs postgres
```

### Error: "Authentication failed for user 'erp_user'"

**Causa:** Credenciales incorrectas en `.env`

**Solución:** Verificar valores en `.env` coincidan con `docker-compose.yml`

### Error: "User does not exist"

**Causa:** No se ejecutó el seed

**Solución:**
```bash
npm run seed
```

### Error: "Invalid password" en login

**Causa:** Hash de contraseña corrupto

**Solución:** Ejecutar seed nuevamente

```bash
npm run seed
```

## Security Best Practices

- ✅ Usar variables de entorno para credenciales
- ✅ Hashear todas las contraseñas con bcryptjs
- ✅ Usar HTTPS en producción
- ✅ Validar todas las entradas en el backend
- ✅ Usar prepared statements (parameterized queries)
- ✅ Hacer backups regulares
- ✅ Limitar acceso a la BD por red

## Migraciones

Para crear nuevas tablas o modificar la estructura:

1. Crear archivo SQL en `src/database/migrations/`
2. Ejecutar: `npm run migrate`

## Testing

Verificar que la BD está correctamente configurada:

```bash
npm test
```

## Contacto y Soporte

Para problemas con la base de datos, revisar los logs:

```bash
docker-compose logs postgres
docker-compose logs -f
```
