/**
 * Constantes del sitio. Los valores marcados como PENDIENTE dependen de
 * información de negocio que no está documentada (ver PLAN_DESARROLLO.md,
 * sección "Información pendiente / dudas abiertas").
 */

// P-01 (PLAN_DESARROLLO.md): número real de WhatsApp sin confirmar.
// Se usa un valor de prueba hasta que el negocio lo provea vía
// NEXT_PUBLIC_WHATSAPP_NUMBER (formato internacional, sin "+" ni espacios).
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5491100000000";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const SITE_NAME = "Gol de Vestuario";

export const SITE_DESCRIPTION =
  "Indumentaria y camisetas de fútbol para quienes viven el fútbol desde adentro. Catálogo en stock y por encargue.";

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/quienes-somos", label: "Quiénes somos" },
  { href: "/soporte", label: "Soporte" },
] as const;

// RN-08: efectivo y transferencia tienen 15% OFF.
export const DESCUENTO_EFECTIVO_TRANSFERENCIA = 0.15;

export const MAX_PRODUCTOS_DESTACADOS = 8;

export const INSTAGRAM_URL = "https://www.instagram.com/golldevestuario/";

export const DEVELOPER_NAME = "Justino Santos";
export const DEVELOPER_URL = "https://justinosantos.vercel.app/";
