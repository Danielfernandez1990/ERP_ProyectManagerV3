# TEST_ENDPOINTS.md - Guía de Prueba de APIs

## 📌 Información de Conexión

- **Base URL:** `http://localhost:3000/api`
- **Health Check:** `http://localhost:3000/api/health`
- **Method:** REST (GET, POST, PUT, DELETE)
- **Content-Type:** `application/json`

---

## 🔄 Flujo de Prueba Completo

### 1. Health Check
```bash
curl -X GET http://localhost:3000/api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T10:00:00.000Z",
  "version": "3.0.0"
}
```

---

### 2. Register (Crear empresa + usuario)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "password": "Password123!",
    "empresa_nombre": "Mi Empresa SPA"
  }'
```

**Response:**
```json
{
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "SUPER_ADMIN"
    },
    "tokens": {
      "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**⚠️ GUARDAR:** Los tokens (especialmente `access`) para siguientes requests

---

### 3. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "Password123!"
  }'
```

**Response:** Similar a Register

---

### 4. Get Current User
```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Reemplazar `<ACCESS_TOKEN>` con el token obtenido en Register/Login

**Response:**
```json
{
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "rol": "SUPER_ADMIN",
    "empresa_id": 1
  }
}
```

---

### 5. Listar Usuarios
```bash
curl -X GET http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan@example.com",
      "rol": "SUPER_ADMIN",
      "activo": true,
      "supervisor_id": null
    }
  ]
}
```

---

### 6. Crear Usuario (Admin)
```bash
curl -X POST http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García",
    "email": "maria@example.com",
    "password": "Password123!",
    "rol": "OPERARIO"
  }'
```

**Response:**
```json
{
  "message": "User created successfully",
  "data": {
    "id": 2,
    "nombre": "María García",
    "email": "maria@example.com",
    "rol": "OPERARIO"
  }
}
```

---

### 7. Obtener Usuario por ID
```bash
curl -X GET http://localhost:3000/api/usuarios/2 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**Response:**
```json
{
  "data": {
    "id": 2,
    "nombre": "María García",
    "email": "maria@example.com",
    "rol": "OPERARIO",
    "activo": true,
    "supervisor_id": null
  }
}
```

---

### 8. Actualizar Usuario
```bash
curl -X PUT http://localhost:3000/api/usuarios/2 \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María García López"
  }'
```

**Response:**
```json
{
  "message": "User updated successfully",
  "data": {
    "id": 2,
    "nombre": "María García López",
    "email": "maria@example.com",
    "rol": "OPERARIO"
  }
}
```

---

### 9. Cambiar Contraseña
```bash
curl -X PUT http://localhost:3000/api/usuarios/1/password \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Password123!",
    "newPassword": "NewPassword456!"
  }'
```

**Response:**
```json
{
  "message": "Password updated successfully"
}
```

---

### 10. Refresh Token
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<REFRESH_TOKEN>"
  }'
```

**Response:**
```json
{
  "message": "Token refreshed",
  "data": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 11. Eliminar Usuario (Admin)
```bash
curl -X DELETE http://localhost:3000/api/usuarios/2 \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## 🧪 Casos de Error

### 1. Email duplicado al registrar
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Otro Usuario",
    "email": "juan@example.com",
    "password": "Password123!",
    "empresa_nombre": "Otra Empresa"
  }'
```

**Response (409):**
```json
{
  "code": "EMAIL_ALREADY_EXISTS",
  "message": "Email already registered",
  "timestamp": "2026-01-15T10:05:00.000Z"
}
```

---

### 2. Contraseña inválida al login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "WrongPassword!"
  }'
```

**Response (401):**
```json
{
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password",
  "timestamp": "2026-01-15T10:06:00.000Z"
}
```

---

### 3. Sin token
```bash
curl -X GET http://localhost:3000/api/usuarios
```

**Response (401):**
```json
{
  "code": "UNAUTHORIZED",
  "message": "No authorization header",
  "timestamp": "2026-01-15T10:07:00.000Z"
}
```

---

### 4. Token expirado
```bash
curl -X GET http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEyMzQ1Njc4OTB9..."
```

**Response (401):**
```json
{
  "code": "UNAUTHORIZED",
  "message": "Invalid or expired token",
  "timestamp": "2026-01-15T10:08:00.000Z"
}
```

---

### 5. Validación fallida (contraseña débil)
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "email": "test@example.com",
    "password": "weak",
    "empresa_nombre": "Test Company"
  }'
```

**Response (400):**
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "password",
      "message": "Password must contain uppercase, number and special character"
    }
  ],
  "timestamp": "2026-01-15T10:09:00.000Z"
}
```

---

## 🛠️ Con Postman

### 1. Crear Collection
- Abrir Postman
- Crear nueva collection: "ERP V3.0"

### 2. Crear Environment
- Variables:
  - `base_url` = `http://localhost:3000/api`
  - `access_token` = (se llena después de login)
  - `refresh_token` = (se llena después de login)

### 3. Crear Requests

#### Request 1: Health Check
- **Nombre:** Health Check
- **Método:** GET
- **URL:** `{{base_url}}/health`

#### Request 2: Register
- **Nombre:** Register
- **Método:** POST
- **URL:** `{{base_url}}/auth/register`
- **Body (JSON):**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Password123!",
  "empresa_nombre": "Mi Empresa"
}
```
- **Test:** Agregar script para guardar tokens
```javascript
var jsonData = pm.response.json();
pm.environment.set("access_token", jsonData.data.tokens.access);
pm.environment.set("refresh_token", jsonData.data.tokens.refresh);
```

#### Request 3: Login
- **Nombre:** Login
- **Método:** POST
- **URL:** `{{base_url}}/auth/login`
- **Body (JSON):**
```json
{
  "email": "juan@example.com",
  "password": "Password123!"
}
```
- **Test:** Guardar tokens (mismo script que Register)

#### Request 4: Get Me
- **Nombre:** Get Me
- **Método:** GET
- **URL:** `{{base_url}}/auth/me`
- **Headers:**
  - `Authorization: Bearer {{access_token}}`

#### Request 5: Listar Usuarios
- **Nombre:** List Usuarios
- **Método:** GET
- **URL:** `{{base_url}}/usuarios`
- **Headers:**
  - `Authorization: Bearer {{access_token}}`

#### Request 6: Create Usuario
- **Nombre:** Create Usuario
- **Método:** POST
- **URL:** `{{base_url}}/usuarios`
- **Headers:**
  - `Authorization: Bearer {{access_token}}`
- **Body (JSON):**
```json
{
  "nombre": "María García",
  "email": "maria@example.com",
  "password": "Password123!",
  "rol": "OPERARIO"
}
```

---

## 📊 Casos de Uso Completos

### Caso 1: Crear empresa y 3 usuarios
```bash
# 1. Register (crea empresa + super admin)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Admin","email":"admin@company.com","password":"Admin123!","empresa_nombre":"Company Inc"}'

# Guardar: access_token

# 2. Crear admin
curl -X POST http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Admin 2","email":"admin2@company.com","password":"Admin123!","rol":"ADMIN"}'

# 3. Crear operario
curl -X POST http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Operario","email":"operario@company.com","password":"Oper123!","rol":"OPERARIO"}'

# 4. Crear visualizador
curl -X POST http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Visualizador","email":"viewer@company.com","password":"View123!","rol":"VISUALIZADOR"}'
```

---

### Caso 2: Login con diferentes roles
```bash
# Login como Operario
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"operario@company.com","password":"Oper123!"}'

# Listar usuarios (cualquier rol puede ver)
curl -X GET http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <operario_token>"

# Intentar crear usuario (solo admin)
curl -X POST http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer <operario_token>" \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"test@company.com","password":"Test123!","rol":"OPERARIO"}'

# Response: 403 FORBIDDEN
```

---

## 🐛 Debugging

### Ver logs en tiempo real
```bash
docker-compose logs -f backend
```

### Ver logs de base de datos
```bash
docker-compose logs -f postgres
```

### Ver logs de Redis
```bash
docker-compose logs -f redis
```

### Conectarse a PostgreSQL
```bash
docker-compose exec postgres psql -U erp_user -d erp_v3_db

# Dentro de psql:
SELECT * FROM usuarios;
SELECT * FROM licencias;
\dt  -- Ver todas las tablas
```

### Conectarse a Redis
```bash
docker-compose exec redis redis-cli

# Dentro de redis-cli:
KEYS *
GET session:123
```

---

## ✅ Checklist de Pruebas

- [ ] Health check responde 200
- [ ] Registro crea empresa y usuario
- [ ] Login devuelve tokens válidos
- [ ] Get me devuelve usuario autenticado
- [ ] Listar usuarios muestra todos
- [ ] Crear usuario crea exitosamente
- [ ] Actualizar usuario modifica datos
- [ ] Cambiar contraseña funciona
- [ ] Eliminar usuario hace soft delete
- [ ] Token expirado rechaza requests
- [ ] Refresh token genera uno nuevo
- [ ] Sin token rechaza acceso
- [ ] Email duplicado rechaza registro
- [ ] Contraseña débil rechaza
- [ ] Email no existe rechaza login
- [ ] Contraseña incorrecta rechaza login
- [ ] No admin no puede crear usuario
- [ ] No admin no puede eliminar usuario
- [ ] Rate limiting funciona

---

**Última actualización:** 2026-01-15  
**Versión:** 3.0.0
