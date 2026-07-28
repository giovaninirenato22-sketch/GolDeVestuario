# Checklist de lanzamiento — Gol de Vestuario

**Qué es esto:** Gol de Vestuario es un catálogo de camisetas hecho en Next.js, con un panel de administración (`/admin`) para cargar productos y categorías, y un carrito que arma el pedido para enviarlo por WhatsApp — no procesa pagos en el sitio.

**Cómo leer esto:**
- 🧑 **Vos** — necesita tu identidad, tus cuentas o una decisión tuya. Nadie más lo puede hacer por vos.
- 🤖 **Agente** — pegá el prompt indicado en tu agente de código y lo resuelve en el proyecto.
- 🤝 **Juntos** — el agente lo prepara, vos hacés el clic final o pegás un valor.

**Regla de oro: ningún secreto (contraseña, clave de API, connection string) se pega en git.** Todo eso va en `.env` (que ya está ignorado por git) o directo en la configuración de Vercel.

---

## ✅ Ya hecho

- **Base de datos migrada de SQLite a Neon (Postgres).** `prisma/schema.prisma` usa `postgresql`, `src/lib/db.ts` y `prisma/seed.ts` usan `@prisma/adapter-pg`. Las tablas están creadas y pobladas con el catálogo de ejemplo (5 categorías, 12 productos) en tu base de Neon.
- **Imágenes y videos migrados a Cloudinary.** Los 29 assets estáticos del sitio (logo, banners, guías de talles, camisetas de la pantalla de carga, los dos videos del hero, placeholder de producto) están subidos y todo el código apunta a esas URLs. El formulario de `/admin` para subir fotos nuevas también sube directo a Cloudinary — nada se escribe al disco del servidor.
- **Credenciales guardadas en `.env` local** (no en git): `DATABASE_URL`, `DIRECT_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- **Contraseña de admin real configurada** (`ADMIN_PASSWORD_HASH` y `SESSION_SECRET` ya no son los de desarrollo).

Con esto, el bloqueante técnico original para desplegar en un host serverless como Vercel ya no existe.

---

## Pendiente

### 1 — Cuenta de Vercel 🧑
**Tiempo: 5 min · Gratis (plan Hobby)**

Entrá a [vercel.com](https://vercel.com) y creá una cuenta ("Continue with GitHub" es lo más simple si tu código ya está en GitHub — si no, subilo primero).

**Vas a saber que funcionó cuando** estés adentro del dashboard de Vercel.

### 2 — Conectar el repo y cargar las variables de entorno 🧑
**Tiempo: 15 min**

1. En Vercel, tocá **Add New → Project**, elegí tu repositorio de GitHub. Vercel detecta que es Next.js solo — no toques la configuración de build.
2. **Antes de tocar "Deploy"**, cargá estas variables en la pantalla de configuración (o después en **Settings → Environment Variables**) — todas son las mismas que ya tenés en tu `.env` local, solo copiarlas y pegarlas:

| Variable |
|---|
| `DATABASE_URL` |
| `DIRECT_URL` |
| `ADMIN_PASSWORD_HASH` |
| `SESSION_SECRET` |
| `CLOUDINARY_CLOUD_NAME` |
| `CLOUDINARY_API_KEY` |
| `CLOUDINARY_API_SECRET` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| `NEXT_PUBLIC_SITE_URL` (poné la URL que te va a dar Vercel, ej. `https://gol-de-vestuario.vercel.app` — la actualizás en el paso 4 si comprás un dominio propio) |

**Vas a saber que funcionó cuando** las 9 variables estén cargadas sin ningún campo vacío.

### 3 — Desplegar 🧑
**Tiempo: 5 min (más 2-3 min de build)**

Tocá **Deploy**. Si todo salió bien, te da una URL tipo `https://gol-de-vestuario-xxxx.vercel.app` con el sitio andando — datos, imágenes y video ya sirviendo desde Neon y Cloudinary.

Si el build falla, el error más probable es una variable de entorno mal copiada — pasame el mensaje de error y lo reviso.

Una vez desplegado: entrá a `/admin/productos` en el sitio en vivo y **borrá los productos de ejemplo** (River Plate, Boca, Selección Argentina, etc.), y cargá tu catálogo real desde ahí.

**Vas a saber que funcionó cuando** entres a la URL y veas la home con el video del hero andando, y `/admin/productos` te deje loguearte con la contraseña nueva.

### 4 — Dominio propio 🧑
**Tiempo: 15 min activo + hasta 24-48hs de espera (propagación de DNS)**

Si ya tenés un dominio, saltá a "conectarlo". Si no:

1. En Vercel → tu proyecto → **Settings → Domains**, podés comprar un dominio ahí mismo (USD 10-20/año según la terminación) o conectar uno que ya tengas de otro proveedor.
2. Si lo comprás en otro lado, Vercel te muestra los registros DNS (**A** y **CNAME**) que tenés que cargar en el panel de tu proveedor.
3. Esperá a que propague (de minutos a 48hs). Vercel te avisa por email cuando quede activo con HTTPS.
4. Una vez activo, actualizá `NEXT_PUBLIC_SITE_URL` en Vercel con tu dominio final y hacé un **redeploy** (Settings → Deployments → los tres puntos del último deploy → Redeploy).

**Vas a saber que funcionó cuando** entres a tu dominio propio (no al `.vercel.app`) y cargue con el candado de HTTPS.

### 5 — Verificación final (probalo como un cliente real) 🧑
**Tiempo: 20 min**

No está "lanzado" hasta que esto pase de principio a fin en el sitio real:

- [ ] Entrá a la home en tu dominio final. ¿Carga el video, sin errores en la consola?
- [ ] Andá a `/productos`, elegí En Stock, filtrá por categoría y talle. ¿Aparece tu catálogo real?
- [ ] Entrá a una ficha de producto, elegí un talle, agregalo al carrito. ¿Aparece el aviso de "agregado"?
- [ ] Andá a `/carrito`, elegí un medio de pago, tocá "Finalizar pedido por WhatsApp". ¿Se abre WhatsApp con el mensaje armado, al número correcto?
- [ ] Entrá a `/admin` con tu contraseña real. Cargá un producto con una foto nueva. ¿Se sube y aparece en el sitio público al toque?
- [ ] Andá a `/admin/categorias`, agregá una de prueba, arrastrala para reordenar, borrala. ¿Funciona sin recargar a mano?
- [ ] Abrí el sitio desde tu celular con datos móviles (no wifi). ¿Se ve bien y carga rápido?

---

## Después del lanzamiento (no bloqueante, pero recomendado)

- **Backups de la base:** Neon los hace automático en el plan free (7 días de historial) — no hay que configurar nada.
- **Monitoreo de errores:** hoy si algo se rompe en producción no te enterás salvo que un cliente te avise. Sentry (plan gratis) manda un aviso automático — decime si lo querés armar.
- **Analítica básica:** Vercel Analytics se activa con un click desde el dashboard, sin configuración.
- **Política de privacidad / términos:** el sitio no tiene una hoy. No es obligatorio para un catálogo simple sin pagos ni cuentas de usuario, pero conviene si en algún momento sumás pagos online.
- **Limpieza de repo (opcional):** las carpetas `public/brand/`, `public/banners/`, `public/guias/`, `public/loading/`, `public/hero/` y `public/productos/placeholder.svg` ya no las usa el código (todo apunta a Cloudinary ahora) — se pueden borrar para achicar el repo (los videos del hero solos pesan 67MB). Decime si querés que las borre.

---

## Resumen

- **Pasos que sos vos, sí o sí:** crear la cuenta de Vercel, cargar las variables de entorno, comprar/conectar el dominio, y la verificación final.
- **Costo mensual mientras el catálogo sea chico:** \$0 — Vercel, Neon y Cloudinary tienen plan gratis que alcanza de sobra. El único costo es el dominio (una vez al año, ~USD 10-20).
- **Primer paso recomendado:** paso 1 (cuenta de Vercel) — es rápido y no depende de nada más.
