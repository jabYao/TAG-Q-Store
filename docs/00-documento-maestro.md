# TAG-Q — Documento Maestro del Proyecto

## 1. Visión del Proyecto

**TAG-Q** es un e-commerce de relojería de lujo en Colombia, diseñado con foco en:

- Rendimiento y velocidad de carga
- Experiencia móvil primero
- Estética juvenil, limpia y premium
- Operación escalable sin reescribir la base

### Propuesta de valor
- Pago online con redirección a Wompi (sin widget embebido)
- Contraentrega habilitada
- Envío gratis desde $400.000 COP
- Gestión de contenido visual desde panel administrador
- Arquitectura preparada para escalar

---

## 2. Stack Tecnológico

### Backend (Laravel)

| Área | Tecnología |
|------|------------|
| Framework | Laravel 11 |
| Autenticación | Laravel Sanctum |
| API Layer | Laravel Resources + Route Groups |
| Base de datos | MySQL 8.0 |
| Colas | Laravel Queues + Redis |
| Caché | Redis |
| Storage | Cloudinary |
| Email | Resend |
| Pagos | Wompi (API transacciones + webhooks) |
| Roles/ACL | Spatie Laravel Permissions |
| Testing | Pest PHP |
| Logs (dev) | Laravel Telescope |
| Logs (prod) | Sentry |
| Docs API | Scramble |
| Deploy | Railway + GitHub Actions |

### Frontend (React + TypeScript)

| Área | Tecnología |
|------|------------|
| Framework | React 18 + TypeScript 5 |
| Routing | React Router v6 |
| Estado global | Zustand |
| Fetching | TanStack Query |
| Estilos | Tailwind CSS |
| Formularios | React Hook Form + Zod |
| HTTP Client | Axios (interceptores para Sanctum) |
| Componentes UI | shadcn/ui + Radix |
| Testing | Vitest + Testing Library + Playwright |
| Deploy | Vercel |

---

## 3. Principios No Negociables

1. La tienda debe sentirse **rápida** desde el primer prototipo
2. No se construyen vistas sin su **wireframe previo**
3. No se construyen mockups sin aceptar la **arquitectura de la vista**
4. No se implementa lógica de pago sin **webhook, eventos y trazabilidad**
5. Toda decisión importante se registra en **Emgram**
6. Toda funcionalidad repetible debe tener su **skill dedicada**
7. El panel admin debe controlar contenido visual **sin depender del frontend**
8. El agente no improvisa nombres de rutas, entidades o permisos: usa **este documento maestro**

---

## 4. Paleta Visual

### Colores

| Rol | Color | Uso |
|-----|-------|-----|
| Primario | `#0B2977` | Azul corporativo, CTAs principales |
| Dorado | `#D4AF37` | Acentos premium, badges, estados |
| Blanco | `#FFFFFF` | Fondos principales |
| Negro carbón | `#1A1A1A` | Texto principal |
| Grises fríos | `#F5F5F5`, `#E0E0E0`, `#9E9E9E` | Fondos secundarios, bordes |

### Dirección estética
- Juvenil, vibrante y moderna
- Contrastes claros entre fondo y acentos
- Uso moderado del dorado (no saturar)
- Marca premium pero no rígida
- Botones, badges y estados importantes con jerarquía visual clara

### Reglas visuales
- Fondo mayormente claro o con secciones muy bien delimitadas
- CTA principal en azul (#0B2977)
- Acentos premium en dorado (#D4AF37)
- Tipografía limpia, fuerte y legible
- Espaciado generoso en mobile

---

## 5. KPIs del Proyecto

### KPIs de Negocio
- Tasa de conversión de visita a compra
- Tasa de abandono de checkout
- Ticket promedio
- % pedidos con envío gratis aplicado
- % ventas contraentrega vs online
- Tasa de recompra

### KPIs de Rendimiento
- LCP < 2.5s en home, categoría y detalle producto
- INP < 200ms en navegación y checkout
- CLS < 0.1
- Peso de imágenes optimizado por Cloudinary
- TTFB < 600ms en páginas críticas

### KPIs de Operación
- Tasa de pago exitoso en Wompi > 95%
- Tasa de webhook procesado sin error > 99%
- Tiempo medio de respuesta del admin al subir contenido
- Tiempo medio de publicación de producto
- Errores frontend/backend por release

### KPIs de Experiencia
- Búsqueda usable (tiempo a primer resultado < 2s)
- Filtros rápidos (< 3 clics para refinar)
- Checkout con pocos pasos (máximo 4 pasos)
- Ficha de producto clara
- Confianza: métodos de pago, envío y políticas visibles

---

## 6. Arquitectura de Navegación

### 6.1 Sitio Público

| Ruta | Método | Descripción |
|------|--------|-------------|
| `/` | GET | Home con hero y destacados |
| `/landing/{slug}` | GET | Landing de colección/campaña |
| `/catalogo` | GET | Catálogo completo |
| `/categoria/{slug}` | GET | Productos por categoría |
| `/busqueda` | GET | Resultados de búsqueda |
| `/producto/{slug}` | GET | Detalle de producto |
| `/carrito` | GET | Carrito de compras |
| `/checkout` | GET/POST | Checkout |
| `/pago/resultado` | GET | Resultado de pago Wompi |
| `/pedido/confirmacion/{id}` | GET | Confirmación de pedido |
| `/politicas` | GET | Políticas legales |
| `/contacto` | GET | Formulario de contacto |

### 6.2 Cuenta de Usuario

| Ruta | Método | Descripción | Protegida |
|------|--------|-------------|-----------|
| `/login` | GET/POST | Login | No |
| `/registro` | GET/POST | Registro | No |
| `/recuperacion` | GET/POST | Recuperación contraseña | No |
| `/perfil` | GET/PUT | Perfil de usuario | Sí |
| `/mis-pedidos` | GET | Lista de pedidos | Sí |
| `/pedido/{id}` | GET | Detalle de pedido | Sí |
| `/direcciones` | GET/POST/PUT/DELETE | Gestión de direcciones | Sí |
| `/preferencias` | GET/PUT | Preferencias de usuario | Sí |

### 6.3 Panel Administrador

| Ruta | Método | Descripción | Rol |
|------|--------|-------------|-----|
| `/admin` | GET | Dashboard | Admin, Operador |
| `/admin/productos` | GET/POST/PUT/DELETE | Gestión de productos | Admin, Operador |
| `/admin/productos/{id}/editar` | GET/PUT | Editar producto | Admin, Operador |
| `/admin/categorias` | GET/POST/PUT/DELETE | Gestión de categorías | Admin |
| `/admin/imagenes` | GET/POST/DELETE | Gestión de imágenes/banners | Admin |
| `/admin/pedidos` | GET | Lista de pedidos | Admin, Operador |
| `/admin/pedidos/{id}` | GET/PUT | Detalle y actualización de pedido | Admin, Operador |
| `/admin/clientes` | GET | Lista de clientes | Admin, Operador |
| `/admin/pagos` | GET | Registro de pagos | Admin |
| `/admin/envios` | GET/PUT | Gestión de envíos | Admin, Operador |
| `/admin/cupones` | GET/POST/PUT/DELETE | Cupones/promociones | Admin |
| `/admin/roles` | GET/POST/PUT/DELETE | Roles y permisos | Admin |
| `/admin/configuracion` | GET/PUT | Configuración de tienda | Admin |
| `/admin/logs` | GET | Logs y monitoreo | Admin |

---

## 7. Entidades del Sistema

### 7.1 Entidades Principales

| Entidad | Descripción |
|---------|-------------|
| `User` | Usuarios del sistema (clientes, admin, operadores) |
| `Role` | Roles del sistema (Spatie) |
| `Permission` | Permisos del sistema (Spatie) |
| `Product` | Productos de la tienda |
| `Category` | Categorías de productos |
| `ProductImage` | Imágenes de productos (Cloudinary) |
| `Brand` | Marcas de relojes |
| `Attribute` | Atributos de productos (color, material, etc.) |
| `ProductAttribute` | Relación producto-atributo |
| `Inventory` | Inventario por producto/variación |
| `Cart` | Carrito de compras |
| `CartItem` | Items del carrito |
| `Order` | Pedidos |
| `OrderItem` | Items del pedido |
| `OrderStatus` | Estados del pedido |
| `Payment` | Pagos (Wompi) |
| `PaymentWebhook` | Registro de webhooks recibidos |
| `Shipping` | Envíos |
| `Address` | Direcciones de usuario |
| `Banner` | Banners promocionales |
| `Hero` | Hero del home |
| `Coupon` | Cupones de descuento |
| `Setting` | Configuraciones de tienda |

### 7.2 Estados de Pedido

```
PENDIENTE -> PAGADO -> EN_PREPARACION -> ENVIADO -> ENTREGADO
         -> RECHAZADO
         -> EXPIRADO
         -> CANCELADO

CONTRAENTREGA_PENDIENTE -> EN_PREPARACION -> ENVIADO -> ENTREGADO
```

---

## 8. Matriz de Roles y Permisos

### 8.1 Roles Base

| Rol | Descripción |
|-----|-------------|
| `admin` | Acceso total al sistema |
| `operador` | Gestión operativa (productos, pedidos, clientes) sin acceso a configuración crítica |
| `cliente` | Usuario registrado, puede comprar y ver sus pedidos |

### 8.2 Permisos por Rol

| Permiso | Admin | Operador | Cliente |
|---------|-------|----------|---------|
| Ver dashboard | ✅ | ✅ | ❌ |
| Crear/editar productos | ✅ | ✅ | ❌ |
| Eliminar productos | ✅ | ❌ | ❌ |
| Gestionar categorías | ✅ | ❌ | ❌ |
| Gestionar imágenes/banners | ✅ | ❌ | ❌ |
| Ver pedidos | ✅ | ✅ | ❌ |
| Actualizar estado de pedido | ✅ | ✅ | ❌ |
| Ver clientes | ✅ | ✅ | ❌ |
| Gestionar cupones | ✅ | ❌ | ❌ |
| Gestionar roles | ✅ | ❌ | ❌ |
| Configuración de tienda | ✅ | ❌ | ❌ |
| Ver logs | ✅ | ❌ | ❌ |
| Ver mis pedidos | ❌ | ❌ | ✅ |
| Gestionar direcciones | ❌ | ❌ | ✅ |
| Gestionar perfil | ❌ | ❌ | ✅ |

---

## 9. Skills Iniciales

| Skill | Descripción | Cuándo usar |
|-------|-------------|-------------|
| `skillsCreator` | Genera nuevas skills y documenta en `.agent/skills/` | Al crear componentes reutilizables o lógica clave |
| `skillsTarjetaUI-frontend` | Tarjeta de producto UI | Listados de productos, destacados, relacionados |
| `skillsAuthSanctum` | Autenticación con Sanctum | Login, registro, refresh token |
| `skillsWompiWebhook` | Integración Wompi webhooks | Recepción y validación de pagos |
| `skillsCheckoutFlow` | Flujo de checkout | Carrito, cálculo, redirección a Wompi |
| `skillsAdminTable` | Tablas de admin | Listados de productos, pedidos, clientes |
| `skillsProductGallery` | Galería de imágenes | Detalle de producto, admin de imágenes |
| `skillsSEOFrontend` | SEO frontend | Metadatos, Open Graph, sitemap |

---

## 10. Decisiones que deben registrarse en Emgram

Las siguientes decisiones **DEBEN** guardarse en Emgram con `mem_save`:

- [ ] Elección de tecnologías (ya registrado en este documento)
- [ ] Cambios de arquitectura
- [ ] Decisiones de UX críticas
- [ ] Reglas de pago y checkout
- [ ] Estructura de roles y permisos
- [ ] Cambio de paleta o identidad visual
- [ ] Nuevas skills aprobadas
- [ ] Decisiones sobre sitemap o navegación
- [ ] Reglas de negocio sobre envío, contraentrega o promociones
- [ ] Configuración de CI/CD
- [ ] Estructura de base de datos
- [ ] Flujos de webhook y eventos

### Formato de registro Emgram

```
**What**: [descripción de la decisión]
**Why**: [razón o problema que motivó la decisión]
**Where**: [archivos o módulos afectados]
**Learned**: [gotchas, edge cases, alternativas descartadas]
```

---

## 11. Referencias a Documentos

| Documento | Ruta | Estado | Notas |
|-----------|------|--------|-------|
| Documento Maestro | `/docs/00-documento-maestro.md` | ✅ | Este archivo |
| Sitemap / Arquitectura | `/docs/01-sitemap.md` | ✅ Completado | Contiene rutas públicas, de usuario, admin y API |
| Matriz de Roles | `/docs/02-roles-permisos.md` | ✅ Incluido en doc maestro | Contenido en sección 8 |
| Entidades y Relaciones | `/docs/03-entidades.md` | ✅ Incluido en doc maestro | Contenido en sección 7 |
| Design System | `/docs/04-design-system.md` | ⏳ Pendiente (Fase 3) | Solo paleta en sección 4, falta design system completo |
| Wireframes | `/docs/05-wireframes.md` | ✅ Completado | 30 vistas completas |
| Mockups | `/docs/06-mockups.md` | ⏳ Pendiente (Fase 1) | — |
| Skills | `/docs/07-skills.md` | ✅ Completado | 8 skills registradas |
| KPIs | `/docs/08-kpis.md` | ✅ Incluido en doc maestro | Contenido en sección 5 |
| Reglas de Checkout | `/docs/09-checkout-reglas.md` | ⏳ Pendiente (Fase 6) | — |
| Integración Wompi | `/docs/10-wompi-integracion.md` | ⏳ Pendiente (Fase 7) | — |
| Imágenes y Cloudinary | `/docs/11-cloudinary.md` | ⏳ Pendiente (Fase 5) | — |
| Testing y Calidad | `/docs/12-testing.md` | ⏳ Pendiente (Fase 9) | — |
| Deploy y CI/CD | `/docs/13-deploy.md` | ⏳ Pendiente (Fase 9) | — |

---

## 12. Siguientes Pasos (Fase 0)

Entregables de la Fase 0:

- [x] Documento maestro del proyecto
- [x] Arquitectura de información / sitemap detallado → `docs/01-sitemap.md`
- [x] Lista inicial de rutas (incluida en sitemap sección 6)
- [x] Lista de entidades (incluida en sección 7)
- [x] Matriz de roles y permisos (incluida en sección 8)
- [x] Lista inicial de skills → `docs/07-skills.md`
- [x] Reglas del agente → `AGENTS.md` (archivo existente)
- [x] Decisiones registradas en Emgram (12 decisiones guardadas el 2026-05-19)

---

**Versión**: 2.0
**Última actualización**: 2026-05-19
**Estado**: ✅ Fase 0 Completada
**Próxima fase**: Fase 1 — UX, wireframes y mockups
