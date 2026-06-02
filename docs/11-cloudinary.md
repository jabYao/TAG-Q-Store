# Integración Cloudinary — TAG-Q

## Objetivo

Gestión de imágenes de productos, banners y heroes desde el panel administrador, usando Cloudinary como CDN y storage único.

## Stack

- **SDK**: `cloudinary/cloudinary_php` ^3.1
- **Servicio**: `App\Services\CloudinaryService` (wrapper interno)
- **Upload**: `ImageController` (admin, requiere auth + rol admin)

## Configuración

### Variables de entorno (`.env`)

```env
CLOUDINARY_CLOUD_NAME=dg6iut6sl
CLOUDINARY_API_KEY=626756797469654
CLOUDINARY_API_SECRET=Jz3WDSAAPNJ-dtW3yqiUqjtxDRw
```

### Config (`config/cloudinary.php`)

```php
return [
    'cloud' => [
        'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
        'api_key' => env('CLOUDINARY_API_KEY'),
        'api_secret' => env('CLOUDINARY_API_SECRET'),
    ],
];
```

## Servicio (`CloudinaryService`)

Métodos disponibles:

| Método | Descripción |
|--------|-------------|
| `upload($file, $options)` | Sube imagen. Opciones: folder, public_id, overwrite, transformation |
| `delete($publicId)` | Elimina imagen por public_id |
| `getUrl($publicId, $transformations)` | URL optimizada con transformaciones |
| `getThumbnailUrl($publicId, $width, $height)` | Thumbnail crop automático |

## Estructura de carpetas en Cloudinary

Las imágenes se organizan en carpetas dentro de `tag-q/` según su tipo:

| Tipo | Carpeta | Endpoint de subida |
|------|---------|-------------------|
| Producto | `tag-q/producto` (plana) | `POST /api/admin/imagenes/producto` |
| Banner | `tag-q/banner` | `POST /api/admin/imagenes/banner` |
| Hero | `tag-q/hero` | `POST /api/admin/imagenes/hero` |
| Promoción | `tag-q/promociones` | `POST /api/admin/imagenes/promocion` |

### Transformaciones por defecto

- `quality: auto:best` — calidad óptima según dispositivo/red
- `fetch_format: auto` — formato automático (WebP si el navegador lo soporta)
- Thumbnails: crop automático con 300x300px

## Flujo de imágenes de producto

```
Admin sube imagen → ImageController@uploadProductImage
  → CloudinaryService::upload() → Cloudinary API
  → Se crea ProductImage (cloudinary_url, public_id)
  → Se asigna is_primary si corresponde
  → Se desmarcan otras primarias del mismo producto
```

### Reglas
- Formatos permitidos: JPEG, PNG, WebP
- Máximo 5MB por imagen de producto
- Máximo 10MB por banner
- Un producto puede tener múltiples imágenes
- Solo una imagen puede ser `is_primary = true` por producto
- El orden se controla con `sort_order` (reordenable desde admin)

## API Endpoints

### Admin — Gestión de imágenes

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/admin/imagenes/producto` | Subir imagen a producto |
| DELETE | `/api/admin/imagenes/producto/{id}` | Eliminar imagen |
| PUT | `/api/admin/imagenes/reordenar` | Reordenar imágenes de un producto |
| POST | `/api/admin/imagenes/banner` | Subir imagen de banner |
| POST | `/api/admin/imagenes/hero` | Subir imagen de hero |
| POST | `/api/admin/imagenes/promocion` | Subir imagen de promoción |

### Request/Response ejemplos

**Subir imagen de producto:**
```http
POST /api/admin/imagenes/producto
Content-Type: multipart/form-data
Authorization: Bearer {token}

product_id: 1
image: (file)
is_primary: true
alt_text: "Tommy Hilfiger Chronograph - Vista frontal"
```

```json
{
  "data": {
    "id": 1,
    "url": "https://res.cloudinary.com/dg6iut6sl/image/upload/v123/tag-q/producto/abc123.jpg",
    "public_id": "tag-q/producto/abc123",
    "alt_text": "Tommy Hilfiger Chronograph - Vista frontal",
    "is_primary": true,
    "sort_order": 0
  }
}
```

**Reordenar imágenes:**
```http
PUT /api/admin/imagenes/reordenar
Content-Type: application/json

{
  "images": [
    { "id": 1, "sort_order": 0 },
    { "id": 2, "sort_order": 1 },
    { "id": 3, "sort_order": 2 }
  ]
}
```

## Almacenamiento en BD

### Tabla `product_images`

| Columna | Tipo | Notas |
|---------|------|-------|
| cloudinary_url | string(500) | URL segura (HTTPS) |
| cloudinary_public_id | string(255) | ID único en Cloudinary |
| alt_text | string(255) | Texto alternativo (accesibilidad) |
| is_primary | boolean | Imagen principal del catálogo |
| sort_order | integer | Para reordenar en galería |
| type | enum('product','gallery') | Tipo de imagen |

## Optimización para Core Web Vitals

1. **Formato automático**: Cloudinary sirve WebP cuando el navegador lo soporta
2. **Calidad adaptativa**: `q_auto:best` equilibra calidad vs peso
3. **Responsive images**: Usar `getThumbnailUrl()` con diferentes breakpoints
4. **Lazy loading**: Las imágenes deben cargarse con `loading="lazy"` en el frontend
5. **CDN global**: Cloudinary tiene edge servers para reducir latencia en Colombia

## Reglas de negocio (principio #7)

- El panel admin **controla** qué imágenes se muestran
- No se hardcodean URLs de imágenes en el frontend
- Todo banner, hero e imagen de producto se gestiona desde `/admin/imagenes`
- Cloudinary es la única fuente de imágenes publicadas

## Próximos pasos

- [ ] Integrar upload de imágenes en AdminProductForm
- [ ] Mostrar imágenes reales en catálogo y detalle producto
- [ ] Gestión de banners y heroes desde admin
- [ ] Implementar lazy loading y responsive images en frontend
