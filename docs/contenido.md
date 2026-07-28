# Contenido editorial

Textos actualmente en el sitio, para que el negocio los revise y apruebe
o corrija. Cada texto indica en qué archivo vive.

Convención: 🟢 texto documentado (viene de `RN Gol de Vestuario.pdf` o de
los assets); 🟡 texto razonable pero no confirmado por el negocio; 🔴
placeholder explícito que debe reemplazarse.

## Inicio — [src/components/contenido/Hero.tsx](../src/components/contenido/Hero.tsx)

- 🟡 Eyebrow: "Pasión por el fútbol"
- 🟡 Título: "EL VESTUARIO / DONDE NACE EL GOL"
- 🟡 Bajada: "Camisetas en stock y por encargue para quienes viven el fútbol desde adentro."
- 🟢 CTAs: "Ver productos" / "Conocer más"

## Fila de valores — [src/components/contenido/StatRow.tsx](../src/components/contenido/StatRow.tsx)

Tomados literalmente de la demo de `docs/design.html`, no confirmados por el negocio.

- 🟡 Calidad — Materiales premium
- 🟡 Comunidad — Hecho por hinchas
- 🟡 Estilo — Diseño de vestuario

## Quiénes somos — [src/app/quienes-somos/page.tsx](../src/app/quienes-somos/page.tsx)

- 🟡 Texto de posicionamiento de marca, parafraseado del "Overview" de `docs/design.md`
  ("el vestuario como lugar donde se gana el partido: preparación, ritual, hermandad").
- 🔴 Historia real, fecha de fundación, equipo: **no documentados**. Se muestra un aviso
  visible en la página en vez de inventarlos (P-07 en `PLAN_DESARROLLO.md`).

## Soporte — [src/app/soporte/page.tsx](../src/app/soporte/page.tsx)

FAQ construida únicamente con reglas de negocio documentadas en el PDF:

- 🟢 Cómo comprar → carrito + resumen por WhatsApp (RN-07)
- 🟢 Medios de pago y descuento → efectivo/transferencia 15% OFF (RN-08)
- 🟢 Qué es "Por Encargue" → talle + precio a coordinar (RN-05)
- 🟢 Cómo elegir talle → guías por categoría (RN-06)
- 🟢 Cuidado de la prenda → 4 reglas de `Cuidados de la camiseta.png`
- 🟢 Catálogo ampliado → CTA de `No encontras tu camiseta.png`
- 🔴 Envíos, plazos, cambios y devoluciones: **no documentados**, aviso visible en la página (P-05).

## Cuidados de la prenda — [src/components/producto/CareGuide.tsx](../src/components/producto/CareGuide.tsx)

🟢 Transcripción literal de `Cuidados de la camiseta.png`:

1. Lavar la prenda a mano en agua fría. No usar lavarropas (en caso de hacerlo, usar la opción de lavado delicado).
2. No secar la prenda al sol.
3. Utilizar jabón blanco.
4. No planchar la prenda.

## Mensaje de WhatsApp — [src/lib/whatsapp.ts](../src/lib/whatsapp.ts)

🟢 Sigue la plantilla definida en `PLAN_DESARROLLO.md` §3.7 (separación En Stock /
Por Encargue, leyenda de precio a coordinar, desglose de descuento).

## Catálogo de productos — [src/data/productos.ts](../src/data/productos.ts)

🔴 Los 12 productos cargados son **datos de ejemplo** (nombres, clubes, precios,
stock por talle). Reemplazar por el catálogo real antes de lanzar (P-02).
Las imágenes son un ícono placeholder, no fotos reales (P-09).

## Footer / contacto — [src/components/layout/Footer.tsx](../src/components/layout/Footer.tsx)

- 🔴 Número de WhatsApp: valor de prueba vía `NEXT_PUBLIC_WHATSAPP_NUMBER` (P-01).
- 🔴 Redes sociales: no incluidas, no documentadas (P-11).
- 🔴 Datos fiscales / razón social: no incluidos, no documentados (P-14).
