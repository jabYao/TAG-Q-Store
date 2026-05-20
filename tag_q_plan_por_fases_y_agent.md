# TAG-Q — Plan por fases para construir la tienda desde cero

## 1) Visión del proyecto
TAG-Q será una tienda de relojes en Colombia, con foco en rendimiento, velocidad de carga, experiencia móvil y una estética juvenil, limpia y premium. El sistema tendrá:

- Pago online con redirección a Wompi (sin widget embebido)
- Contraentrega
- Envío gratis desde 400.000 COP
- Gestión de imágenes desde panel administrador (banners, hero, imágenes de producto)
- Vistas separadas para usuario y admin
- Arquitectura pensada para escalar sin reescribir la base

---

## 2) Stack acordado

### Backend
- Autenticación: Laravel Sanctum
- API Layer: Laravel Resources + Route Groups
- Base de datos: PostgreSQL
- Colas: Laravel Queues
- Caché: Redis
- Storage: Cloudinary
- Email: Resend
- Pagos: Wompi con webhooks + Laravel Events
- Roles/ACL: Spatie Laravel Permissions
- Testing: Pest
- Logs: Laravel Telescope en desarrollo, Sentry en producción
- Docs API: Scrambl
- Deploy: Railway + GitHub Actions para CI/CD

### Frontend
- UI Framework: React + TypeScript
- Routing: React Router v6 con rutas protegidas por rol
- Estado global: Zustand
- Fetching: TanStack Query
- Estilos: Tailwind CSS
- Formularios: React Hook Form + Zod
- HTTP Client: Axios con interceptores para adjuntar token Sanctum
- Componentes UI: shadcn/ui + Radix
- Testing FE: Vitest + Testing Library + Playwright
- Deploy FE: Vercel

---

## 3) Principios no negociables

1. La tienda debe sentirse rápida desde el primer prototipo.
2. No se construyen vistas sin su wireframe previo.
3. No se construyen mockups sin aceptar la arquitectura de la vista.
4. No se implementa lógica de pago sin webhook, eventos y trazabilidad.
5. Toda decisión importante se registra en Emgram.
6. Toda funcionalidad repetible debe tener su skill dedicada.
7. El panel admin debe controlar contenido visual sin depender del frontend.
8. El agente no improvisa nombres de rutas, entidades o permisos: usa el documento maestro.

---

## 4) Paleta visual base

### Colores
- Primario: `#0B2977`
- Dorado brillante: `#D4AF37` o una variante ligeramente más viva para acentos
- Neutros: blanco puro, negro carbón, grises fríos

### Dirección estética
- Juvenil, vibrante y moderna
- Contrastes claros entre fondo y acentos
- Uso moderado del dorado, no saturar toda la interfaz
- La marca debe sentirse premium, pero no rígida
- Botones, badges y estados importantes deben tener jerarquía visual clara

### Reglas visuales
- Fondo mayormente claro o con secciones muy bien delimitadas
- CTA principal en azul
- Acentos premium en dorado
- Tipografía limpia, fuerte y legible
- Espaciado generoso en mobile

---

## 5) KPIs del proyecto

### KPIs de negocio
- Tasa de conversión de visita a compra
- Tasa de abandono de checkout
- Ticket promedio
- Porcentaje de pedidos con envío gratis aplicado
- Porcentaje de ventas por contraentrega vs online
- Tasa de recompra

### KPIs de rendimiento
- LCP bajo en home, categoría y detalle producto
- INP estable y bajo en navegación y checkout
- CLS cercano a cero
- Peso de imágenes optimizado por Cloudinary
- TTFB aceptable en páginas críticas

### KPIs de operación
- Tasa de pago exitoso en Wompi
- Tasa de webhook procesado sin error
- Tiempo medio de respuesta del admin al subir contenido
- Tiempo medio de publicación de producto
- Errores frontend/backend por release

### KPIs de experiencia
- Búsqueda usable
- Filtros rápidos
- Checkout con pocos pasos
- Ficha de producto clara
- Confianza: métodos de pago, envío y políticas visibles

---

## 6) Arquitectura general de navegación

### Sitio público
- Home
- Catálogo
- Categorías
- Detalle de producto
- Carrito
- Checkout
- Confirmación de compra
- Seguimiento de pedido
- Políticas legales
- Contacto

### Cuenta de usuario
- Login
- Registro
- Recuperación de contraseña
- Perfil
- Mis pedidos
- Detalle de pedido
- Direcciones
- Preferencias

### Admin
- Dashboard
- Productos
- Categorías
- Inventario
- Pedidos
- Pagos
- Clientes
- Banners / hero / contenido visual
- Envíos
- Cupones o promociones si se habilitan
- Roles y permisos
- Logs y monitoreo
- Configuración de tienda

---

## 7) Orden de trabajo por fases

## Fase 0 — Definición y base documental
Objetivo: cerrar el marco de trabajo antes de escribir código.

### Entregables
- Documento maestro del proyecto
- Arquitectura de información / sitemap
- Lista inicial de rutas públicas, privadas y admin
- Lista de entidades del sistema
- Matriz de roles y permisos
- Lista de skills iniciales
- Reglas del agente en `.AGENT.md`
- Lista de decisiones que deben registrarse en Emgram

### Criterio de salida
Nada se implementa sin que esta fase esté aprobada.

---

## Fase 1 — UX, wireframes y mockups
Objetivo: definir todas las vistas antes del desarrollo.

### Alcance
Se crean primero los wireframes y luego los mockups de:
- Vistas públicas
- Vistas de usuario autenticado
- Vistas de admin

### Entregables
- Wireframe por vista
- Mockup por vista
- Estados vacíos
- Estados de carga
- Estados de error
- Versiones mobile y desktop de vistas críticas

### Regla importante
No se pasa a implementación hasta tener el mapa visual completo.

### Vistas que deben existir al menos en wireframe
#### Público
- Home
- Landing de colección o campaña
- Catálogo
- Categoría
- Búsqueda
- Detalle producto
- Carrito
- Checkout
- Resultado de pago
- Confirmación de pedido
- Página de políticas
- Contacto

#### Usuario
- Login
- Registro
- Recuperación
- Perfil
- Mis pedidos
- Detalle de pedido
- Direcciones

#### Admin
- Dashboard
- Lista de productos
- Crear/editar producto
- Categorías
- Gestión de imágenes
- Pedidos
- Clientes
- Roles y permisos
- Configuración de pagos
- Configuración de envío
- Logs / monitoreo

---

## Fase 2 — Arquitectura técnica y base del proyecto
Objetivo: instalar la base sólida antes de construir features.

### Orden correcto de implementación
1. Definir sitemap y arquitectura
2. Instalar tecnologías y boilerplates
3. Configurar entorno local, variables y convenciones
4. Configurar autenticación y roles base
5. Configurar CI/CD
6. Crear mockups de todas las vistas con sus wireframes ya aprobados

### Backend
- Inicializar Laravel
- Configurar PostgreSQL
- Instalar Sanctum
- Configurar Spatie Permissions
- Configurar Redis
- Configurar colas
- Configurar Cloudinary
- Configurar Resend
- Configurar Telescope y Sentry
- Estructura de rutas por grupos
- Base de Resources
- Contratos de respuesta API

### Frontend
- Inicializar React + TypeScript
- Configurar Tailwind
- Configurar shadcn/ui + Radix
- Configurar Router v6
- Configurar Zustand
- Configurar TanStack Query
- Configurar Axios con interceptores
- Configurar React Hook Form + Zod
- Configurar Vitest y Playwright

### Criterio de salida
El proyecto arranca vacío, pero listo para construir sin deuda estructural temprana.

---

## Fase 3 — Design system y componentes base
Objetivo: evitar inconsistencias visuales.

### Entregables
- Tokens de color
- Tipografías
- Espaciados
- Botones
- Inputs
- Cards
- Badges
- Modales
- Skeletons
- Toasts
- Layout base
- Header, footer, sidebar admin
- Grid de producto
- Componentes de pricing y promo

### Regla
Toda tarjeta de producto o componente reutilizable debe salir de una skill específica.

### Skill sugerida
- `skillsTarjetaUI-frontend`

Cuando se trabaje una tarjeta de producto, el agente debe activar esa skill antes de proponer cambios.

---

## Fase 4 — Autenticación, roles y base de seguridad
Objetivo: establecer acceso, permisos y rutas protegidas.

### Backend
- Login / logout
- Registro
- Refresh / sesión Sanctum
- Middleware por rol
- Policies o gates donde aplique
- Seeds de roles

### Frontend
- Flujos de autenticación
- Persistencia de sesión
- Rutas públicas/privadas
- Rutas protegidas por rol
- Manejo de expiración de sesión

### Roles mínimos sugeridos
- Admin
- Operador
- Cliente

### Criterio de salida
Un usuario entra, sale, y ve solo lo que le corresponde.

---

## Fase 5 — Catálogo, producto e imágenes
Objetivo: crear el corazón de la tienda.

### Entidades
- Producto
- Categoría
- Imagen
- Variación o atributo si aplica
- Inventario
- Marca
- Etiquetas / colecciones

### Reglas funcionales
- Las imágenes se gestionan desde admin
- Cloudinary es la única fuente de imágenes publicada
- Hero, banners y producto deben poder administrarse sin tocar código
- El catálogo debe cargar rápido y con paginación o carga progresiva

### Vistas
- Home con hero y destacados
- Catálogo
- Categoría
- Detalle de producto
- Relacionados
- Productos destacados

---

## Fase 6 — Carrito, checkout y reglas comerciales
Objetivo: convertir intención en compra.

### Reglas de negocio
- Envío gratis desde 400.000 COP
- Contraentrega habilitada
- Pago online por Wompi con redirección
- Checkout simple y con mínima fricción

### Backend
- Cálculo de subtotal, envío, descuentos y total
- Validación de método de pago
- Creación de orden
- Reserva lógica de stock si aplica
- Eventos de compra

### Frontend
- Carrito persistente
- Checkout por pasos o compacto
- Resumen claro de costos
- Mensajería visible de envío gratis
- Botón de pago redirigido a Wompi

### Importante
No usar widget de Wompi. El flujo debe redirigir y luego validar retorno + webhook.

---

## Fase 7 — Webhooks, pagos y automatización
Objetivo: asegurar que el pago no dependa de la pantalla del usuario.

### Backend
- Webhook Wompi
- Validación de firma o seguridad equivalente
- Laravel Events
- Estado de pago
- Estados de orden
- Reintentos y cola de procesos
- Registro de fallos

### Estados sugeridos
- Pendiente
- Pagado
- Rechazado
- Expirado
- Contraentrega pendiente
- En preparación
- Enviado
- Entregado
- Cancelado

### Criterio de salida
Si el usuario cierra la pestaña, el pedido sigue siendo rastreable por webhook.

---

## Fase 8 — Panel administrador
Objetivo: operar la tienda desde un solo lugar.

### Módulos mínimos
- Dashboard
- Productos
- Categorías
- Imágenes y banners
- Pedidos
- Clientes
- Pagos
- Envíos
- Cupones o promociones
- Roles y permisos
- Configuración general
- Logs y errores

### Reglas
- Todo contenido visual debe poder subirse desde admin
- Los cambios de precio e inventario deben quedar auditables
- El admin no debe depender del frontend público para operar

---

## Fase 9 — Observabilidad, calidad y hardening
Objetivo: dejar de depender de suerte.

### Backend
- Logs útiles en Telescope
- Sentry en producción
- Control de errores por dominio
- Jobs y colas supervisadas
- Cache de consultas frecuentes
- Optimización de queries

### Frontend
- Code splitting
- Lazy loading donde aplique
- Prefetch inteligente con TanStack Query
- Skeletons
- Control de imágenes responsive
- Evitar renders innecesarios

### Calidad
- Tests unitarios
- Tests de integración
- Tests e2e de flujos clave
- Validación de accesibilidad básica

---

## Fase 10 — SEO, performance y lanzamiento
Objetivo: publicar con base técnica seria.

### Acciones
- Sitemap real y actualizado
- Metadatos por página
- Open Graph y Twitter cards
- URLs limpias
- Optimización de imágenes
- Política de cache
- Minimización de JS
- Revisión de Core Web Vitals
- Pruebas finales de compra y contraentrega

### Criterio de salida
La tienda está lista para producción con comportamiento estable y métricas observables.

---

## 8) Documento `.AGENT.md`

### Propósito
Este archivo guía a OPENCODE y a cualquier agente de código para trabajar dentro de TAG-Q sin romper arquitectura, naming, decisiones o contexto.

### Reglas mínimas del `.AGENT.md`
- Seguir este documento maestro antes de proponer cambios
- No inventar estructuras fuera del sitemap aprobado
- No crear componentes duplicados si existe una skill aplicable
- Antes de iniciar una tarea, identificar si requiere una skill existente o una nueva skill
- Toda decisión importante debe registrarse en Emgram
- Si existe una duda de negocio, detenerse y documentar el riesgo, no improvisar
- Mantener consistencia entre backend, frontend, APIs y mocks
- Priorizar rendimiento, accesibilidad y claridad visual
- No implementar pagos con widget si la arquitectura acordada es redirección a Wompi
- No omitir tests en flujos críticos

### Referencias obligatorias que debe mencionar
- Documento maestro del proyecto
- Sitemap / arquitectura de navegación
- Wireframes por vista
- Mockups por vista
- Lista de entidades
- Matriz de roles y permisos
- Catálogo de skills
- Registro de decisiones en Emgram
- Guía de diseño / design system
- Plan de fases

---

## 9) Estructura recomendada de skills

### Regla práctica
Cada vez que aparezca un patrón repetible con impacto visual, técnico o funcional, se crea una skill.

### Ejemplos
- `skillsTarjetaUI-frontend`
- `skillsProductoCardAdmin`
- `skillsCheckoutFlow`
- `skillsAuthSanctum`
- `skillsWompiWebhook`
- `skillsProductGallery`
- `skillsAdminTable`
- `skillsSEOFrontend`

### Qué debe hacer una skill
- Definir cuándo se usa
- Definir qué problema resuelve
- Definir entradas esperadas
- Definir salidas esperadas
- Definir restricciones
- Definir criterios de calidad

### Cómo se referencia en `.AGENT.md`
Cada skill nueva debe agregarse a una sección de índice, para que el agente sepa que existe y cuándo invocarla.

---

## 10) Uso de Emgram con Gentleman / Gentle.ai

### Regla de registro
Las siguientes decisiones deben guardarse en Emgram:
- Elección de tecnologías
- Cambios de arquitectura
- Decisiones de UX críticas
- Reglas de pago y checkout
- Estructura de roles y permisos
- Cambio de paleta o identidad visual
- Nuevas skills aprobadas
- Decisiones sobre sitemap o navegación
- Reglas de negocio sobre envío, contraentrega o promociones

### Formato mental del registro
- Qué se decidió
- Por qué se decidió
- Qué problema resuelve
- Qué queda descartado
- Desde cuándo aplica

---

## 11) Orden de documentación que se debe crear

1. Documento maestro del proyecto
2. Sitemap / arquitectura de navegación
3. Matriz de roles y permisos
4. Lista de entidades y relaciones
5. Guía de diseño / design system
6. Wireframes de todas las vistas
7. Mockups de todas las vistas
8. Documento de skills
9. `.AGENT.md`
10. Documento de KPIs
11. Documento de reglas de negocio de checkout y pagos
12. Documento técnico de integración Wompi
13. Documento técnico de imágenes y Cloudinary
14. Documento de testing y calidad
15. Documento de despliegue y CI/CD

---

## 12) Recomendación operativa
No empieces por componentes aislados. Empieza por:
1. arquitectura
2. wireframes
3. design system
4. base técnica
5. implementación por dominio

Ese orden evita rehacer trabajo y reduce deuda técnica.

