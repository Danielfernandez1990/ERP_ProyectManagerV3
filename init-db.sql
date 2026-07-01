-- ============================================
-- ERP V3.0 - Schema SQL
-- ============================================

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  apellido VARCHAR(255),
  rol VARCHAR(50) NOT NULL DEFAULT 'OPERARIO',
  estado VARCHAR(50) NOT NULL DEFAULT 'activo',
  ultimo_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: empresas
CREATE TABLE IF NOT EXISTS empresas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  razon_social VARCHAR(255),
  rfc VARCHAR(50),
  direccion TEXT,
  telefono VARCHAR(20),
  email VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'BASICO',
  estado VARCHAR(50) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: licencias
CREATE TABLE IF NOT EXISTS licencias (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id),
  plan VARCHAR(50) NOT NULL,
  usuarios_max INTEGER DEFAULT 5,
  estado VARCHAR(50) NOT NULL DEFAULT 'activo',
  fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_expiracion TIMESTAMP,
  precio_mensual DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: clientes
CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id),
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  telefono VARCHAR(20),
  direccion TEXT,
  ciudad VARCHAR(100),
  estado_cliente VARCHAR(50) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: productos
CREATE TABLE IF NOT EXISTS productos (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  cantidad_stock INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  estado VARCHAR(50) DEFAULT 'activo',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: proyectos
CREATE TABLE IF NOT EXISTS proyectos (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id),
  cliente_id INTEGER REFERENCES clientes(id),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'pendiente',
  fecha_inicio TIMESTAMP,
  fecha_fin_estimada TIMESTAMP,
  fecha_fin_real TIMESTAMP,
  presupuesto DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: tareas
CREATE TABLE IF NOT EXISTS tareas (
  id SERIAL PRIMARY KEY,
  proyecto_id INTEGER NOT NULL REFERENCES proyectos(id),
  usuario_id INTEGER REFERENCES usuarios(id),
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'pendiente',
  prioridad VARCHAR(50) DEFAULT 'media',
  fecha_inicio TIMESTAMP,
  fecha_vencimiento TIMESTAMP,
  fecha_completada TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: auditorias
CREATE TABLE IF NOT EXISTS auditorias (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  tabla VARCHAR(100) NOT NULL,
  accion VARCHAR(50) NOT NULL,
  valores_antiguos JSONB,
  valores_nuevos JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: pagos
CREATE TABLE IF NOT EXISTS pagos (
  id SERIAL PRIMARY KEY,
  empresa_id INTEGER NOT NULL REFERENCES empresas(id),
  stripe_payment_id VARCHAR(255),
  monto DECIMAL(10, 2) NOT NULL,
  moneda VARCHAR(10) DEFAULT 'USD',
  estado VARCHAR(50) DEFAULT 'pendiente',
  metodo_pago VARCHAR(50),
  descripcion TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_empresas_estado ON empresas(estado);
CREATE INDEX IF NOT EXISTS idx_licencias_empresa ON licencias(empresa_id);
CREATE INDEX IF NOT EXISTS idx_clientes_empresa ON clientes(empresa_id);
CREATE INDEX IF NOT EXISTS idx_productos_empresa ON productos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_proyectos_empresa ON proyectos(empresa_id);
CREATE INDEX IF NOT EXISTS idx_proyectos_cliente ON proyectos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_tareas_proyecto ON tareas(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_tareas_usuario ON tareas(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tareas_estado ON tareas(estado);
CREATE INDEX IF NOT EXISTS idx_auditorias_usuario ON auditorias(usuario_id);
CREATE INDEX IF NOT EXISTS idx_pagos_empresa ON pagos(empresa_id);

-- Insertar empresa de prueba
INSERT INTO empresas (nombre, razon_social, plan, estado) 
VALUES ('ERP Test Company', 'Test S.A.', 'PRO', 'activo')
ON CONFLICT DO NOTHING;

-- Insertar usuario admin
INSERT INTO usuarios (email, password_hash, nombre, apellido, rol, estado)
VALUES ('admin@erp.local', '$2a$10$..', 'Admin', 'Sistema', 'SUPER_ADMIN', 'activo')
ON CONFLICT (email) DO NOTHING;

-- Insertar licencia de prueba
INSERT INTO licencias (empresa_id, plan, usuarios_max, estado, fecha_expiracion)
SELECT id, 'PRO', 20, 'activo', NOW() + INTERVAL '1 year'
FROM empresas WHERE nombre = 'ERP Test Company'
ON CONFLICT DO NOTHING;

COMMIT;
