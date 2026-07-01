# 🚀 EJECUTAR SQL EN SUPABASE - GUÍA VISUAL PASO A PASO

## ⚠️ IMPORTANTE: Ejecutar CADA BLOQUE por separado

No copies todo de una vez. Supabase tiene límites. Voy a dividir en 10 bloques pequeños.

---

## PASO 1: Ir a Supabase SQL Editor

1. Abre: https://supabase.com/dashboard/project/gzgqhtgrbjbgrvhcestn/sql/new
2. Deberías ver una pantalla como esta:
   ```
   [ SQL Editor ]  [ Untitled query ]  [ Run ]
   ```

---

## PASO 2: EJECUTAR BLOQUE 1 - TABLA USUARIOS

Copia SOLO esto:

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

✅ Click **Run** (botón azul en la esquina inferior derecha)
✅ Espera a que diga "Query completed successfully"
✅ Continúa al PASO 3

---

## PASO 3: EJECUTAR BLOQUE 2 - TABLA PROYECTOS

Copia esto:

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

✅ Click **Run**
✅ Espera "Query completed"
✅ Continúa

---

## PASO 4: EJECUTAR BLOQUE 3 - TABLA TAREAS

Copia esto:

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

✅ Click **Run**
✅ Espera

---

## PASO 5: EJECUTAR BLOQUE 4 - TABLA CLIENTES

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

✅ Click **Run**

---

## PASO 6: EJECUTAR BLOQUE 5 - TABLA PRODUCTOS

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

✅ Click **Run**

---

## PASO 7: EJECUTAR BLOQUE 6 - TABLA LICENCIAS

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

✅ Click **Run**

---

## PASO 8: EJECUTAR BLOQUE 7 - TABLA AUDIT LOGS

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

✅ Click **Run**

---

## PASO 9: EJECUTAR BLOQUE 8 - TABLA SMTP CONFIG

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

✅ Click **Run**

---

## PASO 10: EJECUTAR BLOQUE 9 - TABLA CHAT

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

✅ Click **Run**

---

## PASO 11: EJECUTAR BLOQUE 10 - ROW LEVEL SECURITY

```sql
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE proyectos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tareas ENABLE ROW LEVEL SECURITY;
```

✅ Click **Run**

---

## ✅ LISTO!

Si todos los pasos ejecutaron sin errores, tu Supabase está completamente configurada.

### Para verificar:
1. Ve a: https://supabase.com/dashboard/project/gzgqhtgrbjbgrvhcestn/editor
2. Deberías ver todas las tablas en el panel izquierdo:
   - ✅ usuarios
   - ✅ proyectos
   - ✅ tareas
   - ✅ clientes
   - ✅ productos
   - ✅ licencias
   - ✅ audit_logs
   - ✅ smtp_config
   - ✅ chat_messages

---

## 🔑 OBTENER CLAVES API

1. Ve a: https://supabase.com/dashboard/project/gzgqhtgrbjbgrvhcestn/settings/api
2. Copia:
   - **Project URL** → SUPABASE_URL en .env
   - **Anon Key** → SUPABASE_KEY en .env
   - **Service Role Key** → SUPABASE_SERVICE_ROLE en .env

---

**¡Listo! El backend está preparado para Supabase** 🚀
