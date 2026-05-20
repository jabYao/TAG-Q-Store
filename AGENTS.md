# .AGENT.md - Director de Proyecto TAG-Q (Monorepo)

## Perfil del Proyecto

- **Nombre:** TAG-Q (E-commerce de Relojería Colombia)
- **Stack:** Laravel 11 (Backend) + React 18 + TypeScript 5 (Frontend)
- **Repositorio:** Un solo repositorio. Ramas para desarrollo, merge a main con verificación de CI/CD.
- **Contexto de Decisión:** Emgram (gentle.ai) para persistencia de lógica de negocio y arquitectura.
- **Paleta:** Primario `#0B2977`, Dorado `#D4AF37`, Neutros (blanco, negro carbón, grises fríos)

---

## Reglas de Oro para el Agente

### 1. Principios No Negociables

1. La tienda debe sentirse **rápida** desde el primer prototipo
2. No se construyen vistas sin su **wireframe previo**
3. No se construyen mockups sin aceptar la **arquitectura de la vista**
4. No se implementa lógica de pago sin **webhook, eventos y trazabilidad**
5. Toda decisión importante se registra en **Emgram**
6. Toda funcionalidad repetible debe tener su **skill dedicada**
7. El panel admin debe controlar contenido visual **sin depender del frontend**
8. El agente no improvisa nombres de rutas, entidades o permisos: usa **este documento maestro**

### 2. Reglas Operativas

- **Atómica:** Piensa en pequeño. Crea componentes reutilizables y funciones atómicas.
- **Skills:** Si creas un componente reutilizable o lógica de negocio clave, invoca a `skillsCreator` y referencia la skill aquí. No crear componentes duplicados si existe una skill aplicable. Antes de iniciar una tarea, identificar si requiere una skill existente o una nueva skill.
- **Emgram:** Cada decisión importante (estructura de BD, flujo de Wompi, reglas de checkout) debe ser registrada en Emgram con `mem_save`.
- **Tipado:** TypeScript estricto en frontend, Laravel Resources en backend.
- **Wompi:** Usar API de transacciones para redirección (NO widget embebido). Llaves de Sandbox disponibles.
- **KPIs:** Definir KPIs para imágenes (banners y productos) en el flujo de admin.
- **Orden:** No implementar sin seguir el orden de fases (ver sección Fases).
- **Consistencia:** Mantener coherencia entre backend, frontend, APIs y mocks.
- **Calidad:** No omitir tests en flujos críticos (checkout, pagos, autenticación). Priorizar rendimiento, accesibilidad y claridad visual.

---

## Fases del Proyecto

### Fase 0 — Definición y base documental ✅
- [x] Documento maestro del proyecto
- [x] Arquitectura de información / sitemap
- [x] Lista inicial de rutas
- [x] Lista de entidades del sistema
- [x] Matriz de roles y permisos
- [x] Lista inicial de skills
- [x] Reglas del agente (este archivo)
- [x] Lista de decisiones que deben registrarse en Emgram

### Fase 1 — UX, wireframes y mockups ⏳

**Vistas que requieren wireframe + mockup:**

**Público (12)**
- [ ] Home (`/`)
- [ ] Landing de colección/campaña (`/landing/{slug}`)
- [ ] Catálogo (`/catalogo`)
- [ ] Categoría (`/categoria/{slug}`)
- [ ] Búsqueda (`/busqueda`)
- [ ] Detalle de producto (`/producto/{slug}`)
- [ ] Carrito (`/carrito`)
- [ ] Checkout (resumen, envío, pago, confirmación)
- [ ] Resultado de pago (`/pago/resultado`)
- [ ] Confirmación de pedido (`/pedido/confirmacion/{id}`)
- [ ] Políticas legales (`/politicas`)
- [ ] Contacto (`/contacto`)

**Usuario autenticado (7)**
- [ ] Login (`/login`)
- [ ] Registro (`/registro`)
- [ ] Recuperación de contraseña (`/recuperacion`)
- [ ] Perfil (`/perfil`)
- [ ] Mis pedidos (`/mis-pedidos`)
- [ ] Detalle de pedido (`/mis-pedidos/{id}`)
- [ ] Direcciones (`/direcciones`)

**Admin (11)**
- [ ] Dashboard (`/admin`)
- [ ] Lista de productos (`/admin/productos`)
- [ ] Crear/editar producto (`/admin/productos/nuevo`, `/admin/productos/{id}/editar`)
- [ ] Categorías (`/admin/categorias`)
- [ ] Gestión de imágenes y banners (`/admin/imagenes`)
- [ ] Pedidos (`/admin/pedidos`)
- [ ] Detalle de pedido (`/admin/pedidos/{id}`)
- [ ] Clientes (`/admin/clientes`)
- [ ] Roles y permisos (`/admin/roles`)
- [ ] Configuración de tienda (`/admin/configuracion`)
- [ ] Logs y monitoreo (`/admin/logs`)

**Entregables por vista:**
- [ ] Wireframe (estructura, layout, jerarquía)
- [ ] Mockup (diseño final con colores, tipografías, imágenes)
- [ ] Estados vacío, de carga y de error
- [ ] Versión mobile (< 768px) y desktop (> 1024px) para vistas críticas

### Fase 2 — Arquitectura técnica y base del proyecto ✅

**Backend**
- [x] Inicializar Laravel 11, configurar MySQL 8.0, Redis, colas
- [x] Instalar Sanctum, Spatie Permissions, Cloudinary, Resend, Telescope, Sentry
- [x] Estructura de rutas por grupos (API público, auth, admin, webhooks)
- [x] Base de Laravel Resources y contratos de respuesta API (UserResource, ProductResource, CategoryResource, OrderResource)

**Frontend**
- [x] Inicializar React 18 + TypeScript 5
- [x] Configurar Tailwind, shadcn/ui + Radix, Router v6
- [x] Configurar Zustand, TanStack Query, Axios con interceptores Sanctum
- [x] Configurar React Hook Form + Zod, Vitest + Testing Library + Playwright
- [x] Playwright configurado con test E2E de humo (home, catálogo, navegación)

**Infraestructura
- [x] Variables de entorno (.env.example actualizado en backend y frontend)
- [x] CI/CD (GitHub Actions) — pipeline con PHPUnit + Pest + npm build + Vitest + Playwright
- [x] shadcn/ui + Radix (disponible si se requiere, componentes existentes con Tailwind)
- [x] Redis configurado en .env (sin servidor en Windows — usa sync/file para dev)

> ⚠️ Los mockups pertenecen a Fase 1. No se avanza a Fase 2 sin tener los wireframes y mockups aprobados de todas las vistas.

### Fase 3 — Design system y componentes base ⏳
- [ ] Tokens de color, tipografías, espaciados
- [ ] Componentes base (botones, inputs, cards, badges, modales, skeletons, toasts)
- [ ] Componentes de pricing y promociones
- [ ] Layout base (header, footer, sidebar admin)
- [ ] Grid de producto

> Al trabajar la tarjeta de producto, activar la skill `skillsTarjetaUI-frontend` antes de proponer cambios.

### Fase 4 — Autenticación, roles y seguridad ✅
- [x] Login/logout, registro, recuperación de contraseña
- [x] Middleware por rol (admin + operador)
- [x] Rutas protegidas (PrivateRoute, GuestRoute, AdminRoute)
- [x] Seeds de roles, permisos y usuarios
- [x] Tests de integración (19 tests)

### Fase 5 — Catálogo, producto e imágenes ⏳
- [ ] Entidades: Producto, Categoría, Imagen, Brand, Attribute, Inventory
- [ ] Vistas: Home, Catálogo, Categoría, Detalle producto
- [ ] Gestión de imágenes desde admin (Cloudinary)

### Fase 6 — Carrito, checkout y reglas comerciales ⏳
- [ ] Carrito persistente
- [ ] Cálculo de subtotal, envío, total
- [ ] Envío gratis desde $400.000 COP
- [ ] Checkout simple
- [ ] Redirección a Wompi (NO widget)

### Fase 7 — Webhooks, pagos y automatización ⏳
- [ ] Webhook Wompi con validación de firma
- [ ] Laravel Events para estados de pago
- [ ] Estados de orden y reintentos
- [ ] Registro de fallos

### Fase 8 — Panel administrador ⏳
- [ ] Dashboard con KPIs
- [ ] Módulos: Productos, Categorías, Imágenes, Pedidos, Clientes, Pagos, Envíos, Cupones, Roles, Configuración, Logs

### Fase 9 — Observabilidad, calidad y hardening ⏳
- [ ] Logs (Telescope dev, Sentry prod)
- [ ] Tests unitarios, integración, e2e
- [ ] Optimización de queries y cache
- [ ] Code splitting, lazy loading

### Fase 10 — SEO, performance y lanzamiento ⏳
- [ ] Sitemap real, metadatos, Open Graph
- [ ] Optimización de imágenes y Core Web Vitals
- [ ] Pruebas finales de compra y contraentrega

---

## Skills Registradas

| Skill | Descripción | Cuándo usar |
|-------|-------------|-------------|
| [`skillsCreator`](docs/07-skills.md#31-skillscreator) | Genera nuevas skills y documenta en `.agent/skills/` | Al crear componentes reutilizables o lógica clave |
| [`skillsTarjetaUI-frontend`](docs/07-skills.md#32-skillstarjetaui-frontend) | Tarjeta de producto UI | Listados de productos, destacados, relacionados |
| [`skillsAuthSanctum`](docs/07-skills.md#33-skillsauthsanctum) | Autenticación con Laravel Sanctum | Login, registro, refresh token |
| [`skillsWompiWebhook`](docs/07-skills.md#34-skillswompiwebhook) | Integración Wompi webhooks | Recepción y validación de pagos |
| [`skillsCheckoutFlow`](docs/07-skills.md#35-skillscheckoutflow) | Flujo de checkout | Carrito, cálculo, redirección a Wompi |
| [`skillsAdminTable`](docs/07-skills.md#36-skillsadmintable) | Tablas de admin | Listados de productos, pedidos, clientes |
| [`skillsProductGallery`](docs/07-skills.md#37-skillsproductgallery) | Galería de imágenes | Detalle de producto, admin de imágenes |
| [`skillsSEOFrontend`](docs/07-skills.md#38-skillsseofrontend) | SEO frontend | Metadatos, Open Graph, sitemap |

**Documentación completa:** [`docs/07-skills.md`](docs/07-skills.md)

---

## Índice de Documentación

| Documento | Ruta | Estado | Notas |
|-----------|------|--------|-------|
| Documento Maestro | `/docs/00-documento-maestro.md` | ✅ Completado | Versión 2.0 |
| Sitemap / Arquitectura | `/docs/01-sitemap.md` | ✅ Completado | ~45 rutas detalladas |
| Matriz de Roles | `/docs/02-roles-permisos.md` | ✅ Incluido en doc maestro | Sección 8 del documento maestro |
| Entidades y Relaciones | `/docs/03-entidades.md` | ✅ Incluido en doc maestro | Sección 7 del documento maestro |
| Design System | `/docs/04-design-system.md` | ⏳ Pendiente (Fase 3) | — |
| Wireframes | `/docs/05-wireframes.md` | ✅ Completado | Home y Catálogo (avance) |
| Mockups | `/docs/06-mockups.md` | ⏳ Pendiente (Fase 1) | — |
| Skills | `/docs/07-skills.md` | ✅ Completado | 8 skills registradas |
| KPIs | `/docs/08-kpis.md` | ✅ Incluido en doc maestro | Sección 5 del documento maestro |
| Reglas de Checkout | `/docs/09-checkout-reglas.md` | ⏳ Pendiente (Fase 6) | — |
| Integración Wompi | `/docs/10-wompi-integracion.md` | ⏳ Pendiente (Fase 7) | — |
| Imágenes y Cloudinary | `/docs/11-cloudinary.md` | ⏳ Pendiente (Fase 5) | — |
| Testing y Calidad | `/docs/12-testing.md` | ⏳ Pendiente (Fase 9) | — |
| Deploy y CI/CD | `/docs/13-deploy.md` | ⏳ Pendiente (Fase 9) | — |

---

## Decisiones que deben registrarse en Emgram

Las siguientes decisiones **DEBEN** guardarse con `mem_save`:

- [x] Elección de tecnologías (guardada 2026-05-19)
- [x] Cambios de arquitectura (guardada 2026-05-19)
- [x] Decisiones de UX críticas (guardada 2026-05-19)
- [x] Reglas de pago y checkout (guardada 2026-05-19)
- [x] Estructura de roles y permisos (guardada 2026-05-19)
- [x] Cambio de paleta o identidad visual (guardada 2026-05-19)
- [x] Nuevas skills aprobadas (guardada 2026-05-19)
- [x] Decisiones sobre sitemap o navegación (guardada 2026-05-19)
- [x] Reglas de negocio sobre envío, contraentrega o promociones (guardada 2026-05-19)
- [x] Configuración de CI/CD (guardada 2026-05-19)
- [x] Estructura de base de datos (guardada 2026-05-19)
- [x] Flujos de webhook y eventos (guardada 2026-05-19)

### Formato de registro Emgram

```
**What**: [descripción de la decisión]
**Why**: [razón o problema que motivó la decisión]
**Where**: [archivos o módulos afectados]
**Learned**: [gotchas, edge cases, alternativas descartadas]
```

---

## Reglas de Comportamiento del Agente

### Referencias obligatorias (consultar antes de actuar)

El agente DEBE conocer y consultar los siguientes documentos antes de proponer cambios:
1. Documento maestro del proyecto (`docs/00-documento-maestro.md`)
2. Sitemap / arquitectura de navegación (`docs/01-sitemap.md`)
3. Wireframes por vista (`docs/05-wireframes.md`)
4. Mockups por vista (`docs/06-mockups.md`)
5. Lista de entidades del sistema (sección 7 del doc maestro)
6. Matriz de roles y permisos (sección 8 del doc maestro)
7. Catálogo de skills (`docs/07-skills.md`)
8. Registro de decisiones en Emgram (sección Decisiones de este archivo)
9. Plan de fases (sección Fases de este archivo)

### Antes de implementar

1. **Verificar fase actual** → ¿Qué fase estamos ejecutando?
2. **Consultar documentación** → ¿Existe wireframe/mockup para esta vista?
3. **Buscar skills aplicables** → ¿Hay una skill para este patrón?
4. **Buscar en Emgram** → ¿Hay decisiones previas sobre este tema?

### Durante implementación

1. **Seguir estándares** → TypeScript estricto, Laravel Resources, atomicidad
2. **Invocar skills** → Activar skill antes de implementar patrón conocido
3. **Registrar decisiones** → `mem_save` para decisiones no triviales
4. **Validar con principios** → ¿Cumple los 8 principios no negociables?

### Después de implementar

1. **Guardar en Emgram** → Bug fixes, patrones establecidos, gotchas
2. **Actualizar documentación** → Si algo cambió, actualizar docs
3. **Verificar tests** → ¿Hay tests para esta funcionalidad?
4. **Preparar siguiente paso** → ¿Qué sigue según las fases?

---

## Contacto y Soporte

Si el agente encuentra una duda de negocio o arquitectura que no está documentada:

1. **Detenerse** → No improvisar
2. **Documentar el riesgo** → ¿Qué no está claro?
3. **Preguntar al usuario** → Esperar respuesta antes de continuar
4. **Registrar en Emgram** → Una vez resuelto, guardar la decisión

---

**Versión**: 3.0
**Última actualización**: 2026-05-19
**Estado**: Fase 0 - Completado ✅
**Próxima fase**: Fase 1 — UX, wireframes y mockups

> 📄 **Documento de control personal del usuario:** `tag_q_plan_por_fases_y_agent.md` contiene una visión general del plan para seguimiento personal.
