# 🚀 GUÍA DE MIGRACIÓN A SUPABASE

## Paso 1: Obtener Credenciales de Supabase

Tu ID de proyecto Supabase: `gzgqhtgrbjbgrvhcestn`

1. Ve a: https://supabase.com/dashboard/project/gzgqhtgrbjbgrvhcestn/settings/api
2. Copia las siguientes claves:
   - **Anon Key** → `SUPABASE_KEY` en .env
   - **Service Role Key** → `SUPABASE_SERVICE_ROLE` en .env

## Paso 2: Ejecutar SQL en Supabase

1. Ve a: https://supabase.com/dashboard/project/gzgqhtgrbjbgrvhcestn/sql
2. Crea una nueva query
3. Copia TODO el contenido de `src/database/migrations.supabase.sql`
4. Pega en la editor de Supabase
5. Click en **"Run"** (▶️)
6. Espera a que termine (verás "Query completed")

## Paso 3: Actualizar .env

Reemplaza en `.env`:

```bash
# Anterior (PostgreSQL local)
DB_HOST=localhost
DB_PORT=5432
DB_USER=erp_user
DB_PASSWORD=erp_password_123
DB_NAME=erp_v3_db

# Nuevo (Supabase)
SUPABASE_URL=https://gzgqhtgrbjbgrvhcestn.supabase.co
SUPABASE_KEY=eyJhbGc... (tu anon key aquí)
SUPABASE_SERVICE_ROLE=eyJhbGc... (tu service role aquí)
```

## Paso 4: Instalar Dependencias

```bash
npm install @supabase/supabase-js
```

## Paso 5: Verificar Conexión

El backend intentará conectarse a Supabase al iniciar. Deberías ver:

```
✅ Conectado a Supabase exitosamente
```

## Paso 6: Características Principales de Supabase

✅ **Auth**: Manejo de autenticación
✅ **Database**: PostgreSQL completo
✅ **Realtime**: Actualizaciones en tiempo real
✅ **Storage**: Almacenamiento de archivos
✅ **Row Level Security**: Seguridad a nivel de fila

## Troubleshooting

### Error: "Invalid API Key"
- Verifica que copiaste la clave completa sin espacios
- Usa la **Anon Key** en `SUPABASE_KEY`
- Usa la **Service Role Key** en `SUPABASE_SERVICE_ROLE`

### Error: "Connection refused"
- Verifica que la URL está correcta
- Intenta desde: https://supabase.com/dashboard/project/gzgqhtgrbjbgrvhcestn/sql/new

### Las tablas no existen
- Ejecuta nuevamente el SQL de migraciones
- Verifica que no hay errores en la consola

## Próximos Pasos

1. ✅ Ejecutar migraciones SQL
2. ✅ Actualizar .env con claves
3. ⏳ Reiniciar backend
4. ⏳ Testear endpoints
5. ⏳ Migrar datos existentes (si hay)

---

**Proyecto**: ERP V3.0 - Plataforma Empresarial
**URL de proyecto Supabase**: https://supabase.com/dashboard/org/jmsrgiygjfwtowmcnhiv
