# Gol de Vestuario

Catálogo de camisetas de fútbol con checkout asistido por WhatsApp y un
panel de administración propio. No procesa pagos en el sitio: el carrito
arma un mensaje de WhatsApp con el resumen del pedido y la venta se cierra
por ese canal.

## Desarrollo

```bash
npm install
cp .env.example .env      # completar los valores (ver abajo)
npm run db:push           # aplica el schema a la base configurada en DATABASE_URL
npm run db:seed           # carga un catálogo de ejemplo (opcional, para probar en local)
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para el sitio y
[http://localhost:3000/admin](http://localhost:3000/admin) para el panel.

### Variables de entorno

Ver `.env.example` para el detalle y las instrucciones de cada una:
`NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`, `DATABASE_URL` y
`DIRECT_URL` (Postgres — Neon u otro proveedor), `ADMIN_PASSWORD_HASH`,
`SESSION_SECRET`, y las credenciales de Cloudinary
(`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`,
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`).

**Importante con `ADMIN_PASSWORD_HASH`**: el hash contiene `$` (ej.
`$2b$10$...`). Next.js expande `$VAR` en los `.env`, así que hay que
escaparlos como `\$` en el archivo o el login falla en silencio. Ejemplo:
`ADMIN_PASSWORD_HASH="\$2b\$10\$..."`.

## Estructura

- `prisma/schema.prisma` — modelos `Producto` y `Categoria` (Postgres).
- `prisma/seed.ts` + `prisma/seed-data.ts` — catálogo de ejemplo para un
  entorno nuevo (`npm run db:seed`); el catálogo real se carga y mantiene
  desde `/admin`.
- `src/data/productos.ts` — lecturas públicas del catálogo (server-only,
  usa Prisma). El carrito, que corre en el navegador, no lo importa
  directamente: consume `GET /api/productos`.
- `src/lib/productos/admin.ts` — altas/bajas/cambios del catálogo, usados
  por las Server Actions de `/admin`.
- `src/data/categorias.ts` — categorías (Fan/Player/Retro/Shorts) → guía de
  talles y foto de cuidados, cargadas y editables desde `/admin`.
- `src/data/site.ts` — constantes del sitio (nav, WhatsApp, descuento).
- `src/data/media.ts` — URLs de Cloudinary de los assets estáticos (logo,
  banners, videos del hero, etc.).
- `src/lib/precios.ts` — cálculo de subtotal/descuento/total del carrito.
- `src/lib/whatsapp.ts` — armado del mensaje y del enlace de WhatsApp.
- `src/lib/carrito/CartContext.tsx` — estado del carrito (persistido en
  `localStorage`, catálogo traído por `fetch`).
- `src/lib/cloudinary-client.ts` — subida de imágenes directo del
  navegador a Cloudinary desde los formularios de `/admin`.
- `src/lib/auth/session.ts` + `src/proxy.ts` — sesión del admin (cookie
  firmada) y protección de `/admin` (`proxy.ts` es el reemplazo de
  `middleware.ts` en Next.js 16).
- `src/app/(site)` — todas las páginas públicas (usan el layout con
  Navbar/Footer/WhatsApp flotante).
- `src/app/admin` — panel de administración (`(protected)` requiere sesión).
- `src/components/ui` — primitivas del sistema de diseño (`docs/design.md`).
- `src/components/producto`, `carrito`, `contenido`, `layout`, `admin` —
  componentes de dominio.

## Administrar el catálogo

Entrar a `/admin`, iniciar sesión, y desde ahí crear/editar/eliminar
productos y categorías (nombre, categoría, tipo, precio, talles y
cantidad por talle, imágenes, destacado, activo). Los cambios se reflejan
en el sitio público al instante (revalidación on-demand), sin necesidad de
redeploy.

Reglas que el formulario aplica automáticamente:

- `tipo: en-stock` pide precio y cantidad por talle; `tipo: por-encargue`
  no permite cargar precio (solo qué talles se ofrecen).
- Los talles ofrecidos dependen de la categoría elegida.
- Máximo 8 productos "destacados" se muestran en Inicio — se puede marcar
  cualquier cantidad, pero el sitio recorta a 8.
- Las imágenes se suben directo del navegador a Cloudinary (sin pasar por
  el servidor).

## Pendientes de negocio

- Historia de la marca, fecha de fundación y equipo: no están definidos
  todavía (aviso visible en `/quienes-somos`).
- Cantidades reales de stock por talle: la migración a este modelo cargó
  un valor provisorio (5 unidades) en los talles que ya estaban marcados
  como disponibles — conviene revisar y cargar la cantidad real de cada
  producto desde `/admin`.

## Deploy

Listo para serverless (Vercel u otro): la base es Postgres (Neon, vía
`@prisma/adapter-pg`) y las imágenes/videos se suben a Cloudinary — nada
depende del disco local del servidor.

Variables de entorno necesarias en producción (ver `.env.example`):
`DATABASE_URL`, `DIRECT_URL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`,
`NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`,
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`,
`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
