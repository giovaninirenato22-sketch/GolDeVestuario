import crypto from "node:crypto";

export const SESSION_COOKIE = "gdv_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

function firmar(payload: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("Falta SESSION_SECRET en las variables de entorno");
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/** Token de sesión sin estado: "expiraEnMs.firmaHMAC". No hace falta guardar sesiones en la DB. */
export function crearTokenSesion(): string {
  const expira = String(Date.now() + SESSION_TTL_MS);
  return `${expira}.${firmar(expira)}`;
}

export function tokenEsValido(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, firma] = token.split(".");
  if (!payload || !firma) return false;

  let esperada: string;
  try {
    esperada = firmar(payload);
  } catch {
    return false;
  }

  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  return Number(payload) > Date.now();
}
