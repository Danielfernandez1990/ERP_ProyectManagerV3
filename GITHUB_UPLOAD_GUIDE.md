# 📤 INSTRUCCIONES PARA SUBIR ERP V3.0 A GITHUB

## Paso 1: Verificar Git instalado

```powershell
git --version
```

Si no está instalado, descárgalo desde: https://git-scm.com/download/win

---

## Paso 2: Configurar Git (primera vez)

```powershell
git config --global user.name "Tu Nombre"
git config --global user.email "tu.email@github.com"
```

**Ejemplo:**
```powershell
git config --global user.name "Daniel Fernandez"
git config --global user.email "daniel@github.com"
```

---

## Paso 3: Navegar al proyecto

```powershell
cd C:\ERP-V3
```

---

## Paso 4: Inicializar repositorio (si es nuevo)

```powershell
git init
git add .
git commit -m "Initial commit: ERP V3.0 - Complete CRUD system with authentication" -m "" -m "Assisted-By: docker-agent"
```

---

## Paso 5: Agregar repositorio remoto

```powershell
git remote add origin https://github.com/Danielfernandez1990/ERP-ProyectManager3_03.git
```

---

## Paso 6: Hacer push (primera vez)

```powershell
git branch -M main
git push -u origin main
```

---

## Paso 7: Para futuros commits

```powershell
# Ver cambios
git status

# Agregar cambios
git add .

# Commit con mensaje descriptivo
git commit -m "feat: Add component X" -m "" -m "Assisted-By: docker-agent"

# Push
git push
```

---

## 📋 CONTENIDO DEL COMMIT

El commit incluye:

### Backend
- ✅ Express + TypeScript
- ✅ PostgreSQL integrada
- ✅ Redis para cache
- ✅ JWT authentication
- ✅ 8 rutas CRUD completas
- ✅ Docker compose con servicios

### Frontend
- ✅ React 18 + TypeScript
- ✅ Vite como bundler
- ✅ Tailwind CSS diseño
- ✅ 4 páginas CRUD completas
- ✅ Layout con sidebar
- ✅ Componentes reutilizables
- ✅ Tests unitarios e integración

### Base de datos
- ✅ 9 tablas con relaciones
- ✅ Script seed con datos
- ✅ Migraciones

### Documentación
- ✅ README.md
- ✅ DATABASE.md
- ✅ TESTING_GUIDE.md
- ✅ TESTING_REPORT.md

---

## 🔐 CREDENCIALES (NO subir a Git)

Las siguientes están en `.env` (incluido en .gitignore):

```
DB_HOST=localhost
DB_USER=erp_user
DB_PASSWORD=erp_password_123
JWT_SECRET=your_secret_key
```

---

## ✅ CHECKLIST ANTES DE PUSH

```powershell
# 1. Verificar archivos
git status

# 2. Ver cambios
git diff

# 3. Verificar .gitignore
cat .gitignore

# 4. No incluya node_modules
git ls-files | findstr "node_modules" # No debe salir nada

# 5. No incluya .env
git ls-files | findstr ".env" # No debe salir nada

# 6. Contar archivos
git ls-files | Measure-Object -Line # Debe ser ~150 archivos
```

---

## 📊 ESTRUCTURA DEL REPOSITORIO

```
ERP-ProyectManager3_03/
├── backend/                          # Backend Node.js
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env (IGNORED)
│
├── frontend/                         # Frontend React
│   ├── src/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local (IGNORED)
│
├── docker-compose.yml
├── .gitignore
├── .env.example
└── README.md
```

---

## 🚀 COMANDOS ÚTILES

```powershell
# Ver historial
git log --oneline

# Ver rama actual
git branch

# Ver cambios pendientes
git status

# Ver diff de archivo
git diff src/main.ts

# Deshacer cambios
git checkout -- src/main.ts

# Ver remotes
git remote -v
```

---

## ⚠️ ADVERTENCIAS

1. **NO incluyas:**
   - `node_modules/`
   - `.env` (usa `.env.example`)
   - `/dist`, `/build`
   - `.DS_Store` (Mac)

2. **SÍ incluye:**
   - Código fuente
   - Configuraciones (tsconfig, vite.config)
   - Documentación
   - Tests
   - Dockerfiles

3. **Credenciales:**
   - Nunca commits contraseñas
   - Usa variables de entorno
   - `.env` va en .gitignore

---

## 📞 SOPORTE

Si tienes errores:

```powershell
# Reiniciar repo
git reset --hard

# Ver rama
git branch

# Ver remotes
git remote -v

# Forzar push (CUIDADO)
git push -f origin main
```

---

**¡LISTO PARA SUBIR A GITHUB!** 🎉

