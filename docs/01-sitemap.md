# TAG-Q — Sitemap y Arquitectura de Información

## 1. Mapa del Sitio Público

```
/
├── /landing/{slug}              (Landing de colección/campaña)
├── /catalogo                    (Catálogo completo)
├── /categoria/{slug}            (Productos por categoría)
├── /busqueda                    (Resultados de búsqueda)
├── /producto/{slug}             (Detalle de producto)
├── /carrito                     (Carrito de compras)
├── /checkout                    (Checkout)
│   ├── /checkout/resumen        (Resumen y validación)
│   ├── /checkout/envio          (Datos de envío)
│   ├── /checkout/pago           (Selección de método de pago)
│   └── /checkout/confirmacion   (Confirmación antes de pagar)
├── /pago/resultado              (Resultado de pago Wompi)
│   ├── /pago/resultado/exito
│   └── /pago/resultado/fallo
├── /pedido/confirmacion/{id}    (Confirmación de pedido)
├── /politicas                   (Políticas legales)
│   ├── /politicas/privacidad
│   ├── /politicas/terminos
│   ├── /politicas/envios
│   ├── /politicas/devoluciones
│   └── /politicas/cookies
└── /contacto                    (Formulario de contacto)
```

### 1.1 Home (`/`)

**Propósito**: Punto de entrada principal, mostrar productos destacados y campañas.

**Componentes**:
- Header (logo, navegación, carrito, búsqueda, login)
- Hero banner (imagen configurable desde admin)
- Sección de categorías destacadas
- Productos destacados / nuevos arrivals
- Banner promocional (configurable desde admin)
- Sección de beneficios (envío gratis, métodos de pago, etc.)
- Footer (enlaces legales, redes sociales, contacto)

**Estados**:
- ✅ Con contenido cargado
- ⏳ Cargando (skeletons para hero, banners, productos)
- ❌ Error (mensaje de error con reintento)
- 🔲 Vacío (sin productos destacados - mostrar catálogo completo)

---

### 1.2 Landing de Colección/Campaña (`/landing/{slug}`)

**Propósito**: Página promocional para campañas específicas.

**Componentes**:
- Hero de campaña
- Descripción de la colección
- Grid de productos de la colección
- CTA de compra
- Footer

**Estados**:
- ✅ Con contenido
- ⏳ Cargando
- ❌ Error
- 🔲 Landing no encontrada (404)

---

### 1.3 Catálogo (`/catalogo`)

**Propósito**: Mostrar todos los productos disponibles.

**Componentes**:
- Header de página con título
- Filtros laterales (categoría, marca, precio, atributos)
- Ordenamiento (precio, popularidad, nuevos)
- Grid de productos (paginación o infinite scroll)
- Badge de envío gratis si aplica

**Estados**:
- ✅ Con productos
- ⏳ Cargando (skeletons de cards)
- ❌ Error
- 🔲 Sin resultados (mensaje + sugerencias)

**Query params**:
- `?categoria=slug`
- `?marca=id`
- `?precio_min=valor`
- `?precio_max=valor`
- `?orden=precio_asc|precio_desc|popularidad|nuevos`
- `?pagina=numero`

---

### 1.4 Categoría (`/categoria/{slug}`)

**Propósito**: Mostrar productos de una categoría específica.

**Componentes**:
- Header de categoría (nombre, descripción, imagen)
- Filtros laterales
- Grid de productos
- Subcategorías si existen

**Estados**:
- ✅ Con productos
- ⏳ Cargando
- ❌ Error
- 🔲 Categoría no encontrada (404)
- 🔲 Sin productos en categoría

---

### 1.5 Búsqueda (`/busqueda`)

**Propósito**: Resultados de búsqueda de productos.

**Componentes**:
- Barra de búsqueda (con foco automático)
- Filtros laterales
- Grid de resultados
- Sugerencias de búsqueda

**Estados**:
- ✅ Con resultados
- ⏳ Cargando
- ❌ Error
- 🔲 Sin resultados (mostrar sugerencias, productos populares)
- 🔲 Búsqueda vacía (mostrar productos destacados)

**Query params**:
- `?q=termino`
- `?categoria=slug`
- `?precio_min=valor`
- `?precio_max=valor`
- `?orden=relevancia|precio_asc|precio_desc`

---

### 1.6 Detalle de Producto (`/producto/{slug}`)

**Propósito**: Mostrar información completa del producto y permitir añadir al carrito.

**Componentes**:
- Galería de imágenes (con zoom)
- Información del producto (nombre, precio, descripción)
- Selector de cantidad
- Botón "Añadir al carrito"
- Badge de envío gratis si aplica
- Información de envío y devoluciones
- Productos relacionados
- Reseñas (si se implementa en el futuro)

**Estados**:
- ✅ Producto disponible
- ⏳ Cargando
- ❌ Error
- 🔲 Producto no encontrado (404)
- 🔲 Sin stock (mostrar mensaje, deshabilitar botón)

---

### 1.7 Carrito (`/carrito`)

**Propósito**: Mostrar items en el carrito y permitir gestión.

**Componentes**:
- Lista de items (imagen, nombre, precio, cantidad, subtotal)
- Control de cantidad (+/-)
- Botón eliminar item
- Resumen de costos (subtotal, envío, total)
- Mensaje de progreso para envío gratis ("Faltan $X para envío gratis")
- Botón "Continuar al checkout"
- Productos sugeridos

**Estados**:
- ✅ Con items
- 🔲 Vacío (mostrar mensaje + CTA al catálogo)
- ⏳ Actualizando
- ❌ Error al actualizar

---

### 1.8 Checkout (`/checkout`)

**Propósito**: Proceso de compra.

#### 1.8.1 Resumen (`/checkout/resumen`)

**Componentes**:
- Lista de items del carrito
- Formulario de dirección de envío (o selección de existente)
- Selector de método de envío
- Resumen de costos

**Validaciones**:
- Items disponibles
- Stock suficiente
- Dirección válida

---

#### 1.8.2 Envío (`/checkout/envio`)

**Componentes**:
- Formulario de datos de envío (nombre, dirección, ciudad, teléfono)
- Selector de dirección guardada (si existe)
- Método de envío (domicilio, punto de recogida)
- Costo de envío calculado

**Validaciones**:
- Campos requeridos
- Ciudad válida (Colombia)
- Teléfono válido

---

#### 1.8.3 Pago (`/checkout/pago`)

**Componentes**:
- Resumen del pedido
- Selector de método de pago:
  - Wompi (tarjeta, PSE, Nequi)
  - Contraentrega
- Términos y condiciones (checkbox)
- Botón "Confirmar pedido"

**Reglas**:
- Contraentrega disponible para todos los pedidos
- Wompi redirige a pasarela externa

---

#### 1.8.4 Confirmación (`/checkout/confirmacion`)

**Componentes**:
- Resumen final del pedido
- Botón "Pagar ahora" (redirige a Wompi)
- Información de contraentrega si aplica

**Acciones**:
- Crear orden en backend
- Redirigir a Wompi (si pago online)
- Mostrar confirmación (si contraentrega)

---

### 1.9 Resultado de Pago (`/pago/resultado`)

**Propósito**: Mostrar resultado del pago después de redirección de Wompi.

#### 1.9.1 Éxito (`/pago/resultado/exito`)

**Componentes**:
- Mensaje de éxito
- Número de pedido
- Resumen del pedido
- Botón "Ver detalle del pedido"
- Botón "Seguir comprando"

---

#### 1.9.2 Fallo (`/pago/resultado/fallo`)

**Componentes**:
- Mensaje de fallo
- Razón del fallo (si disponible)
- Botón "Intentar de nuevo"
- Botón "Volver al carrito"
- Contacto de soporte

---

### 1.10 Confirmación de Pedido (`/pedido/confirmacion/{id}`)

**Propósito**: Página de confirmación después de crear pedido.

**Componentes**:
- Número de pedido
- Resumen del pedido
- Método de pago
- Método de envío
- Tiempo estimado de entrega
- Botón "Seguir comprando"
- Botón "Ver detalle del pedido"

---

### 1.11 Políticas Legales (`/politicas`)

**Propósito**: Información legal requerida.

#### Páginas:
- `/politicas/privacidad` - Política de privacidad
- `/politicas/terminos` - Términos y condiciones
- `/politicas/envios` - Política de envíos
- `/politicas/devoluciones` - Política de devoluciones
- `/politicas/cookies` - Política de cookies

**Componentes**:
- Contenido estático (markdown o desde admin)
- Índice de navegación
- Fecha de última actualización

---

### 1.12 Contacto (`/contacto`)

**Propósito**: Formulario de contacto con la tienda.

**Componentes**:
- Formulario (nombre, email, asunto, mensaje)
- Información de contacto (email, teléfono, WhatsApp)
- Horarios de atención
- Redes sociales

**Validaciones**:
- Campos requeridos
- Email válido
- Captcha (si es necesario)

---

## 2. Mapa del Sitio de Usuario Autenticado

```
/account
├── /login                     (Login)
├── /registro                  (Registro)
├── /recuperacion              (Recuperación de contraseña)
│   └── /recuperacion/{token}  (Reset con token)
├── /perfil                    (Perfil de usuario)
├── /mis-pedidos               (Lista de pedidos)
│   └── /mis-pedidos/{id}      (Detalle de pedido)
├── /direcciones               (Gestión de direcciones)
│   ├── /direcciones/nueva     (Crear dirección)
│   └── /direcciones/{id}/editar (Editar dirección)
└── /preferencias              (Preferencias de usuario)
```

### 2.1 Login (`/login`)

**Componentes**:
- Formulario (email, contraseña)
- Link "Olvidé mi contraseña"
- Link "Crear cuenta"
- Login social (si se implementa)

**Validaciones**:
- Email válido
- Contraseña requerida

**Estados**:
- ✅ Login exitoso (redirige a home o página anterior)
- ❌ Credenciales inválidas
- ❌ Error de servidor

---

### 2.2 Registro (`/registro`)

**Componentes**:
- Formulario (nombre, email, contraseña, confirmar contraseña)
- Checkbox de términos y condiciones
- Link "Ya tengo cuenta"

**Validaciones**:
- Nombre requerido
- Email válido y único
- Contraseña mín. 8 caracteres
- Contraseñas coinciden

---

### 2.3 Recuperación de Contraseña (`/recuperacion`)

**Componentes**:
- Formulario de solicitud (email)
- Mensaje de éxito (email enviado)
- Link "Volver al login"

#### 2.3.1 Reset con Token (`/recuperacion/{token}`)

**Componentes**:
- Formulario (nueva contraseña, confirmar contraseña)
- Validación de token válido/expirado

---

### 2.4 Perfil (`/perfil`)

**Componentes**:
- Formulario de datos personales (nombre, email, teléfono)
- Cambio de contraseña
- Botón "Cerrar sesión"
- Historial de pedidos (resumen)

**Acciones**:
- Actualizar perfil
- Cambiar contraseña
- Cerrar sesión

---

### 2.5 Mis Pedidos (`/mis-pedidos`)

**Componentes**:
- Lista de pedidos (número, fecha, estado, total)
- Filtros por estado
- Paginación

**Estados**:
- ✅ Con pedidos
- 🔲 Sin pedidos (mensaje + CTA al catálogo)
- ⏳ Cargando

---

### 2.6 Detalle de Pedido (`/mis-pedidos/{id}`)

**Componentes**:
- Número de pedido
- Fecha de compra
- Estado del pedido (timeline)
- Items del pedido
- Dirección de envío
- Método de pago
- Método de envío
- Total
- Botón "Volver a comprar" (si aplica)
- Botón "Contactar soporte"

---

### 2.7 Direcciones (`/direcciones`)

**Componentes**:
- Lista de direcciones guardadas
- Botón "Nueva dirección"
- Botones editar/eliminar por dirección
- Dirección marcada como predeterminada

#### 2.7.1 Nueva Dirección (`/direcciones/nueva`)

**Formulario**:
- Nombre (para identificar la dirección)
- Ciudad
- Dirección completa
- Teléfono
- Checkbox "Marcar como predeterminada"

---

### 2.8 Preferencias (`/preferencias`)

**Componentes**:
- Preferencias de newsletter (opt-in/opt-out)
- Preferencias de notificaciones
- Preferencias de privacidad

---

## 3. Mapa del Panel Administrador

```
/admin
├── /dashboard                 (Dashboard con KPIs)
├── /productos                 (Gestión de productos)
│   ├── /productos/nuevo       (Crear producto)
│   └── /productos/{id}/editar (Editar producto)
├── /categorias                (Gestión de categorías)
│   ├── /categorias/nueva      (Crear categoría)
│   └── /categorias/{id}/editar (Editar categoría)
├── /imagenes                  (Gestión de imágenes/banners)
│   ├── /imagenes/banners      (Banners del sitio)
│   ├── /imagenes/hero         (Hero del home)
│   └── /imagenes/productos    (Imágenes de productos)
├── /pedidos                   (Gestión de pedidos)
│   └── /pedidos/{id}          (Detalle y actualización)
├── /clientes                  (Lista de clientes)
│   └── /clientes/{id}         (Detalle de cliente)
├── /pagos                     (Registro de pagos)
├── /envios                    (Gestión de envíos)
├── /cupones                   (Gestión de cupones)
│   ├── /cupones/nuevo         (Crear cupón)
│   └── /cupones/{id}/editar   (Editar cupón)
├── /roles                     (Roles y permisos)
├── /configuracion             (Configuración de tienda)
└── /logs                      (Logs y monitoreo)
```

### 3.1 Dashboard (`/admin/dashboard`)

**Componentes**:
- KPIs principales (ventas hoy, pedidos pendientes, etc.)
- Gráfica de ventas (últimos 7/30 días)
- Pedidos recientes
- Productos con stock bajo
- Alertas importantes

**Roles**: Admin, Operador

---

### 3.2 Productos (`/admin/productos`)

**Componentes**:
- Tabla de productos (imagen, nombre, categoría, precio, stock, estado)
- Filtros (categoría, estado, stock)
- Buscador
- Botón "Nuevo producto"
- Paginación
- Acciones por fila (editar, eliminar, toggle estado)

**Roles**: Admin, Operador

---

### 3.3 Crear/Editar Producto (`/admin/productos/nuevo`, `/admin/productos/{id}/editar`)

**Componentes**:
- Formulario de datos básicos (nombre, descripción, categoría, marca)
- Upload de imágenes (múltiples, con reordenamiento)
- Precios (precio base, precio oferta)
- Inventario (SKU, stock, stock mínimo)
- Atributos (color, material, dimensiones)
- SEO (meta título, meta descripción, slug)
- Estado (activo/inactivo)

**Validaciones**:
- Nombre requerido
- Categoría requerida
- Precio > 0
- Al menos una imagen

**Roles**: Admin, Operador

---

### 3.4 Categorías (`/admin/categorias`)

**Componentes**:
- Tabla de categorías (nombre, slug, productos, estado)
- Botón "Nueva categoría"
- Acciones por fila (editar, eliminar, toggle estado)

**Roles**: Admin

---

### 3.5 Imágenes y Banners (`/admin/imagenes`)

**Componentes**:
- Sección Hero (upload, vista previa, link de destino)
- Sección Banners (lista de banners, upload, posición, link)
- Galería de productos (imágenes subidas)

**Roles**: Admin

---

### 3.6 Pedidos (`/admin/pedidos`)

**Componentes**:
- Tabla de pedidos (número, cliente, fecha, estado, total)
- Filtros por estado
- Buscador por número o cliente
- Paginación

**Roles**: Admin, Operador

---

### 3.7 Detalle de Pedido (`/admin/pedidos/{id}`)

**Componentes**:
- Número de pedido
- Cliente (con link a detalle)
- Fecha
- Estado (selector para actualizar)
- Items del pedido
- Dirección de envío
- Método de pago
- Método de envío
- Historial de estados
- Notas internas

**Acciones**:
- Actualizar estado
- Enviar notificación al cliente
- Imprimir pedido

**Roles**: Admin, Operador

---

### 3.8 Clientes (`/admin/clientes`)

**Componentes**:
- Tabla de clientes (nombre, email, pedidos, total comprado, fecha registro)
- Filtros
- Buscador
- Paginación

**Roles**: Admin, Operador

---

### 3.9 Pagos (`/admin/pagos`)

**Componentes**:
- Tabla de pagos (id, pedido, método, estado, monto, fecha)
- Filtros por estado
- Detalles de webhook recibidos

**Roles**: Admin

---

### 3.10 Envíos (`/admin/envios`)

**Componentes**:
- Lista de envíos pendientes
- Asignación de transportadora
- Generación de guía
- Tracking

**Roles**: Admin, Operador

---

### 3.11 Cupones (`/admin/cupones`)

**Componentes**:
- Tabla de cupones (código, descuento, tipo, vigencia, usos)
- Botón "Nuevo cupón"
- Acciones por fila

**Formulario de cupón**:
- Código
- Tipo de descuento (porcentaje, fijo)
- Valor
- Mínimo de compra
- Vigencia (fecha inicio, fecha fin)
- Usos máximos
- Productos/categorías aplicables

**Roles**: Admin

---

### 3.12 Roles y Permisos (`/admin/roles`)

**Componentes**:
- Lista de roles
- Permisos por rol (checkboxes)
- Botón "Crear rol"
- Acciones por fila

**Roles**: Admin

---

### 3.13 Configuración (`/admin/configuracion`)

**Componentes**:
- Información de la tienda (nombre, email, teléfono, dirección)
- Redes sociales
- Configuración de envíos (costo, gratis desde)
- Configuración de pagos (llaves Wompi)
- Configuración de email (Resend)
- Configuración de imágenes (Cloudinary)

**Roles**: Admin

---

### 3.14 Logs (`/admin/logs`)

**Componentes**:
- Lista de errores recientes
- Filtros por severidad
- Buscador
- Link a Telescope (dev) o Sentry (prod)

**Roles**: Admin

---

## 4. Rutas de API (Backend)

### 4.1 Público

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/products` | Listar productos (con filtros) |
| GET | `/api/products/{slug}` | Detalle de producto |
| GET | `/api/categories` | Listar categorías |
| GET | `/api/brands` | Listar marcas |
| GET | `/api/search` | Búsqueda de productos |
| GET | `/api/banners` | Banners activos |
| GET | `/api/hero` | Hero activo |
| POST | `/api/contact` | Enviar formulario de contacto |

### 4.2 Autenticación

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Registro |
| POST | `/api/auth/logout` | Logout |
| POST | `/api/auth/forgot-password` | Solicitar reset |
| POST | `/api/auth/reset-password` | Reset con token |
| GET | `/api/auth/me` | Usuario actual |

### 4.3 Usuario

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/user/profile` | Perfil |
| PUT | `/api/user/profile` | Actualizar perfil |
| PUT | `/api/user/password` | Cambiar contraseña |
| GET | `/api/user/orders` | Mis pedidos |
| GET | `/api/user/orders/{id}` | Detalle de pedido |
| GET | `/api/user/addresses` | Direcciones |
| POST | `/api/user/addresses` | Crear dirección |
| PUT | `/api/user/addresses/{id}` | Actualizar dirección |
| DELETE | `/api/user/addresses/{id}` | Eliminar dirección |

### 4.4 Carrito

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/cart` | Obtener carrito |
| POST | `/api/cart/items` | Añadir item |
| PUT | `/api/cart/items/{id}` | Actualizar cantidad |
| DELETE | `/api/cart/items/{id}` | Eliminar item |
| DELETE | `/api/cart` | Vaciar carrito |

### 4.5 Checkout

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/checkout` | Crear orden |
| POST | `/api/checkout/wompi` | Iniciar pago Wompi |
| GET | `/api/checkout/shipping-cost` | Calcular envío |

### 4.6 Admin

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/admin/dashboard` | Dashboard KPIs |
| GET | `/api/admin/products` | Listar productos |
| POST | `/api/admin/products` | Crear producto |
| GET | `/api/admin/products/{id}` | Detalle producto |
| PUT | `/api/admin/products/{id}` | Actualizar producto |
| DELETE | `/api/admin/products/{id}` | Eliminar producto |
| POST | `/api/admin/products/{id}/images` | Subir imágenes |
| GET | `/api/admin/categories` | Listar categorías |
| POST | `/api/admin/categories` | Crear categoría |
| PUT | `/api/admin/categories/{id}` | Actualizar categoría |
| DELETE | `/api/admin/categories/{id}` | Eliminar categoría |
| GET | `/api/admin/orders` | Listar pedidos |
| GET | `/api/admin/orders/{id}` | Detalle pedido |
| PUT | `/api/admin/orders/{id}/status` | Actualizar estado |
| GET | `/api/admin/customers` | Listar clientes |
| GET | `/api/admin/payments` | Listar pagos |
| GET | `/api/admin/coupons` | Listar cupones |
| POST | `/api/admin/coupons` | Crear cupón |
| PUT | `/api/admin/coupons/{id}` | Actualizar cupón |
| DELETE | `/api/admin/coupons/{id}` | Eliminar cupón |
| GET | `/api/admin/roles` | Listar roles |
| POST | `/api/admin/roles` | Crear rol |
| PUT | `/api/admin/roles/{id}` | Actualizar rol |
| GET | `/api/admin/settings` | Configuración |
| PUT | `/api/admin/settings` | Actualizar configuración |

### 4.7 Webhooks

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/webhooks/wompi` | Webhook de Wompi |

---

## 5. Estados del Sistema

### 5.1 Estados de Pedido

| Estado | Descripción |
|--------|-------------|
| `PENDIENTE` | Pedido creado, esperando pago |
| `PAGADO` | Pago confirmado |
| `RECHAZADO` | Pago rechazado |
| `EXPIRADO` | Pedido expirado sin pago |
| `CONTRAENTREGA_PENDIENTE` | Pedido contraentrega creado |
| `EN_PREPARACION` | Preparando pedido |
| `ENVIADO` | Pedido en tránsito |
| `ENTREGADO` | Pedido entregado |
| `CANCELADO` | Pedido cancelado |

### 5.2 Estados de Pago

| Estado | Descripción |
|--------|-------------|
| `PENDIENTE` | Pago iniciado |
| `APROBADO` | Pago aprobado |
| `RECHAZADO` | Pago rechazado |
| `EXPIRADO` | Pago expirado |

### 5.3 Estados de Producto

| Estado | Descripción |
|--------|-------------|
| `ACTIVO` | Producto visible en tienda |
| `INACTIVO` | Producto oculto |
| `SIN_STOCK` | Producto sin stock (visible pero no comprable) |

---

## 6. Flujo de Navegación Crítico

### 6.1 Flujo de Compra

```
Home/Catálogo → Detalle Producto → Carrito → Checkout → Pago Wompi → Confirmación
```

### 6.2 Flujo de Autenticación

```
Login → Home (redirección) → Perfil/Mis Pedidos
```

### 6.3 Flujo de Admin

```
Login Admin → Dashboard → Módulo (productos/pedidos/etc.) → Detalle → Editar → Guardar
```

---

**Versión**: 1.0
**Última actualización**: 2026-05-13
**Estado**: Fase 0 - Completado
