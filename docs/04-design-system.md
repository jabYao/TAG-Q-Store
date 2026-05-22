# TAG-Q — Design System

## 1. Tokens de Color

| Token | Valor | Uso |
|-------|-------|-----|
| `--color-primary` | `#0B2977` | Fondos de botones, links, header, footer |
| `--color-primary-dark` | `#081D55` | Hover de botones primary |
| `--color-gold` | `#D4AF37` | Badges, CTAs, acentos |
| `--color-gold-light` | `#E0C456` | Hover de botones gold |
| `--color-carbon` | `#1A1A1A` | Texto principal, sidebar admin |
| `--color-gray-50` | `#F5F5F5` | Fondos alternativos, inputs |
| `--color-gray-200` | `#E0E0E0` | Bordes, separadores |
| `--color-gray-400` | `#9E9E9E` | Texto secundario, placeholders |

## 2. Tipografía

| Nivel | Font | Size | Weight | Color | Uso |
|-------|------|------|--------|-------|-----|
| Display | System UI | 48px | 700 | #1A1A1A | Hero titles |
| H1 | System UI | 28px | 700 | #1A1A1A | Page titles |
| H2 | System UI | 24px | 600 | #1A1A1A | Section titles |
| H3 | System UI | 20px | 600 | #1A1A1A | Card titles |
| Body | System UI | 14px | 400 | #1A1A1A | Paragraphs |
| Small | System UI | 12px | 400 | #9E9E9E | Captions, meta |
| Label | System UI | 13px | 500 | #1A1A1A | Form labels |
| Button | System UI | 14px | 600 | — | Buttons |

## 3. Espaciados

| Token | Valor |
|-------|-------|
| `--space-xs` | 4px |
| `--space-sm` | 8px |
| `--space-md` | 16px |
| `--space-lg` | 24px |
| `--space-xl` | 32px |
| `--space-2xl` | 48px |

Usar clases utilitarias de Tailwind: `gap-*`, `p-*`, `m-*`, `space-y-*`.

## 4. Bordes y Sombras

| Token | Valor |
|-------|-------|
| `--radius-sm` | 6px |
| `--radius-md` | 8px |
| `--radius-lg` | 12px |
| `--radius-xl` | 16px |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.06)` |
| `--shadow-md` | `0 2px 8px rgba(0,0,0,0.08)` |
| `--shadow-lg` | `0 4px 24px rgba(0,0,0,0.12)` |

## 5. Botones — Componente `<Button>`

Importar desde `@/components/ui`:

```tsx
import { Button } from '@/components/ui'
```

### Variantes

| Variante | bg | text | hover | disabled |
|----------|-----|------|-------|----------|
| `primary` (default) | #0B2977 | #FFFFFF | #081D55 | opacity 50% |
| `gold` | #D4AF37 | #1A1A1A | #E0C456 | opacity 50% |
| `outline` | transparent | #0B2977 | bg #0B2977 text white | opacity 50% |
| `ghost` | transparent | #1A1A1A | bg #F5F5F5 | opacity 50% |

### Tamaños

| Size | padding | text |
|------|---------|------|
| `sm` | px-3 py-1.5 | 12px |
| `md` (default) | px-6 py-3 | 14px |
| `lg` | px-8 py-3.5 | 16px |

### Props adicionales

- `loading?: boolean` — muestra spinner, deshabilita el botón
- `disabled?: boolean` — deshabilita visual y funcionalmente
- `className?: string` — clases adicionales

### Ejemplo

```tsx
<Button variant="gold" size="lg" onClick={handleClick}>
  COMPRAR AHORA
</Button>

<Button variant="primary" loading={isPending}>
  AGREGANDO...
</Button>

<Button variant="outline" size="sm">
  Cancelar
</Button>
```

## 6. Inputs — Componente `<Input>` / `<Textarea>`

Importar desde `@/components/ui`:

```tsx
import { Input, Textarea } from '@/components/ui'
```

### Estados

| Estado | bg | border | text |
|--------|-----|--------|------|
| Default | #F5F5F5 | #E0E0E0 | #1A1A1A |
| Focus | #FFFFFF | #0B2977 (ring 2px) | #1A1A1A |
| Error | #FEF2F2 | #DC2626 | #1A1A1A |
| Disabled | #F5F5F5 | #E0E0E0 | #9E9E9E |

### Props

- `label?: string` — label sobre el input
- `error?: string` — mensaje de error (cambia el borde a rojo)
- `helperText?: string` — texto de ayuda (se oculta si hay error)
- Además todas las props estándar de `<input>` / `<textarea>`

### Ejemplo

```tsx
<Input
  label="Correo electrónico"
  type="email"
  placeholder="tu@email.com"
  error={errors.email}
  {...register('email')}
/>

<Textarea
  label="Descripción"
  placeholder="Descripción del producto..."
  rows={4}
/>
```

## 7. Modal — Componente `<Modal>`

Importar desde `@/components/ui`:

```tsx
import { Modal, Button } from '@/components/ui'
```

### Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `open` | boolean | — | Controla visibilidad |
| `onClose` | () => void | — | Callback al cerrar |
| `title` | string | — | Título del modal |
| `children` | ReactNode | — | Contenido |
| `footer` | ReactNode | — | Botones de acción (opcional) |
| `size` | 'sm' \| 'md' \| 'lg' | 'md' | Ancho máximo |

### Comportamiento

- Cierra con Escape
- Cierra al hacer click en el backdrop
- Previene scroll del body mientras está abierto
- Animación fade-in + scale-up

### Ejemplo

```tsx
const [open, setOpen] = useState(false)

<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirmar eliminación"
  size="sm"
  footer={
    <>
      <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
      <Button variant="primary" onClick={handleDelete}>Eliminar</Button>
    </>
  }
>
  <p className="text-sm text-gray-500">
    ¿Estás seguro de que querés eliminar este producto? Esta acción no se puede deshacer.
  </p>
</Modal>
```

## 8. Cards

### ProductCard

```tsx
<ProductCard
  name="Tommy Hilfiger Chronograph"
  slug="tommy-chronograph"
  price={250000}
  originalPrice={350000}
  imageUrl="/images/tommy.jpg"
  badge={{ label: '-29%', variant: 'gold' }}
/>
```

Props: `name`, `slug`, `price`, `originalPrice?`, `imageUrl?`, `thumbnail?`, `badge?`

### CategoryCard

```tsx
<CategoryCard
  name="Dama"
  slug="dama"
  emoji="👩"
  count={12}
/>
```

## 9. Skeletons

Importar desde `@/components/Skeleton`:

| Componente | Uso |
|-----------|-----|
| `Skeleton` | Genérico, recibe `className` |
| `ProductGridSkeleton` | Grilla de productos |
| `DetailSkeleton` | Página de detalle producto |
| `CartSkeleton` | Página de carrito |
| `CategoryCardSkeleton` | Card de categoría |
| `HeroSkeleton` | Hero banner |
| `OrderListSkeleton` | Lista de pedidos |
| `HomeSectionSkeleton` | Sección de home |
| `PageSkeleton` | Página completa (de `PageSkeleton.tsx`) |

## 10. Toasts

```tsx
import { toast } from '@/stores/toastStore'

toast.success('Producto agregado', 'Se agregó al carrito correctamente')
toast.error('Error', 'No se pudo completar la operación')
toast.info('Información', 'Nueva colección disponible')
toast.warning('Stock bajo', 'Solo quedan 3 unidades')
```

Tipos: `success` (verde), `error` (rojo), `info` (azul), `warning` (ámbar).

Auto-dismiss en 4 segundos. Se apilan en esquina inferior derecha.

## 11. Layouts

| Componente | Ruta | Descripción |
|-----------|------|-------------|
| `PublicLayout` | PublicLayout.tsx | Header + nav + main + footer |
| `AdminLayout` | AdminLayout.tsx | Sidebar + top bar + main |
| `Footer` | Footer.tsx | Footer independiente, 4 columnas |

## 12. Animaciones

| Clase | Keyframe | Duración | Uso |
|-------|----------|----------|-----|
| `animate-shimmer` | shimmer | 1.5s | Skeletons |
| `animate-slide-in` | slide-in | 0.25s | Drawer mobile |
| `animate-slide-up` | slide-up | 0.25s | Toasts |
| `animate-modal-in` | modal-in | 0.2s | Modal/Dialog |

---

**Versión**: 1.0  
**Última actualización**: 2026-05-21  
**Tecnología**: Tailwind CSS v4 con `@theme` directives + CSS nativo
