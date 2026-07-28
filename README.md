# Gol de Vestuario

Catálogo de camisetas de fútbol con checkout asistido por WhatsApp y un
panel de administración propio. Ver [PLAN_DESARROLLO.md](./PLAN_DESARROLLO.md)
para el plan de producto original (el panel /admin con base de datos se
construyó antes de lo previsto ahí, a pedido explícito — el resto del plan
sigue vigente).

## Desarrollo

```bash
npm install
cp .env.example .env      # completar los valores (ver abajo)
npm run db:push           # crea prisma/dev.db con el schema
npm run db:seed           # carga el catálogo de ejemplo
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para el sitio y
[http://localhost:3000/admin](http://localhost:3000/admin) para el panel.

### Variables de entorno

- `NEXT_PUBLIC_WHATSAPP_NUMBER` — número de destino de los pedidos.
- `NEXT_PUBLIC_SITE_URL` — URL base para metadatos y Open Graph.
- `DATABASE_URL` — conexión SQLite (`file:./dev.db` por defecto).
- `ADMIN_PASSWORD_HASH` — hash bcrypt de la contraseña del panel. Generar con:
  ```bash
  node -e "console.log(require('bcryptjs').hashSync('tu-contraseña', 10))"
  ```
  **Importante**: el hash contiene `$` (ej. `$2b$10$...`). Next.js expande
  `$VAR` en los `.env`, así que hay que escaparlos como `\$` en el archivo
  o el login falla en silencio. Ejemplo:
  `ADMIN_PASSWORD_HASH="\$2b\$10\$..."`.
- `SESSION_SECRET` — clave para firmar la cookie de sesión del admin:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

Contraseña de desarrollo por defecto (solo en este repo, cambiarla antes de
cualquier uso real): `GolDeVestuario2026!`.

## Estructura

- `prisma/schema.prisma` — modelo `Producto` (SQLite).
- `prisma/seed.ts` + `prisma/seed-data.ts` — catálogo de ejemplo para
  poblar la base la primera vez (`npm run db:seed`). **Son datos de
  ejemplo** (ver P-02 en el plan); cargar el catálogo real desde `/admin`.
- `src/data/productos.ts` — lecturas públicas del catálogo (server-only,
  usa Prisma). El carrito, que corre en el navegador, no lo importa
  directamente: consume `GET /api/productos`.
- `src/lib/productos/admin.ts` — altas/bajas/cambios del catálogo, usados
  por las Server Actions de `/admin`.
- `src/data/categorias.ts` — mapa categoría (Fan/Player/Retro) → guía de
  talles y foto de cuidados. RN-06.
- `src/data/site.ts` — constantes del sitio (nav, WhatsApp, descuento).
- `src/lib/precios.ts` — cálculo de subtotal/descuento/total del carrito.
- `src/lib/whatsapp.ts` — armado del mensaje y del enlace de WhatsApp.
- `src/lib/carrito/CartContext.tsx` — estado del carrito (persistido en
  `localStorage`, catálogo traído por `fetch`).
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
productos (nombre, categoría, tipo, precio, talles disponibles, imágenes,
destacado, activo). Los cambios se reflejan en el sitio público al
instante (revalidación on-demand), sin necesidad de redeploy.

Reglas que el formulario aplica automáticamente:

- `tipo: en-stock` pide precio; `tipo: por-encargue` no permite cargarlo
  (RN-04/RN-05).
- Los talles ofrecidos dependen de la categoría elegida (RN-06).
- Máximo 8 productos "destacados" se muestran en Inicio (RN-02) — se puede
  marcar cualquier cantidad, pero el sitio recorta a 8.
- Las imágenes se suben a Cloudinary (ver `src/lib/uploads.ts`).

## Pendientes de negocio

Ver la sección "Información pendiente" de `PLAN_DESARROLLO.md`. Los más
urgentes: número real de WhatsApp, catálogo real y fotos de producto (ya
se pueden cargar desde `/admin`).

## Deploy

Listo para serverless (Vercel u otro): la base es Postgres (Neon, vía
`@prisma/adapter-pg`) y las imágenes/videos se suben a Cloudinary — nada
depende del disco local del servidor.

Variables de entorno necesarias en producción (ver `.env.example`):
`DATABASE_URL`, `DIRECT_URL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`,
`NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`,
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

Guía paso a paso (cuentas, costos, verificación final) en
`docs/launch-checklist.md`.
