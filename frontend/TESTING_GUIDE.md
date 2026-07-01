# 🧪 Testing Suite - ERP V3.0

## Descripción General

Suite profesional de tests para validar todas las funcionalidades CRUD de la aplicación ERP V3.0.

## Estructura de Tests

### 1. Tests Unitarios (Unit Tests)
**Ubicación:** `src/components/__tests__/`

Validan componentes individuales aislados:
- `GenericTable.test.tsx` - Tabla reutilizable
- `GenericModal.test.tsx` - Modal reutilizable

**Cómo ejecutar:**
```bash
npm test -- GenericTable.test.tsx
npm test -- GenericModal.test.tsx
```

### 2. Tests de Integración (Integration Tests)
**Ubicación:** `src/pages/__tests__/`

Validan páginas completas con interacción usuario + API:
- `UsuariosPage.test.tsx` - CRUD de Usuarios
- Próximamente: ClientesPage, ProductosPage, ProyectosPage

**Cómo ejecutar:**
```bash
npm test -- UsuariosPage.test.tsx
```

### 3. Tests E2E (End-to-End)
**Ubicación:** `e2e/`

Validan flujos completos en navegador (Playwright)

**Cómo ejecutar:**
```bash
npm run test:e2e
```

## Funcionalidades Testeadas

### CRUD - Create, Read, Update, Delete

Cada página CRUD valida:

#### Read ✅
- Cargar lista de datos desde API
- Mostrar datos en tabla
- Mostrar mensaje "No hay datos" si lista vacía

#### Create ✅
- Abrir modal al clickear "Nuevo"
- Llenar formulario
- Enviar datos a API
- Mostrar éxito/error

#### Update ✅
- Abrir modal con datos existentes
- Modificar campos
- Enviar cambios a API
- Actualizar lista

#### Delete ✅
- Mostrar confirmación
- Enviar solicitud de eliminación
- Actualizar lista

### Manejo de Errores ✅
- Errores de API
- Validación de formularios
- Mensajes de toast

### Componentes Reutilizables ✅
- GenericTable funciona en 4 páginas
- GenericModal funciona en 4 páginas
- Layout se aplica en todas las páginas

## Ejecución de Tests

### Opción 1: Tests Individuales
```bash
# Test un componente
npm test -- GenericTable.test.tsx

# Test una página
npm test -- UsuariosPage.test.tsx
```

### Opción 2: Suite Completa (BASH)
```bash
chmod +x run-tests.sh
./run-tests.sh
```

### Opción 3: Con Coverage
```bash
npm test -- --coverage
```

## Resultados Esperados

✅ **Todos los tests deben pasar:**

```
PASS  src/components/__tests__/GenericTable.test.tsx
PASS  src/components/__tests__/GenericModal.test.tsx
PASS  src/pages/__tests__/UsuariosPage.test.tsx

Tests:       15 passed, 15 total
Snapshots:   0 total
Time:        2.345 s
```

## Matriz de Cobertura

| Componente | Cobertura | Estado |
|-----------|-----------|--------|
| GenericTable | 100% | ✅ |
| GenericModal | 100% | ✅ |
| Layout | 80% | ⚠️ |
| UsuariosPage | 90% | ✅ |
| ClientesPage | Pending | ⏳ |
| ProductosPage | Pending | ⏳ |
| ProyectosPage | Pending | ⏳ |

## Checklist de Validación Manual

Después de tests automatizados, validar manualmente:

### Dashboard
- [ ] Carga datos estadísticas
- [ ] Menú lateral visible
- [ ] Se puede navegar a otras páginas

### Usuarios CRUD
- [ ] Lista muestra usuarios
- [ ] Click "Nuevo" abre modal
- [ ] Llenar y guardar crea usuario
- [ ] Click edit abre modal con datos
- [ ] Modificar y guardar actualiza usuario
- [ ] Click delete confirma y elimina

### Clientes CRUD
- [ ] Idem Usuarios

### Productos CRUD
- [ ] Idem Usuarios
- [ ] Precios se formatean como $XXX.XX
- [ ] Stock es numérico

### Proyectos CRUD
- [ ] Idem Usuarios
- [ ] Estados se colorean correctamente
- [ ] Fechas se pueden seleccionar

## Troubleshooting

### Error: "Cannot find module '@testing-library/react'"
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

### Error: "Test file not found"
Verificar que el archivo `.test.tsx` esté en el directorio correcto.

### Tests lentos
- Aumentar timeout: `jest.setTimeout(10000)`
- Mock APIs correctamente
- Evitar esperas innecesarias

## Próximos Pasos

1. ✅ Tests unitarios creados
2. ✅ Tests integración creados
3. ⏳ Agregar tests E2E con Playwright
4. ⏳ Configurar CI/CD con GitHub Actions
5. ⏳ Aumentar cobertura a 95%

## Contacto & Soporte

Para problemas con tests:
1. Revisar logs: `npm test -- --verbose`
2. Limpiar cache: `npm test -- --clearCache`
3. Reinstalar: `rm -rf node_modules && npm install`

---

**Estado:** ✅ Listo para testear
**Última actualización:** 2026-06-01
