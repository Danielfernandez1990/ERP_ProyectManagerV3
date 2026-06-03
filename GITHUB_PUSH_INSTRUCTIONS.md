# 🚀 INSTRUCCIONES FINALES - SUBIR ERP V3.0 A GITHUB

## RESUMEN DE CAMBIOS

Todo está listo para subir al repositorio:
- ✅ .gitignore configurado (excluye node_modules, .env, dist)
- ✅ .env.example creado (credenciales de ejemplo)
- ✅ README.md profesional
- ✅ Documentación completa
- ✅ Tests creados
- ✅ Código limpio

---

## PASO 1: INSTALAR GIT (si no lo tienes)

1. Descarga desde: https://git-scm.com/download/win
2. Instala con opciones por defecto
3. Reinicia PowerShell

Verifica:
```powershell
git --version
```

---

## PASO 2: CONFIGURAR GIT (primera vez)

```powershell
git config --global user.name "Daniel Fernandez"
git config --global user.email "tu.email@gmail.com"
```

Verifica:
```powershell
git config --global user.name
git config --global user.email
```

---

## PASO 3: NAVEGAR AL PROYECTO

```powershell
cd C:\ERP-V3
```

---

## PASO 4: CREAR REPO LOCAL

```powershell
# Inicializar repositorio
git init

# Ver estado
git status

# Agregar todos los archivos
git add .

# Ver qué se va a commitear
git status
```

**Verificar que NO incluya:**
- ❌ node_modules/
- ❌ .env (solo .env.example)
- ❌ dist/
- ❌ build/

---

## PASO 5: PRIMER COMMIT

```powershell
git commit -m "Initial commit: ERP V3.0 - Complete CRUD system" -m "" -m "Assisted-By: docker-agent"
```

Este comando:
- Crea el primer commit
- Con mensaje descriptivo
- Con línea en blanco
- Con footer de asistencia

---

## PASO 6: CONECTAR CON GITHUB

```powershell
# Agregar repositorio remoto
git remote add origin https://github.com/Danielfernandez1990/ERP-ProyectManager3_03.git

# Verificar
git remote -v
```

Deberías ver:
```
origin  https://github.com/Danielfernandez1990/ERP-ProyectManager3_03.git (fetch)
origin  https://github.com/Danielfernandez1990/ERP-ProyectManager3_03.git (push)
```

---

## PASO 7: HACER PUSH A GITHUB

```powershell
# Renombrar rama a 'main'
git branch -M main

# Hacer push
git push -u origin main
```

Se te pedirá autenticación. Opciones:
1. **Token de GitHub** (recomendado)
   - Generarlo en: https://github.com/settings/tokens
   - Copiar token y usarlo como contraseña
2. **SSH** (más seguro)
   - Configurar SSH key
   - https://docs.github.com/es/authentication/connecting-to-github-with-ssh

---

## VERIFICACIÓN EN GITHUB

1. Abre: https://github.com/Danielfernandez1990/ERP-ProyectManager3_03
2. Verifica que tenga:
   - ✅ Código del backend
   - ✅ Código del frontend
   - ✅ docker-compose.yml
   - ✅ README.md
   - ✅ .gitignore
   - ✅ .env.example
   - ❌ NO node_modules
   - ❌ NO .env

---

## PARA FUTUROS CAMBIOS

```powershell
# 1. Ver cambios
git status

# 2. Agregar cambios específicos
git add src/main.ts frontend/src/pages/UsuariosPage.tsx

# O agregar todo
git add .

# 3. Commit
git commit -m "feat: Add new feature" -m "" -m "Assisted-By: docker-agent"

# 4. Push
git push
```

---

## COMANDOS ÚTILES

```powershell
# Ver historial
git log --oneline

# Ver rama actual
git branch

# Ver cambios no commiteados
git diff

# Ver cambios staged
git diff --cached

# Deshacer cambios de archivo
git checkout -- src/main.ts

# Ver remotes
git remote -v

# Cambiar remote URL
git remote set-url origin https://github.com/nuevo/repo.git
```

---

## 🔐 SEGURIDAD

### Proteger secrets en GitHub

En GitHub > Settings > Secrets and variables > Actions:

```
GITHUB_TOKEN (automático)
DB_PASSWORD=erp_password_123
STRIPE_SECRET=sk_test_xxxxx
JWT_SECRET=your_secret_key
```

Luego usarlos en CI/CD:
```yaml
env:
  DB_PASSWORD: ${{ secrets.DB_PASSWORD }}
```

---

## 📋 CHECKLIST FINAL

Antes de hacer push, verifica:

```
[ ] Git instalado y configurado
[ ] En directorio C:\ERP-V3
[ ] git init ejecutado
[ ] .gitignore creado
[ ] .env NO está en archivos a commitear
[ ] node_modules NO está en archivos
[ ] README.md existe
[ ] .env.example existe
[ ] git add . ejecutado
[ ] git commit ejecutado
[ ] git remote add origin <URL>
[ ] git branch -M main ejecutado
[ ] git push -u origin main ejecutado
[ ] Verificado en GitHub que se subió todo
```

---

## ⚠️ ERRORES COMUNES

### Error: "fatal: not a git repository"
```powershell
cd C:\ERP-V3
git init
```

### Error: "authentication failed"
- Verificar credenciales GitHub
- Usar token en lugar de contraseña
- https://github.com/settings/tokens

### Error: "everything up-to-date"
Ya está todo subido. Para cambios:
```powershell
git add .
git commit -m "Update: Description"
git push
```

### Error: ".env está en commit"
```powershell
# Deshacer último commit
git reset --soft HEAD~1

# Remover .env de staging
git reset HEAD .env

# Agregar solo lo que queremos
git add .gitignore README.md src/ frontend/

# Nuevo commit
git commit -m "Initial commit"
```

---

## 🎯 PRÓXIMOS PASOS

Después de subir:

1. **Configurar branch protection** (Settings > Branches)
2. **Configurar CI/CD** (GitHub Actions)
3. **Agregar collaboradores** (Settings > Collaborators)
4. **Crear issues** para features/bugs
5. **Crear milestones** para versiones

---

## 📞 SOPORTE GITHUB

- Documentación: https://docs.github.com/es
- Problemas: https://github.com/support
- Tokens: https://github.com/settings/tokens

---

**¡LISTO PARA SUBIR!** 🎉

Ejecuta estos comandos en PowerShell:

```powershell
cd C:\ERP-V3
git init
git add .
git commit -m "Initial commit: ERP V3.0"
git remote add origin https://github.com/Danielfernandez1990/ERP-ProyectManager3_03.git
git branch -M main
git push -u origin main
```

Listo! ✨

