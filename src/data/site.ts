/**
 * Constantes del sitio.
 */

// Formato internacional, sin "+" ni espacios. El fallback solo aplica si
// falta la env var (ej. entorno local sin .env configurado).
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
