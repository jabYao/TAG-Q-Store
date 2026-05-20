# TAG-Q — Catálogo de Skills

## 1. ¿Qué es una Skill?

Una **skill** es un conjunto de reglas y patrones documentados que guían al agente al implementar funcionalidades repetibles con impacto visual, técnico o funcional.

### Propósito
- Evitar inconsistencias en implementaciones repetidas
- Garantizar que el agente siga patrones probados
- Reducir la carga cognitiva en cada implementación
- Permitir que el conocimiento se acumule y mejore con el tiempo

---

## 2. Regla Práctica para Crear Skills

**Cada vez que aparezca un patrón repetible con impacto visual, técnico o funcional, se crea una skill.**

### Señales para crear una skill
- [ ] Implementás el mismo tipo de componente 2+ veces
- [ ] La lógica de negocio se repite en diferentes módulos
- [ ] Hay decisiones de diseño que no deberían debatirse cada vez
- [ ] Querés garantizar consistencia en una funcionalidad crítica

---

## 3. Skills Iniciales de TAG-Q

### 3.1 `skillsCreator`

**Cuándo usar**: Al crear cualquier componente reutilizable o lógica de negocio clave.

**Propósito**: Genera nuevas skills y documenta en `.agent/skills/`.

**Entradas**:
- Nombre del componente/funcionalidad
- Descripción del problema que resuelve
- Restricciones específicas

**Salidas**:
- Archivo de skill en `.agent/skills/{nombre-skill}.md`
- Referencia agregada en este documento

**Restricciones**:
- No crear skills para componentes de un solo uso
- Validar que la funcionalidad es realmente repetible

---

### 3.2 `skillsTarjetaUI-frontend`

**Cuándo usar**: En listados de productos, destacados, relacionados, búsquedas.

**Propósito**: Renderizar tarjeta de producto consistente en el frontend.

**Entradas**:
- Producto (id, nombre, slug, precio, precioOferta, imagen, categoria)
- Badge de envío gratis (booleano)
- Mostrar "Sin stock" (booleano)

**Salidas**:
- Card responsive con imagen, nombre, precio, CTA
- Badge de envío gratis si aplica (>= $400.000 COP)
- Estado de stock visible

**Restricciones**:
- Imagen con aspect ratio consistente
- Precio en formato COP ($ 123.456)
- CTA deshabilitado si sin stock
- Mobile-first, grid responsive

**Criterios de calidad**:
- LCP optimizado (lazy loading en imágenes below fold)
- CLS < 0.1 (reservar espacio para imagen)
- Accesible (aria-labels, focus states)

---

### 3.3 `skillsAuthSanctum`

**Cuándo usar**: En todos los flujos de autenticación (login, registro, refresh, logout).

**Propósito**: Implementar autenticación con Laravel Sanctum.

**Entradas**:
- Credentials (email, password)
- Endpoint de API
- Redirect después de login

**Salidas**:
- Token almacenado en cookie/httpOnly
- Usuario en estado global (Zustand)
- Redirect a página protegida

**Restricciones**:
- Token httpOnly, secure en producción
- Refresh automático antes de expiración
- Manejo de errores 401 (redirigir a login)

**Criterios de calidad**:
- No exponer token en localStorage
- Interceptor Axios para adjuntar token
- Estado de "autenticando" durante requests

---

### 3.4 `skillsWompiWebhook`

**Cuándo usar**: Al recibir y procesar webhooks de Wompi.

**Propósito**: Validar y procesar notificaciones de pago.

**Entradas**:
- Payload de Wompi
- Signature/secret key
- Orden ID

**Salidas**:
- Estado de pago actualizado
- Evento de pago procesado
- Registro en tabla `payment_webhooks`

**Restricciones**:
- Validar firma de Wompi
- Idempotencia (no procesar mismo webhook 2 veces)
- Log de todos los webhooks recibidos

**Criterios de calidad**:
- Response 200 rápido (no bloquear)
- Cola para procesamiento asíncrono
- Reintentos configurados

---

### 3.5 `skillsCheckoutFlow`

**Cuándo usar**: En todo el flujo de checkout (carrito → confirmación).

**Propósito**: Gestionar proceso de compra con reglas de negocio.

**Entradas**:
- Items del carrito
- Dirección de envío
- Método de pago seleccionado

**Salidas**:
- Orden creada
- Cálculo de envío
- Redirección a Wompi o confirmación contraentrega

**Restricciones**:
- Envío gratis si subtotal >= $400.000 COP
- Contraentrega siempre disponible
- Validar stock antes de crear orden

**Criterios de calidad**:
- Máximo 4 pasos
- Progreso visible
- Resumen de costos siempre visible

---

### 3.6 `skillsAdminTable`

**Cuándo usar**: En listados de admin (productos, pedidos, clientes, cupones).

**Propósito**: Renderizar tablas de administración consistentes.

**Entradas**:
- Columns configuration
- Data source (API endpoint)
- Filters disponibles
- Acciones por fila

**Salidas**:
- Tabla con paginación
- Filtros laterales/superiores
- Buscador
- Acciones (editar, eliminar, toggle)

**Restricciones**:
- Loading state (skeleton o spinner)
- Empty state con mensaje útil
- Error state con reintento

**Criterios de calidad**:
- Paginación server-side
- Filtros con debounce
- Keyboard navigation

---

### 3.7 `skillsProductGallery`

**Cuándo usar**: En detalle de producto y gestión de imágenes en admin.

**Propósito**: Mostrar galería de imágenes con zoom y reordenamiento.

**Entradas**:
- Imágenes (array de URLs)
- Modo (viewer/admin)

**Salidas**:
- Imagen principal + thumbnails
- Zoom on hover/click
- Reordenamiento (admin mode)

**Restricciones**:
- Lazy loading
- Aspect ratio consistente
- Upload con preview (admin)

**Criterios de calidad**:
- Imágenes optimizadas por Cloudinary
- Navegación con teclado
- Touch-friendly en mobile

---

### 3.8 `skillsSEOFrontend`

**Cuándo usar**: En todas las páginas públicas.

**Propósito**: Implementar SEO técnico consistente.

**Entradas**:
- Página/ruta
- Datos dinámicos (producto, categoría)

**Salidas**:
- Meta tags (title, description, OG, Twitter)
- Sitemap XML actualizado
- Schema.org markup

**Restricciones**:
- Title < 60 caracteres
- Description 150-160 caracteres
- OG image 1200x630px

**Criterios de calidad**:
- Lighthouse SEO score > 90
- URLs limpias y descriptivas
- Canonical tags

---

## 4. Estructura de una Skill

Cada skill debe seguir este formato:

```markdown
# {Nombre de la Skill}

## Cuándo usar
[Descripción de los casos de uso]

## Propósito
[Qué problema resuelve]

## Entradas
[Datos/parámetros requeridos]

## Salidas
[Resultado esperado]

## Restricciones
[Reglas que deben seguirse]

## Criterios de calidad
[Métricas o validaciones para considerar la skill completada]
```

---

## 5. Proceso para Crear Nueva Skill

1. **Identificar patrón repetible** → ¿Se va a usar 2+ veces?
2. **Documentar en `.agent/skills/{nombre}.md`** → Usar formato estándar
3. **Agregar referencia en este documento** → Índice de skills
4. **Registrar en Emgram** → Decisión de nueva skill aprobada
5. **Usar en implementación** → Invocar skill antes de codificar

---

## 6. Skills Futuras (Backlog)

Estas skills se crearán cuando corresponda:

- [ ] `skillsHeroBanner` - Hero configurable del home
- [ ] `skillsFilterSidebar` - Filtros laterales de catálogo
- [ ] `skillsSearchBar` - Búsqueda con sugerencias
- [ ] `skillsOrderTimeline` - Timeline de estados de pedido
- [ ] `skillsDashboardKPI` - Cards de KPIs en dashboard admin
- [ ] `skillsImageUpload` - Upload con preview y crop
- [ ] `skillsNotificationToast` - Toasts de notificaciones
- [ ] `skillsEmptyState` - Estados vacíos consistentes
- [ ] `skillsLoadingSkeleton` - Skeletons de carga
- [ ] `skillsErrorBoundary` - Manejo de errores en frontend

---

## 7. Referencias

- Documento maestro: `/docs/00-documento-maestro.md`
- Sitemap: `/docs/01-sitemap.md`
- Diseño: `/docs/04-design-system.md` (pendiente)

---

**Versión**: 1.0
**Última actualización**: 2026-05-13
**Estado**: Fase 0 - Completado
