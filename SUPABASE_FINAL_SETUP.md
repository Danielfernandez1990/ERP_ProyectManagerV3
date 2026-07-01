# 🎯 SETUP SUPABASE - INSTRUCCIONES FINALES

## ⚡ RESUMEN RÁPIDO

Tu Supabase está casi lista. Solo necesitas:

1. ✅ Copiar 10 bloques SQL pequeños
2. ✅ Ejecutar cada uno en Supabase
3. ✅ Obtener 3 claves API
4. ✅ Actualizar `.env`
5. ✅ Reiniciar backend

**Tiempo total: 15 minutos**

---

## 📍 DÓNDE COPIAR EL SQL

Archivo en tu proyecto: **`SUPABASE_SQL_OPTIMIZADO.sql`**

O aquí en GitHub:
https://raw.githubusercontent.com/Danielfernandez1990/ERP_ProyectManagerV3/main/SUPABASE_SQL_OPTIMIZADO.sql

---

## 🚀 CÓMO EJECUTAR PASO A PASO

### Abre Supabase SQL Editor
👉 https://supabase.com/dashboard/project/gzgqhtgrbjbgrvhcestn/sql/new

### BLOQUE 1: Tabla Usuarios
Copia este código y pega en el editor:

```sql
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  rol VARCHAR(50) NOT NULL DEFAULT 'OPERARIO' CHECK (rol IN ('SUPER_ADMIN', 'ADMIN', 'OPERARIO', 'CLIENTE')),
  estado VARCHAR(50) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO', 'BLOQUEADO')),
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  pais VARCHAR(100),
  avatar_url TEXT,
  ultimo_acceso TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
```

Click **Run** ▶️ Espera "Query completed"

---

### BLOQUE 2: Tabla Proyectos

```sql
CREATE TABLE IF NOT EXISTS proyectos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) NOT NULL DEFAULT 'ABIERTO' CHECK (estado IN ('ABIERTO', 'EN_PROGRESO', 'CERRADO', 'CANCELADO')),
  responsable_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE SET NULL,
  fecha_inicio DATE,
  fecha_fin DATE,
  presupuesto DECIMAL(12, 2),
  progreso INTEGER DEFAULT 0 CHECK (progreso >= 0 AND progreso <= 100),
  prioridad VARCHAR(50) DEFAULT 'MEDIA' CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA', 'URGENTE')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proyectos_responsable ON proyectos(responsable_id);
CREATE INDEX IF NOT EXISTS idx_proyectos_estado ON proyectos(estado);
```

Click **Run** ▶️

---

### BLOQUE 3: Tabla Tareas

```sql
CREATE TABLE IF NOT EXISTS tareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID NOT NULL REFERENCES proyectos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) NOT NULL DEFAULT 'TODO' CHECK (estado IN ('TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE')),
  prioridad VARCHAR(50) NOT NULL DEFAULT 'MEDIA' CHECK (prioridad IN ('BAJA', 'MEDIA', 'ALTA', 'URGENTE')),
  asignado_a UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  fecha_vencimiento DATE,
  fecha_inicio DATE,
  orden_columna INTEGER DEFAULT 0,
  etiquetas TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tareas_proyecto ON tareas(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_tareas_asignado ON tareas(asignado_a);
CREATE INDEX IF NOT EXISTS idx_tareas_estado ON tareas(estado);
```

Click **Run** ▶️

---

### BLOQUE 4: Tabla Clientes

```sql
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  pais VARCHAR(100),
  código_postal VARCHAR(10),
  tipo_cliente VARCHAR(50) DEFAULT 'EMPRESA',
  estado VARCHAR(50) NOT NULL DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO', 'BLOQUEADO')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_clientes_email ON clientes(email);
```

Click **Run** ▶️

---

### BLOQUE 5: Tabla Productos

```sql
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(12, 2) NOT NULL CHECK (precio >= 0),
  cantidad INTEGER NOT NULL DEFAULT 0 CHECK (cantidad >= 0),
  cantidad_minima INTEGER DEFAULT 10,
  categoria VARCHAR(100),
  sku VARCHAR(50) UNIQUE NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'ACTIVO',
  proveedor VARCHAR(255),
  imagen_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Click **Run** ▶️

---

### BLOQUE 6: Tabla Licencias

```sql
CREATE TABLE IF NOT EXISTS licencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('BASICA', 'PROFESIONAL', 'EMPRESARIAL')),
  fecha_inicio DATE NOT NULL,
  fecha_vencimiento DATE NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'ACTIVA',
  cantidad_usuarios INTEGER DEFAULT 1,
  cantidad_proyectos INTEGER DEFAULT 5,
  precio_mensual DECIMAL(12, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_licencias_usuario ON licencias(usuario_id);
```

Click **Run** ▶️

---

### BLOQUE 7: Tabla Audit Logs

```sql
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  accion VARCHAR(100) NOT NULL,
  tabla VARCHAR(100) NOT NULL,
  registro_id UUID,
  cambios JSONB,
  ip_address VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_usuario ON audit_logs(usuario_id);
```

Click **Run** ▶️

---

### BLOQUE 8: Tabla SMTP Config

```sql
CREATE TABLE IF NOT EXISTS smtp_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servidor VARCHAR(255) NOT NULL,
  puerto INTEGER NOT NULL,
  email VARCHAR(255) NOT NULL,
  contraseña TEXT NOT NULL,
  cifrado VARCHAR(20) NOT NULL,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Click **Run** ▶️

---

### BLOQUE 9: Tabla Chat Messages

```sql
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  mensaje TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'TEXTO',
  leido BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_chat_proyecto ON chat_messages(proyecto_id);
```

Click **Run** ▶️

---

### BLOQUE 10: Row Level Security

```sql
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
```

Click **Run** ▶️

---

## ✅ VERIFICAR QUE TODO FUNCIONÓ

1. Ve a: https://supabase.com/dashboard/project/gzgqhtgrbjbgrvhcestn/editor
2. En el panel izquierdo deberías ver:
   - ✅ usuarios
   - ✅ proyectos
   - ✅ tareas
   - ✅ clientes
   - ✅ productos
   - ✅ licencias
   - ✅ audit_logs
   - ✅ smtp_config
   - ✅ chat_messages

Si todas aparecen → ¡Listo! ✨

---

## 🔑 OBTENER CLAVES API

1. Ve a: https://supabase.com/dashboard/project/gzgqhtgrbjbgrvhcestn/settings/api

2. Copia estas 3 líneas:
   ```
   Project URL:
   Anon Key:
   Service Role Key:
   ```

---

## 📝 ACTUALIZAR .env

En `C:/ERP-V3/.env`, reemplaza:

```bash
SUPABASE_URL=https://gzgqhtgrbjbgrvhcestn.supabase.co
SUPABASE_KEY=<pega_aqui_anon_key>
SUPABASE_SERVICE_ROLE=<pega_aqui_service_role_key>
```

---

## ▶️ INICIAR BACKEND

```bash
cd C:/ERP-V3
npm run dev
```

Deberías ver:
```
✅ Conectado a Supabase exitosamente
🚀 Server running on http://localhost:3000
```

---

## 📊 ¿QUÉ INCLUYE ESTA SETUP?

✅ **Base de datos completa** - Todas las tablas relacionadas
✅ **Índices** - Para consultas rápidas
✅ **Row Level Security** - Seguridad a nivel de BD
✅ **Relaciones** - Foreign keys para integridad
✅ **Constraints** - Validaciones a nivel de BD

**Sin necesidad de:**
- ❌ PostgreSQL local
- ❌ Redis
- ❌ Gestión manual de servidores

---

## 🆘 PROBLEMAS?

**Error: "syntax error"**
→ Asegúrate de copiar un bloque a la vez, no todo junto

**Error: "relation already exists"**
→ Normal si ejecutas dos veces. Usa `IF NOT EXISTS`

**No veo las tablas**
→ Recarga la página de Supabase editor

---

**¡Listo para producción!** 🚀

